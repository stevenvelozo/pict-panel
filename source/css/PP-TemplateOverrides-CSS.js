module.exports = { CSS: /*CSS*/`

/* Template Overrides View */

.pp_to_container {
	padding: 4px;
}

.pp_to_entry {
	padding: 3px 8px;
	border-left: 2px solid transparent;
}

.pp_to_entry:hover {
	background: rgba(0,48,73, 0.06);
}

.pp_to_active {
	border-left-color: var(--pal-acc);
}

.pp_to_inactive {
	border-left-color: transparent;
	opacity: 0.6;
}

.pp_to_entry_row {
	display: flex;
	align-items: center;
	gap: 6px;
}

.pp_to_toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	color: var(--pal-pri);
	text-decoration: none;
	cursor: pointer;
	flex-shrink: 0;
}

.pp_to_toggle:hover {
	color: var(--pal-acc-bri);
}

.pp_to_entry_hash {
	font-family: Courier, monospace;
	font-size: 0.75rem;
	font-weight: bold;
	color: var(--pal-acc);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	min-width: 0;
}

.pp_to_remove {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	color: var(--pal-pri);
	text-decoration: none;
	cursor: pointer;
	flex-shrink: 0;
	opacity: 0;
}

.pp_to_entry:hover .pp_to_remove {
	opacity: 1;
}

.pp_to_remove:hover {
	color: #c44;
}

.pp_to_empty {
	font-family: Courier, monospace;
	font-size: 0.75rem;
	color: var(--pal-pri);
	opacity: 0.5;
	padding: 8px;
}

`};
