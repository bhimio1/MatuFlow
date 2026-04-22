/**
 * MatuFlow Background Service Worker
 * Handles fetching theme from local bridge to avoid CORS/LocalNetwork CORS popups in content scripts.
 */

const BRIDGE_URL = 'http://localhost:3000/api/theme';
let pollInterval = null;

async function fetchAndStoreTheme() {
  try {
    const response = await fetch(BRIDGE_URL);
    const data = await response.json();
    
    if (data.css) {
      // Store in local storage for inject.js to pick up
      chrome.storage.local.set({ 
        'matuflow_theme': data.css,
        'matuflow_updated_at': data.updatedAt 
      });
    }
  } catch (e) {
    // Silent fail if bridge is down
  }
}

// Initial fetch
fetchAndStoreTheme();

// Poll every 5 seconds for system-wide updates
// We use a simple interval here since we're in a persistent-ish context (MV3 SW stays alive while active)
setInterval(fetchAndStoreTheme, 5000);

// Also fetch when extension is clicked or tab changes to ensure fresh data
chrome.tabs.onActivated.addListener(fetchAndStoreTheme);
chrome.runtime.onInstalled.addListener(fetchAndStoreTheme);
