# Template Overrides

The template override system lets you edit templates at runtime, persist those edits across page reloads, and toggle between original and modified versions.

## Workflow

1. Open the **Templates** view and click "ed" on a template to open the editor
2. Make your changes and click "save"
3. The original template content is snapshotted and the override is stored in localStorage
4. The edited content is applied to the host app's TemplateProvider immediately
5. Navigate to the **Overrides** view to see all stored overrides

## Override States

Each override can be **active** or **inactive**:

- **Active** (filled dot) -- The override content is applied to the TemplateProvider
- **Inactive** (hollow dot) -- The original content is restored to the TemplateProvider

Click the dot next to any override to toggle its state. Use "all on" and "all off" to batch toggle.

## Persistence

Overrides are stored in localStorage under the key `PictPanel-TemplateOverrides`, separate from the panel configuration. The storage format is:

```javascript
{
    "Template-Hash-Name": {
        "Original": "the original template content before editing",
        "Override": "your edited template content",
        "Active": true
    }
}
```

When the panel is injected after a page reload, all active overrides are automatically re-applied to the host app's TemplateProvider.

## Removing Overrides

Click the X button on any override entry to permanently remove it. This restores the original template content and deletes the override from localStorage.

## Exporting

The Overrides view provides two export formats for active overrides:

### JSON Export

Downloads a file named `PictTemplates-<hostname>.json` containing an array of objects:

```json
[
    {
        "Hash": "Template-Hash-Name",
        "Template": "<div>edited content</div>"
    }
]
```

### JS Export

Downloads a file named `PictTemplates-<hostname>.js` containing an array formatted as JavaScript source with backtick-quoted template literals:

```javascript
[
        {
Hash: "Template-Hash-Name",
Template: /*html*/`
<div>edited content</div>
`
        }
    ]
```

This format is designed to be pasted directly into Pict view configuration files as template definitions.

## Multiple Overrides

You can override any number of templates simultaneously. A typical workflow:

1. Override several templates while developing a new layout
2. Use "all off" to see the original rendering
3. Use "all on" to switch back to your overrides
4. Export as JS when satisfied, to paste into your source code
5. Remove overrides when they have been committed to the codebase
