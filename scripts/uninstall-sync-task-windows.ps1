# Remove the hourly sync Scheduled Task for this Jarvis workspace.
# Windows companion to install-sync-task-windows.ps1.
#
# Usage (from the workspace root, in PowerShell):
#   powershell -ExecutionPolicy Bypass -File .\scripts\uninstall-sync-task-windows.ps1

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoDir   = Split-Path -Parent $ScriptDir
$WorkspaceName = Split-Path -Leaf $RepoDir
$TaskName = "JarvisSync-$WorkspaceName"

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
  Write-Host "Removed sync task '$TaskName'"
} else {
  Write-Host "No sync task named '$TaskName' (nothing to do)"
}
