$ProgressPreference = 'SilentlyContinue'

Write-Host "=== 1. TEST USER API ==="
try {
    $u1 = Invoke-RestMethod -Uri 'http://localhost:8080/api/users/1' -Method Get
    Write-Host "GET /api/users/1 -> HTTP 200 SUCCESS"
    $u1 | ConvertTo-Json -Depth 2
} catch {
    Write-Host "GET /api/users/1 FAILED: $_"
}

try {
    $users = Invoke-RestMethod -Uri 'http://localhost:8080/api/users' -Method Get
    Write-Host "GET /api/users -> HTTP 200 SUCCESS (Total users: $($users.Count))"
} catch {
    Write-Host "GET /api/users FAILED: $_"
}

Write-Host "`n=== 2. TEST STUDENT 14 (10-A) ==="
try {
    $s14Att = Invoke-RestMethod -Uri 'http://localhost:8080/api/students/14/attendance-summary'
    $s14Pct = Invoke-RestMethod -Uri 'http://localhost:8080/api/students/14/overall-percentage'
    $s14Rank = Invoke-RestMethod -Uri 'http://localhost:8080/api/students/14/class-rank'
    Write-Host "Student 14 (guna): Class $($s14Rank.className)-$($s14Rank.section) | Att: $($s14Att.attendancePercentage)% | Pct: $($s14Pct.overallPercentage)% | Rank: $($s14Rank.classRank)/$($s14Rank.totalStudents)"
} catch {
    Write-Host "Student 14 lookup error: $_"
}

Write-Host "`n=== 3. TEST STUDENT 18 (10-B) ==="
try {
    $s18Att = Invoke-RestMethod -Uri 'http://localhost:8080/api/students/18/attendance-summary'
    $s18Pct = Invoke-RestMethod -Uri 'http://localhost:8080/api/students/18/overall-percentage'
    $s18Rank = Invoke-RestMethod -Uri 'http://localhost:8080/api/students/18/class-rank'
    Write-Host "Student 18 (Hema): Class $($s18Rank.className)-$($s18Rank.section) | Att: $($s18Att.attendancePercentage)% | Pct: $($s18Pct.overallPercentage)% | Rank: $($s18Rank.classRank)/$($s18Rank.totalStudents)"
} catch {
    Write-Host "Student 18 lookup error: $_"
}

Write-Host "`n=== 4. TEST STUDENT 21 (Gokulnath - 0 attendance/marks) ==="
try {
    $s21Att = Invoke-RestMethod -Uri 'http://localhost:8080/api/students/21/attendance-summary'
    Write-Host "Student 21 Attendance Summary: TotalDays=$($s21Att.totalDays), HasData=$($s21Att.hasAttendanceData), Status=$($s21Att.status)"
} catch {
    Write-Host "Student 21 lookup error: $_"
}

Write-Host "`n=== 5. TEST TEACHER MANI REPORT ==="
try {
    $tMani = Invoke-RestMethod -Uri 'http://localhost:8080/api/teachers/search?name=Mani' -ErrorAction SilentlyContinue
    if ($tMani) {
        $tId = $tMani.id
        $tRpt = Invoke-RestMethod -Uri "http://localhost:8080/api/teachers/$tId/report"
        Write-Host "Teacher Mani Report: classSize=$($tRpt.classSize), studentsWithMarks=$($tRpt.studentsWithMarks), averageGrade=$($tRpt.averageGrade), averageAttendance=$($tRpt.averageAttendance)"
    } else {
        Write-Host "Teacher Mani not found by search"
    }
} catch {
    Write-Host "Teacher Mani report error: $_"
}

Write-Host "`n=== 6. ADMIN DASHBOARD STUDENT REPORTS ==="
try {
    $adminRpt = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/dashboard/student-reports'
    $gokulRow = $adminRpt | Where-Object { $_.id -eq 21 -or $_.name -like '*Gokulnath*' }
    if ($gokulRow) {
        Write-Host "Admin Report Row for Gokulnath: attendance=$($gokulRow.attendance), averageScore=$($gokulRow.averageScore)"
    }
} catch {
    Write-Host "Admin report error: $_"
}
