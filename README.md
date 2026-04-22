# MatuFlow: Material You for the Web

**MatuFlow** is a high-performance theme bridge and browser extension that connects your system-generated color palettes (via Matugen, Pywal, etc.) to your browser globally. It serves your system theme from a zero-dependency Python RAM cache.

---

## 🚀 Installation

### 1. Build & Prepare
This creates the dashboard UI directly inside the extension folder.
```bash
npm install
npm run build
```

### 2. Start the Local RAM Cache
The Python bridge holds your theme in memory and satisfies requests from the extension.
```bash
python3 server.py
```

### 3. Load the Extension
1. Open your browser's extensions page (`chrome://extensions`).
2. Enable **Developer Mode**.
3. Click **Load Unpacked**.
4. Select the `extension/` folder.

**The dashboard is now available by clicking the extension icon in your browser toolbar!**

---

## 🎨 Matugen Integration

### 1. Config Locations
Depending on your OS, your Matugen configuration is located at:
- **Linux/Unix**: `~/.config/matugen/config.toml`
- **Windows**: `%AppData%\InioX\matugen\config\config.toml`
- **MacOS**: `~/Library/Application Support/com.InioX.matugen/config.toml`

### 2. Add the Template & Hook
Add the following block to your `config.toml`. This tells Matugen to generate the CSS and then immediately push it to the MatuFlow RAM cache.

```toml
[templates.matuflow]
input_path = '~/.config/matugen/templates/matuflow.css'
output_path = '~/.cache/matugen/colors.css'
post_hook = 'python3 /path/to/bridge.py --reload --file ~/.cache/matugen/colors.css'
```

### 3. Create the Input Template
Create the file at the `input_path` defined above (`~/.config/matugen/templates/matuflow.css`):
```css
:root {
    --primary: {{colors.primary.default.hex}};
    --on-primary: {{colors.on_primary.default.hex}};
    --primary-container: {{colors.primary_container.default.hex}};
    --on-primary-container: {{colors.on_primary_container.default.hex}};
    --background: {{colors.surface.default.hex}};
    --on-background: {{colors.on_surface.default.hex}};
    --surface: {{colors.surface.default.hex}};
    --on-surface: {{colors.on_surface.default.hex}};
    --outline: {{colors.outline.default.hex}};
    --error: {{colors.error.default.hex}};
}
```

---

## 🔄 The Sync Bridge (`bridge.py`)

The `bridge.py` script is your local utility for pushing data to the RAM cache.

| Command | Description |
| :--- | :--- |
| `python3 bridge.py --reload` | One-shot sync. Best for `post_theme` hooks. |
| `python3 bridge.py --watch` | Background service that watches for file changes. |
| `python3 bridge.py --file /path/to/css` | Specify a custom CSS file location. |
| `python3 bridge.py --url http://my-host:3000` | Target a remote MatuFlow instance. |

---

## ⚙️ Autostart Configuration

To keep your theme synced across reboots, you should run the `bridge.py --watch` command on startup.

### For Portable/Desktop Environments (GNOME, KDE, XFCE)
1. Open **Startup Applications**.
2. Add a new entry:
   - **Name**: MatuFlow Bridge
   - **Command**: `python3 /absolute/path/to/bridge.py --watch --file /path/to/your/colors.css`
   - **Comment**: Syncs system colors to browser.

### Using Systemd (Headless/Advanced)
Create a file at `~/.config/systemd/user/matuflow.service`:
```ini
[Unit]
Description=MatuFlow Theme Bridge Service

[Service]
ExecStart=/usr/bin/python3 /path/to/bridge.py --watch --file %h/.cache/matugen/colors.css
Restart=always

[Install]
WantedBy=default.target
```
Then run:
```bash
systemctl --user daemon-reload
systemctl --user enable --now matuflow.service
```

---

## 🛠️ Configuration Details

### Changing the File Location
The bridge defaults to `~/.cache/wal/colors.css`. If you use Matugen, you likely want to change this:
- **CLI**: `python3 bridge.py --file ~/.cache/matugen/colors.css`
- **Manual**: Edit the `FILE_PATH` variable at the top of `bridge.py`.

### Why Python?
MatuFlow uses a standard-library Python backend to ensure:
1. **Ultra-low RAM usage**: < 30MB total overhead.
2. **Persistence**: Variables stay in RAM even if you close the dashboard tab.
3. **No Dependencies**: No `npm` or `pip` required for the local bridge utility.

---

## 📁 Project Structure
- `/src`: Frontend React (Vite) code for the dashboard.
- `/extension`: Manifest and injection script for browser integration.
- `server.py`: The RAM-cache API and static file server.
- `bridge.py`: The CLI/Watchdog utility for your local machine.
