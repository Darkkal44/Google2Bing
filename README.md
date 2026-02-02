# Google to Bing Rewards Grinder 

![Version](https://img.shields.io/badge/version-1.0-blue) ![Tampermonkey](https://img.shields.io/badge/extension-Tampermonkey-green)

**Automatically earn Microsoft Rewards points while using Google.**

## Features

*   **Works in the background:** Bing opens in a background tab, so your workflow is never interrupted.
*   **Human like:**
    *   Randomized delays between searches.
    *   Scrolls down and up on the Bing results page randomly.
    *   **CTR Generator:** Clicks a random search result to visit a site.
    *   Scrolls on the visited site before closing.
*   **Auto-Close:** The background tab cleans itself up automatically after the task is done.

## How to install?

### Install Tampermonkey
You need a userscript manager to run this. Install **Tampermonkey** for your browser:

*   [Chrome Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
*   [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
*   [Microsoft Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

!! Make sure to have developer mode turned on in your extensions settings

### Install the Script
Click the link below to install the script from GreasyFork:

👉 **[Install from GreasyFork](https://greasyfork.org/en/scripts/564880-google-to-bing-rewards-grinder)**

Click the green **"Install this script"** button.

## Usage & Setup

1.  **Log in:** Make sure you are logged into your Microsoft Account on [Bing.com](https://www.bing.com).
2.  **Search:** Go to [Google.com](https://www.google.com) and type a search query.
3.  **Popup Permission (Crucial):**
    *   The first time you search, your browser will likely block the background tab.
    *   Look for a **"Popup Blocked" icon** in your address bar (usually on the right side).
    *   Click it and select **"Always allow pop-ups and redirects from https://www.google.com"**.
4.  **Done!** Future searches will silently open Bing in the background, collect points, and close themselves.

## Troubleshooting

*   **"It's not opening tabs":** Check your browser's Popup Blocker settings. The script relies on `window.open` (via `GM_openInTab`), which browsers restrict by default unless permitted.
*   **"Points aren't counting":** Ensure you aren't using a VPN that Microsoft has flagged, and ensure you are logged in on Bing.
*   **Background Throttling:** If you minimize the browser entirely, Chrome/Edge may pause the script to save battery. It works best if the browser window is open (even if you are looking at a different tab).

## ⚠️ Disclaimer

This script is for educational purposes. While it attempts to simulate human behavior (delays, scrolling, clicking links) to appear organic, using automation tools with Microsoft Rewards technically violates their Terms of Service. **Use this script at your own risk.** I am not responsible for any account bans or point revocations.

---

*Enjoying the script? Feel free to give it a star on github~*
