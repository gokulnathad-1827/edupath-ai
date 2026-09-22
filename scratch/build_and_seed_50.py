import subprocess
import os

MYSQL_CMD = r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
MONGOSH_CMD = r"C:\Users\Gokulnath\AppData\Local\Programs\mongosh\mongosh.exe"
DB_PASS = "nath@1827"
DB_NAME = "edupath_ai"
PASSWORD_HASH = "$2a$10$i7nXwG5NWnGls0sjg9MT8.y1VthhvCPgOVxANWa8APoBIlsEwfgZi"

students_data = [
    # --- Class 9-A (6 students) ---
    {"name": "Arjun Kumar", "gender": "Male", "dob": "2012-04-15", "grade": "9", "section": "A", "teacher_id": 8, "parent_name": "Ramanathan K", "parent_email": "parent.arjun@edupath.com", "parent_phone": "9843100001", "math": 92, "sci": 95, "eng": 88, "comp": 94, "att": 10, "comp_rate": 95.0, "hrs": 7.0, "beh": 9.2},
    {"name": "Keerthana M", "gender": "Female", "dob": "2012-06-20", "grade": "9", "section": "A", "teacher_id": 8, "parent_name": "Murugan S", "parent_email": "parent.keerthana@edupath.com", "parent_phone": "9843100002", "math": 85, "sci": 90, "eng": 92, "comp": 89, "att": 9, "comp_rate": 88.0, "hrs": 5.5, "beh": 8.5},
    {"name": "Kavin Raj", "gender": "Male", "dob": "2012-02-10", "grade": "9", "section": "A", "teacher_id": 8, "parent_name": "Rajendran P", "parent_email": "parent.kavin@edupath.com", "parent_phone": "9843100003", "math": 78, "sci": 82, "eng": 75, "comp": 80, "att": 8, "comp_rate": 80.0, "hrs": 4.0, "beh": 7.8},
    {"name": "Harini S", "gender": "Female", "dob": "2012-08-05", "grade": "9", "section": "A", "teacher_id": 8, "parent_name": "Sundaram V", "parent_email": "parent.harini@edupath.com", "parent_phone": "9843100004", "math": 62, "sci": 68, "eng": 70, "comp": 65, "att": 7, "comp_rate": 72.0, "hrs": 3.0, "beh": 7.0},
    {"name": "Dharshan P", "gender": "Male", "dob": "2012-11-12", "grade": "9", "section": "A", "teacher_id": 8, "parent_name": "Paranthaman R", "parent_email": "parent.dharshan@edupath.com", "parent_phone": "9843100005", "math": 45, "sci": 50, "eng": 48, "comp": 52, "att": 6, "comp_rate": 58.0, "hrs": 2.0, "beh": 5.5},
    {"name": "Nandhini R", "gender": "Female", "dob": "2012-01-25", "grade": "9", "section": "A", "teacher_id": 8, "parent_name": "Ramesh Babu", "parent_email": "parent.nandhini@edupath.com", "parent_phone": "9843100006", "math": 96, "sci": 94, "eng": 95, "comp": 98, "att": 10, "comp_rate": 98.0, "hrs": 7.5, "beh": 9.5},

    # --- Class 9-B (6 students) ---
    {"name": "Aavani Nair", "gender": "Female", "dob": "2012-03-14", "grade": "9", "section": "B", "teacher_id": 11, "parent_name": "Unnikrishnan Nair", "parent_email": "parent.aavani@edupath.com", "parent_phone": "9843100007", "math": 88, "sci": 85, "eng": 90, "comp": 87, "att": 9, "comp_rate": 90.0, "hrs": 6.0, "beh": 8.8},
    {"name": "Bhavan K", "gender": "Male", "dob": "2012-05-18", "grade": "9", "section": "B", "teacher_id": 11, "parent_name": "Krishnamoorthy A", "parent_email": "parent.bhavan@edupath.com", "parent_phone": "9843100008", "math": 74, "sci": 76, "eng": 72, "comp": 75, "att": 8, "comp_rate": 78.0, "hrs": 4.5, "beh": 7.6},
    {"name": "Charulatha V", "gender": "Female", "dob": "2012-07-22", "grade": "9", "section": "B", "teacher_id": 11, "parent_name": "Vasudevan T", "parent_email": "parent.charu@edupath.com", "parent_phone": "9843100009", "math": 55, "sci": 60, "eng": 58, "comp": 62, "att": 7, "comp_rate": 65.0, "hrs": 3.0, "beh": 6.4},
    {"name": "Deepak Verma", "gender": "Male", "dob": "2012-09-09", "grade": "9", "section": "B", "teacher_id": 11, "parent_name": "Suresh Verma", "parent_email": "parent.deepak@edupath.com", "parent_phone": "9843100010", "math": 32, "sci": 38, "eng": 35, "comp": 40, "att": 5, "comp_rate": 45.0, "hrs": 1.5, "beh": 4.8},
    {"name": "Ezhil Maran", "gender": "Male", "dob": "2012-10-30", "grade": "9", "section": "B", "teacher_id": 11, "parent_name": "Ilango M", "parent_email": "parent.ezhil@edupath.com", "parent_phone": "9843100011", "math": 90, "sci": 92, "eng": 89, "comp": 91, "att": 10, "comp_rate": 92.0, "hrs": 6.5, "beh": 9.0},
    {"name": "Fiona Joseph", "gender": "Female", "dob": "2012-12-04", "grade": "9", "section": "B", "teacher_id": 11, "parent_name": "Joseph Thomas", "parent_email": "parent.fiona@edupath.com", "parent_phone": "9843100012", "math": 82, "sci": 84, "eng": 86, "comp": 83, "att": 9, "comp_rate": 85.0, "hrs": 5.0, "beh": 8.2},

    # --- Class 10-A (4 new -> total 6 with guna & Gokulnath) ---
    {"name": "Gowtham S", "gender": "Male", "dob": "2011-01-15", "grade": "10", "section": "A", "teacher_id": 4, "parent_name": "Senthil Nathan", "parent_email": "parent.gowtham@edupath.com", "parent_phone": "9843100013", "math": 89, "sci": 91, "eng": 88, "comp": 93, "att": 10, "comp_rate": 91.0, "hrs": 6.0, "beh": 8.9},
    {"name": "Hemalatha R", "gender": "Female", "dob": "2011-04-20", "grade": "10", "section": "A", "teacher_id": 4, "parent_name": "Radhakrishnan G", "parent_email": "parent.hemar@edupath.com", "parent_phone": "9843100014", "math": 76, "sci": 79, "eng": 81, "comp": 78, "att": 8, "comp_rate": 82.0, "hrs": 4.5, "beh": 8.0},
    {"name": "Iniyan K", "gender": "Male", "dob": "2011-06-11", "grade": "10", "section": "A", "teacher_id": 4, "parent_name": "Karthikeyan P", "parent_email": "parent.iniyan@edupath.com", "parent_phone": "9843100015", "math": 58, "sci": 62, "eng": 60, "comp": 64, "att": 7, "comp_rate": 68.0, "hrs": 3.0, "beh": 6.6},
    {"name": "Janani B", "gender": "Female", "dob": "2011-09-28", "grade": "10", "section": "A", "teacher_id": 4, "parent_name": "Balasubramanian V", "parent_email": "parent.janani@edupath.com", "parent_phone": "9843100016", "math": 94, "sci": 96, "eng": 95, "comp": 97, "att": 10, "comp_rate": 96.0, "hrs": 7.0, "beh": 9.4},

    # --- Class 10-B (4 new -> total 6 with Hema & sanjay) ---
    {"name": "Karthik V", "gender": "Male", "dob": "2011-02-17", "grade": "10", "section": "B", "teacher_id": 5, "parent_name": "Vijayaraghavan S", "parent_email": "parent.karthik@edupath.com", "parent_phone": "9843100017", "math": 86, "sci": 88, "eng": 84, "comp": 87, "att": 9, "comp_rate": 87.0, "hrs": 5.5, "beh": 8.6},
    {"name": "Kavya Shree", "gender": "Female", "dob": "2011-05-24", "grade": "10", "section": "B", "teacher_id": 5, "parent_name": "Shanmugam K", "parent_email": "parent.kavya@edupath.com", "parent_phone": "9843100018", "math": 72, "sci": 75, "eng": 74, "comp": 76, "att": 8, "comp_rate": 79.0, "hrs": 4.0, "beh": 7.7},
    {"name": "Lokesh Kumar", "gender": "Male", "dob": "2011-08-03", "grade": "10", "section": "B", "teacher_id": 5, "parent_name": "Mani Kumar", "parent_email": "parent.lokesh@edupath.com", "parent_phone": "9843100019", "math": 40, "sci": 42, "eng": 38, "comp": 44, "att": 5, "comp_rate": 50.0, "hrs": 1.8, "beh": 5.2},
    {"name": "Madhumitha P", "gender": "Female", "dob": "2011-10-19", "grade": "10", "section": "B", "teacher_id": 5, "parent_name": "Palanisamy R", "parent_email": "parent.madhu@edupath.com", "parent_phone": "9843100020", "math": 91, "sci": 93, "eng": 90, "comp": 92, "att": 10, "comp_rate": 93.0, "hrs": 6.8, "beh": 9.1},

    # --- Class 11-A (6) ---
    {"name": "Naveen Chandran", "gender": "Male", "dob": "2010-03-12", "grade": "11", "section": "A", "teacher_id": 8, "parent_name": "Chandrasekar T", "parent_email": "parent.naveen@edupath.com", "parent_phone": "9843100021", "math": 95, "sci": 93, "eng": 91, "comp": 96, "att": 10, "comp_rate": 95.0, "hrs": 7.2, "beh": 9.4},
    {"name": "Nivedha R", "gender": "Female", "dob": "2010-06-08", "grade": "11", "section": "A", "teacher_id": 8, "parent_name": "Rajagopal M", "parent_email": "parent.nivedha@edupath.com", "parent_phone": "9843100022", "math": 87, "sci": 85, "eng": 89, "comp": 88, "att": 9, "comp_rate": 89.0, "hrs": 5.8, "beh": 8.7},
    {"name": "Omkar Sharma", "gender": "Male", "dob": "2010-07-29", "grade": "11", "section": "A", "teacher_id": 8, "parent_name": "Mahesh Sharma", "parent_email": "parent.omkar@edupath.com", "parent_phone": "9843100023", "math": 75, "sci": 78, "eng": 73, "comp": 76, "att": 8, "comp_rate": 80.0, "hrs": 4.2, "beh": 7.9},
    {"name": "Pavithra M", "gender": "Female", "dob": "2010-09-14", "grade": "11", "section": "A", "teacher_id": 8, "parent_name": "Manoharan K", "parent_email": "parent.pavi@edupath.com", "parent_phone": "9843100024", "math": 64, "sci": 67, "eng": 65, "comp": 68, "att": 7, "comp_rate": 70.0, "hrs": 3.2, "beh": 6.8},
    {"name": "Pranav V", "gender": "Male", "dob": "2010-11-05", "grade": "11", "section": "A", "teacher_id": 8, "parent_name": "Venkatraman S", "parent_email": "parent.pranav@edupath.com", "parent_phone": "9843100025", "math": 35, "sci": 39, "eng": 36, "comp": 41, "att": 5, "comp_rate": 48.0, "hrs": 1.5, "beh": 4.6},
    {"name": "Rithika S", "gender": "Female", "dob": "2010-12-21", "grade": "11", "section": "A", "teacher_id": 8, "parent_name": "Subramanian G", "parent_email": "parent.rithika@edupath.com", "parent_phone": "9843100026", "math": 92, "sci": 94, "eng": 93, "comp": 95, "att": 10, "comp_rate": 94.0, "hrs": 7.0, "beh": 9.3},

    # --- Class 11-B (6) ---
    {"name": "Rohit Menon", "gender": "Male", "dob": "2010-01-30", "grade": "11", "section": "B", "teacher_id": 11, "parent_name": "Narayanan Menon", "parent_email": "parent.rohit@edupath.com", "parent_phone": "9843100027", "math": 89, "sci": 87, "eng": 90, "comp": 88, "att": 9, "comp_rate": 88.0, "hrs": 6.0, "beh": 8.9},
    {"name": "Samyuktha G", "gender": "Female", "dob": "2010-04-16", "grade": "11", "section": "B", "teacher_id": 11, "parent_name": "Gopalakrishnan R", "parent_email": "parent.samyu@edupath.com", "parent_phone": "9843100028", "math": 79, "sci": 81, "eng": 83, "comp": 80, "att": 8, "comp_rate": 83.0, "hrs": 4.8, "beh": 8.1},
    {"name": "Sharvesh K", "gender": "Male", "dob": "2010-05-27", "grade": "11", "section": "B", "teacher_id": 11, "parent_name": "Kuppusamy V", "parent_email": "parent.sharvesh@edupath.com", "parent_phone": "9843100029", "math": 59, "sci": 63, "eng": 61, "comp": 65, "att": 7, "comp_rate": 67.0, "hrs": 3.0, "beh": 6.5},
    {"name": "Sneha Patel", "gender": "Female", "dob": "2010-08-10", "grade": "11", "section": "B", "teacher_id": 11, "parent_name": "Bhavesh Patel", "parent_email": "parent.sneha@edupath.com", "parent_phone": "9843100030", "math": 96, "sci": 97, "eng": 95, "comp": 98, "att": 10, "comp_rate": 97.0, "hrs": 7.5, "beh": 9.6},
    {"name": "Srikanth N", "gender": "Male", "dob": "2010-10-02", "grade": "11", "section": "B", "teacher_id": 11, "parent_name": "Natarajan P", "parent_email": "parent.srikanth@edupath.com", "parent_phone": "9843100031", "math": 28, "sci": 30, "eng": 32, "comp": 35, "att": 4, "comp_rate": 40.0, "hrs": 1.0, "beh": 4.2},
    {"name": "Swetha B", "gender": "Female", "dob": "2010-11-18", "grade": "11", "section": "B", "teacher_id": 11, "parent_name": "Bhaskar S", "parent_email": "parent.swetha@edupath.com", "parent_phone": "9843100032", "math": 84, "sci": 86, "eng": 88, "comp": 85, "att": 9, "comp_rate": 86.0, "hrs": 5.2, "beh": 8.4},

    # --- Class 12-A (7) ---
    {"name": "Tarun Raj", "gender": "Male", "dob": "2009-02-14", "grade": "12", "section": "A", "teacher_id": 4, "parent_name": "Rajasekar M", "parent_email": "parent.tarun@edupath.com", "parent_phone": "9843100033", "math": 94, "sci": 96, "eng": 92, "comp": 95, "att": 10, "comp_rate": 95.0, "hrs": 7.0, "beh": 9.3},
    {"name": "Tharani M", "gender": "Female", "dob": "2009-04-25", "grade": "12", "section": "A", "teacher_id": 4, "parent_name": "Muthusamy K", "parent_email": "parent.tharani@edupath.com", "parent_phone": "9843100034", "math": 86, "sci": 88, "eng": 89, "comp": 87, "att": 9, "comp_rate": 88.0, "hrs": 5.6, "beh": 8.6},
    {"name": "Udaya Kumar", "gender": "Male", "dob": "2009-06-19", "grade": "12", "section": "A", "teacher_id": 4, "parent_name": "Anand Kumar", "parent_email": "parent.udaya@edupath.com", "parent_phone": "9843100035", "math": 77, "sci": 80, "eng": 78, "comp": 82, "att": 8, "comp_rate": 81.0, "hrs": 4.4, "beh": 7.9},
    {"name": "Vaishnavi R", "gender": "Female", "dob": "2009-08-31", "grade": "12", "section": "A", "teacher_id": 4, "parent_name": "Ramachandran V", "parent_email": "parent.vaishnavi@edupath.com", "parent_phone": "9843100036", "math": 65, "sci": 68, "eng": 70, "comp": 67, "att": 7, "comp_rate": 72.0, "hrs": 3.4, "beh": 7.1},
    {"name": "Varun S", "gender": "Male", "dob": "2009-10-12", "grade": "12", "section": "A", "teacher_id": 4, "parent_name": "Sivaraman P", "parent_email": "parent.varun@edupath.com", "parent_phone": "9843100037", "math": 42, "sci": 45, "eng": 40, "comp": 46, "att": 5, "comp_rate": 52.0, "hrs": 2.0, "beh": 5.0},
    {"name": "Vidhya K", "gender": "Female", "dob": "2009-11-28", "grade": "12", "section": "A", "teacher_id": 4, "parent_name": "Kannan R", "parent_email": "parent.vidhya@edupath.com", "parent_phone": "9843100038", "math": 91, "sci": 93, "eng": 94, "comp": 92, "att": 10, "comp_rate": 93.0, "hrs": 6.8, "beh": 9.2},
    {"name": "Vignesh P", "gender": "Male", "dob": "2009-12-09", "grade": "12", "section": "A", "teacher_id": 4, "parent_name": "Periasamy T", "parent_email": "parent.vignesh@edupath.com", "parent_phone": "9843100039", "math": 83, "sci": 85, "eng": 82, "comp": 84, "att": 9, "comp_rate": 85.0, "hrs": 5.0, "beh": 8.3},

    # --- Class 12-B (7) ---
    {"name": "Vishnu Vardhan", "gender": "Male", "dob": "2009-01-11", "grade": "12", "section": "B", "teacher_id": 5, "parent_name": "Venkatesan R", "parent_email": "parent.vishnu@edupath.com", "parent_phone": "9843100040", "math": 97, "sci": 98, "eng": 96, "comp": 99, "att": 10, "comp_rate": 98.0, "hrs": 7.8, "beh": 9.6},
    {"name": "Yashwanth R", "gender": "Male", "dob": "2009-03-22", "grade": "12", "section": "B", "teacher_id": 5, "parent_name": "Ranganathan S", "parent_email": "parent.yashwanth@edupath.com", "parent_phone": "9843100041", "math": 88, "sci": 90, "eng": 87, "comp": 89, "att": 9, "comp_rate": 89.0, "hrs": 6.0, "beh": 8.8},
    {"name": "Yalini S", "gender": "Female", "dob": "2009-05-04", "grade": "12", "section": "B", "teacher_id": 5, "parent_name": "Selvaraj M", "parent_email": "parent.yalini@edupath.com", "parent_phone": "9843100042", "math": 76, "sci": 78, "eng": 80, "comp": 77, "att": 8, "comp_rate": 80.0, "hrs": 4.5, "beh": 7.8},
    {"name": "Yogesh K", "gender": "Male", "dob": "2009-07-16", "grade": "12", "section": "B", "teacher_id": 5, "parent_name": "Kumaresan G", "parent_email": "parent.yogesh@edupath.com", "parent_phone": "9843100043", "math": 56, "sci": 60, "eng": 58, "comp": 62, "att": 7, "comp_rate": 65.0, "hrs": 3.0, "beh": 6.3},
    {"name": "Zara Khan", "gender": "Female", "dob": "2009-09-08", "grade": "12", "section": "B", "teacher_id": 5, "parent_name": "Tariq Khan", "parent_email": "parent.zara@edupath.com", "parent_phone": "9843100044", "math": 30, "sci": 34, "eng": 32, "comp": 38, "att": 4, "comp_rate": 42.0, "hrs": 1.2, "beh": 4.4},
    {"name": "Aadhavan T", "gender": "Male", "dob": "2009-10-29", "grade": "12", "section": "B", "teacher_id": 5, "parent_name": "Thirunavukkarasu K", "parent_email": "parent.aadhavan@edupath.com", "parent_phone": "9843100045", "math": 93, "sci": 95, "eng": 92, "comp": 94, "att": 10, "comp_rate": 94.0, "hrs": 7.0, "beh": 9.3},
    {"name": "Abhinaya P", "gender": "Female", "dob": "2009-12-15", "grade": "12", "section": "B", "teacher_id": 5, "parent_name": "Prabakar R", "parent_email": "parent.abhinaya@edupath.com", "parent_phone": "9843100046", "math": 85, "sci": 87, "eng": 89, "comp": 86, "att": 9, "comp_rate": 87.0, "hrs": 5.5, "beh": 8.5}
]

dates = [
    "2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05",
    "2026-09-08", "2026-09-09", "2026-09-10", "2026-09-11", "2026-09-12"
]

sql_lines = ["START TRANSACTION;"]
mongo_js_lines = []

idx = 2001
for s in students_data:
    st_name = s["name"]
    st_email = f"{st_name.lower().replace(' ', '.')}@edupath.com"
    st_phone = f"98430{idx:05d}"
    student_id_str = f"STU-17866{idx:08d}"
    adm_no = f"ADM-{idx}"
    roll_no = f"R-{idx}"

    p_name = s["parent_name"]
    p_email = s["parent_email"]
    p_phone = s["parent_phone"]
    p_id_str = f"PAR-{idx}"

    # 1. Parent User SQL & Parent Entity SQL
    sql_lines.append(f"INSERT INTO users (email, password, full_name, name, phone_number, role_id, enabled, created_at, updated_at) VALUES ('{p_email}', '{PASSWORD_HASH}', '{p_name}', '{p_name}', '{p_phone}', 4, 1, NOW(), NOW());")
    sql_lines.append(f"SET @p_user_id = LAST_INSERT_ID();")

    sql_lines.append(f"INSERT INTO parents (parent_id, user_id, full_name, father_name, child_name, email, phone_number, relationship, status) VALUES ('{p_id_str}', @p_user_id, '{p_name}', '{p_name}', '{st_name}', '{p_email}', '{p_phone}', 'Father', 'ACTIVE');")
    sql_lines.append(f"SET @parent_entity_id = LAST_INSERT_ID();")

    # 2. Student User SQL & Student Entity SQL
    sql_lines.append(f"INSERT INTO users (email, password, full_name, name, phone_number, role_id, enabled, created_at, updated_at) VALUES ('{st_email}', '{PASSWORD_HASH}', '{st_name}', '{st_name}', '{st_phone}', 3, 1, NOW(), NOW());")
    sql_lines.append(f"SET @s_user_id = LAST_INSERT_ID();")

    sql_lines.append(f"""INSERT INTO students (student_id, admission_number, roll_number, full_name, gender, date_of_birth, user_id, class_name, section, academic_year, blood_group, address, phone_number, parent_phone, email, class_teacher_id, parent_id, counselor_id, status)
VALUES ('{student_id_str}', '{adm_no}', '{roll_no}', '{st_name}', '{s["gender"]}', '{s["dob"]}', @s_user_id, '{s["grade"]}', '{s["section"]}', '2026-2027', 'O+', 'EduPath Campus', '{st_phone}', '{p_phone}', '{st_email}', {s["teacher_id"]}, @parent_entity_id, 1, 'ACTIVE');""")
    sql_lines.append(f"SET @student_entity_id = LAST_INSERT_ID();")

    # 3. Academic Profile SQL
    sql_lines.append(f"INSERT INTO student_academic_profiles (student_id, assignment_completion_rate, study_hours_per_day, behavior_score, created_at, updated_at) VALUES (@student_entity_id, {s['comp_rate']}, {s['hrs']}, {s['beh']}, NOW(), NOW());")

    # 4. Marks SQL
    subjects_marks = [("Mathematics", s["math"]), ("Science", s["sci"]), ("English", s["eng"]), ("Computer Science", s["comp"])]
    for subj, val in subjects_marks:
        sql_lines.append(f"INSERT INTO student_marks (student_name, subject, marks, date, created_at) VALUES ('{st_name}', '{subj}', '{val}', '2026-09-15', NOW());")

    # 5. Attendance SQL
    att_count = s["att"] # out of 10
    for i in range(10):
        d = dates[i]
        st = "Present" if i < att_count else "Absent"
        sql_lines.append(f"INSERT INTO attendance (student_id, student_name, status, attendance_date, date, created_at) VALUES (@student_entity_id, '{st_name}', '{st}', '{d}', '{d}', NOW());")

    # 6. MongoDB JS Document
    mongo_js_lines.append(f"""
    db.users.insertOne({{
        fullName: '{st_name}',
        email: '{st_email}',
        password: '{PASSWORD_HASH}',
        phoneNumber: '{st_phone}',
        role: {{ _id: ObjectId('6a7576e59fae76a691abd887'), name: 'ROLE_STUDENT' }},
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: 'com.edupath.authservice.entity.User'
    }});
    db.users.insertOne({{
        fullName: '{p_name}',
        email: '{p_email}',
        password: '{PASSWORD_HASH}',
        phoneNumber: '{p_phone}',
        role: {{ _id: ObjectId('6a7576e59fae76a691abd888'), name: 'ROLE_PARENT' }},
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: 'com.edupath.authservice.entity.User'
    }});
    """)

    idx += 1

sql_lines.append("COMMIT;")

sql_filepath = r"scratch\seed_batch.sql"
js_filepath = r"scratch\seed_batch.js"

with open(sql_filepath, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

with open(js_filepath, "w", encoding="utf-8") as f:
    f.write("\n".join(mongo_js_lines))

print(f"Generated SQL script with {len(sql_lines)} statements.")
print(f"Generated JS script for MongoDB.")

print("Executing SQL script against MySQL...")
cmd_sql = [MYSQL_CMD, "-u", "root", f"-p{DB_PASS}", DB_NAME, f"--default-character-set=utf8mb4", "-e", f"source {sql_filepath}"]
res_sql = subprocess.run(cmd_sql, capture_output=True, text=True)
if res_sql.returncode == 0:
    print("MySQL Seeding SUCCESSFUL!")
else:
    print(f"MySQL Seeding FAILED:\n{res_sql.stderr}")

print("Executing JS script against MongoDB...")
cmd_js = [MONGOSH_CMD, "mongodb://localhost:27017/oauth_db", js_filepath]
res_js = subprocess.run(cmd_js, capture_output=True, text=True)
if res_js.returncode == 0:
    print("MongoDB Seeding SUCCESSFUL!")
else:
    print(f"MongoDB Seeding FAILED:\n{res_js.stderr}")
