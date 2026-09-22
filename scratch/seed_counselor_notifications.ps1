$baseUrl = "http://localhost:8080/api"

# Check notifications for Counselor (User 4)
Write-Host "Fetching notifications for counselor (User ID: 4)..."
$counselorNotifs = Invoke-RestMethod -Uri "$baseUrl/notifications/user/4?role=COUNSELOR" -Method Get
Write-Host "Notifications retrieved for counselor:"
$counselorNotifs | ConvertTo-Json -Depth 3

# If counselor has no notifications, let's post a counselor notification
if (-not $counselorNotifs -or $counselorNotifs.Count -eq 0) {
    Write-Host "Seeding a notification for counselor..."
    $body = @{
        title = "New Counseling Schedule"
        message = "You have 3 upcoming counseling sessions scheduled for this week."
        type = "ALERT"
        userId = 4
        targetRole = "COUNSELOR"
        read = $false
    } | ConvertTo-Json

    $posted = Invoke-RestMethod -Uri "$baseUrl/notifications" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Posted notification:"
    $posted | ConvertTo-Json
}

# Verify again
$counselorNotifsUpdated = Invoke-RestMethod -Uri "$baseUrl/notifications/user/4?role=COUNSELOR" -Method Get
Write-Host "Updated Counselor Notifications:"
$counselorNotifsUpdated | ConvertTo-Json -Depth 3
