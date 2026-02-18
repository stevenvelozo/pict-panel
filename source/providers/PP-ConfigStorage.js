const libPictProvider = require('pict-provider');

const _DEFAULT_PROVIDER_CONFIGURATION =
{
	ProviderIdentifier: 'PP-ConfigStorage',
	AutoInitialize: false,
	AutoSolveWithApp: false,

	StorageKey: 'PictPanel'
};

class PictPanelConfigStorage extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}

	save(pUIState)
	{
		try
		{
			let tmpConfig = {
				Behaviors: Object.assign({}, pUIState.Behaviors),
				ManualTop: pUIState.ManualTop,
				ManualLeft: pUIState.ManualLeft,
				ManualWidth: pUIState.ManualWidth
			};

			// Also save current panel element position/size if available
			let tmpPanelElement = document.getElementById('Pict-Panel');
			if (tmpPanelElement)
			{
				tmpConfig.PanelStyle = {
					top: tmpPanelElement.style.top,
					left: tmpPanelElement.style.left,
					right: tmpPanelElement.style.right,
					width: tmpPanelElement.style.width,
					height: tmpPanelElement.style.height
				};
			}

			// Save the active navigation view hash
			if (this.pict.providers['PP-Router'] && this.pict.providers['PP-Router'].activeView)
			{
				tmpConfig.ActiveView = this.pict.providers['PP-Router'].activeView;
			}

			localStorage.setItem(this.options.StorageKey, JSON.stringify(tmpConfig));
		}
		catch (pError)
		{
			this.log.error('PP-ConfigStorage failed to save: ' + pError.message);
		}
	}

	load()
	{
		try
		{
			let tmpRaw = localStorage.getItem(this.options.StorageKey);
			if (!tmpRaw) return false;

			let tmpConfig = JSON.parse(tmpRaw);
			return tmpConfig;
		}
		catch (pError)
		{
			this.log.error('PP-ConfigStorage failed to load: ' + pError.message);
			return false;
		}
	}

	clear()
	{
		try
		{
			localStorage.removeItem(this.options.StorageKey);
		}
		catch (pError)
		{
			this.log.error('PP-ConfigStorage failed to clear: ' + pError.message);
		}
	}

	applyConfig(pMainView)
	{
		let tmpConfig = this.load();
		if (!tmpConfig) return false;

		// Apply saved behaviors
		if (tmpConfig.Behaviors)
		{
			let tmpKeys = Object.keys(tmpConfig.Behaviors);
			for (let i = 0; i < tmpKeys.length; i++)
			{
				if (tmpKeys[i] in pMainView.uiState.Behaviors)
				{
					pMainView.uiState.Behaviors[tmpKeys[i]] = tmpConfig.Behaviors[tmpKeys[i]];
				}
			}
		}

		// Apply saved manual position values
		if ('ManualTop' in tmpConfig) pMainView.uiState.ManualTop = tmpConfig.ManualTop;
		if ('ManualLeft' in tmpConfig) pMainView.uiState.ManualLeft = tmpConfig.ManualLeft;
		if ('ManualWidth' in tmpConfig) pMainView.uiState.ManualWidth = tmpConfig.ManualWidth;

		// Apply saved panel element styles after render
		if (tmpConfig.PanelStyle)
		{
			let tmpPanelElement = document.getElementById('Pict-Panel');
			if (tmpPanelElement)
			{
				if (tmpConfig.PanelStyle.top) tmpPanelElement.style.top = tmpConfig.PanelStyle.top;
				if (tmpConfig.PanelStyle.left) tmpPanelElement.style.left = tmpConfig.PanelStyle.left;
				if (tmpConfig.PanelStyle.right) tmpPanelElement.style.right = tmpConfig.PanelStyle.right;
				if (tmpConfig.PanelStyle.width) tmpPanelElement.style.width = tmpConfig.PanelStyle.width;
				if (tmpConfig.PanelStyle.height) tmpPanelElement.style.height = tmpConfig.PanelStyle.height;
			}
		}

		// Apply behavior-driven UI state
		let tmpPanelElement = document.getElementById('Pict-Panel');
		if (tmpPanelElement)
		{
			// Tab mode
			if (pMainView.uiState.Behaviors.tab_mode)
			{
				tmpPanelElement.classList.add('pp_tab_mode');
			}

			// Night mode class
			if (pMainView.uiState.Behaviors.night_mode)
			{
				tmpPanelElement.classList.add('pp_dark_mode');
			}

			// Resize handle lock
			if (!pMainView.uiState.Behaviors.resize_handle)
			{
				tmpPanelElement.classList.add('pp_no_resize');
			}

			// Pin right
			if (pMainView.uiState.Behaviors.pin_right)
			{
				tmpPanelElement.style.left = '';
				tmpPanelElement.style.right = '-3px';
			}

			// Pin top
			if (pMainView.uiState.Behaviors.pin_top)
			{
				tmpPanelElement.style.top = '-3px';
			}

			// show_ui hides nav + content
			if (!pMainView.uiState.Behaviors.show_ui)
			{
				let tmpNavElement = tmpPanelElement.querySelector('.pp_nav');
				let tmpContentElement = tmpPanelElement.querySelector('.pp_content');
				if (tmpNavElement) tmpNavElement.style.display = 'none';
				if (tmpContentElement) tmpContentElement.style.display = 'none';
			}

			// show_navigation hides nav
			if (!pMainView.uiState.Behaviors.show_navigation)
			{
				let tmpNavElement = tmpPanelElement.querySelector('.pp_nav');
				if (tmpNavElement) tmpNavElement.style.display = 'none';
			}
		}

		// Update all toggle icon displays
		pMainView.initializePanelIcons();

		// Restore the active navigation view
		if (tmpConfig.ActiveView && this.pict.providers['PP-Router'])
		{
			this.pict.providers['PP-Router'].navigateTo(tmpConfig.ActiveView);
		}

		return tmpConfig;
	}
}

module.exports = PictPanelConfigStorage;
module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
