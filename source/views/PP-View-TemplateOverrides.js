const libPictView = require('pict-view');

const _ViewConfiguration = (
	{
		ViewIdentifier: "Pict-Panel-TemplateOverrides",

		DefaultRenderable: "PP-TemplateOverrides",
		DefaultDestinationAddress: "#Pict-Panel .pp_content",

		AutoRender: false,
		AutoSolveWithApp: false,

		Templates: [
			{
				Hash: "PP-TemplateOverrides",
				Template: /*HTML*/`
				<div class="pp_to_container">
					<div class="pp_adb_header">
						<span class="pp_adb_header_label">Overrides</span>
						<div class="pp_adb_header_actions">
							<a href="#" class="pp_adb_action_btn" onclick="_Pict.views['PP-TO'].exportOverrides(); return false;" title="Export active overrides as JSON">json</a>
							<a href="#" class="pp_adb_action_btn" onclick="_Pict.views['PP-TO'].exportOverridesJS(); return false;" title="Export active overrides as JS">js</a>
							<a href="#" class="pp_adb_action_btn" onclick="_Pict.views['PP-TO'].toggleAll(true); return false;" title="Activate all overrides">all on</a>
							<a href="#" class="pp_adb_action_btn" onclick="_Pict.views['PP-TO'].toggleAll(false); return false;" title="Deactivate all overrides">all off</a>
							<a href="#" class="pp_adb_action_btn pp_adb_refresh_btn" onclick="_Pict.views['PP-TO'].render(); return false;" title="Refresh">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M320 146s24.36-12-64-12a160 160 0 10160 160"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 58l80 80-80 80"/></svg>
							</a>
						</div>
					</div>
					<div class="pp_to_list" id="pp_to_list">
					</div>
				</div>
`
			},
			{
				Hash: "PP-TemplateOverrideEntry",
				Template: /*HTML*/`
				<div class="pp_to_entry {~D:Record.ActiveClass~}">
					<div class="pp_to_entry_row">
						<a href="#" class="pp_to_toggle" onclick="_Pict.views['PP-TO'].toggleOverride('{~D:Record.Hash~}'); return false;" title="{~D:Record.ToggleTitle~}">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12"><circle cx="256" cy="256" r="192" fill="{~D:Record.DotColor~}" stroke="currentColor" stroke-width="32"/></svg>
						</a>
						<span class="pp_to_entry_hash">{~D:Record.Hash~}</span>
						<a href="#" class="pp_to_remove" onclick="_Pict.views['PP-TO'].removeOverride('{~D:Record.Hash~}'); return false;" title="Remove override">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>
						</a>
					</div>
				</div>
`
			}
		],
		Renderables: [
			{
				RenderableHash: "PP-TemplateOverrides",
				TemplateHash: "PP-TemplateOverrides",
				ContentDestinationAddress: "#Pict-Panel .pp_content"
			}]
	});

class PictPanelTemplateOverrides extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender()
	{
		this.renderOverrideList();
	}

	getOverrideEntries()
	{
		let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
		if (!tmpOverrideStorage) return [];

		let tmpOverrides = tmpOverrideStorage.loadOverrides();
		let tmpHashes = Object.keys(tmpOverrides);

		let tmpEntries = [];
		for (let i = 0; i < tmpHashes.length; i++)
		{
			let tmpHash = tmpHashes[i];
			let tmpEntry = tmpOverrides[tmpHash];

			tmpEntries.push(
				{
					Hash: tmpHash,
					Active: tmpEntry.Active,
					ActiveClass: tmpEntry.Active ? 'pp_to_active' : 'pp_to_inactive',
					DotColor: tmpEntry.Active ? 'var(--pal-acc)' : 'none',
					ToggleTitle: tmpEntry.Active ? 'Deactivate (restore original)' : 'Activate (apply override)'
				});
		}

		tmpEntries.sort(function(a, b) { return a.Hash.localeCompare(b.Hash); });

		return tmpEntries;
	}

	renderOverrideList()
	{
		let tmpEntries = this.getOverrideEntries();

		let tmpOutput = '';
		if (tmpEntries.length > 0)
		{
			tmpOutput = this.pict.parseTemplateSetByHash('PP-TemplateOverrideEntry', tmpEntries, null, [this]);
		}
		else
		{
			tmpOutput = '<div class="pp_to_empty">No template overrides stored.</div>';
		}

		this.pict.ContentAssignment.assignContent('#pp_to_list', tmpOutput);
	}

	toggleOverride(pHash)
	{
		let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
		if (!tmpOverrideStorage) return;

		let tmpOverrides = tmpOverrideStorage.loadOverrides();
		if (!tmpOverrides[pHash]) return;

		tmpOverrideStorage.toggleOverride(pHash, !tmpOverrides[pHash].Active);
		this.renderOverrideList();
	}

	toggleAll(pActive)
	{
		let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
		if (!tmpOverrideStorage) return;

		tmpOverrideStorage.toggleAll(pActive);
		this.renderOverrideList();
	}

	removeOverride(pHash)
	{
		let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
		if (!tmpOverrideStorage) return;

		tmpOverrideStorage.removeOverride(pHash);
		this.renderOverrideList();
	}

	exportOverrides()
	{
		let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
		if (!tmpOverrideStorage) return;

		let tmpOverrides = tmpOverrideStorage.loadOverrides();
		let tmpHashes = Object.keys(tmpOverrides);

		// Build export array from active overrides only
		let tmpExport = [];
		for (let i = 0; i < tmpHashes.length; i++)
		{
			let tmpHash = tmpHashes[i];
			if (tmpOverrides[tmpHash].Active)
			{
				tmpExport.push(
					{
						Hash: tmpHash,
						Template: tmpOverrides[tmpHash].Override
					});
			}
		}

		if (tmpExport.length === 0)
		{
			this.log.warn('No active overrides to export.');
			return;
		}

		// Build a site hash from the current hostname
		let tmpSiteHash = window.location.hostname.replace(/[^a-zA-Z0-9]/g, '_');

		let tmpJSON = JSON.stringify(tmpExport, null, '\t');
		let tmpBlob = new Blob([tmpJSON], { type: 'application/json' });
		let tmpURL = URL.createObjectURL(tmpBlob);

		let tmpLink = document.createElement('a');
		tmpLink.href = tmpURL;
		tmpLink.download = 'PictTemplates-' + tmpSiteHash + '.json';
		document.body.appendChild(tmpLink);
		tmpLink.click();
		document.body.removeChild(tmpLink);
		URL.revokeObjectURL(tmpURL);

		this.log.info(`Exported ${tmpExport.length} template override(s) as JSON`);
	}

	exportOverridesJS()
	{
		let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
		if (!tmpOverrideStorage) return;

		let tmpOverrides = tmpOverrideStorage.loadOverrides();
		let tmpHashes = Object.keys(tmpOverrides);

		// Build entries from active overrides only
		let tmpEntries = [];
		for (let i = 0; i < tmpHashes.length; i++)
		{
			let tmpHash = tmpHashes[i];
			if (tmpOverrides[tmpHash].Active)
			{
				tmpEntries.push(
					{
						Hash: tmpHash,
						Template: tmpOverrides[tmpHash].Override
					});
			}
		}

		if (tmpEntries.length === 0)
		{
			this.log.warn('No active overrides to export.');
			return;
		}

		// Format as JS source with backtick-quoted template strings
		let tmpLines = [];
		tmpLines.push('[\n');
		for (let i = 0; i < tmpEntries.length; i++)
		{
			let tmpEntry = tmpEntries[i];
			tmpLines.push('\t\t{\n');
			tmpLines.push('Hash: "' + tmpEntry.Hash.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '",\n');
			tmpLines.push('Template: /*html*/`\n');
			tmpLines.push(tmpEntry.Template);
			if (!tmpEntry.Template.endsWith('\n'))
			{
				tmpLines.push('\n');
			}
			tmpLines.push('`\n');
			tmpLines.push('\t\t}');
			if (i < tmpEntries.length - 1)
			{
				tmpLines.push(',');
			}
			tmpLines.push('\n');
		}
		tmpLines.push('\t]\n');

		let tmpSiteHash = window.location.hostname.replace(/[^a-zA-Z0-9]/g, '_');

		let tmpContent = tmpLines.join('');
		let tmpBlob = new Blob([tmpContent], { type: 'application/javascript' });
		let tmpURL = URL.createObjectURL(tmpBlob);

		let tmpLink = document.createElement('a');
		tmpLink.href = tmpURL;
		tmpLink.download = 'PictTemplates-' + tmpSiteHash + '.js';
		document.body.appendChild(tmpLink);
		tmpLink.click();
		document.body.removeChild(tmpLink);
		URL.revokeObjectURL(tmpURL);

		this.log.info(`Exported ${tmpEntries.length} template override(s) as JS`);
	}
}

module.exports = PictPanelTemplateOverrides;
module.exports.default_configuration = _ViewConfiguration;
