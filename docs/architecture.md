# Architecture

Pict Panel is built entirely with the same Pict MVC primitives it is designed to inspect. It registers its own views, providers, and templates into the host application's Pict instance, then renders itself into a floating panel overlay.

## Injection Flow

1. The `PictPanel` class (a Pict Provider) is registered with the host Pict instance
2. Calling `show()` registers all sub-providers and sub-views
3. Saved configuration is loaded from localStorage and applied to `uiState`
4. The root container view renders, which triggers the main view and navigation
5. Saved panel position, behavior toggles, and active view are restored
6. Persisted template overrides are applied to the host app's template provider

## Module Map

### Providers

| Provider | File | Purpose |
|----------|------|---------|
| `PP-Router` | `PP-Router.js` | Simple view navigation with active view tracking |
| `PP-CSS-Hotloader` | `PP-CSS-Hotloader.js` | Injects concatenated CSS into a `<style>` tag |
| `PP-ConfigStorage` | `PP-ConfigStorage.js` | Persists panel state to localStorage (`PictPanel` key) |
| `PP-TemplateOverrideStorage` | `PP-TemplateOverrideStorage.js` | Persists template overrides to localStorage (`PictPanel-TemplateOverrides` key) |

### Views

| View | Hash | File | Purpose |
|------|------|------|---------|
| Container | `PP-Panel` | `PP-Container.js` | Root container element and CSS hotload trigger |
| Main | `PP-Main` | `PP-Main.js` | Panel chrome: header, drag, icon grid, behavior toggles |
| Navigation | `PP-Nav` | `PP-Navigation.js` | Navigation bar with view links |
| AppData Browser | `PP-ADB` | `PP-View-AppDataBrowser.js` | Tree browser for `_Pict.AppData` |
| Template Browser | `PP-TB` | `PP-View-TemplateBrowser.js` | Searchable template list with editor |
| View Browser | `PP-VB` | `PP-View-ViewBrowser.js` | List/detail browser for registered views |
| Provider Browser | `PP-PB` | `PP-View-ProviderBrowser.js` | List/detail browser for registered providers |
| Template Overrides | `PP-TO` | `PP-View-TemplateOverrides.js` | Override management with toggle and export |

### CSS Modules

All CSS is defined as tagged template literals in JS modules and concatenated at load time by `PP-CSS-Hotloader`:

| Module | Scope |
|--------|-------|
| `PP-Palette-CSS.js` | CSS custom properties (color palette, light and dark themes) |
| `PP-Panel-CSS.js` | Panel positioning, tab mode, drag handle, icon grid, navigation |
| `PP-Logo-CSS.js` | SVG logo styling |
| `PP-AppDataBrowser-CSS.js` | AppData tree and shared header/editor styles |
| `PP-TemplateBrowser-CSS.js` | Template list and editor styles |
| `PP-ServiceBrowser-CSS.js` | Shared styles for View Browser and Provider Browser |
| `PP-TemplateOverrides-CSS.js` | Override list styles |

## State Management

Panel state lives in the `PP-Main` view's `uiState` object:

```javascript
{
    Wired: false,
    Behaviors: {
        tab_mode: false,
        maximize_mode: false,
        lock_position: false,
        pin_top: false,
        pin_right: false,
        night_mode: false,
        resize_handle: true,
        show_ui: true,
        show_navigation: true,
        visible: true
    },
    ManualTop: 0,
    ManualLeft: 0,
    ManualWidth: 300,
    SavedPosition: false,
    SavedTabPosition: false
}
```

`PP-ConfigStorage` serializes this to localStorage after every toggle or drag. On panel init, the saved config is loaded and applied before rendering, so the panel appears exactly where the user left it.

## localStorage Keys

| Key | Contents |
|-----|----------|
| `PictPanel` | Panel behaviors, position, size, active view |
| `PictPanel-TemplateOverrides` | Map of `{ Hash: { Original, Override, Active } }` entries |
