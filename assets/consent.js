(function () {
  "use strict";

  // TODO: replace with the real GTM container ID once Google Analytics /
  // Tag Manager / Ads is actually set up. Until this is a real GTM-XXXXXXX
  // id, nothing is loaded, consent or not — so it's safe to leave as-is.
  var GTM_ID = "GTM-XXXXXXX";

  var STORAGE_KEY = "dp_cookie_consent";
  var banner = document.getElementById("cookie-banner");
  var settingsLink = document.getElementById("cookie-settings-link");

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(status) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ status: status, ts: Date.now() })
      );
    } catch (e) {
      /* localStorage unavailable (private mode etc.) — consent choice just won't persist */
    }
  }

  function isConfigured() {
    return GTM_ID && GTM_ID.indexOf("XXXX") === -1;
  }

  function loadGTM() {
    if (!isConfigured() || window.__gtmLoaded) return;
    window.__gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var first = document.getElementsByTagName("script")[0];
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    first.parentNode.insertBefore(tag, first);
  }

  function showBanner() {
    if (banner) banner.hidden = false;
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function applyConsent(status) {
    writeConsent(status);
    hideBanner();
    if (status === "accepted") loadGTM();
  }

  // On load: respect an existing choice, otherwise ask (only matters once
  // GTM_ID above is a real id — until then this just quietly does nothing
  // beyond remembering the visitor's preference for later).
  var existing = readConsent();
  if (existing && existing.status === "accepted") {
    loadGTM();
  } else if (!existing) {
    showBanner();
  }

  if (banner) {
    banner.addEventListener("click", function (e) {
      var action = e.target.getAttribute("data-consent");
      if (action === "accept") applyConsent("accepted");
      if (action === "reject") applyConsent("rejected");
    });
  }

  if (settingsLink) {
    settingsLink.addEventListener("click", function (e) {
      e.preventDefault();
      showBanner();
    });
  }
})();
