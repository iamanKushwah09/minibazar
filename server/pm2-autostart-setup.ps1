# pm2-autostart-setup.ps1
Write-Host "Creating PM2 startup task..."

# Define the scheduled task
$action = New-ScheduledTaskAction -Execute "pm2.cmd" -Argument "resurrect"
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest

# Register the scheduled task
Register-ScheduledTask -TaskName "PM2 Startup" -Action $action -Trigger $trigger -Principal $principal

Write-Host "✅ PM2 auto-start task created successfully!"
