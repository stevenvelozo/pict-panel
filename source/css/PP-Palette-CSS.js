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

`};