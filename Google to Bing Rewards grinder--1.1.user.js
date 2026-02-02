// ==UserScript==
// @name         Google to Bing Rewards Grinder (Hybrid)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Mirror Google searches to Bing, type humanly, scroll results, visit link, wait 2-5s, and close.
// @author       Darkkal44
// @match        *://www.google.com/search*
// @match        *://www.google.co.*/search*
// @match        *://www.bing.com/*
// @match        *://*/*
// @license      MIT
// @grant        GM_openInTab
// @grant        window.close
// @run-at       document-end
// ==/UserScript==
 
(function() {
    'use strict';
 
    // CONFIGURATION
    const BOT_ID = "TM_BACKGROUND_WORKER"; 
    
    // Typing Speed Settings
    const TYPE_DELAY_MIN = 10;  
    const TYPE_DELAY_MAX = 40; 
 
    // Helpers
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const randomTime = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
 
    // Helper: Fast Human Typing
    async function typeFast(element, text) {
        element.focus();
        element.value = ""; 
        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            element.value += char;
            element.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
            element.dispatchEvent(new InputEvent('input', { bubbles: true }));
            element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
            await sleep(randomTime(TYPE_DELAY_MIN, TYPE_DELAY_MAX));
        }
    }
 
    // Helper: Force Close
    function forceClose() {
        // Keeps the browser from blocking the close command
        window.open('', '_self', ''); 
        window.close();
    }
 
    const currentURL = window.location.href;
 
    // ==========================================
    // 1. GOOGLE (Trigger)
    // ==========================================
    if (currentURL.includes("google.") && currentURL.includes("/search")) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const searchId = "bing_bg_" + query;
 
        if (query && !sessionStorage.getItem(searchId)) {
            console.log(`[Grinder] Triggering Bing search for: ${query}`);
            sessionStorage.setItem(searchId, "true");
            
            // Open Bing Homepage to start the typing process
            const bingURL = `https://www.bing.com/?tm_grind_q=${encodeURIComponent(query)}`;
            GM_openInTab(bingURL, { active: false, insert: false });
        }
    }
 
    // ==========================================
    // 2. BING (The Worker)
    // ==========================================
    else if (currentURL.includes("bing.com")) {
        
        // --- PHASE A: TYPING (Homepage) ---
        if (window.location.search.includes('tm_grind_q')) {
            window.name = BOT_ID; // Set ID here
            const urlParams = new URLSearchParams(window.location.search);
            const queryToType = decodeURIComponent(urlParams.get('tm_grind_q'));
 
            (async () => {
                await sleep(1500); 
                const searchBox = document.getElementById('sb_form_q');
                const searchForm = document.getElementById('sb_form');
 
                if (searchBox) {
                    await typeFast(searchBox, queryToType);
                    await sleep(500); 
                    if(searchForm) searchForm.submit();
                    else document.getElementById('sb_form_go').click();
                } else {
                    forceClose();
                }
            })();
        }
 
        // --- PHASE B: RESULTS (Scrolling & Clicking) ---
        // Using your requested logic here
        else if (window.name === BOT_ID && currentURL.includes("/search")) {
            (async () => {
                // Wait for load
                await sleep(randomTime(2000, 4000));
 
                // Scroll down (Your requested snippet)
                window.scrollTo({ top: 500, behavior: 'smooth' });
                await sleep(1000);
                window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' });
                await sleep(randomTime(2000, 4000));
 
                // Find a valid organic search result
                const results = document.querySelectorAll('#b_results .b_algo h2 a');
 
                if (results.length > 0) {
                    const randomResult = results[Math.floor(Math.random() * results.length)];
                    console.log("[Grinder] Visiting: " + randomResult.href);
                    
                    // Navigate the CURRENT background tab to that URL
                    window.location.href = randomResult.href;
                } else {
                    forceClose();
                }
            })();
        }
    }
 
    // ==========================================
    // 3. ANY EXTERNAL SITE (The Visitor)
    // ==========================================
    else {
        // We check if this tab is our specific "BOT_ID" tab.
        if (window.name === BOT_ID) {
            (async () => {
                console.log("[Grinder] External site loaded. Waiting...");
                
                // Wait 2-5 seconds as requested
                await sleep(randomTime(2000, 5000));
 
                console.log("[Grinder] Closing tab.");
                forceClose();
            })();
        }
    }
})();
