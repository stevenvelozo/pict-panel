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
			this.activeView = pViewHash;
			this.pict.views[pViewHash].render();

			// Update the active nav highlight
			let tmpNavItems = document.querySelectorAll('#Pict-Panel .pp_nav span[data-nav]');
			for (let i = 0; i < tmpNavItems.length; i++)
			{
				if (tmpNavItems[i].getAttribute('data-nav') === pViewHash)
				{
					tmpNavItems[i].classList.add('pp_nav_active');
				}
				else
				{
					tmpNavItems[i].classList.remove('pp_nav_active');
				}
			}

			// Persist the active view selection
			if (this.pict.providers['PP-ConfigStorage'] && this.pict.views['PP-Main'])
			{
				this.pict.providers['PP-ConfigStorage'].save(this.pict.views['PP-Main'].uiState);
			}
		}
	}
}

module.exports = PictPanelRouter;
module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;