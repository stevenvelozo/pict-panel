# Providers

Pict Panel registers four providers with the host Pict instance. Each extends `pict-provider` and follows the standard service provider pattern.

## PP-Router

A simple view router that tracks which navigation view is currently active.

**Methods:**

- `navigateTo(pViewHash)` -- Render the specified view and persist the selection

The router checks whether the requested view is already active (to avoid re-rendering) and saves the active view hash to `PP-ConfigStorage` after each navigation.

## PP-CSS-Hotloader

Injects the panel's CSS into the host page via a `<style>` element.

All CSS is defined as tagged template literals in JS modules under `source/css/`. At require time, these are concatenated into a single string stored in `options.CustomPanelCSS`. When `hotloadCSS()` is called, that string is injected into `document.head` as a style element with id `Pict-Panel-Container-CSS`.

The CSS is injected once and is idempotent -- calling `hotloadCSS()` again is a no-op.

**CSS load order:**

1. Palette (CSS custom properties)
2. Panel (positioning, layout, icon grid)
3. Logo
4. AppData Browser
5. Template Browser
6. Service Browser (shared between View and Provider browsers)
7. Template Overrides

## PP-ConfigStorage

Persists panel state to localStorage under the key `PictPanel`.

**Methods:**

- `save(pUIState)` -- Serialize behaviors, position, size, and active view to localStorage
- `load()` -- Deserialize and return the saved config, or `false` if none exists
- `clear()` -- Remove the saved config
- `applyConfig(pMainView)` -- Restore all saved state to the DOM and uiState after render

The `applyConfig` method handles:

- Behavior flags (night mode class, tab mode class, resize lock, pin positions)
- Panel element inline styles (top, left, right, width, height)
- Show/hide states for navigation and content areas
- Icon toggle displays (checked/unchecked classes)
- Active navigation view restoration

## PP-TemplateOverrideStorage

Persists template overrides to localStorage under the key `PictPanel-TemplateOverrides`.

Each override entry stores:

```javascript
{
    "TemplateHash": {
        "Original": "original template content",
        "Override": "edited template content",
        "Active": true
    }
}
```

**Methods:**

- `saveOverride(pHash, pOriginal, pOverride)` -- Store or update an override entry
- `removeOverride(pHash)` -- Delete an override and restore the original template
- `toggleOverride(pHash, pActive)` -- Activate or deactivate a single override
- `toggleAll(pActive)` -- Activate or deactivate all overrides at once
- `loadOverrides()` -- Return the full overrides map from localStorage
- `applyOverrides()` -- Apply all active overrides to the host app's TemplateProvider

See [Template Overrides](overrides.md) for the full workflow.
