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

	overflow: hidden;
	resize: both;

	display: flex;
	flex-direction: column;

	color: var(--win-fg);
	background: var(--win-bg);
	border: 3px double var(--win-border);
	border-radius: 5px;
}

.pp_content {
	flex: 1;
	overflow: auto;
	min-height: 0;
}

#Pict-Panel.pp_no_resize {
	resize: none;
}

/* Tab mode: collapse to just the logo */
#Pict-Panel.pp_tab_mode {
	top: -3px;
	right: 60px;
	left: auto;
	width: auto;
	min-width: 0;
	max-width: none;
	height: auto;
	min-height: 0;
	max-height: none;
	resize: none;
	overflow: visible;
	padding: 0;
}

#Pict-Panel.pp_tab_mode .pp_hd {
	display: block;
	padding: 2px;
}

#Pict-Panel.pp_tab_mode .pp_hd_pict,
#Pict-Panel.pp_tab_mode .pp_hd_control,
#Pict-Panel.pp_tab_mode .pp_nav,
#Pict-Panel.pp_tab_mode .pp_content {
	display: none !important;
}

#Pict-Panel.pp_tab_mode .pp_hd_logo {
	cursor: grab;
}

#Pict-Panel.pp_tab_mode .pp_hd_logo:active {
	cursor: grabbing;
}

#Pict-Panel.pp_tab_mode .pp_hd_logo svg {
	width: 36px;
	height: 36px;
	display: block;
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

.pp_sz_con > div {
	background-color: var(--hd-sz-con);
	border-color: var(--hd-sz-con-border);
	border-style: dotted;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
}

.pp_sz_con > div:hover {
	background-color: var(--hd-sz-con-hover);
	border-color: var(--hd-sz-con-border-hover);
	border-style: solid;
}

.pp_sz_con svg
{
	width: 16px;
	height: 16px;
	color: var(--pal-pri);
	fill: var(--pal-pri);
}

.pp_sz_con > div:hover svg
{
	color: var(--pal-acc-bri);
	fill: var(--pal-acc-bri);
}

/* Toggle icon visibility: unchecked shows .off, checked shows .on */
.pp_sz_con .checked .off,
.pp_sz_con .checked .hover_on
{
	display: none !important;
}
.pp_sz_con .unchecked .on,
.pp_sz_con .unchecked .hover_off
{
	display: none !important;
}
.pp_sz_con .checked .on,
.pp_sz_con .checked .hover_off
{
	display: inline-flex !important;
}
.pp_sz_con .unchecked .off,
.pp_sz_con .unchecked .hover_on
{
	display: inline-flex !important;
}

/* Navigation */
.pp_nav {
	padding: 2px 8px;
	border-bottom: 1px solid var(--pal-acc);
	font-family: Courier, monospace;
	font-size: 0.8rem;
}

.pp_nav a {
	color: var(--pal-acc);
	text-decoration: none;
}

.pp_nav a:hover {
	color: var(--pal-acc-bri);
}

.pp_nav_short {
	font-weight: 800;
	letter-spacing: -0.5px;
	text-transform: uppercase;
	font-style: normal;
}

.pp_nav_long {
	font-weight: 400;
	font-style: normal;
	display: none;
}

.pp_nav_active .pp_nav_short {
	display: none;
}

.pp_nav_active .pp_nav_long {
	display: inline;
	opacity: 0.6;
}

`};