const libPictView = require('pict-view');

const _ViewConfiguration = (
	{
		ViewIdentifier: "Pict-Panel-ViewBrowser",

		DefaultRenderable: "PP-ViewBrowser",
		DefaultDestinationAddress: "#Pict-Panel .pp_content",

		AutoRender: false,
		AutoSolveWithApp: false,

		Templates: [
			{
				Hash: "PP-ViewBrowser",
				Template: /*HTML*/`
				<div class="pp_sb_container" id="pp_vb_container">
					<div class="pp_adb_header">
						<span class="pp_adb_header_label">Views</span>
						<div class="pp_adb_header_actions">
							<a href="#" class="pp_adb_action_btn pp_adb_refresh_btn" onclick="_Pict.views['PP-VB'].showList(); return false;" title="Refresh">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M320 146s24.36-12-64-12a160 160 0 10160 160"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 58l80 80-80 80"/></svg>
							</a>
						</div>
					</div>
					<div class="pp_sb_body" id="pp_vb_body">
					</div>
				</div>
`
			},
			{
				Hash: "PP-ViewEntry",
				Template: /*HTML*/`
				<div class="pp_sb_entry">
					<div class="pp_sb_entry_row">
						<a href="#" class="pp_sb_entry_hash" onclick="_Pict.views['PP-VB'].showDetail('{~D:Record.Hash~}'); return false;">{~D:Record.Hash~}</a>
						<span class="pp_sb_entry_info">{~D:Record.Info~}</span>
						<a href="#" class="pp_sb_action_icon" onclick="_Pict.views['{~D:Record.Hash~}'].render(); return false;" title="Render (sync)">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12"><path d="M133 440a35.37 35.37 0 01-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0135.77.45l247.85 148.36a36 36 0 010 61l-247.89 148.4A35.5 35.5 0 01133 440z" fill="currentColor"/></svg>
						</a>
						<a href="#" class="pp_sb_action_icon" onclick="_Pict.views['{~D:Record.Hash~}'].renderAsync(function(){}); return false;" title="Render (async)">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12"><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48z"/><path fill="currentColor" d="M200 168v176l144-88-144-88z"/></svg>
						</a>
					</div>
				</div>
`
			},
			{
				Hash: "PP-ViewDetail",
				Template: /*HTML*/`
				<div class="pp_sb_detail">
					<div class="pp_sb_detail_header">
						<a href="#" class="pp_sb_back_btn" onclick="_Pict.views['PP-VB'].showList(); return false;" title="Back to list">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>
						</a>
						<span class="pp_sb_detail_hash">{~D:Record.Hash~}</span>
					</div>
					<div class="pp_sb_vitals">
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">UUID</span><span class="pp_sb_vital_val">{~D:Record.UUID~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Destination</span><span class="pp_sb_vital_val">{~D:Record.DefaultDestination~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Renderable</span><span class="pp_sb_vital_val">{~D:Record.DefaultRenderable~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">AutoRender</span><span class="pp_sb_vital_val">{~D:Record.AutoRender~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">AutoSolve</span><span class="pp_sb_vital_val">{~D:Record.AutoSolve~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Initialized</span><span class="pp_sb_vital_val">{~D:Record.InitTS~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Last Render</span><span class="pp_sb_vital_val">{~D:Record.RenderTS~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Last Solve</span><span class="pp_sb_vital_val">{~D:Record.SolveTS~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Last Marshal To</span><span class="pp_sb_vital_val">{~D:Record.MarshalToTS~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Last Marshal From</span><span class="pp_sb_vital_val">{~D:Record.MarshalFromTS~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Renderables</span><span class="pp_sb_vital_val">{~D:Record.RenderableCount~}</span></div>
						<div class="pp_sb_vital_row"><span class="pp_sb_vital_key">Templates</span><span class="pp_sb_vital_val">{~D:Record.TemplateCount~}</span></div>
					</div>
					<div class="pp_sb_detail_actions">
						<a href="#" class="pp_sb_detail_action_btn" onclick="_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','solve'); return false;" title="solve()">solve</a>
						<a href="#" class="pp_sb_detail_action_btn" onclick="_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','render'); return false;" title="render()">render</a>
						<a href="#" class="pp_sb_detail_action_btn" onclick="_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','renderAsync'); return false;" title="renderAsync()">renderAsync</a>
						<a href="#" class="pp_sb_detail_action_btn" onclick="_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','marshalToView'); return false;" title="marshalToView()">marshalTo</a>
						<a href="#" class="pp_sb_detail_action_btn" onclick="_Pict.views['PP-VB'].execViewAction('{~D:Record.Hash~}','marshalFromView'); return false;" title="marshalFromView()">marshalFrom</a>
					</div>
					<div class="pp_sb_detail_section_label">Templates</div>
					<div class="pp_sb_detail_templates" id="pp_vb_detail_templates">
					</div>
				</div>
`
			},
			{
				Hash: "PP-ViewDetailTemplate",
				Template: /*HTML*/`
				<div class="pp_sb_detail_tpl_entry">
					<span class="pp_sb_detail_tpl_hash">{~D:Record.Hash~}</span>
					<a href="#" class="pp_adb_action_btn" onclick="_Pict.views['PP-TB'].editTemplate('{~D:Record.Hash~}'); _Pict.providers['PP-Router'].navigateTo('PP-TB'); return false;" title="Edit in Template Browser">ed</a>
					<div class="pp_sb_detail_tpl_preview">{~D:Record.Preview~}</div>
				</div>
`
			}
		],
		Renderables: [
			{
				RenderableHash: "PP-ViewBrowser",
				TemplateHash: "PP-ViewBrowser",
				ContentDestinationAddress: "#Pict-Panel .pp_content"
			}]
	});

class PictPanelViewBrowser extends libPictView
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

	getViewEntries()
	{
		let tmpViews = this.pict.views;
		let tmpHashes = Object.keys(tmpViews);
		let tmpEntries = [];

		for (let i = 0; i < tmpHashes.length; i++)
		{
			let tmpHash = tmpHashes[i];
			let tmpView = tmpViews[tmpHash];

			let tmpInfo = '';
			if (tmpView.options && tmpView.options.DefaultDestinationAddress)
			{
				tmpInfo = tmpView.options.DefaultDestinationAddress;
			}

			tmpEntries.push({ Hash: tmpHash, Info: tmpInfo });
		}

		tmpEntries.sort(function(a, b) { return a.Hash.localeCompare(b.Hash); });
		return tmpEntries;
	}

	showList()
	{
		this.detailHash = false;
		let tmpEntries = this.getViewEntries();
		let tmpOutput = '';
		if (tmpEntries.length > 0)
		{
			tmpOutput = this.pict.parseTemplateSetByHash('PP-ViewEntry', tmpEntries, null, [this]);
		}
		else
		{
			tmpOutput = '<div class="pp_tb_empty">No views registered.</div>';
		}
		this.pict.ContentAssignment.assignContent('#pp_vb_body', tmpOutput);
	}

	formatTimestamp(pTimestamp)
	{
		if (!pTimestamp) return '--';
		let tmpDate = new Date(pTimestamp);
		return tmpDate.toLocaleTimeString();
	}

	showDetail(pHash)
	{
		let tmpView = this.pict.views[pHash];
		if (!tmpView) return;

		this.detailHash = pHash;

		let tmpTemplateCount = 0;
		if (tmpView.options && tmpView.options.Templates)
		{
			tmpTemplateCount = tmpView.options.Templates.length;
		}

		let tmpRenderableCount = 0;
		if (tmpView.renderables)
		{
			tmpRenderableCount = Object.keys(tmpView.renderables).length;
		}

		let tmpRecord = [
			{
				Hash: pHash,
				UUID: tmpView.UUID || '--',
				DefaultDestination: (tmpView.options && tmpView.options.DefaultDestinationAddress) || '--',
				DefaultRenderable: (tmpView.options && tmpView.options.DefaultRenderable) || '--',
				AutoRender: (tmpView.options && tmpView.options.AutoRender) ? 'true' : 'false',
				AutoSolve: (tmpView.options && tmpView.options.AutoSolveWithApp) ? 'true' : 'false',
				InitTS: this.formatTimestamp(tmpView.initializeTimestamp),
				RenderTS: this.formatTimestamp(tmpView.lastRenderedTimestamp),
				SolveTS: this.formatTimestamp(tmpView.lastSolvedTimestamp),
				MarshalToTS: this.formatTimestamp(tmpView.lastMarshalToViewTimestamp),
				MarshalFromTS: this.formatTimestamp(tmpView.lastMarshalFromViewTimestamp),
				RenderableCount: tmpRenderableCount,
				TemplateCount: tmpTemplateCount
			}];

		let tmpOutput = this.pict.parseTemplateSetByHash('PP-ViewDetail', tmpRecord, null, [this]);
		this.pict.ContentAssignment.assignContent('#pp_vb_body', tmpOutput);

		// Render the template list for this view
		this.renderDetailTemplates(tmpView);
	}

	renderDetailTemplates(pView)
	{
		let tmpTemplates = [];
		if (pView.options && pView.options.Templates)
		{
			for (let i = 0; i < pView.options.Templates.length; i++)
			{
				let tmpTpl = pView.options.Templates[i];
				let tmpContent = this.pict.TemplateProvider.getTemplate(tmpTpl.Hash) || '';
				let tmpPreview = '';
				if (typeof(tmpContent) === 'string')
				{
					tmpPreview = tmpContent.replace(/[\t\n\r]+/g, ' ').trim();
					if (tmpPreview.length > 100)
					{
						tmpPreview = tmpPreview.substring(0, 97) + '...';
					}
				}
				tmpPreview = tmpPreview.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

				tmpTemplates.push({ Hash: tmpTpl.Hash, Preview: tmpPreview });
			}
		}

		let tmpOutput = '';
		if (tmpTemplates.length > 0)
		{
			tmpOutput = this.pict.parseTemplateSetByHash('PP-ViewDetailTemplate', tmpTemplates, null, [this]);
		}
		else
		{
			tmpOutput = '<div class="pp_tb_empty">No templates.</div>';
		}
		this.pict.ContentAssignment.assignContent('#pp_vb_detail_templates', tmpOutput);
	}

	execViewAction(pHash, pAction)
	{
		let tmpView = this.pict.views[pHash];
		if (!tmpView) return;

		this.log.info(`Executing ${pAction}() on view [${pHash}]`);

		if (pAction === 'renderAsync')
		{
			tmpView.renderAsync(function() {});
		}
		else if (typeof(tmpView[pAction]) === 'function')
		{
			tmpView[pAction]();
		}

		// Refresh the detail view to show updated timestamps
		let __View = this;
		setTimeout(function() { if (__View.detailHash === pHash) __View.showDetail(pHash); }, 250);
	}
}

module.exports = PictPanelViewBrowser;
module.exports.default_configuration = _ViewConfiguration;
