const libPictView = require('pict-view');

const _ViewConfiguration = (
	{
		ViewIdentifier: "Pict-Panel-TemplateBrowser",

		DefaultRenderable: "PP-TemplateBrowser",
		DefaultDestinationAddress: "#Pict-Panel .pp_content",

		AutoRender: false,
		AutoSolveWithApp: false,

		Templates: [
			{
				Hash: "PP-TemplateBrowser",
				Template: /*HTML*/`
				<div class="pp_tb_container">
					<div class="pp_adb_header">
						<span class="pp_adb_header_label">Templates</span>
						<div class="pp_adb_header_actions">
							<a href="#" class="pp_adb_action_btn pp_adb_refresh_btn" onclick="_Pict.views['PP-TB'].render(); return false;" title="Refresh">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M320 146s24.36-12-64-12a160 160 0 10160 160"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 58l80 80-80 80"/></svg>
							</a>
						</div>
					</div>
					<div class="pp_tb_filter">
						<input type="text" class="pp_tb_filter_input" id="pp_tb_filter_input" placeholder="filter templates..." oninput="_Pict.views['PP-TB'].filterTemplates(this.value);" />
					</div>
					<div class="pp_tb_editor" id="pp_tb_editor" style="display:none;">
						<div class="pp_tb_editor_header">
							<span class="pp_tb_editor_hash" id="pp_tb_editor_hash"></span>
							<div class="pp_adb_header_actions">
								<a href="#" class="pp_adb_action_btn pp_adb_editor_save" onclick="_Pict.views['PP-TB'].saveTemplate(); return false;">save</a>
								<a href="#" class="pp_adb_action_btn pp_adb_editor_cancel" onclick="_Pict.views['PP-TB'].closeEditor(); return false;">cancel</a>
							</div>
						</div>
						<textarea class="pp_adb_editor_textarea pp_tb_editor_textarea" id="pp_tb_editor_textarea"></textarea>
					</div>
					<div class="pp_tb_list" id="pp_tb_list">
					</div>
				</div>
`
			},
			{
				Hash: "PP-TemplateEntry",
				Template: /*HTML*/`
				<div class="pp_tb_entry" data-i-hash="{~D:Record.Hash~}">
					<div class="pp_tb_entry_row">
						<span class="pp_tb_entry_hash">{~D:Record.Hash~}</span>
						<span class="pp_tb_entry_source">{~D:Record.Source~}</span>
						<a href="#" class="pp_adb_action_btn" onclick="_Pict.views['PP-TB'].editTemplate('{~D:Record.Hash~}'); return false;" title="Edit template">ed</a>
					</div>
					<div class="pp_tb_entry_preview">{~D:Record.Preview~}</div>
				</div>
`
			}
		],
		Renderables: [
			{
				RenderableHash: "PP-TemplateBrowser",
				TemplateHash: "PP-TemplateBrowser",
				ContentDestinationAddress: "#Pict-Panel .pp_content"
			}]
	});

class PictPanelTemplateBrowser extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.currentFilter = '';
		this.editingHash = false;
	}

	onAfterRender()
	{
		this.renderTemplateList();
	}

	getTemplateEntries()
	{
		let tmpTemplates = this.pict.TemplateProvider.templates;
		let tmpSources = this.pict.TemplateProvider.templateSources;
		let tmpHashes = Object.keys(tmpTemplates);

		let tmpEntries = [];
		for (let i = 0; i < tmpHashes.length; i++)
		{
			let tmpHash = tmpHashes[i];
			let tmpTemplate = tmpTemplates[tmpHash];
			let tmpSource = tmpSources[tmpHash] || '';

			// Build a one-line preview
			let tmpPreview = '';
			if (typeof(tmpTemplate) === 'string')
			{
				tmpPreview = tmpTemplate.replace(/[\t\n\r]+/g, ' ').trim();
				if (tmpPreview.length > 120)
				{
					tmpPreview = tmpPreview.substring(0, 117) + '...';
				}
			}

			// Escape HTML in preview so it renders as text
			tmpPreview = tmpPreview.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

			tmpEntries.push(
				{
					Hash: tmpHash,
					Source: tmpSource,
					Preview: tmpPreview
				});
		}

		// Sort alphabetically by hash
		tmpEntries.sort(function(a, b) { return a.Hash.localeCompare(b.Hash); });

		return tmpEntries;
	}

	renderTemplateList()
	{
		let tmpEntries = this.getTemplateEntries();

		// Apply filter
		if (this.currentFilter)
		{
			let tmpFilterLower = this.currentFilter.toLowerCase();
			tmpEntries = tmpEntries.filter(function(pEntry)
			{
				return pEntry.Hash.toLowerCase().indexOf(tmpFilterLower) >= 0
					|| pEntry.Source.toLowerCase().indexOf(tmpFilterLower) >= 0
					|| pEntry.Preview.toLowerCase().indexOf(tmpFilterLower) >= 0;
			});
		}

		let tmpOutput = '';
		if (tmpEntries.length > 0)
		{
			tmpOutput = this.pict.parseTemplateSetByHash('PP-TemplateEntry', tmpEntries, null, [this]);
		}
		else
		{
			tmpOutput = '<div class="pp_tb_empty">No templates match filter.</div>';
		}

		this.pict.ContentAssignment.assignContent('#pp_tb_list', tmpOutput);
	}

	filterTemplates(pFilterText)
	{
		this.currentFilter = pFilterText;
		this.renderTemplateList();
	}

	editTemplate(pHash)
	{
		let tmpTemplate = this.pict.TemplateProvider.getTemplate(pHash);
		if (tmpTemplate === null)
		{
			this.log.error(`Template [${pHash}] not found.`);
			return;
		}

		this.editingHash = pHash;

		let tmpEditor = document.getElementById('pp_tb_editor');
		let tmpTextarea = document.getElementById('pp_tb_editor_textarea');
		let tmpHashLabel = document.getElementById('pp_tb_editor_hash');
		if (!tmpEditor || !tmpTextarea) return;

		tmpHashLabel.textContent = pHash;
		tmpTextarea.value = tmpTemplate;
		tmpEditor.style.display = 'block';
		tmpTextarea.focus();
	}

	saveTemplate()
	{
		if (!this.editingHash) return;

		let tmpTextarea = document.getElementById('pp_tb_editor_textarea');
		if (!tmpTextarea) return;

		let tmpNewContent = tmpTextarea.value;

		// Snapshot the original and persist the override
		let tmpOverrideStorage = this.pict.providers['PP-TemplateOverrideStorage'];
		if (tmpOverrideStorage)
		{
			let tmpOriginal = this.pict.TemplateProvider.getTemplate(this.editingHash);
			tmpOverrideStorage.saveOverride(this.editingHash, tmpOriginal, tmpNewContent);
		}

		this.pict.TemplateProvider.addTemplate(this.editingHash, tmpNewContent);
		this.log.info(`Template [${this.editingHash}] updated.`);

		this.closeEditor();
		this.renderTemplateList();
	}

	closeEditor()
	{
		let tmpEditor = document.getElementById('pp_tb_editor');
		if (tmpEditor) tmpEditor.style.display = 'none';
		this.editingHash = false;
	}
}

module.exports = PictPanelTemplateBrowser;
module.exports.default_configuration = _ViewConfiguration;
