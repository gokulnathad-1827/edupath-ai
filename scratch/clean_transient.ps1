$ProgressPreference = 'SilentlyContinue'
$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$mongosh = "C:\Users\Gokulnath\AppData\Local\Programs\mongosh\mongosh.exe"

Write-Host "Cleaning transient seeded data..."
& $mysql -u root -pnath@1827 edupath_ai -e "
DELETE FROM student_academic_profiles WHERE student_id > 21;
DELETE FROM attendance WHERE student_id > 21;
DELETE FROM student_marks WHERE id > 16;
DELETE FROM students WHERE id > 21;
DELETE FROM parents WHERE id > 1;
DELETE FROM users WHERE id > 31;
"

& $mongosh mongodb://localhost:27017/oauth_db --eval "db.users.deleteMany({ email: { `$nin: ['admin@edupath.com', 'teacher@edupath.com', 'parent@edupath.com', 'counselor@edupath.com', 'student@edupath.com'] } })"

Write-Host "Cleanup completed!"
