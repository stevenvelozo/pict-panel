module.exports = { CSS: /*CSS*/`

/* Panel Styling */

#Pict-Panel {
	z-index: 900;
	position: fixed;
	top: 15px;
	right: 15px;

	min-height: 24px;
	max-height: 98%;
	min-width: 300px;
	max-width: 98%;

	width: 300px;
	
	overflow: auto;

	color: var(--win-fg);
	background: var(--win-bg);
	border: 3px double var(--win-border);
	border-radius: 5px;
}

#Pict-Panel-Drag {
	z-index: 910;
	cursor: move;
}

.pp_hd {
	display: grid;
	grid-template-columns: 70px 1fr 70px;
	grid-template-areas: "logo title controls";
	align-content: stretch;

	padding: 4px;
	fill: var(--hd-bg);
}

.pp_hd_logo {
	grid-area: logo;
}

.pp_hd_pict {
	grid-area: title;
	font-family: Verdana;
	font-size: 48px;
	font-weight: bold;
	color: --hd-logotext;
	user-select: none;
}

.pp_hd_control {
	grid-area: controls;
	justify-self: end;
}


/* UI size/etc. toggle Controls */
.pp_sz_con {
	display: grid;
	grid-template-columns: 20px 20px 20px;
	grid-template-rows: 20px 20px 20px;
	align-content: stretch;

	text-align: right;
}

.pp_sz_con div {
	background-color: var(--hd-sz-con);
	border-color: var(--hd-sz-con-border);
	border-style: dotted;
}

.pp_sz_con div:hover {
	background-color: var(--hd-sz-con-hover);
	border-color: var(--hd-sz-con-border-hover);
	border-style: solid;
}

.pp_sz_con svg
{
	width: 16px;
	height: 16px;
}
.pp_sz_icon
{
	width: 100%;
	height: auto;
	object-fit: fill;
	color: var(--pal-pri);
}
.pp_sz_icon:hover
{
	color: var(--pal-pri-bri);
}

.pp_sz_con .checked .off
{
	display: none;
}
.pp_sz_con .unchecked .on
{
	display: none;
}
.pp_sz_con .checked .on
{
	display:block;
}
.pp_sz_con .unchecked .off
{
	display:block;
}

`};