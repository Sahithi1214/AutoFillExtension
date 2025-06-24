# AutoFill Pro Chrome Extension

AutoFill Pro is a modern Chrome extension that automatically fills out job application forms and other repetitive web forms with your personal and professional information. Enter your details once, and let the extension do the typing for you!

## Features
- **One-time setup:** Enter your info (name, contact, experience, education, etc.) in the extension settings.
- **Automatic & manual autofill:** Fills forms on most job boards and application sites. Trigger autofill with the popup button or automatically as forms load.
- **Advanced field detection:** Uses fuzzy matching, label/placeholder analysis, and traverses Shadow DOM and iframes for maximum compatibility.
- **Modern, responsive UI:** Clean settings page for easy data entry and management.

## Where It Works
- Most job application sites (Greenhouse, Lever, Workday, etc.)
- Any regular web form on HTTP/HTTPS pages
- Forms inside same-origin iframes
- Forms using Shadow DOM (modern web apps)

## Where It Does **Not** Work
- Chrome Web Store, `chrome://` pages, or browser-internal pages (Chrome restriction)
- Forms inside cross-origin iframes (browser security)
- Some highly custom or protected forms (rare)

## How It Works
- The extension injects a content script into every page (and iframe) you visit.
- It scans for all form fields, including those in Shadow DOMs.
- It matches each field to your saved info using fuzzy/partial matching on labels, placeholders, and nearby text.
- It fills the best-matching data and highlights filled fields.
- For file uploads (like resume), it prompts you to upload manually (auto-upload is not allowed by Chrome).

## Tech Stack
- **Manifest V3** Chrome Extension
- **Vanilla JavaScript** (no frameworks)
- **Chrome Storage API** for secure, persistent data
- **MutationObserver** for dynamic forms
- **Shadow DOM traversal** for modern web apps

## Installation
1. Download or clone this repository.
2. Go to `chrome://extensions/` in Chrome.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the extension folder.
5. The extension will appear in your Chrome toolbar.

## Usage
1. Click the extension icon and go to **Settings**.
2. Enter your details and click **Save**.
3. On any supported form, click the extension and hit **Autofill Now**.
4. Fields will be filled automatically. For resume uploads, follow the prompt to upload manually.

## Limitations
- Cannot autofill on Chrome Web Store, browser settings, or other restricted pages.
- Cannot autofill forms inside cross-origin iframes (browser security).
- Some very custom or protected forms may require manual entry.

## Contributing
Pull requests and suggestions are welcome!

## License
Sahithi Duppati