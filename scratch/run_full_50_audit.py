import urllib.request
import json
import subprocess

BASE_URL = "http://localhost:8080"
MYSQL_CMD = r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
MONGOSH_CMD = r"C:\Users\Gokulnath\AppData\Local\Programs\mongosh\mongosh.exe"
DB_PASS = "nath@1827"

def http_get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, headers={"User-Agent": "Python-Audit"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read().decode('utf-8')
            return resp.status, json.loads(data)
    except urllib.error.HTTPError as e:
        data = e.read().decode('utf-8')
        try:
            body = json.loads(data)
        except:
            body = data
        return e.code, body
    except Exception as e:
        return 500, str(e)

print("==================================================")
print("EDUPATH AI — FULL 50-STUDENT INTEGRATION AUDIT")
print("==================================================")

# 1. DATABASE AUDIT
print("\n--- 1. DATABASE AUDIT ---")
cmd_sql = [MYSQL_CMD, "-u", "root", f"-p{DB_PASS}", "edupath_ai", "-e", "SELECT class_name, section, COUNT(*) as count FROM students GROUP BY class_name, section ORDER BY CAST(class_name AS UNSIGNED), section;"]
res_sql = subprocess.run(cmd_sql, capture_output=True, text=True)
print("MySQL Class Distribution:\n", res_sql.stdout)

# 2. FETCH ALL STUDENTS
status, students = http_get("/api/students")
print(f"GET /api/students -> HTTP {status}, Total returned: {len(students)}")

# 3. AI DROPOUT RISK AUDIT (ALL 50 STUDENTS)
print("\n--- 2. AI DROPOUT RISK AUDIT (ALL 50 STUDENTS) ---")
ai_success_count = 0
ai_risk_counts = {"High": 0, "Medium": 0, "Low": 0, "No Risk": 0, "Unknown": 0}
feature_missing_count = 0

for st in students:
    st_id = st["id"]
    status, ai_res = http_get(f"/api/ai/students/{st_id}/dropout-risk")
    if status == 200 and ("dropoutRisk" in ai_res or "dropout_risk" in ai_res):
        ai_success_count += 1
        r = ai_res.get("dropout_risk") or ai_res.get("dropoutRisk", "Unknown")
        ai_risk_counts[r] = ai_risk_counts.get(r, 0) + 1
        
        feat = ai_res.get("featureSummary", {})
        required_features = [
            "age", "gender", "grade", "attendance_percentage", "previous_percentage",
            "current_percentage", "mathematics_score", "science_score", "english_score",
            "computer_score", "assignment_completion_rate", "study_hours_per_day",
            "behavior_score", "parental_support", "previous_failures", "academic_trend"
        ]
        missing = [f for f in required_features if f not in feat or feat[f] is None]
        if missing:
            feature_missing_count += 1
            print(f"   [WARNING] Student ID {st_id} missing AI features: {missing}")

print(f"AI Prediction Success Rate: {ai_success_count} / {len(students)}")
print(f"AI Risk Distribution: {ai_risk_counts}")
print(f"Students with missing AI features: {feature_missing_count}")

# 4. CLASS RANK AUDIT (ALL 50 STUDENTS)
print("\n--- 3. CLASS RANK AUDIT (ALL 50 STUDENTS) ---")
expected_section_sizes = {
    "9-A": 6, "9-B": 6, "10-A": 6, "10-B": 6,
    "11-A": 6, "11-B": 6, "12-A": 7, "12-B": 7
}
rank_isolation_pass = True
for st in students:
    st_id = st["id"]
    status, rk_res = http_get(f"/api/students/{st_id}/class-rank")
    if status == 200:
        c_name = rk_res.get("className", "").replace("Class ", "").strip()
        sec = rk_res.get("section", "").strip()
        key = f"{c_name}-{sec}"
        exp_size = expected_section_sizes.get(key, 0)
        tot_studs = rk_res.get("totalStudents", 0)
        if tot_studs != exp_size:
            print(f"   [FAIL] Student ID {st_id} ({st['fullName']}, Class {key}): expected total {exp_size}, got {tot_studs}")
            rank_isolation_pass = False

print(f"Class Rank Section Isolation Pass: {rank_isolation_pass}")

# 5. TEACHER REPORTS AUDIT
print("\n--- 4. TEACHER REPORTS AUDIT ---")
status, teachers = http_get("/api/teachers")
print(f"Total Teachers: {len(teachers)}")
for t in teachers:
    t_id = t["id"]
    status, t_rpt = http_get(f"/api/teachers/{t_id}/report")
    if status == 200:
        c_size = t_rpt.get("classSize", 0)
        s_marks = t_rpt.get("studentsWithMarks", 0)
        avg_g = t_rpt.get("averageGrade", "N/A")
        print(f"Teacher ID {t_id} ({t['fullName']}, Subject: {t['subject']}): ClassSize={c_size}, StudentsWithMarks={s_marks}, AvgGrade={avg_g}")
    else:
        print(f"Teacher ID {t_id} report error HTTP {status}")

# 6. COUNSELOR REPORT AUDIT
print("\n--- 5. COUNSELOR REPORT AUDIT ---")
status, c_rpt = http_get("/api/counselors/1/report")
if status == 200:
    sup_count = len(c_rpt.get("supervisedStudents", []))
    at_risk = c_rpt.get("atRiskStudentsCount", 0)
    print(f"Counselor Report: Supervised Students={sup_count}, At-Risk Count={at_risk}")

# 7. ADMIN DASHBOARD AUDIT
print("\n--- 6. ADMIN DASHBOARD AUDIT ---")
endpoints = [
    "/api/admin/dashboard/student-growth",
    "/api/admin/dashboard/grade-distribution",
    "/api/admin/dashboard/performance",
    "/api/admin/dashboard/attendance-distribution",
    "/api/admin/dashboard/classes",
    "/api/admin/dashboard/reports/students",
    "/api/admin/dashboard/reports/teachers"
]
for ep in endpoints:
    status, data = http_get(ep)
    if isinstance(data, list):
        count_str = f"list of {len(data)} items"
    elif isinstance(data, dict):
        count_str = f"dict keys: {list(data.keys())}"
    else:
        count_str = str(data)
    print(f"Endpoint {ep} -> HTTP {status} ({count_str})")

print("\nAudit execution script completed!")
