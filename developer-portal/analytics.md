# Enable analytics

Whether you utilize Google Analytics, Google Tag Manager, Heap.io or something else, it can be enabled with a few lines of configuration in the `siteConfig.yaml`.

:::attention
Analytics is disabled in development server mode. So enabling will have no impact until built and deployed.
:::

## Google Analytics

Let's say our tracking id is `UA-132456789-1`.

```yaml
analytics:
  ga:
    # you can use any options here from https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/
    # note that GA doesn't work in DEV
    trackingId: UA-132456789-1
```

## Other JavaScript add-ons

If we needed to enable some other JavaScript, we can do that too.
Here is an example of enabling the Intercom chat widget.
You would replace the part that says `your-code` with your intercom id.

```yaml
scripts:
  - ./static/intercom.js
```

```js
window.intercomSettings = {
  app_id: 'hvbieiwv',
};

(function () {
  var w = window;
  var ic = w.Intercom;
  if (typeof ic === 'function') {
    ic('reattach_activator');
    ic('update', w.intercomSettings);
  } else {
    var d = document;
    var i = function () {
      i.c(arguments);
    };
    i.q = [];
    i.c = function (args) {
      i.q.push(args);
    };
    w.Intercom = i;
    var l = function () {
      var s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://widget.intercom.io/widget/your-code';
      var x = d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    };
    if (d.readyState === 'complete') {
      l();
    } else {
      if (w.attachEvent) {
        w.attachEvent('onload', l);
      } else {
        w.addEventListener('load', l, false);
      }
    }
  }
})();
```
