const libPictProvider = require('pict-provider');

const libPPRouter = require('./providers/PP-Router.js');
const libPPCSSHotloader = require('./providers/PP-CSS-Hotloader.js');
const libPPConfigStorage = require('./providers/PP-ConfigStorage.js');
const libPPTemplateOverrideStorage = require('./providers/PP-TemplateOverrideStorage.js');

const libPPContainer = require('./views/PP-Container.js');
const libPPMain = require('./views/PP-Main.js');
const libPPNav = require('./views/PP-Navigation.js');

const libPPADB = require('./views/PP-View-AppDataBrowser.js');
const libPPTB = require('./views/PP-View-TemplateBrowser.js');
const libPPVB = require('./views/PP-View-ViewBrowser.js');
const libPPPB = require('./views/PP-View-ProviderBrowser.js');
const libPPTO = require('./views/PP-View-TemplateOverrides.js');

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
			this.pict.addProvider('PP-ConfigStorage', libPPConfigStorage.default_configuration, libPPConfigStorage);
			this.pict.addProvider('PP-TemplateOverrideStorage', libPPTemplateOverrideStorage.default_configuration, libPPTemplateOverrideStorage);

			// TODO: Discuss whether this should load them all or children should load their parts (e.g. this loads Main/Nav, Main or Nav loads the next bits)
			let tmpRootPanelView = this.pict.addView('PP-Panel', libPPContainer.default_configuration, libPPContainer);
			let tmpMainView = this.pict.addView('PP-Main', libPPMain.default_configuration, libPPMain);
			this.pict.addView('PP-Nav', libPPNav.default_configuration, libPPNav);

			this.pict.addView('PP-ADB', libPPADB.default_configuration, libPPADB);
			this.pict.addView('PP-TB', libPPTB.default_configuration, libPPTB);
			this.pict.addView('PP-VB', libPPVB.default_configuration, libPPVB);
			this.pict.addView('PP-PB', libPPPB.default_configuration, libPPPB);
			this.pict.addView('PP-TO', libPPTO.default_configuration, libPPTO);

			// Load saved config into uiState before rendering
			let tmpSavedConfig = this.pict.providers['PP-ConfigStorage'].load();
			if (tmpSavedConfig && tmpSavedConfig.Behaviors)
			{
				let tmpKeys = Object.keys(tmpSavedConfig.Behaviors);
				for (let i = 0; i < tmpKeys.length; i++)
				{
					if (tmpKeys[i] in tmpMainView.uiState.Behaviors)
					{
						tmpMainView.uiState.Behaviors[tmpKeys[i]] = tmpSavedConfig.Behaviors[tmpKeys[i]];
					}
				}
			}

			tmpRootPanelView.render();

			// Apply saved position/size and visual state after DOM exists
			this.pict.providers['PP-ConfigStorage'].applyConfig(tmpMainView);

			// Apply any persisted template overrides
			this.pict.providers['PP-TemplateOverrideStorage'].applyOverrides();
		}
		else
		{
			// Toggle the show/hide for the main view.
			this.pict.views['PP-Main'].toggleUIBehavior('visible');
		}
	}
}

/**
 * Auto-inject into a running pict app when the script is loaded via eval/script tag.
 *
 * When hotloaded (e.g. via fetch+eval or a script tag), this detects the global
 * _Pict instance, registers PictPanel as a provider, and shows the panel.
 *
 * Simple console one-liner to inject from CDN:
 *   fetch('https://cdn.jsdelivr.net/npm/pict-panel/dist/pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
 *
 * Or from a local dev server:
 *   fetch('http://localhost:9998/pict-panel.js').then(r=>r.text()).then(eval).then(()=>PictPanel.inject())
 */
PictPanel.inject = function(pPictInstance)
{
	let tmpPict = pPictInstance || (typeof(_Pict) !== 'undefined' ? _Pict : null);

	if (!tmpPict)
	{
		console.error('PictPanel.inject: No Pict instance found. Pass one as PictPanel.inject(myPictInstance) or ensure _Pict is global.');
		return;
	}

	if (!tmpPict.providers.PictPanel)
	{
		tmpPict.addProvider('PictPanel', {}, PictPanel);
	}
	tmpPict.providers.PictPanel.show();
};

module.exports = PictPanel;
module.exports.default_configuration = _DefaultProviderConfiguration;