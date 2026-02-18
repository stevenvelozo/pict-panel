# Pict Panel

> A developer panel for inspecting and debugging Pict applications at runtime

Pict Panel is a hotloadable debugging tool that injects into any running Pict application. It provides real-time inspection of AppData, templates, views, and providers -- along with a template editor that persists overrides across page reloads.

Open your browser console and paste:

```javascript
fetch('./pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
```

The panel appears as a draggable, resizable window in the top-right corner. Use the navigation bar to switch between views. See [Hotloading](hotloading.md) for details on how this works and how to serve the panel from your own app.

## Features

- **Hotloadable** -- Inject via `fetch` + `eval` from any URL, no build step required
- **AppData Browser** -- Navigate the live application data tree with expandable nodes
- **Template Browser** -- Search, view, and edit all registered templates
- **View Browser** -- List views with render and renderAsync action buttons
- **Provider Browser** -- List providers with solve action buttons
- **Template Overrides** -- Persist template edits across reloads, toggle on/off, export as JSON or JS
- **Panel Controls** -- Drag, resize, pin, maximize, collapse to tab, dark mode, and more
- **Persistent State** -- All panel settings survive page reloads via localStorage

## Panel Controls

The header contains a 3x3 icon grid with nine behavior toggles:

| Toggle | Effect |
|--------|--------|
| Tab Mode | Collapse the panel to a small logo tab at the top of the screen |
| Maximize | Fill the viewport with 15px padding on all sides |
| Lock Position | Prevent the panel from being dragged |
| Pin Top | Lock vertical position to the top edge |
| Pin Right | Lock horizontal position to the right edge |
| Night Mode | Switch to a dark color scheme |
| Resize Handle | Enable or disable the browser resize handle |
| Show UI | Toggle visibility of the navigation and content areas |
| Show Navigation | Toggle visibility of just the navigation bar |

All toggle states persist across page reloads.

## Learn More

- [Hotloading](hotloading.md) -- How injection works and how to serve the panel from your app
- [Architecture](architecture.md) -- How the panel is structured internally
- [Views](views.md) -- Detailed documentation for each navigation view
- [Providers](providers.md) -- The four providers that power the panel
- [Template Overrides](overrides.md) -- The override persistence and export system
