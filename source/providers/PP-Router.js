const libPictProvider = require('pict-provider');

const _DEFAULT_PROVIDER_CONFIGURATION = 
{
	ProviderIdentifier: 'PP-Router',
	AutoInitialize: false,
	AutoSolveWithApp: false
}

class PictPanelRouter extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this.activeView = false;
	}

	navigateTo(pViewHash)
	{
		if (this.activeView === pViewHash)
		{
			// TODO: Allow for subtlety in views reloading versus rendering
			return false;
		}

		if (pViewHash in this.pict.views)
		{
			this.pict.views[pViewHash].render();
		}
	}
}

module.exports = PictPanelRouter;
module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;