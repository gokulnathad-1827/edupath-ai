$ProgressPreference = 'SilentlyContinue'

$r1 = Invoke-RestMethod -Uri 'http://localhost:8080/api/ai/students/78/dropout-risk'
Write-Host "=== Deepak Verma (Class 9-B, Weak) ==="
$r1 | ConvertTo-Json -Depth 3

$r2 = Invoke-RestMethod -Uri 'http://localhost:8080/api/ai/students/99/dropout-risk'
Write-Host "=== Srikanth N (Class 11-B, Low) ==="
$r2 | ConvertTo-Json -Depth 3

$r3 = Invoke-RestMethod -Uri 'http://localhost:8080/api/ai/students/112/dropout-risk'
Write-Host "=== Zara Khan (Class 12-B, Low) ==="
$r3 | ConvertTo-Json -Depth 3
