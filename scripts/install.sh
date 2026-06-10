#!/usr/bin/env bash
# =============================================================================
# TabRoks — Automated Chrome Extension Installer
# by DigitalRoks (digitalroks.com)
# GitHub: https://github.com/timmiller99/tabroks
#
# WHAT THIS DOES:
#   1. Checks that Git and Google Chrome are installed
#   2. Clones (or pulls latest) the TabRoks repo from GitHub
#   3. Opens Chrome's extension manager (chrome://extensions)
#   4. Prints step-by-step instructions to load the extension
#   5. Optionally opens the TabRoks folder in Finder/Explorer for easy drag-drop
#
# USAGE:
#   chmod +x install.sh && ./install.sh
#
# REQUIREMENTS:
#   - macOS, Linux, or Windows (Git Bash / WSL)
#   - Google Chrome installed
#   - Git installed (https://git-scm.com)
# =============================================================================

set -e

# ── Colors ────────────────────────────────────────────────────────────────────
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

REPO_URL="https://github.com/timmiller99/tabroks.git"
INSTALL_DIR="$HOME/tabroks"

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${PURPLE}${BOLD}"
echo "  ████████╗ █████╗ ██████╗ ██████╗  ██████╗ ██╗  ██╗███████╗"
echo "     ██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔═══██╗██║ ██╔╝██╔════╝"
echo "     ██║   ███████║██████╔╝██████╔╝██║   ██║█████╔╝ ███████╗ "
echo "     ██║   ██╔══██║██╔══██╗██╔══██╗██║   ██║██╔═██╗ ╚════██║ "
echo "     ██║   ██║  ██║██████╔╝██║  ██║╚██████╔╝██║  ██╗███████║ "
echo "     ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝"
echo -e "${RESET}"
echo -e "${CYAN}  Smart Tab Groups for Chrome — by DigitalRoks.com${RESET}"
echo -e "${CYAN}  GitHub: https://github.com/timmiller99/tabroks${RESET}"
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""

# ── Step 1: Check Git ─────────────────────────────────────────────────────────
echo -e "${BOLD}[1/5] Checking dependencies...${RESET}"

if ! command -v git &>/dev/null; then
  echo -e "${RED}✗ Git is not installed.${RESET}"
  echo -e "  Install Git from: ${CYAN}https://git-scm.com/downloads${RESET}"
  exit 1
fi
echo -e "${GREEN}✓ Git found: $(git --version)${RESET}"

# ── Step 2: Detect OS + Chrome path ──────────────────────────────────────────
echo ""
echo -e "${BOLD}[2/5] Detecting your system...${RESET}"

OS="unknown"
CHROME_CMD=""
OPEN_CMD=""

if [[ "$OSTYPE" == "darwin"* ]]; then
  OS="mac"
  CHROME_CMD="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  OPEN_CMD="open"
  echo -e "${GREEN}✓ macOS detected${RESET}"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  OS="linux"
  CHROME_CMD=$(command -v google-chrome || command -v chromium-browser || command -v chromium || echo "")
  OPEN_CMD="xdg-open"
  echo -e "${GREEN}✓ Linux detected${RESET}"
elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "cygwin"* ]]; then
  OS="windows"
  CHROME_CMD="/c/Program Files/Google/Chrome/Application/chrome.exe"
  OPEN_CMD="start"
  echo -e "${GREEN}✓ Windows (Git Bash) detected${RESET}"
fi

if [[ -z "$CHROME_CMD" ]] || [[ ! -f "$CHROME_CMD" && "$OS" != "windows" ]]; then
  echo -e "${YELLOW}⚠ Could not auto-detect Chrome. You can still install manually.${RESET}"
else
  echo -e "${GREEN}✓ Chrome found${RESET}"
fi

# ── Step 3: Clone or update the repo ─────────────────────────────────────────
echo ""
echo -e "${BOLD}[3/5] Setting up TabRoks files...${RESET}"

if [[ -d "$INSTALL_DIR/.git" ]]; then
  echo -e "${CYAN}→ TabRoks already cloned. Pulling latest updates...${RESET}"
  cd "$INSTALL_DIR"
  git pull origin main
  echo -e "${GREEN}✓ Updated to latest version${RESET}"
else
  echo -e "${CYAN}→ Cloning TabRoks from GitHub...${RESET}"
  git clone "$REPO_URL" "$INSTALL_DIR"
  echo -e "${GREEN}✓ Cloned to: $INSTALL_DIR${RESET}"
fi

# ── Step 4: Open Chrome extensions page ──────────────────────────────────────
echo ""
echo -e "${BOLD}[4/5] Opening Chrome Extensions Manager...${RESET}"

if [[ "$OS" == "mac" ]]; then
  open -a "Google Chrome" "chrome://extensions" 2>/dev/null || true
elif [[ "$OS" == "linux" ]]; then
  $CHROME_CMD "chrome://extensions" 2>/dev/null &
elif [[ "$OS" == "windows" ]]; then
  start chrome "chrome://extensions" 2>/dev/null || true
fi

echo -e "${GREEN}✓ Chrome Extensions page should be opening...${RESET}"
echo -e "${YELLOW}  (If it didn't open, manually go to: chrome://extensions)${RESET}"

# ── Step 5: Open the TabRoks folder ──────────────────────────────────────────
echo ""
echo -e "${BOLD}[5/5] Opening TabRoks folder...${RESET}"

if [[ "$OS" == "mac" ]]; then
  open "$INSTALL_DIR"
elif [[ "$OS" == "linux" ]]; then
  xdg-open "$INSTALL_DIR" 2>/dev/null || true
elif [[ "$OS" == "windows" ]]; then
  explorer "$(cygpath -w "$INSTALL_DIR")" 2>/dev/null || true
fi

echo -e "${GREEN}✓ TabRoks folder opened: $INSTALL_DIR${RESET}"

# ── Final Instructions ────────────────────────────────────────────────────────
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "${BOLD}${GREEN}🎉 Almost done! Complete these 3 steps in Chrome:${RESET}"
echo ""
echo -e "  ${BOLD}Step 1:${RESET} In Chrome Extensions (chrome://extensions)"
echo -e "          Toggle ${BOLD}Developer Mode${RESET} ${YELLOW}ON${RESET} (top-right switch)"
echo ""
echo -e "  ${BOLD}Step 2:${RESET} Click ${BOLD}\"Load unpacked\"${RESET} button"
echo ""
echo -e "  ${BOLD}Step 3:${RESET} Navigate to and select this folder:"
echo -e "          ${CYAN}${BOLD}$INSTALL_DIR${RESET}"
echo ""
echo -e "  ${BOLD}Step 4:${RESET} Click the ${BOLD}puzzle piece icon${RESET} in Chrome toolbar → Pin ${BOLD}TabRoks${RESET}"
echo ""
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo ""
echo -e "${CYAN}  TabRoks is free & open source — MIT License${RESET}"
echo -e "${CYAN}  More free AI tools: ${BOLD}https://digitalroks.com${RESET}"
echo ""
