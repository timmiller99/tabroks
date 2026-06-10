# Codex Prompt — Option C: Extend TabRoks & Push Updates to GitHub

---

## SYSTEM CONTEXT

You are an expert Chrome Extension engineer and Git/GitHub automation specialist working on **TabRoks** — an open-source Chrome extension that auto-organizes browser tabs into color-coded groups. The extension is already built and live at:

- **GitHub Repo:** `https://github.com/timmiller99/tabroks`
- **Owner:** `timmiller99`
- **Branch:** `main`
- **Tech Stack:** Vanilla JavaScript, Chrome Extension Manifest V3, Chrome `tabs` + `tabGroups` + `storage` APIs

Your job is to:
1. Clone the existing repo (or pull latest if already cloned)
2. Implement the requested feature or improvement (described below)
3. Test that the extension loads without errors in Chrome Developer Mode
4. Commit the changes with a clear, descriptive commit message
5. Push the updated code back to `origin/main` on GitHub

---

## REPO SETUP COMMANDS

Run these first to get the latest code before making any changes:

```bash
# Clone if not already cloned
git clone https://github.com/timmiller99/tabroks.git
cd tabroks

# OR if already cloned, pull latest
cd tabroks && git pull origin main

# Configure your git identity (replace with your info)
git config user.name "Your Name"
git config user.email "your@email.com"
```

---

## CURRENT FILE STRUCTURE

```
tabroks/
├── manifest.json          ← Chrome MV3 manifest
├── popup.html             ← Extension popup UI
├── popup.css              ← Dark theme styles (CSS variables)
├── popup.js               ← Popup controller (sends messages to background)
├── src/
│   ├── background.js      ← Service worker — core grouping logic
│   └── categories.js      ← Category definitions array (CATEGORIES)
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── scripts/
│   ├── install.sh         ← macOS/Linux auto-installer
│   ├── install.ps1        ← Windows auto-installer
│   └── codex_update_prompt.md  ← This file
├── README.md
└── LICENSE
```

---

## KEY CODE PATTERNS TO KNOW

### Adding a new category (src/categories.js)
```javascript
// Add to the CATEGORIES array — order matters (first match wins)
{
  name: "🏠 Home Services",
  color: "grey",
  patterns: [
    "pdhandy.com",
    "homedepot.com",
    "lowes.com",
    "angi.com",
    "thumbtack.com"
  ]
}
```
Valid Chrome color strings: `"grey"`, `"blue"`, `"red"`, `"yellow"`, `"green"`, `"pink"`, `"purple"`, `"cyan"`, `"orange"`

### Adding a new message handler (src/background.js)
```javascript
// Inside the chrome.runtime.onMessage.addListener callback:
if (request.action === "yourNewAction") {
  yourNewFunction().then(sendResponse).catch(err => sendResponse({ error: err.message }));
  return true; // REQUIRED — keeps channel open for async
}
```

### Calling a new action from popup (popup.js)
```javascript
chrome.runtime.sendMessage({ action: "yourNewAction", data: payload }, (result) => {
  if (chrome.runtime.lastError || result?.error) {
    showResult(`Error: ${result?.error}`, "error");
    return;
  }
  // handle success
});
```

### Saving user settings (chrome.storage.sync)
```javascript
// Save
await chrome.storage.sync.set({ myKey: myValue });

// Read
const data = await chrome.storage.sync.get(["myKey"]);
const value = data.myKey ?? defaultValue;
```

---

## FEATURE REQUESTS — IMPLEMENT ONE OR MORE

Choose which features to implement from the list below. Each is self-contained and can be built independently.

---

### FEATURE 1: Custom User Categories (Saved to Storage)

**Goal:** Let users add their own custom domain patterns and category names via the popup UI, persisted to `chrome.storage.sync`.

**Implementation steps:**
1. Add a "⚙ Manage Categories" button to `popup.html` below the legend
2. Clicking it opens a settings panel (inline, not a new page) with:
   - A list of existing custom categories (editable)
   - An "Add Category" form: name input, color dropdown, patterns textarea (one per line)
   - A "Save" button and a "Delete" button per category
3. In `src/background.js`, modify `matchCategory()` to check user-defined categories FIRST (before built-in ones), loading them from `chrome.storage.sync`
4. Custom categories persist across browser restarts
5. Add a "Reset to defaults" button that clears all custom categories

**Storage schema:**
```javascript
// chrome.storage.sync key: "customCategories"
// Value: array of category objects
[
  {
    name: "🏠 My Business",
    color: "blue",
    patterns: ["mybusiness.com", "mycrm.io"]
  }
]
```

---

### FEATURE 2: Auto-Group on Browser Startup

**Goal:** Automatically run the tab grouping logic every time Chrome starts, without requiring the user to click the button.

**Implementation steps:**
1. Add `"alarms"` to the `permissions` array in `manifest.json`
2. In `src/background.js`, add a listener for `chrome.runtime.onStartup`:
   ```javascript
   chrome.runtime.onStartup.addListener(async () => {
     const settings = await chrome.storage.sync.get(["autoGroupOnStartup"]);
     if (settings.autoGroupOnStartup) {
       await groupAllTabs();
     }
   });
   ```
3. Add a toggle switch in the popup UI: "Auto-group on startup" — saves to `chrome.storage.sync` key `"autoGroupOnStartup"` (boolean, default `false`)
4. Style the toggle to match the existing dark theme

---

### FEATURE 3: Keyboard Shortcut Support

**Goal:** Allow users to trigger Auto-Group with a keyboard shortcut (default: `Ctrl+Shift+G` / `Cmd+Shift+G` on Mac).

**Implementation steps:**
1. Add to `manifest.json`:
   ```json
   "commands": {
     "group-tabs": {
       "suggested_key": {
         "default": "Ctrl+Shift+G",
         "mac": "Command+Shift+G"
       },
       "description": "Auto-group all tabs"
     }
   }
   ```
2. In `src/background.js`, add:
   ```javascript
   chrome.commands.onCommand.addListener(async (command) => {
     if (command === "group-tabs") {
       await groupAllTabs();
     }
   });
   ```
3. Update `README.md` to document the keyboard shortcut

---

### FEATURE 4: Tab Count Badge on Extension Icon

**Goal:** Show the number of open tabs as a badge on the TabRoks toolbar icon, updating in real time.

**Implementation steps:**
1. In `src/background.js`, create an `updateBadge()` function:
   ```javascript
   async function updateBadge() {
     const tabs = await chrome.tabs.query({ currentWindow: true });
     const count = tabs.length;
     await chrome.action.setBadgeText({ text: count > 0 ? String(count) : "" });
     await chrome.action.setBadgeBackgroundColor({ color: "#7c3aed" });
   }
   ```
2. Call `updateBadge()` on these events:
   - `chrome.tabs.onCreated`
   - `chrome.tabs.onRemoved`
   - `chrome.tabs.onUpdated` (when status === "complete")
   - `chrome.runtime.onStartup`
3. Add `"action"` to permissions if not already present (it's implicit in MV3 but explicit is safer)

---

### FEATURE 5: Export / Import Category Config as JSON

**Goal:** Let users export their custom categories as a `.json` file and import them on another machine.

**Implementation steps:**
1. Add two buttons to the settings panel: "📤 Export Config" and "📥 Import Config"
2. Export: reads `chrome.storage.sync` → serializes to JSON → triggers a file download via a Blob URL
3. Import: opens a file picker → reads the JSON file → validates structure → saves to `chrome.storage.sync` → refreshes the UI
4. Validate imported JSON: must be an array of objects each with `name` (string), `color` (valid Chrome color), and `patterns` (array of strings)

---

## COMMIT MESSAGE FORMAT

Use this format for all commits:

```
feat: [short description of what was added]

- [bullet: specific change 1]
- [bullet: specific change 2]
- [bullet: specific change 3]

Closes #[issue number if applicable]
```

Examples:
```
feat: add custom user categories with chrome.storage.sync persistence

- Add settings panel to popup with add/edit/delete category UI
- Modify matchCategory() to check custom categories first
- Add Reset to defaults button
- Persist custom categories across browser restarts
```

---

## PUSH WORKFLOW

After implementing and testing your changes:

```bash
# Stage all changed files
git add -A

# Commit with descriptive message
git commit -m "feat: [your feature description]"

# Push to GitHub
git push origin main

# Verify it's live
echo "✓ Changes live at: https://github.com/timmiller99/tabroks"
```

---

## TESTING CHECKLIST

Before pushing, verify ALL of the following:

- [ ] Extension loads in Chrome (`chrome://extensions` → Load unpacked) with **zero errors**
- [ ] Popup opens without console errors (right-click extension icon → Inspect popup)
- [ ] "Auto-Group All Tabs" button successfully groups tabs
- [ ] "Ungroup All" button successfully removes all groups
- [ ] Stats panel shows correct tab counts on popup open
- [ ] Footer CTA link opens `https://digitalroks.com` in a new tab
- [ ] New feature works as described with no regressions to existing features
- [ ] No hardcoded values — all configurable items use constants or storage
- [ ] Code is commented with JSDoc on all new functions

---

## QUALITY STANDARDS

- **No external dependencies** — pure vanilla JS only
- **No `eval()` or `innerHTML` with user data** — use `textContent` or DOM methods
- **All async Chrome API calls use `await`** — never synchronous
- **Error handling on every `chrome.runtime.sendMessage` call** — always check `chrome.runtime.lastError`
- **CSS follows existing variable system** — use `var(--accent)`, `var(--bg-card)`, etc.
- **Mobile-safe popup** — popup is 340px wide, no horizontal scroll

---

## DELIVERABLE

Produce the complete updated source code for every file you modified. Then provide the exact git commands to commit and push. Do not truncate any file. Do not use placeholder comments.
