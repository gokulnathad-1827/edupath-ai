$baseUrl = "http://localhost:8080/api"

Write-Host "========================================="
Write-Host "ADMIN SECONDARY PAGES VERIFICATION TEST"
Write-Host "========================================="

# 1. Admin Account
Write-Host "`n--- 1. Admin Account ---"
Write-Host "Admin User Email: admin@edupath.com"
Write-Host "Admin User ID: 1"

# 2. Classes API Endpoint & Actual Data
Write-Host "`n--- 2. Classes API Endpoint & Actual Data ---"
try {
    $classes = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/classes" -Method Get
    Write-Host "Endpoint: GET /api/admin/dashboard/classes"
    Write-Host "Total Classes Returned: "$classes.Count
    foreach ($cls in $classes) {
        Write-Host " - Class Name: $($cls.name) | Dept: $($cls.department) | Teacher: $($cls.teacherName) | Strength: $($cls.strength) students"
    }
} catch {
    Write-Host "Error fetching admin classes: $_"
}

# 3. Analytics API Endpoint & Actual Data
Write-Host "`n--- 3. Analytics API Endpoint & Actual Data ---"
try {
    $perf = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/performance" -Method Get
    Write-Host "Endpoint: GET /api/admin/dashboard/performance"
    Write-Host "Has Performance Data: "$perf.hasPerformanceData
    Write-Host "Subject Performance Items Count: "$perf.performanceData.Count
    foreach ($item in $perf.performanceData) {
        Write-Host " - Subject: $($item.month) | Average Score: $($item.average)%"
    }
} catch {
    Write-Host "Error fetching admin analytics: $_"
}

# 4. Student Report API Endpoint & Actual Data
Write-Host "`n--- 4. Student Report API Endpoint & Actual Data ---"
try {
    $studentReports = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/reports/students" -Method Get
    Write-Host "Endpoint: GET /api/admin/dashboard/reports/students"
    Write-Host "Student Report Rows Count: "$studentReports.Count
    foreach ($sr in $studentReports) {
        Write-Host " - [ID: $($sr.id)] Name: $($sr.name) | Class: $($sr.classAndSection) | Att: $($sr.attendance) | Score: $($sr.averageScore) | Risk: $($sr.riskLevel) | Action: $($sr.currentAction)"
    }
} catch {
    Write-Host "Error fetching student reports: $_"
}

# 5. Teacher Report API Endpoint & Actual Data
Write-Host "`n--- 5. Teacher Report API Endpoint & Actual Data ---"
try {
    $teacherReports = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/reports/teachers" -Method Get
    Write-Host "Endpoint: GET /api/admin/dashboard/reports/teachers"
    Write-Host "Teacher Report Rows Count: "$teacherReports.Count
    foreach ($tr in $teacherReports) {
        Write-Host " - [EmpID: $($tr.employeeId)] Name: $($tr.name) | Subject: $($tr.subject) | Qual: $($tr.qualification) | Classes: $($tr.classesAssigned) | Status: $($tr.status)"
    }
} catch {
    Write-Host "Error fetching teacher reports: $_"
}

# 6. Admin Notification Endpoint & Visible Notifications
Write-Host "`n--- 6. Notification Endpoint & Visible Notifications ---"
try {
    $adminNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications/user/1?role=ADMIN" -Method Get
    Write-Host "Endpoint: GET /api/notifications/user/1?role=ADMIN"
    Write-Host "Visible Notifications Count: "$adminNotifs.Count
    foreach ($n in $adminNotifs) {
        Write-Host " - [ID: $($n.id)] TargetRole: $($n.targetRole) | UserId: $($n.userId) | Title: $($n.title)"
    }
} catch {
    Write-Host "Error fetching admin notifications: $_"
}

# 7. Notification Isolation Check
Write-Host "`n--- 7. Security & Notification Isolation Check ---"
try {
    $allNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method Get
    $unauthorized = $allNotifs | Where-Object { 
        ($_.targetRole -eq "PARENT" -and $_.userId -ne 1) -or 
        ($_.targetRole -eq "TEACHER" -and $_.userId -ne 1) -or 
        ($_.targetRole -eq "STUDENT" -and $_.userId -ne 1) -or 
        ($_.targetRole -eq "COUNSELOR" -and $_.userId -ne 1)
    }

    $leakedInAdmin = $adminNotifs | Where-Object { 
        ($_.targetRole -eq "PARENT" -and $_.userId -ne 1) -or 
        ($_.targetRole -eq "TEACHER" -and $_.userId -ne 1) -or 
        ($_.targetRole -eq "STUDENT" -and $_.userId -ne 1) -or 
        ($_.targetRole -eq "COUNSELOR" -and $_.userId -ne 1)
    }

    if ($leakedInAdmin.Count -eq 0) {
        Write-Host "SUCCESS: Admin received 0 private role notifications belonging to Parent/Teacher/Student/Counselor."
        Write-Host "Filtered out $($unauthorized.Count) private role notifications."
    } else {
        Write-Host "WARNING: Leaked $($leakedInAdmin.Count) private role notifications!"
    }
} catch {
    Write-Host "Error checking notification isolation: $_"
}

Write-Host "`n========================================="
Write-Host "VERIFICATION COMPLETE"
Write-Host "========================================="
