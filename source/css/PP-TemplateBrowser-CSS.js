module.exports = { CSS: /*CSS*/`

/* Template Browser */

.pp_tb_container {
	padding: 4px;
}

.pp_tb_filter {
	padding: 2px 8px 4px;
}

.pp_tb_filter_input {
	width: 100%;
	box-sizing: border-box;
	font-family: Courier, monospace;
	font-size: 0.75rem;
	padding: 3px 6px;
	border: 1px solid var(--pal-pri);
	border-radius: 3px;
	background: transparent;
	color: var(--pal-pri);
}

.pp_tb_filter_input:focus {
	outline: 2px solid var(--pal-acc-bri);
	outline-offset: -1px;
}

.pp_tb_filter_input::placeholder {
	color: #999;
}

/* Editor area */
.pp_tb_editor {
	padding: 4px 8px;
	border-bottom: 1px solid rgba(0,48,73, 0.15);
	margin-bottom: 4px;
}

.pp_tb_editor_header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 4px;
}

.pp_tb_editor_hash {
	font-family: Courier, monospace;
	font-size: 0.8rem;
	font-weight: bold;
	color: var(--pal-acc);
}

.pp_tb_editor_textarea {
	min-height: 120px;
}

/* Template list */
.pp_tb_entry {
	padding: 3px 8px;
	border-left: 2px solid transparent;
}

.pp_tb_entry:hover {
	background: rgba(0,48,73, 0.06);
	border-left-color: var(--pal-pri);
}

.pp_tb_entry_row {
	display: flex;
	align-items: baseline;
	gap: 6px;
}

.pp_tb_entry_hash {
	font-family: Courier, monospace;
	font-size: 0.8rem;
	font-weight: bold;
	color: var(--pal-acc);
	flex-shrink: 0;
}

.pp_tb_entry_source {
	font-family: Courier, monospace;
	font-size: 0.65rem;
	color: #999;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	min-width: 0;
}

.pp_tb_entry_preview {
	font-family: Courier, monospace;
	font-size: 0.7rem;
	color: var(--pal-pri);
	opacity: 0.6;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	padding-left: 8px;
}

.pp_tb_empty {
	padding: 8px;
	font-family: Courier, monospace;
	font-size: 0.8rem;
	color: #999;
	font-style: italic;
}

`};
