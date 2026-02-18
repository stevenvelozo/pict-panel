module.exports = { CSS: /*CSS*/`

/* Shared Service Browser (Views + Providers) */

.pp_sb_container {
	padding: 4px;
}

/* List entries */
.pp_sb_entry {
	padding: 3px 8px;
	border-left: 2px solid transparent;
}

.pp_sb_entry:hover {
	background: rgba(0,48,73, 0.06);
	border-left-color: var(--pal-pri);
}

.pp_sb_entry_row {
	display: flex;
	align-items: baseline;
	gap: 6px;
	position: relative;
}

.pp_sb_entry_hash {
	font-family: Courier, monospace;
	font-size: 0.8rem;
	font-weight: bold;
	color: var(--pal-acc);
	text-decoration: none;
	flex-shrink: 0;
	cursor: pointer;
}

.pp_sb_entry_hash:hover {
	color: var(--pal-acc-bri);
}

.pp_sb_entry_info {
	font-family: Courier, monospace;
	font-size: 0.65rem;
	color: #999;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	min-width: 0;
}

/* Action icons (render/renderAsync) in list */
.pp_sb_action_icon {
	display: none;
	align-items: center;
	justify-content: center;
	width: 18px;
	height: 18px;
	padding: 2px;
	border-radius: 3px;
	color: var(--pal-pri);
	text-decoration: none;
	cursor: pointer;
	position: absolute;
	right: 0;
	top: 0;
	background: var(--win-bg);
}

.pp_sb_action_icon + .pp_sb_action_icon {
	right: 20px;
}

.pp_sb_entry:hover .pp_sb_action_icon {
	display: inline-flex;
}

.pp_sb_action_icon:hover {
	color: var(--pal-acc-bri);
	background: rgba(0,0,0,0.05);
}

.pp_sb_action_icon svg {
	width: 12px;
	height: 12px;
}

/* Detail view */
.pp_sb_detail {
	padding: 0 4px;
}

.pp_sb_detail_header {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 4px 4px 6px;
	border-bottom: 2px solid var(--pal-acc);
	margin-bottom: 4px;
}

.pp_sb_back_btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 18px;
	height: 18px;
	color: var(--pal-pri);
	text-decoration: none;
	border-radius: 3px;
	flex-shrink: 0;
}

.pp_sb_back_btn:hover {
	color: var(--pal-acc-bri);
	background: rgba(0,0,0,0.05);
}

.pp_sb_back_btn svg {
	width: 14px;
	height: 14px;
}

.pp_sb_detail_hash {
	font-family: Courier, monospace;
	font-size: 0.9rem;
	font-weight: bold;
	color: var(--pal-acc);
}

/* Vitals */
.pp_sb_vitals {
	padding: 2px 8px;
}

.pp_sb_vital_row {
	display: flex;
	align-items: baseline;
	gap: 6px;
	padding: 1px 0;
	font-family: Courier, monospace;
	font-size: 0.75rem;
	line-height: 1.4;
}

.pp_sb_vital_key {
	color: var(--pal-acc);
	font-weight: bold;
	flex-shrink: 0;
	min-width: 90px;
}

.pp_sb_vital_key::after {
	content: ':';
	color: var(--pal-pri);
}

.pp_sb_vital_val {
	color: var(--pal-pri);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	flex: 1;
	min-width: 0;
}

/* Action buttons in detail view */
.pp_sb_detail_actions {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	padding: 6px 8px;
	border-top: 1px solid rgba(0,48,73, 0.1);
	border-bottom: 1px solid rgba(0,48,73, 0.1);
	margin: 4px 0;
}

.pp_sb_detail_action_btn {
	font-family: Courier, monospace;
	font-size: 0.7rem;
	font-weight: bold;
	color: var(--pal-pri);
	text-decoration: none;
	cursor: pointer;
	padding: 2px 6px;
	border: 1px solid var(--pal-pri);
	border-radius: 3px;
}

.pp_sb_detail_action_btn:hover {
	color: var(--pal-acc-bri);
	border-color: var(--pal-acc-bri);
	background: rgba(0,0,0,0.05);
}

/* Section labels */
.pp_sb_detail_section_label {
	font-family: Courier, monospace;
	font-size: 0.75rem;
	font-weight: bold;
	color: var(--pal-pri);
	padding: 4px 8px 2px;
	opacity: 0.6;
}

/* Template entries in detail */
.pp_sb_detail_tpl_entry {
	padding: 2px 8px;
	border-left: 2px solid transparent;
}

.pp_sb_detail_tpl_entry:hover {
	background: rgba(0,48,73, 0.04);
	border-left-color: var(--pal-pri-brt);
}

.pp_sb_detail_tpl_hash {
	font-family: Courier, monospace;
	font-size: 0.75rem;
	font-weight: bold;
	color: var(--pal-acc);
}

.pp_sb_detail_tpl_preview {
	font-family: Courier, monospace;
	font-size: 0.65rem;
	color: var(--pal-pri);
	opacity: 0.5;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	padding-left: 8px;
}

/* Options list in provider detail */
.pp_sb_detail_opts_list {
	padding: 2px 8px;
}

`};
