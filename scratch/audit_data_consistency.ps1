$baseUrl = "http://localhost:8080/api"

Write-Host "========================================="
Write-Host "DEEP DATA CONSISTENCY & CALCULATION AUDIT"
Write-Host "========================================="

$studentIds = @(14, 18, 19, 21)

foreach ($sid in $studentIds) {
    Write-Host "`n-----------------------------------------"
    Write-Host "STUDENT ID: $sid"
    Write-Host "-----------------------------------------"
    
    # 1. Student Details
    $student = Invoke-RestMethod -Uri "$baseUrl/students/$sid" -Method Get
    Write-Host "Name: $($student.fullName) | Class: $($student.className)-$($student.section) | Status: $($student.status)"
    Write-Host "Class Teacher ID: $($student.classTeacherId) | Counselor ID: $($student.counselorId)"

    # 2. Attendance Summary
    $att = Invoke-RestMethod -Uri "$baseUrl/students/$sid/attendance-summary" -Method Get
    Write-Host "Attendance API: Total=$($att.totalDays), Present=$($att.presentDays), Absent=$($att.absentDays), Pct=$($att.attendancePercentage)%"

    # 3. Overall Percentage
    $pct = Invoke-RestMethod -Uri "$baseUrl/students/$sid/overall-percentage" -Method Get
    Write-Host "Overall Pct API: Score=$($pct.overallPercentage)%, TotalSubjects=$($pct.totalSubjects), Status=$($pct.status)"

    # 4. Class Rank
    $rank = Invoke-RestMethod -Uri "$baseUrl/students/$sid/class-rank" -Method Get
    Write-Host "Class Rank API: Rank=$($rank.classRank), TotalInClass=$($rank.totalStudentsInClass), ClassName=$($rank.className)"

    # 5. Raw Marks
    $marks = Invoke-RestMethod -Uri "$baseUrl/students/$sid/marks" -Method Get
    Write-Host "Marks API Count: $($marks.Count)"
    foreach ($m in $marks) {
        Write-Host "   - Subject: $($m.subject) | Mark: $($m.marks)"
    }

    # 6. Single AI Dropout Risk API
    try {
        $aiSingle = Invoke-RestMethod -Uri "$baseUrl/ai/dropout-risk/$sid" -Method Get
        $rVal = if ($aiSingle.dropoutRisk) { $aiSingle.dropoutRisk } else { $aiSingle.dropout_risk }
        Write-Host "AI Single Risk API: Risk=$rVal, Conf=$($aiSingle.confidence)%"
    } catch {
        Write-Host "AI Single Risk API Error: $_"
    }
}

Write-Host "`n========================================="
Write-Host "COUNSELOR REPORT & BATCH DROPOUT AUDIT"
Write-Host "========================================="
$counselorReport = Invoke-RestMethod -Uri "$baseUrl/counselors/1/report" -Method Get
Write-Host "Counselor Report Metrics: TotalSessions=$($counselorReport.totalSessions), Completed=$($counselorReport.completedSessions), Pending=$($counselorReport.pendingSessions), AtRiskCount=$($counselorReport.atRiskStudentsCount)"
Write-Host "Risk Breakdown: High=$($counselorReport.highRiskCount), Medium=$($counselorReport.mediumRiskCount), Low=$($counselorReport.lowRiskCount), NoRisk=$($counselorReport.noRiskCount)"
Write-Host "Supervised Student Rows:"
foreach ($sr in $counselorReport.supervisedStudents) {
    Write-Host " - [ID: $($sr.studentId)] $($sr.name) | Att: $($sr.attendancePercentage)% | Score: $($sr.academicScore)% | Risk: $($sr.riskLevel) | Action: $($sr.recommendedAction)"
}

Write-Host "`n========================================="
Write-Host "TEACHER REPORTS AUDIT"
Write-Host "========================================="
$teacherIds = @(4, 5, 8, 11)
foreach ($tid in $teacherIds) {
    try {
        $tr = Invoke-RestMethod -Uri "$baseUrl/teachers/$tid/reports" -Method Get
        Write-Host "Teacher ID $tid ($($tr.teacherName)): TotalStudents=$($tr.totalStudents), AvgAtt=$($tr.averageAttendance)%, AvgScore=$($tr.averageAcademicScore)%, AtRisk=$($tr.atRiskCount)"
    } catch {
        Write-Host "Error fetching teacher $tid report: $_"
    }
}

Write-Host "`n========================================="
Write-Host "ADMIN REPORTS AUDIT"
Write-Host "========================================="
$adminStudentReports = Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/reports/students" -Method Get
foreach ($asr in $adminStudentReports) {
    Write-Host " - [ID: $($asr.id)] $($asr.name) | Class: $($asr.classAndSection) | Att: $($asr.attendance) | Score: $($asr.averageScore) | Risk: $($asr.riskLevel) | Action: $($asr.currentAction)"
}
