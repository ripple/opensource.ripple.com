/**
 * Optimized Google Tag Manager Implementation
 * Enhanced for Performance (Resource Hints) and Security
 */

(function(w, d, s, l, i) {
    // 1. Performance Optimization: Preconnect to Google domains
    const link = d.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://www.googletagmanager.com';
    d.head.appendChild(link);

    // 2. DataLayer Initialization with safety check
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });

    // 3. Script Loading Logic
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
    
    j.async = true; // Non-blocking load
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    
    // 4. Security: Adding Integrity or Nonce if CSP is used
    // j.setAttribute('nonce', 'YOUR_CSP_NONCE_HERE'); 

    if (f && f.parentNode) {
        f.parentNode.insertBefore(j, f);
    }
})(window, document, 'script', 'dataLayer', 'GTM-W3ND7TWZ');
