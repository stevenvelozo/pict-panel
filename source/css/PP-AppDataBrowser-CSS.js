module.exports = { CSS: /*CSS*/`

/* AppData Browser */

.pp_adb_container {
	padding: 4px;
}

.pp_adb_header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 4px 8px;
	border-bottom: 2px solid var(--pal-acc);
	margin-bottom: 4px;
}

.pp_adb_header_label {
	font-family: Courier, monospace;
	font-size: 0.9rem;
	font-weight: bold;
	color: var(--pal-pri);
}

.pp_adb_header_actions {
	display: flex;
	align-items: center;
	gap: 6px;
}

.pp_adb_action_btn {
	font-family: Courier, monospace;
	font-size: 0.7rem;
	font-weight: bold;
	color: var(--pal-pri);
	text-decoration: none;
	cursor: pointer;
	padding: 1px 4px;
	border-radius: 3px;
	display: flex;
	align-items: center;
}

.pp_adb_action_btn:hover {
	color: var(--pal-acc-bri);
	background: rgba(0,0,0,0.05);
}

/* Editor */
.pp_adb_editor {
	padding: 4px 8px;
	border-bottom: 1px solid rgba(0,48,73, 0.15);
	margin-bottom: 4px;
}

.pp_adb_editor_textarea {
	width: 100%;
	min-height: 200px;
	max-height: 60vh;
	font-family: Courier, monospace;
	font-size: 0.75rem;
	line-height: 1.3;
	padding: 4px;
	border: 1px solid var(--pal-pri);
	border-radius: 3px;
	background: #fff;
	color: var(--pal-pri);
	resize: vertical;
	box-sizing: border-box;
	tab-size: 4;
}

.pp_adb_editor_textarea:focus {
	outline: 2px solid var(--pal-acc-bri);
	outline-offset: -1px;
}

.pp_adb_editor_textarea.pp_adb_editor_error {
	outline: 2px solid #c1121f;
	background: #fff1f1;
}

.pp_adb_editor_actions {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
	margin-top: 4px;
}

.pp_adb_editor_save {
	color: #067d17 !important;
}

.pp_adb_editor_cancel {
	color: var(--pal-acc) !important;
}

/* Tree entries */
.pp_adb_entry {
	font-family: Courier, monospace;
	font-size: 0.8rem;
	line-height: 1.4;
}

.pp_adb_leaf .pp_adb_datarow {
	display: flex;
	align-items: baseline;
	padding: 1px 4px 1px 8px;
	border-left: 2px solid transparent;
}

.pp_adb_leaf .pp_adb_datarow:hover {
	background: rgba(0,48,73, 0.06);
	border-left-color: var(--pal-pri);
}

.pp_adb_branch > .pp_adb_datarow {
	display: flex;
	align-items: baseline;
	padding: 2px 4px;
	cursor: pointer;
	border-left: 2px solid transparent;
	user-select: none;
}

.pp_adb_branch > .pp_adb_datarow:hover {
	background: rgba(0,48,73, 0.08);
	border-left-color: var(--pal-acc-bri);
}

.pp_adb_record_metadata {
	display: flex;
	align-items: baseline;
	gap: 4px;
	flex-shrink: 0;
}

.pp_adb_record_data {
	margin-left: 4px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	min-width: 0;
}

.pp_adb_key {
	color: var(--pal-acc);
	font-weight: bold;
}

.pp_adb_leaf .pp_adb_key::after {
	content: ':';
	color: var(--pal-pri);
}

.pp_adb_type {
	font-size: 0.7rem;
	font-style: italic;
	color: #888;
}

.pp_adb_count {
	font-size: 0.7rem;
	color: #888;
}

/* Leaf value styling by type */
.pp_adb_value {
	color: var(--pal-pri);
}

.pp_adb_value_string {
	color: #067d17;
}

.pp_adb_value_string::before {
	content: '"';
	color: #888;
}

.pp_adb_value_string::after {
	content: '"';
	color: #888;
}

.pp_adb_value_number {
	color: #1750eb;
}

.pp_adb_value_boolean {
	color: #9c27b0;
	font-weight: bold;
}

.pp_adb_value_null,
.pp_adb_value_undefined {
	color: #888;
	font-style: italic;
}

/* Expand/collapse icon */
.pp_adb_expand_icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 14px;
	height: 14px;
	transition: transform 0.15s ease;
	flex-shrink: 0;
}

.pp_adb_expand_icon.pp_adb_collapsed {
	transform: rotate(0deg);
}

.pp_adb_expand_icon.pp_adb_expanded {
	transform: rotate(90deg);
}

.pp_adb_expand_icon svg {
	color: var(--pal-pri);
}

/* Child container indentation */
.pp_adb_children {
	margin-left: 12px;
	border-left: 1px solid rgba(0,48,73, 0.15);
}

.pp_adb_scalar_value {
	padding: 4px 8px;
	font-family: Courier, monospace;
	font-size: 0.8rem;
	color: var(--pal-pri);
}

`};
