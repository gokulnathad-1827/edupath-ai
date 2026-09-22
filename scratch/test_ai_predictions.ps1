$ProgressPreference = 'SilentlyContinue'

Write-Host "=================== TESTING AI DROPOUT RISK PREDICTIONS ==================="

$students = Invoke-RestMethod -Uri "http://localhost:8080/api/students"

$sampleStudents = @()
$sampleStudents += $students | Where-Object { $_.className -eq '9' -and $_.section -eq 'A' } | Select-Object -First 2
$sampleStudents += $students | Where-Object { $_.className -eq '10' -and $_.section -eq 'A' } | Select-Object -First 2
$sampleStudents += $students | Where-Object { $_.className -eq '11' -and $_.section -eq 'B' } | Select-Object -First 2
$sampleStudents += $students | Where-Object { $_.className -eq '12' -and $_.section -eq 'B' } | Select-Object -First 2

foreach ($st in $sampleStudents) {
    $id = $st.id
    $name = $st.fullName
    $cName = $st.className
    $sec = $st.section
    try {
        $aiRes = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/students/$id/dropout-risk" -Method Get -ErrorAction Stop
        Write-Host "Student ID $id ($name, Class $cName-$sec): Risk=$($aiRes.dropoutRisk), Confidence=$($aiRes.confidence)%"
        if ($aiRes.featureSummary) {
            $f = $aiRes.featureSummary
            Write-Host "   Features derived (16/16): Age=$($f.age), Grade=$($f.grade), Att=$($f.attendancePercentage)%, Math=$($f.mathematicsScore), Sci=$($f.scienceScore), Eng=$($f.englishScore), Comp=$($f.computerScore), AssignRate=$($f.assignmentCompletionRate)%, StudyHrs=$($f.studyHoursPerDay), Behavior=$($f.behaviorScore), ParentSupport=$($f.parentalSupport), Failures=$($f.previousFailures), Trend=$($f.academicTrend)"
        }
    } catch {
        Write-Host "Student ID $id ($name) AI test error: $_"
    }
}
