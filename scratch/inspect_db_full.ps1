$ProgressPreference = 'SilentlyContinue'
$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

Write-Host "=================== CURRENT STUDENTS ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT id, full_name, student_id, class_name, section, email, user_id, parent_id, class_teacher_id, counselor_id FROM students;"

Write-Host "`n=================== STUDENTS CLASS-SECTION DISTRIBUTION ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT class_name, section, COUNT(*) as count FROM students GROUP BY class_name, section;"

Write-Host "`n=================== CURRENT USERS ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT id, username, email, full_name, role, is_enabled FROM users;"

Write-Host "`n=================== CURRENT PARENTS ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT id, full_name, email, phone_number, user_id FROM parents;"

Write-Host "`n=================== CURRENT TEACHERS ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT id, full_name, subject, email, department, user_id FROM teachers;"

Write-Host "`n=================== CURRENT COUNSELORS ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT id, full_name, email, department, user_id FROM counselors;"

Write-Host "`n=================== STUDENT ACADEMIC PROFILES ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT * FROM student_academic_profiles;"

Write-Host "`n=================== ATTENDANCE TABLE SCHEMA ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "DESCRIBE attendance;"

Write-Host "`n=================== ATTENDANCES TABLE SCHEMA ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "DESCRIBE attendances;"

Write-Host "`n=================== MARKS TABLE SCHEMA ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "DESCRIBE marks;"

Write-Host "`n=================== STUDENTS TABLE SCHEMA ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "DESCRIBE students;"

Write-Host "`n=================== USERS TABLE SCHEMA ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "DESCRIBE users;"

Write-Host "`n=================== PARENTS TABLE SCHEMA ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "DESCRIBE parents;"

Write-Host "`n=================== TEACHERS TABLE SCHEMA ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "DESCRIBE teachers;"
