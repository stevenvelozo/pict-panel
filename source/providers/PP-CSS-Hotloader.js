const libPictProvider = require('pict-provider');

const _DEFAULT_PROVIDER_CONFIGURATION = 
{
	ProviderIdentifier: 'PP-CSS-Hotloader',
	AutoInitialize: false,
	AutoSolveWithApp: false,

	CustomPanelCSS: 
		// Not great but cute.
		// The order of these matter.
		// And this is still simpler to work with than slow-ass sass or less.
		require('../css/PP-Palette-CSS.js').CSS
		+ require('../css/PP-Panel-CSS.js').CSS 
		+ require('../css/PP-Logo-CSS.js').CSS
		+ require('../css/PP-AppDataBrowser-CSS.js').CSS
}

class PictPanelCSSHotloader extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.injectedCSS = false;
	}

	// TODO: This seems useful outside of the panel app ... maybe a core provider?
	hotloadCSS()
	{
		if (this.injectedCSS) return;

		// Load the custom CSS for the container into its own style tag
		let tmpCSSContainer = this.pict.ContentAssignment.getElement('#Pict-Panel-Container-CSS');
		// This does not use the PICT CSS functionality because we don't want to pollute whatever the normal app is doing with it.
		if (!Array.isArray(tmpCSSContainer) || tmpCSSContainer.length === 0)
		{
			try
			{
				let tmpCSS = document.createElement('style');
				tmpCSS.id = 'Pict-Panel-Container-CSS';
				tmpCSS.innerHTML = this.options.CustomPanelCSS;
				document.head.appendChild(tmpCSS);
			}
			catch (pError)
			{
				console.error('Error adding custom CSS to head in Pict-Panel onBeforeRender:', pError);
			}
		}
		this.injectedCSS = true;

		return true;
	}
}

module.exports = PictPanelCSSHotloader;
module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;