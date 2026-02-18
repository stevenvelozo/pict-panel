# Views

Pict Panel includes five navigation views, each accessible from the navigation bar. The active view is persisted across page reloads.

## AppData Browser (PP-ADB)

Provides a tree browser for the host application's `_Pict.AppData` object.

- **Tree navigation** -- Expand and collapse nested objects and arrays
- **Inline editing** -- Click a value to edit it in place; changes are written directly to AppData
- **Type display** -- Shows data types (string, number, boolean, object, array) alongside values
- **Refresh** -- Re-render the tree from the current AppData state

The tree renders recursively using Pict templates, with each node generating its own expand/collapse and edit controls.

## Template Browser (PP-TB)

Lists all templates registered with the host application's `TemplateProvider`.

- **Filter** -- Type in the filter input to narrow the list by hash, source, or content
- **Source display** -- Shows where each template was registered from
- **Preview** -- One-line content preview (HTML-escaped, truncated to 120 characters)
- **Editor** -- Click "ed" on any template to open an inline textarea editor
- **Save** -- Saves the edited content back to the TemplateProvider and creates an override entry

When you save a template, the original content is automatically snapshotted by `PP-TemplateOverrideStorage` so it can be restored later.

## View Browser (PP-VB)

Lists all views registered with the host Pict instance.

- **List view** -- Shows each view's hash and class name
- **Action buttons** -- Hover to reveal `render` and `renderAsync` buttons that execute on the view
- **Detail view** -- Click a view hash to see its vitals (identifier, class, renderable count, template count) and a list of its templates and renderables
- **Template preview** -- Each template in the detail view shows its hash and a content preview

## Provider Browser (PP-PB)

Lists all providers registered with the host Pict instance.

- **List view** -- Shows each provider's hash and class name
- **Action button** -- Hover to reveal a `solve` button
- **Detail view** -- Click a provider hash to see its vitals (identifier, class, options count) and its configuration options

## Template Overrides (PP-TO)

Manages persisted template overrides. See [Template Overrides](overrides.md) for full documentation.
