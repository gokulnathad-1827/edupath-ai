$ProgressPreference = 'SilentlyContinue'

Write-Host "=================== MYSQL TABLES IN edupath_ai ==================="
$tables = mysql -u root -pnath@1827 edupath_ai -e "SHOW TABLES;" 2>&1
Write-Host $tables

Write-Host "`n=================== STUDENTS IN MYSQL ==================="
$students = mysql -u root -pnath@1827 edupath_ai -e "SELECT id, full_name, student_id, class_name, section, email, user_id, parent_id, class_teacher_id, counselor_id FROM students;" 2>&1
Write-Host $students

Write-Host "`n=================== USERS IN MYSQL ==================="
$users = mysql -u root -pnath@1827 edupath_ai -e "SELECT id, username, email, full_name, role, is_enabled FROM users;" 2>&1
Write-Host $users

Write-Host "`n=================== PARENTS IN MYSQL ==================="
$parents = mysql -u root -pnath@1827 edupath_ai -e "SELECT id, full_name, email, phone_number, user_id FROM parents;" 2>&1
Write-Host $parents

Write-Host "`n=================== TEACHERS IN MYSQL ==================="
$teachers = mysql -u root -pnath@1827 edupath_ai -e "SELECT id, full_name, subject, email, user_id FROM teachers;" 2>&1
Write-Host $teachers

Write-Host "`n=================== COUNSELORS IN MYSQL ==================="
$counselors = mysql -u root -pnath@1827 edupath_ai -e "SELECT id, full_name, email, user_id FROM counselors;" 2>&1
Write-Host $counselors

Write-Host "`n=================== STUDENT ACADEMIC PROFILES IN MYSQL ==================="
$profiles = mysql -u root -pnath@1827 edupath_ai -e "SELECT id, student_id, assignment_completion_rate, study_hours_per_day, behavior_score, previous_percentage FROM student_academic_profiles;" 2>&1
Write-Host $profiles

Write-Host "`n=================== ATTENDANCE COUNT IN MYSQL ==================="
$attCount = mysql -u root -pnath@1827 edupath_ai -e "SELECT student_id, count(*) as count FROM attendance GROUP BY student_id;" 2>&1
Write-Host $attCount

Write-Host "`n=================== MARKS COUNT IN MYSQL ==================="
$marksCount = mysql -u root -pnath@1827 edupath_ai -e "SELECT student_name, count(*) as count FROM marks GROUP BY student_name;" 2>&1
Write-Host $marksCount
