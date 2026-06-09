/**
 * TabRoks — Background Service Worker
 * by DigitalRoks (digitalroks.com)
 */

importScripts("categories.js");

/**
 * Match a tab to a category based on its URL and title.
 * Returns the first matching category or null.
 */
function matchCategory(tab) {
  const url = (tab.url || "").toLowerCase();
  const title = (tab.title || "").toLowerCase();

  for (const category of CATEGORIES) {
    for (const pattern of category.patterns) {
      if (url.includes(pattern) || title.includes(pattern)) {
        return category;
      }
    }
  }
  return null;
}

/**
 * Core grouping function — groups all tabs in the current window.
 * Returns a summary object with counts per group.
 */
async function groupAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const summary = { grouped: 0, ungrouped: 0, groups: {} };

  // Build a map: categoryName -> { category, tabIds[] }
  const categoryMap = new Map();
  const ungroupedTabIds = [];

  for (const tab of tabs) {
    // Skip chrome:// and extension pages — they can't be grouped
    if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://") || tab.url.startsWith("about:")) {
      ungroupedTabIds.push(tab.id);
      summary.ungrouped++;
      continue;
    }

    const category = matchCategory(tab);
    if (category) {
      if (!categoryMap.has(category.name)) {
        categoryMap.set(category.name, { category, tabIds: [] });
      }
      categoryMap.get(category.name).tabIds.push(tab.id);
      summary.grouped++;
    } else {
      ungroupedTabIds.push(tab.id);
      summary.ungrouped++;
    }
  }

  // Create/update tab groups for each category
  for (const [name, { category, tabIds }] of categoryMap.entries()) {
    if (tabIds.length === 0) continue;

    // Check if a group with this name already exists in the window
    const existingGroups = await chrome.tabGroups.query({ title: name });
    let groupId;

    if (existingGroups.length > 0) {
      // Add tabs to existing group
      groupId = existingGroups[0].id;
      await chrome.tabs.group({ groupId, tabIds });
    } else {
      // Create a new group
      groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, {
        title: name,
        color: category.color,
        collapsed: false
      });
    }

    summary.groups[name] = tabIds.length;
  }

  // Ungroup any tabs that were previously grouped but no longer match
  // (only ungroup if they are in a TabRoks-managed group)
  return summary;
}

/**
 * Ungroup all tabs — reset to flat tab bar.
 */
async function ungroupAllTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const groupedTabs = tabs.filter(t => t.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE);
  if (groupedTabs.length > 0) {
    await chrome.tabs.ungroup(groupedTabs.map(t => t.id));
  }
  return { ungrouped: groupedTabs.length };
}

/**
 * Get stats about current tabs without modifying them.
 */
async function getTabStats() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const stats = { total: tabs.length, byCategory: {}, uncategorized: 0 };

  for (const tab of tabs) {
    if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://") || tab.url.startsWith("about:")) {
      stats.uncategorized++;
      continue;
    }
    const category = matchCategory(tab);
    if (category) {
      stats.byCategory[category.name] = (stats.byCategory[category.name] || 0) + 1;
    } else {
      stats.uncategorized++;
    }
  }

  return stats;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "groupTabs") {
    groupAllTabs().then(sendResponse).catch(err => sendResponse({ error: err.message }));
    return true; // Keep message channel open for async response
  }

  if (request.action === "ungroupTabs") {
    ungroupAllTabs().then(sendResponse).catch(err => sendResponse({ error: err.message }));
    return true;
  }

  if (request.action === "getStats") {
    getTabStats().then(sendResponse).catch(err => sendResponse({ error: err.message }));
    return true;
  }
});
