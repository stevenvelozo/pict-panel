const libPictProvider = require('pict-provider');

const _DEFAULT_PROVIDER_CONFIGURATION =
{
	ProviderIdentifier: 'PP-TemplateOverrideStorage',
	AutoInitialize: false,
	AutoSolveWithApp: false,

	StorageKey: 'PictPanel-TemplateOverrides'
};

class PictPanelTemplateOverrideStorage extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _DEFAULT_PROVIDER_CONFIGURATION, pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}

	/**
	 * Load all overrides from localStorage.
	 * @returns {Object} Map of { TemplateHash: { Original, Override, Active } }
	 */
	loadOverrides()
	{
		try
		{
			let tmpRaw = localStorage.getItem(this.options.StorageKey);
			if (!tmpRaw) return {};
			return JSON.parse(tmpRaw);
		}
		catch (pError)
		{
			this.log.error('PP-TemplateOverrideStorage failed to load: ' + pError.message);
			return {};
		}
	}

	/**
	 * Persist the full overrides map to localStorage.
	 */
	_persist(pOverrides)
	{
		try
		{
			localStorage.setItem(this.options.StorageKey, JSON.stringify(pOverrides));
		}
		catch (pError)
		{
			this.log.error('PP-TemplateOverrideStorage failed to save: ' + pError.message);
		}
	}

	/**
	 * Save (or update) an override entry.
	 * If this hash already has an override, only the Override content is updated.
	 */
	saveOverride(pHash, pOriginal, pOverride)
	{
		let tmpOverrides = this.loadOverrides();

		if (tmpOverrides[pHash])
		{
			// Already have an original snapshot -- just update the override content
			tmpOverrides[pHash].Override = pOverride;
			tmpOverrides[pHash].Active = true;
		}
		else
		{
			tmpOverrides[pHash] = {
				Original: pOriginal,
				Override: pOverride,
				Active: true
			};
		}

		this._persist(tmpOverrides);
		this.log.trace(`Override saved for template [${pHash}]`);
	}

	/**
	 * Remove an override entry and restore the original template.
	 */
	removeOverride(pHash)
	{
		let tmpOverrides = this.loadOverrides();
		if (!tmpOverrides[pHash]) return;

		// Restore the original template before removing the entry
		let tmpOriginal = tmpOverrides[pHash].Original;
		this.pict.TemplateProvider.addTemplate(pHash, tmpOriginal);

		delete tmpOverrides[pHash];
		this._persist(tmpOverrides);
		this.log.trace(`Override removed for template [${pHash}]`);
	}

	/**
	 * Toggle a single override on or off.
	 */
	toggleOverride(pHash, pActive)
	{
		let tmpOverrides = this.loadOverrides();
		if (!tmpOverrides[pHash]) return;

		tmpOverrides[pHash].Active = pActive;
		this._persist(tmpOverrides);

		if (pActive)
		{
			this.pict.TemplateProvider.addTemplate(pHash, tmpOverrides[pHash].Override);
		}
		else
		{
			this.pict.TemplateProvider.addTemplate(pHash, tmpOverrides[pHash].Original);
		}

		this.log.trace(`Override for [${pHash}] set to ${pActive ? 'active' : 'inactive'}`);
	}

	/**
	 * Toggle all overrides on or off.
	 */
	toggleAll(pActive)
	{
		let tmpOverrides = this.loadOverrides();
		let tmpHashes = Object.keys(tmpOverrides);

		for (let i = 0; i < tmpHashes.length; i++)
		{
			let tmpHash = tmpHashes[i];
			tmpOverrides[tmpHash].Active = pActive;

			if (pActive)
			{
				this.pict.TemplateProvider.addTemplate(tmpHash, tmpOverrides[tmpHash].Override);
			}
			else
			{
				this.pict.TemplateProvider.addTemplate(tmpHash, tmpOverrides[tmpHash].Original);
			}
		}

		this._persist(tmpOverrides);
		this.log.trace(`All overrides set to ${pActive ? 'active' : 'inactive'}`);
	}

	/**
	 * Apply all active overrides. Called on panel init after page reload.
	 */
	applyOverrides()
	{
		let tmpOverrides = this.loadOverrides();
		let tmpHashes = Object.keys(tmpOverrides);
		let tmpApplied = 0;

		for (let i = 0; i < tmpHashes.length; i++)
		{
			let tmpHash = tmpHashes[i];
			if (tmpOverrides[tmpHash].Active)
			{
				this.pict.TemplateProvider.addTemplate(tmpHash, tmpOverrides[tmpHash].Override);
				tmpApplied++;
			}
		}

		if (tmpApplied > 0)
		{
			this.log.info(`Applied ${tmpApplied} template override(s)`);
		}
	}
}

module.exports = PictPanelTemplateOverrideStorage;
module.exports.default_configuration = _DEFAULT_PROVIDER_CONFIGURATION;
