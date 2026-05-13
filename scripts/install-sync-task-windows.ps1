# Install an hourly Scheduled Task that syncs this Jarvis workspace to GitHub.
# Windows equivalent of install-sync-cron.sh.
# Idempotent: running again replaces any existing task for this workspace.
#
# Usage (from the workspace root, in PowerShell):
#   powershell -ExecutionPolicy Bypass -File .\scripts\install-sync-task-windows.ps1

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoDir   = Split-Path -Parent $ScriptDir
$SyncScript = Join-Path $RepoDir 'scripts\sync.sh'

if (-not (Test-Path $SyncScript)) {
  Write-Error "sync.sh not found at $SyncScript"
  exit 1
}

# Locate bash.exe from Git for Windows (the shell devs already have installed)
$BashExe = $null
$candidates = @(
  "$env:ProgramFiles\Git\bin\bash.exe",
  "${env:ProgramFiles(x86)}\Git\bin\bash.exe",
  "$env:LOCALAPPDATA\Programs\Git\bin\bash.exe"
)
foreach ($c in $candidates) {
  if (Test-Path $c) { $BashExe = $c; break }
}
if (-not $BashExe) {
  Write-Error @"
bash.exe not found. Git for Windows must be installed (it ships bash.exe).
Install via: winget install Git.Git
"@
  exit 1
}

$WorkspaceName = Split-Path -Leaf $RepoDir
$TaskName = "JarvisSync-$WorkspaceName"

$Action = New-ScheduledTaskAction `
  -Execute $BashExe `
  -Argument "`"$SyncScript`"" `
  -WorkingDirectory $RepoDir

$StartAt = (Get-Date).AddMinutes(2)
$Trigger = New-ScheduledTaskTrigger -Once -At $StartAt `
  -RepetitionInterval (New-TimeSpan -Hours 1) `
  -RepetitionDuration (New-TimeSpan -Days 3650)

$Settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 10)

$Principal = New-ScheduledTaskPrincipal `
  -UserId "$env:USERDOMAIN\$env:USERNAME" `
  -LogonType Interactive

# Idempotent: remove any existing task with the same name first
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $Action `
  -Trigger $Trigger `
  -Settings $Settings `
  -Principal $Principal `
  -Description "Hourly sync for Jarvis workspace at $RepoDir" | Out-Null

Write-Host "Installed hourly sync task '$TaskName' for $RepoDir"
Write-Host ""
Write-Host "Verify:   Get-ScheduledTask -TaskName '$TaskName'"
Write-Host "Run now:  Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "Logs:     $RepoDir\.jarvis-sync.log"
Write-Host ""
Write-Host "To remove later: powershell -ExecutionPolicy Bypass -File .\scripts\uninstall-sync-task-windows.ps1"
