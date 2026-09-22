$ProgressPreference = 'SilentlyContinue'
$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$mongosh = "C:\Users\Gokulnath\AppData\Local\Programs\mongosh\mongosh.exe"

Write-Host "=================== 1. TOTAL STUDENTS COUNT ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT COUNT(*) as total_students FROM students;"

Write-Host "`n=================== 2. CLASS-SECTION DISTRIBUTION ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT class_name, section, COUNT(*) as student_count FROM students GROUP BY class_name, section ORDER BY CAST(class_name AS UNSIGNED), section;"

Write-Host "`n=================== 3. USER ACCOUNTS COUNT IN MYSQL ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT role_id, COUNT(*) as count FROM users GROUP BY role_id;"

Write-Host "`n=================== 4. PARENT RECORDS COUNT ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT COUNT(*) as total_parents FROM parents;"

Write-Host "`n=================== 5. ACADEMIC PROFILES COUNT ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT COUNT(*) as total_academic_profiles FROM student_academic_profiles;"

Write-Host "`n=================== 6. MARKS RECORDS COUNT ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT COUNT(*) as total_marks_records FROM student_marks;"

Write-Host "`n=================== 7. ATTENDANCE RECORDS COUNT ==================="
& $mysql -u root -pnath@1827 edupath_ai -e "SELECT COUNT(*) as total_attendance_records FROM attendance;"

Write-Host "`n=================== 8. MONGODB OAUTH USERS COUNT ==================="
& $mongosh mongodb://localhost:27017/oauth_db --eval "db.users.countDocuments()"
