# Setup Claude Skills Directory on Windows
#
# The repository ships a .claude/skills -> ../.agents/skills symlink so Claude Code
# auto-discovers the same skills the rest of the ecosystem uses via .agents/skills/.
# Git for Windows can check out symlinks, but only when core.symlinks=true AND the
# user has developer mode / admin rights. If your clone shows .claude/skills as a
# one-line text file (containing "../.agents/skills") instead of a working link,
# that support is not active. Run this script from the repo root as a fallback.
#
# What it does:
#   1. If .claude/skills exists and looks like a broken symlink placeholder, removes it
#   2. Tries to create a real directory symlink from .claude/skills to .agents/skills
#   3. If symlink creation fails (admin rights / dev mode missing), falls back to a
#      junction (mklink /J) which does not require privilege elevation but still
#      transparently points Claude Code at the .agents/skills/ directory
#
# Usage:  powershell -ExecutionPolicy Bypass -File scripts/setup-claude-skills-windows.ps1

$ErrorActionPreference = 'Stop'

Push-Location (Split-Path -Parent $PSScriptRoot)

try {
    if (-not (Test-Path .\.agents\skills)) {
        throw 'Cannot find .agents/skills at repo root. Run this script from the repo root after cloning.'
    }

    if (Test-Path .\.claude\skills) {
        $item = Get-Item .\.claude\skills -Force
        $isReparse = ($item.Attributes -band [System.IO.FileAttributes]::ReparsePoint)
        if ($isReparse) {
            Write-Host '.claude/skills is already a reparse point (symlink or junction). Nothing to do.'
            return
        }
        Write-Host '.claude/skills exists as a non-symlink. Removing so it can be recreated.'
        Remove-Item .\.claude\skills -Recurse -Force
    }

    if (-not (Test-Path .\.claude)) {
        New-Item -ItemType Directory -Path .\.claude | Out-Null
    }

    try {
        New-Item -ItemType SymbolicLink -Path .\.claude\skills -Target ..\.agents\skills | Out-Null
        Write-Host 'Created symlink .claude/skills -> ../.agents/skills'
    } catch {
        Write-Host 'Symbolic link creation failed (most likely missing developer-mode / admin privilege). Falling back to a directory junction.'
        $target = (Resolve-Path .\.agents\skills).Path
        cmd /c mklink /J .\.claude\skills "$target" | Out-Null
        Write-Host "Created junction .claude/skills -> $target"
    }
}
finally {
    Pop-Location
}
