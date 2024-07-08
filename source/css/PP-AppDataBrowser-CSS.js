module.exports = { CSS: /*CSS*/`

/* AppData Browser */

.pp_adb_datarow {
	display: grid;

	grid-template-columns: 1fr 24px;
	grid-template-rows: 16px 32px;
	align-content: stretch;

	overflow-y: scroll;

	font-family: Courier;
}

.pp_adb_record_metadata {
	grid-column: 1 / 2;
	grid-row: 1 / 2;
}

.pp_adb_record_data {
	grid-column: 1 / 2;
	grid-row: 2 / 3;
}

.pp_adb_key {
	font-size: 0.85rem;

	background-color: #fff1f1;

	border-color: #efefef;
	border-width: 1px;

	margin: 2px;

	padding-left: 0.5em;
	padding-right: 0.5em;
}

.pp_adb_type {
	font-size: 0.75rem;
	font-weight: light;
	font-style: italic;

	background-color: #fff1f1;

	border-color: #efefef;
	border-width: 1px;

	margin: 2px;

	padding-left: 0.5em;
	padding-right: 0.5em;
}

.pp_adb_value {
	overflow-y: scroll;
	overflow-x: hidden;
	max-height: 120px;
}

.pp_adb_menu {
	grid-column: 2 / 3;
	grid-row: 1 / 3;
}

.pp_adb_entry
{
	border-radius: 2px;
	margin: 4px;
}

div.pp_adb_entry
{
	border: 1px solid #b48d49;
	background-color: #dcd6c1;
}

div.pp_adb_entry  div.pp_adb_entry
{
	border: 1px solid #312514;
	background-color: #dcd6c1;
}

`};