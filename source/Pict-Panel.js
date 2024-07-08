const libPictProvider = require('pict-provider');

const libPPRouter = require('./providers/PP-Router.js');
const libPPCSSHotloader = require('./providers/PP-CSS-Hotloader.js');

const libPPContainer = require('./views/PP-Container.js');
const libPPMain = require('./views/PP-Main.js');
const libPPNav = require('./views/PP-Navigation.js');

const libPPADB = require('./views/PP-View-AppDataBrowser.js');

const _DefaultProviderConfiguration = (
{
	"ProviderIdentifier": "Pict-Panel",
	"AutoInitialize": false,
	"AutoSolveWithApp": false
});

class PictPanel extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultProviderConfiguration)), pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}

	show()
	{
		if (!('PP-Panel' in this.pict.views))
		{
			this.pict.addProvider('PP-Router', libPPRouter.default_configuration, libPPRouter);
			this.pict.addProvider('PP-CSS-Hotloader', libPPCSSHotloader.default_configuration, libPPCSSHotloader);

			// TODO: Discuss whether this should load them all or children should load their parts (e.g. this loads Main/Nav, Main or Nav loads the next bits)
			let tmpRootPanelView = this.pict.addView('PP-Panel', libPPContainer.default_configuration, libPPContainer);
			this.pict.addView('PP-Main', libPPMain.default_configuration, libPPMain);
			this.pict.addView('PP-Nav', libPPNav.default_configuration, libPPNav);

			this.pict.addView('PP-ADB', libPPADB.default_configuration, libPPADB);

			tmpRootPanelView.render();
		}
		else
		{
			// Toggle the show/hide for the main view.
			this.pict.views['PP-Main'].toggleUIBehavior('visible');
		}
	}
}

module.exports = PictPanel;
module.exports.default_configuration = _DefaultProviderConfiguration;