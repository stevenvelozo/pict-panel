const libPictView = require('pict-view');

const _ViewConfiguration = (
	{
		ViewIdentifier: "Pict-Panel-ProviderBrowser",

		DefaultRenderable: "PP-ProviderBrowser",
		DefaultDestinationAddress: "#Pict-Panel .pp_content",

		AutoRender: false,
		AutoSolveWithApp: false,

		Templates: [
			{
				Hash: "PP-ProviderBrowser",
				Template: /*HTML*/`
				<div class="pp_sb_container" id="pp_pb_container">
					<div class="pp_adb_header">
						<span class="pp_adb_header_label">Providers</span>
						<div class="pp_adb_header_actions">
							<a href="#" class="pp_adb_action_btn pp_adb_refresh_btn" onclick="_Pict.views['PP-PB'].showList(); return false;" title="Refresh">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M320 146s24.36-12-64-12a160 160 0 10160 160"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 58l80 80-80 80"/></svg>
							</a>
						</div>
					</div>
					<div class="pp_sb_body" id="pp_pb_body">
					</div>
				</div>
`
			},
			{
				Hash: "PP-ProviderEntry",
				Template: /*HTML*/`
				<div class="pp_sb_entry">
					<div class="pp_sb_entry_row">
						<a href="#" class="pp_sb_entry_hash" onclick="_Pict.views['PP-PB'].showDetail('{~D:Record.Hash~}'); return false;">{~D:Record.Hash~}</a>
						<span class="pp_sb_entry_info">{~D:Record.Info~}</span>
					</div>
				</div>
`
			},
			{
				Hash: "PP-ProviderDetail",
				Template: /*HTML*/`
				<div class="pp_sb_detail">
					<div class="pp_sb_detail_header">
						<a href="#" class="pp_sb_back_btn" onclick="_Pict.views['PP-PB'].showList(); return false;" title="Back to list">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>
						</a>
						<span class="pp_sb_detail_hash">{~D:Record.Hash~}</span>
					</div>
					<div class="pp_sb_vitals">
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">UUID</span><span class="pp_sb_vital_val">{~D:Record.UUID~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">AutoInitialize</span><span class="pp_sb_vital_val">{~D:Record.AutoInit~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">AutoSolve</span><span class="pp_sb_vital_val">{~D:Record.AutoSolve~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Initialized</span><span class="pp_sb_vital_val">{~D:Record.InitTS~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Last Solve</span><span class="pp_sb_vital_val">{~D:Record.SolveTS~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Templates</span><span class="pp_sb_vital_val">{~D:Record.TemplateCount~}</span></div>
					</div>
					<div class="pp_sb_detail_actions">
						<a href="#" class="pp_sb_detail_action_btn" onclick="_Pict.views['PP-PB'].execProviderAction('{~D:Record.Hash~}','solve'); return false;" title="solve()">solve</a>
					</div>
					<div class="pp_sb_detail_section_label">Options</div>
					<div class="pp_sb_detail_options" id="pp_pb_detail_options">
					</div>
				</div>
`
			}
		],
		Renderables: [
			{
				RenderableHash: "PP-ProviderBrowser",
				TemplateHash: "PP-ProviderBrowser",
				ContentDestinationAddress: "#Pict-Panel .pp_content"
			}]
	});

class PictPanelProviderBrowser extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.detailHash = false;
	}

	onAfterRender()
	{
		this.showList();
	}

	getProviderEntries()
	{
		let tmpProviders = this.pict.providers;
		let tmpHashes = Object.keys(tmpProviders);
		let tmpEntries = [];

		for (let i = 0; i < tmpHashes.length; i++)
		{
			let tmpHash = tmpHashes[i];
			let tmpProvider = tmpProviders[tmpHash];

			let tmpInfo = tmpProvider.serviceType || '';

			tmpEntries.push({ Hash: tmpHash, Info: tmpInfo });
		}

		tmpEntries.sort(function(a, b) { return a.Hash.localeCompare(b.Hash); });
		return tmpEntries;
	}

	showList()
	{
		this.detailHash = false;
		let tmpEntries = this.getProviderEntries();
		let tmpOutput = '';
		if (tmpEntries.length > 0)
		{
			tmpOutput = this.pict.parseTemplateSetByHash('PP-ProviderEntry', tmpEntries, null, [this]);
		}
		else
		{
			tmpOutput = '<div class="pp_tb_empty">No providers registered.</div>';
		}
		this.pict.ContentAssignment.assignContent('#pp_pb_body', tmpOutput);
	}

	formatTimestamp(pTimestamp)
	{
		if (!pTimestamp) return '--';
		let tmpDate = new Date(pTimestamp);
		return tmpDate.toLocaleTimeString();
	}

	showDetail(pHash)
	{
		let tmpProvider = this.pict.providers[pHash];
		if (!tmpProvider) return;

		this.detailHash = pHash;

		let tmpTemplateCount = 0;
		if (tmpProvider.options && tmpProvider.options.Templates)
		{
			tmpTemplateCount = tmpProvider.options.Templates.length;
		}

		let tmpRecord = [
			{
				Hash: pHash,
				UUID: tmpProvider.UUID || '--',
				AutoInit: (tmpProvider.options && tmpProvider.options.AutoInitialize) ? 'true' : 'false',
				AutoSolve: (tmpProvider.options && tmpProvider.options.AutoSolveWithApp) ? 'true' : 'false',
				InitTS: this.formatTimestamp(tmpProvider.initializeTimestamp),
				SolveTS: this.formatTimestamp(tmpProvider.lastSolvedTimestamp),
				TemplateCount: tmpTemplateCount
			}];

		let tmpOutput = this.pict.parseTemplateSetByHash('PP-ProviderDetail', tmpRecord, null, [this]);
		this.pict.ContentAssignment.assignContent('#pp_pb_body', tmpOutput);

		// Show a summary of options (non-function, non-template keys)
		this.renderDetailOptions(tmpProvider);
	}

	renderDetailOptions(pProvider)
	{
		if (!pProvider.options) return;

		let tmpKeys = Object.keys(pProvider.options);
		let tmpOutput = '<div class="pp_sb_detail_opts_list">';

		for (let i = 0; i < tmpKeys.length; i++)
		{
			let tmpKey = tmpKeys[i];
			let tmpVal = pProvider.options[tmpKey];

			// Skip large objects and arrays (Templates, Manifests, etc.)
			if (tmpKey === 'Templates' || tmpKey === 'DefaultTemplates' || tmpKey === 'Manifests') continue;
			if (typeof(tmpVal) === 'function') continue;

			let tmpDisplayVal = '';
			if (tmpVal === null)
			{
				tmpDisplayVal = '<span class="pp_adb_value_null">null</span>';
			}
			else if (typeof(tmpVal) === 'object')
			{
				tmpDisplayVal = JSON.stringify(tmpVal).substring(0, 80);
				tmpDisplayVal = tmpDisplayVal.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}
			else if (typeof(tmpVal) === 'boolean')
			{
				tmpDisplayVal = '<span class="pp_adb_value_boolean">' + String(tmpVal) + '</span>';
			}
			else if (typeof(tmpVal) === 'number')
			{
				tmpDisplayVal = '<span class="pp_adb_value_number">' + tmpVal + '</span>';
			}
			else
			{
				let tmpStr = String(tmpVal);
				if (tmpStr.length > 60)
				{
					tmpStr = tmpStr.substring(0, 57) + '...';
				}
				tmpDisplayVal = tmpStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}

			tmpOutput += '<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">' + tmpKey + '</span><span class="pp_sb_vital_val">' + tmpDisplayVal + '</span></div>';
		}

		tmpOutput += '</div>';
		this.pict.ContentAssignment.assignContent('#pp_pb_detail_options', tmpOutput);
	}

	execProviderAction(pHash, pAction)
	{
		let tmpProvider = this.pict.providers[pHash];
		if (!tmpProvider) return;

		this.log.info(`Executing ${pAction}() on provider [${pHash}]`);

		if (typeof(tmpProvider[pAction]) === 'function')
		{
			tmpProvider[pAction]();
		}

		// Refresh the detail view to show updated timestamps
		let __View = this;
		setTimeout(function() { if (__View.detailHash === pHash) __View.showDetail(pHash); }, 250);
	}
}

module.exports = PictPanelProviderBrowser;
module.exports.default_configuration = _ViewConfiguration;
