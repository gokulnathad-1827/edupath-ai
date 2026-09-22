$ProgressPreference = 'SilentlyContinue'

Write-Host "=== 1. PARENT 1 (Suresh Kumar) LINKED CHILD ==="
try {
    $c = Invoke-RestMethod -Uri 'http://localhost:8080/api/parents/1/child'
    Write-Host "Parent 1 Linked Child: $($c.fullName) (ID $($c.id))"
} catch {
    Write-Host "Parent 1 child error: $_"
}

Write-Host "`n=== 2. PARENT 1 ACCESSING UNLINKED CHILD (Hema, ID 18) ==="
try {
    $res = Invoke-RestMethod -Uri 'http://localhost:8080/api/parents/1/child/18' -Method Get
    Write-Host "UNEXPECTED ALLOWED: $res"
} catch {
    Write-Host "SECURITY CHECK PASSED (REJECTED): $_"
}
