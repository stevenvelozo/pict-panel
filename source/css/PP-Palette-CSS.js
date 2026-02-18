module.exports = { CSS: /*CSS*/`

/* CSS Color Palettes .. for bein' modern? */

/*
rgb(255, 252, 64),
rgb(250, 186, 97),
rgb(255, 129, 114),
rgb(255, 47, 169),
rgb(58, 87, 154),
rgb(54, 36, 79)

#fffc40
#faba61
#ff8172
#ff2fa9
#3a579a
#36244f
*/

:root { 
	--pal-bg: #fdf0d5;
    --pal-pri: #003049;
	--pal-pri-brt: #669bbc;
    --pal-acc: #780000;
    --pal-acc-bri: #c1121f;

	--win-bg: var(--pal-bg);
	--win-fg: var(--pal-pri);
	--win-border: var(--pal-acc);

	--hd-bg: var(--win-bg);
	--hd-logotext: var(--pal-acc);

	--hd-sz-con: rgba(210,210,210, 0.2);
	--hd-sz-con-border: rgba(235,235,235, 0.4);
	--hd-sz-con-hover: rgba(210,210,210, 0.9);
	--hd-sz-con-border-hover: var(--pal-acc-bri);
}

/* Dark mode overrides */
#Pict-Panel.pp_dark_mode {
	--pal-bg: #1e1e2e;
	--pal-pri: #cdd6f4;
	--pal-pri-brt: #89b4fa;
	--pal-acc: #f38ba8;
	--pal-acc-bri: #eba0ac;

	--win-bg: var(--pal-bg);
	--win-fg: var(--pal-pri);
	--win-border: var(--pal-acc);

	--hd-bg: var(--win-bg);
	--hd-logotext: var(--pal-acc);

	--hd-sz-con: rgba(80,80,80, 0.3);
	--hd-sz-con-border: rgba(100,100,100, 0.4);
	--hd-sz-con-hover: rgba(80,80,80, 0.8);
	--hd-sz-con-border-hover: var(--pal-acc-bri);
}

#Pict-Panel.pp_dark_mode .pp_adb_value_string {
	color: #a6e3a1;
}

#Pict-Panel.pp_dark_mode .pp_adb_value_number {
	color: #89b4fa;
}

#Pict-Panel.pp_dark_mode .pp_adb_value_boolean {
	color: #cba6f7;
}

#Pict-Panel.pp_dark_mode .pp_adb_editor_textarea {
	background: #313244;
	color: #cdd6f4;
	border-color: #585b70;
}

#Pict-Panel.pp_dark_mode .pp_adb_editor_save {
	color: #a6e3a1 !important;
}

`};