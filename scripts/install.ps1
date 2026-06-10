# =============================================================================
# TabRoks — Automated Chrome Extension Installer (Windows PowerShell)
# by DigitalRoks (digitalroks.com)
# GitHub: https://github.com/timmiller99/tabroks
#
# USAGE (run as Administrator or normal user):
#   Right-click this file → "Run with PowerShell"
#   OR in PowerShell: .\install.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

$REPO_URL    = "https://github.com/timmiller99/tabroks.git"
$INSTALL_DIR = "$env:USERPROFILE\tabroks"

# ── Banner ────────────────────────────────────────────────────────────────────
Clear-Host
Write-Host ""
Write-Host "  ⚡ TabRoks — Smart Tab Groups for Chrome" -ForegroundColor Magenta
Write-Host "  by DigitalRoks.com" -ForegroundColor Cyan
Write-Host "  https://github.com/timmiller99/tabroks" -ForegroundColor Cyan
Write-Host ""
Write-Host ("─" * 60) -ForegroundColor DarkGray
Write-Host ""

# ── Step 1: Check Git ─────────────────────────────────────────────────────────
Write-Host "[1/5] Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    Write-Host "✓ $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git not found. Install from: https://git-scm.com/downloads" -ForegroundColor Red
    Write-Host "  Then re-run this script." -ForegroundColor Red
    Pause
    exit 1
}

# ── Step 2: Clone or update ───────────────────────────────────────────────────
Write-Host ""
Write-Host "[2/5] Setting up TabRoks files..." -ForegroundColor Yellow

if (Test-Path "$INSTALL_DIR\.git") {
    Write-Host "→ TabRoks already installed. Pulling latest updates..." -ForegroundColor Cyan
    Set-Location $INSTALL_DIR
    git pull origin main
    Write-Host "✓ Updated to latest version" -ForegroundColor Green
} else {
    Write-Host "→ Cloning TabRoks from GitHub to: $INSTALL_DIR" -ForegroundColor Cyan
    git clone $REPO_URL $INSTALL_DIR
    Write-Host "✓ Clone complete" -ForegroundColor Green
}

# ── Step 3: Detect Chrome ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "[3/5] Detecting Chrome..." -ForegroundColor Yellow

$chromePaths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chromeExe = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromeExe = $path
        break
    }
}

if ($chromeExe) {
    Write-Host "✓ Chrome found: $chromeExe" -ForegroundColor Green
} else {
    Write-Host "⚠ Chrome not found at default paths. You'll open it manually." -ForegroundColor Yellow
}

# ── Step 4: Open Chrome Extensions ───────────────────────────────────────────
Write-Host ""
Write-Host "[4/5] Opening Chrome Extensions Manager..." -ForegroundColor Yellow

if ($chromeExe) {
    Start-Process $chromeExe "chrome://extensions"
    Write-Host "✓ Chrome Extensions page opening..." -ForegroundColor Green
} else {
    Write-Host "→ Manually open Chrome and go to: chrome://extensions" -ForegroundColor Yellow
}

# ── Step 5: Open TabRoks folder ───────────────────────────────────────────────
Write-Host ""
Write-Host "[5/5] Opening TabRoks folder in Explorer..." -ForegroundColor Yellow
Start-Process explorer $INSTALL_DIR
Write-Host "✓ Folder opened: $INSTALL_DIR" -ForegroundColor Green

# ── Final Instructions ────────────────────────────────────────────────────────
Write-Host ""
Write-Host ("─" * 60) -ForegroundColor DarkGray
Write-Host ""
Write-Host "🎉 Almost done! Complete these steps in Chrome:" -ForegroundColor Green
Write-Host ""
Write-Host "  Step 1: In Chrome Extensions (chrome://extensions)" -ForegroundColor White
Write-Host "          Toggle Developer Mode ON (top-right)" -ForegroundColor White
Write-Host ""
Write-Host "  Step 2: Click 'Load unpacked'" -ForegroundColor White
Write-Host ""
Write-Host "  Step 3: Select this folder:" -ForegroundColor White
Write-Host "          $INSTALL_DIR" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Step 4: Pin TabRoks from the puzzle piece icon in Chrome toolbar" -ForegroundColor White
Write-Host ""
Write-Host ("─" * 60) -ForegroundColor DarkGray
Write-Host ""
Write-Host "  More free AI tools: https://digitalroks.com" -ForegroundColor Cyan
Write-Host ""
Pause
