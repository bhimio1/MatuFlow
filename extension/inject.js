(function() {
  // In the extension, the dashboard might run as a full page or a popup.
  // We want to ensure it always points to the local Python RAM cache.
  const BRIDGE_URL = 'http://localhost:3000/api/theme';

  async function applyGlobalTheme() {
    try {
      const response = await fetch(BRIDGE_URL);
      const data = await response.json();
      
      if (data.css) {
        // Create or update a style tag at the top of the head
        let styleTag = document.getElementById('matuflow-bridge-vars');
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'matuflow-bridge-vars';
          document.documentElement.appendChild(styleTag);
        }

        // We only care about the :root block from the CSS
        const rootMatch = data.css.match(/:root\s*{[\s\S]*?}/);
        if (rootMatch) {
          styleTag.textContent = rootMatch[0];
          console.log('[MatuFlow] Global variables injected');
        }
      }
    } catch (e) {
      // Fail silently on most pages to avoid console clutter
    }
  }

  // Apply immediately
  applyGlobalTheme();

  // Re-apply when the tab enters focus (to sync changes)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      applyGlobalTheme();
    }
  });
})();
