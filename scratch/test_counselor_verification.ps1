$baseUrl = "http://localhost:8080/api"

Write-Host "========================================="
Write-Host "COUNSELOR VERIFICATION & ISOLATION TEST"
Write-Host "========================================="

# 1. Counselor Account
Write-Host "`n--- 1. Counselor Account ---"
try {
    $counselor = Invoke-RestMethod -Uri "$baseUrl/counselors/1" -Method Get
    Write-Host "Counselor Entity ID: "$counselor.id
    Write-Host "Counselor Name: "$counselor.fullName
    Write-Host "Counselor Email: "$counselor.email
    Write-Host "Counselor User ID: "$counselor.userId
} catch {
    Write-Host "Error fetching counselor 1: $_"
}

# 2. Supervised Students / Classes
Write-Host "`n--- 2. Supervised Students ---"
try {
    $students = Invoke-RestMethod -Uri "$baseUrl/counselors/1/students" -Method Get
    Write-Host "Total Supervised Students: "$students.Count
    foreach ($s in $students) {
        Write-Host " - Student ID: $($s.id) | Name: $($s.fullName) | Class: $($s.className)-$($s.section)"
    }
} catch {
    Write-Host "Error fetching assigned students: $_"
}

# 3. At-Risk API Endpoint & Actual Data
Write-Host "`n--- 3. At-Risk API Endpoint & Actual Data ---"
try {
    $dropoutData = Invoke-RestMethod -Uri "$baseUrl/ai/students/counselor/1/dropout-risk" -Method Get
    Write-Host "At-Risk Endpoint: GET /api/ai/students/counselor/1/dropout-risk"
    Write-Host "Returned $($dropoutData.Count) student risk predictions:"
    foreach ($item in $dropoutData) {
        Write-Host " - Student ID: $($item.studentId) | Name: $($item.studentName) | Risk: $($item.dropout_risk) | Confidence: $($item.confidence)% | Att: $($item.featureSummary.attendance_percentage)% | Score: $($item.featureSummary.current_percentage)%"
    }
} catch {
    Write-Host "Error fetching counselor dropout risk: $_"
}

# 4. Counselor Report API & Actual Data
Write-Host "`n--- 4. Counselor Report API & Actual Data ---"
try {
    $report = Invoke-RestMethod -Uri "$baseUrl/counselors/1/report" -Method Get
    Write-Host "Report Endpoint: GET /api/counselors/1/report"
    Write-Host "Total Sessions: "$report.totalSessions
    Write-Host "Completed Sessions: "$report.completedSessions
    Write-Host "Pending Sessions: "$report.pendingSessions
    Write-Host "At-Risk Student Count: "$report.atRiskStudentsCount
    Write-Host "Risk Breakdown: High=$($report.highRiskCount), Medium=$($report.mediumRiskCount), Low=$($report.lowRiskCount), NoRisk=$($report.noRiskCount)"
    Write-Host "Monthly Reports Count: "$report.monthlyReports.Count
    Write-Host "Supervised Student Rows: "$report.supervisedStudents.Count
} catch {
    Write-Host "Error fetching counselor report: $_"
}

# 5. Notification Endpoint & Visible Notifications
Write-Host "`n--- 5. Notification Endpoint & Visible Notifications ---"
try {
    $notifs = Invoke-RestMethod -Uri "$baseUrl/notifications/user/4?role=COUNSELOR" -Method Get
    Write-Host "Notification Endpoint: GET /api/notifications/user/4?role=COUNSELOR"
    Write-Host "Visible Notifications Count: "$notifs.Count
    foreach ($n in $notifs) {
        Write-Host " - [ID: $($n.id)] TargetRole: $($n.targetRole) | UserId: $($n.userId) | Title: $($n.title)"
    }
} catch {
    Write-Host "Error fetching counselor notifications: $_"
}

# 6. Blocked Unauthorized Notifications Check
Write-Host "`n--- 6. Security & Notification Isolation Check ---"
try {
    # Fetch all notifications via admin to compare
    $allNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method Get
    $unauthorized = $allNotifs | Where-Object { 
        ($_.targetRole -eq "PARENT" -and $_.userId -ne 4) -or 
        ($_.targetRole -eq "TEACHER" -and $_.userId -ne 4) -or 
        ($_.targetRole -eq "STUDENT" -and $_.userId -ne 4) -or 
        ($_.targetRole -eq "ADMIN")
    }
    
    $leakedInCounselor = $notifs | Where-Object { 
        ($_.targetRole -eq "PARENT" -and $_.userId -ne 4) -or 
        ($_.targetRole -eq "TEACHER" -and $_.userId -ne 4) -or 
        ($_.targetRole -eq "STUDENT" -and $_.userId -ne 4) -or 
        ($_.targetRole -eq "ADMIN")
    }

    if ($leakedInCounselor.Count -eq 0) {
        Write-Host "SUCCESS: Counselor received 0 unauthorized (Parent/Teacher/Student/Admin private) notifications."
        Write-Host "Blocked $($unauthorized.Count) unauthorized role/user private notifications."
    } else {
        Write-Host "WARNING: Leaked $($leakedInCounselor.Count) unauthorized notifications!"
    }
} catch {
    Write-Host "Error checking notification isolation: $_"
}

Write-Host "`n========================================="
Write-Host "VERIFICATION COMPLETE"
Write-Host "========================================="
