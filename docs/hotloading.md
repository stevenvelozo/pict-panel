# Hotloading

Pict Panel is designed to be injected into any running Pict application without modifying the app's source code. Open your browser console and paste:

```javascript
fetch('https://cdn.jsdelivr.net/npm/pict-panel/dist/pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
```

This fetches the panel bundle, evaluates it in the page context, and injects it into the running Pict instance.

## How It Works

The one-liner does three things in sequence:

1. **`fetch('https://cdn.jsdelivr.net/npm/pict-panel/dist/pict-panel.js')`** -- Downloads the browserified panel bundle as text from the jsdelivr CDN. This can also be a relative path (if your app serves the file) or any other URL hosting the bundle.

2. **`.then(eval)`** -- Evaluates the script in the current page context. This defines the `PictPanel` class as a global and attaches the static `PictPanel.inject()` method. No side effects occur at this stage -- the panel is defined but not yet active.

3. **`.then(()=>PictPanel.inject())`** -- Registers `PictPanel` as a provider on the global `_Pict` instance and calls `show()`. This triggers the full initialization sequence: registering sub-providers and sub-views, injecting CSS, rendering the panel DOM, loading saved configuration from localStorage, and applying any persisted template overrides.

`PictPanel.inject()` auto-detects the global `_Pict` instance. If your app uses a different variable name, pass it explicitly:

```javascript
PictPanel.inject(myPictInstance)
```

## Fetching from a Remote URL

If the panel bundle is not served by the current app, fetch it from wherever it is hosted:

```javascript
fetch('http://localhost:9998/pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
```

This is useful during development when you have one server running the app and another serving the panel. The URL can point to any HTTP server -- a local dev server, a staging environment, or a CDN.

## Serving the Panel from Your App

Instead of fetching the panel from an external source, you can bundle it with your application so it is always available at a known path. There are two approaches.

### Static File Serving

If your app uses Orator or another static file server, copy the built panel bundle into your static assets directory:

```bash
cp node_modules/pict-panel/dist/pict-panel.js ./dist/pict-panel.js
```

Or add a copy step to your build using Quackage. In your app's `package.json`, add a `copyFilesSettings` entry:

```json
{
    "copyFilesSettings": {
        "copyFiles": [
            {
                "from": "node_modules/pict-panel/dist/pict-panel.js",
                "to": "dist/pict-panel.js"
            }
        ]
    }
}
```

Then run `npx quack copy` as part of your build. The panel will be available at `./pict-panel.js` relative to your app.

### Bundling into Your App

You can also require and register the panel directly in your application source:

```javascript
const PictPanel = require('pict-panel');

// Register and show the panel
pict.addProvider('PictPanel', {}, PictPanel);
pict.providers.PictPanel.show();
```

This bundles the panel into your app's browserified output. The panel will be available immediately without a separate fetch step. This approach is convenient for development builds but increases your bundle size, so you may want to exclude it from production builds.

### Development Server

The pict-panel repository includes a simple example server (`ServeExamples.js`) that serves the panel and example applications on port 9998. You can run a similar server alongside your app during development:

```bash
cd node_modules/pict-panel
node ServeExamples.js
```

Then inject from that server into any page:

```javascript
fetch('http://localhost:9998/pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
```

## What Happens on Inject

When `PictPanel.inject()` is called, the following sequence occurs:

1. The `PictPanel` provider is registered with the Pict instance
2. `show()` is called, which registers all sub-providers and sub-views
3. Saved panel configuration is loaded from localStorage
4. The CSS hotloader injects a `<style>` tag with all panel styles
5. The root container view renders, which triggers the main panel view and navigation
6. Saved panel position, behavior toggles, and active view are restored from localStorage
7. Any persisted template overrides are applied to the host app's TemplateProvider

The panel is fully self-contained. It does not modify the host app's DOM outside of its own `#Pict-Panel-Container` element and a single `<style>` tag in `<head>`. Removing the panel requires a page reload.

## Re-injection After Reload

After a page reload, the panel is gone but its state persists in localStorage. Paste the one-liner again and the panel reappears exactly where you left it -- same position, same size, same behavior toggles, same active view, and the same template overrides re-applied.
