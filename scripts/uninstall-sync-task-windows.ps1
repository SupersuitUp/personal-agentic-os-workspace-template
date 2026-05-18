# Remove the hourly sync Scheduled Task for this workspace.
# Windows companion to install-sync-task-windows.ps1.
#
# Usage (from the workspace root, in PowerShell):
#   powershell -ExecutionPolicy Bypass -File .\scripts\uninstall-sync-task-windows.ps1

$ErrorActionPreference = 'Stop'

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoDir   = Split-Path -Parent $ScriptDir
$WorkspaceName = Split-Path -Leaf $RepoDir
$TaskName    = "WorkspaceSync-$WorkspaceName"
$LegacyName  = "JarvisSync-$WorkspaceName"

$removed = $false

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
  Write-Host "Removed sync task '$TaskName'"
  $removed = $true
}

if (Get-ScheduledTask -TaskName $LegacyName -ErrorAction SilentlyContinue) {
  Unregister-ScheduledTask -TaskName $LegacyName -Confirm:$false
  Write-Host "Removed legacy sync task '$LegacyName'"
  $removed = $true
}

if (-not $removed) {
  Write-Host "No sync task found for '$WorkspaceName' (nothing to do)"
}
