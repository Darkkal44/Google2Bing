// ==UserScript==
// @name         Google to Bing Rewards grinder/
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mirror Google searches to Bing, scroll, visit a result, and close—all in a background tab.
// @author       Darkkal44
// @match        *://www.google.com/search*
// @match        *://www.google.co.*/search*
// @match        *://www.bing.com/search*
// @match        *://*/*
// @license         MIT
// @grant        GM_openInTab
// @grant        window.close
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564880/Google%20to%20Bing%20Rewards%20grinder.user.js
// @updateURL https://update.greasyfork.org/scripts/564880/Google%20to%20Bing%20Rewards%20grinder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIGURATION
    const BOT_ID = "TM_BACKGROUND_WORKER"; // Internal ID to track the tab
    const MIN_WAIT = 2000;
    const MAX_WAIT = 5000;

    // Helper: Random sleep
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const randomTime = () => Math.floor(Math.random() * (MAX_WAIT - MIN_WAIT + 1) + MIN_WAIT);

    const currentURL = window.location.href;

    // ==========================================
    // 1. GOOGLE (The Trigger)
    // ==========================================
    if (currentURL.includes("google.") && currentURL.includes("/search")) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const searchId = "bing_bg_" + query;

        // If query exists and we haven't run this specific search yet
        if (query && !sessionStorage.getItem(searchId)) {
            console.log("Triggering background Bing search...");
            sessionStorage.setItem(searchId, "true");

            // Add a special flag (&tm_auto=1) so Bing knows to automate
            const bingURL = `https://www.bing.com/search?q=${encodeURIComponent(query)}&tm_auto=1`;

            // OPEN IN BACKGROUND: active: false ensures it doesn't steal focus
            GM_openInTab(bingURL, { active: false, insert: false });
        }
    }

    // ==========================================
    // 2. BING (The Worker)
    // ==========================================
    else if (currentURL.includes("bing.com/search")) {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get('tm_auto') === '1') {
            // Set the window name so we recognize this tab when it navigates to other sites
            window.name = BOT_ID;

            (async () => {
                // Wait for load
                await sleep(randomTime());

                // Scroll down
                window.scrollTo({ top: 500, behavior: 'smooth' });
                await sleep(1000);
                window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' });
                await sleep(randomTime());

                // Find a valid organic search result (ignoring ads/images)
                // Selects the main link in standard results
                const results = document.querySelectorAll('#b_results .b_algo h2 a');

                if (results.length > 0) {
                    const randomResult = results[Math.floor(Math.random() * results.length)];

                    // Navigate the CURRENT background tab to that URL
                    // We do not use window.open because we want to keep the same tab ID
                    window.location.href = randomResult.href;
                } else {
                    // Fallback if no results found: Close tab
                    window.close();
                }
            })();
        }
    }

    // ==========================================
    // 3. ANY EXTERNAL SITE (The Visitor)
    // ==========================================
    else {
        // We check if this tab is our specific "BOT_ID" tab.
        // If window.name matches, it means this tab originated from our Bing script.
        if (window.name === BOT_ID) {
            (async () => {
                // Simulate reading
                await sleep(2000);
                window.scrollTo({ top: 300, behavior: 'smooth' });
                await sleep(2000);
                window.scrollTo({ top: 600, behavior: 'smooth' });

                // Final wait before cleanup
                await sleep(randomTime());

                // Close the tab
                window.close();
            })();
        }
    }

})();