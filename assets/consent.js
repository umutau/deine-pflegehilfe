(function () {
  "use strict";

  // Google Tag Manager container. Only loaded after the visitor clicks
  // "Alle akzeptieren" in the cookie banner.
  var GTM_ID = "GTM-WM86QQS5";

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
    // Consent Mode v2: tell Google tags the visitor has agreed (required for
    // Google Ads measurement in the EU). GTM only loads after consent anyway.
    function gtag() { window.dataLayer.push(arguments); }
    gtag("consent", "default", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted"
    });
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

  // Conversion events: every link with data-gtm-event="phone_click" /
  // "email_click" pushes that event to GTM (only when GTM is loaded).
  document.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-gtm-event]") : null;
    if (el && window.__gtmLoaded) {
      window.dataLayer.push({
        event: el.getAttribute("data-gtm-event"),
        link_url: el.getAttribute("href")
      });
    }
  });

  if (settingsLink) {
    settingsLink.addEventListener("click", function (e) {
      e.preventDefault();
      showBanner();
    });
  }
})();
