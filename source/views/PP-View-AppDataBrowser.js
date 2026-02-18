const libPictView = require('pict-view');
const libPictTemplate = require('pict-template');

const _ViewConfiguration = (
	{
		ViewIdentifier: "Pict-Panel-AppDataBrowser",

		DefaultRenderable: "PP-AppDataBrowser",
		DefaultDestinationAddress: "#Pict-Panel .pp_content",

		AutoRender: false,
		AutoSolveWithApp: false,

		Templates: [
			{
				Hash: "PP-AppDataBrowser",
				Template: /*HTML*/`
				<div class="pp_adb_container">
					<div class="pp_adb_header">
						<span class="pp_adb_header_label">AppData</span>
						<div class="pp_adb_header_actions">
							<a href="#" class="pp_adb_action_btn" onclick="_Pict.views['PP-ADB'].downloadAppData(); return false;" title="Download AppData as JSON">dl</a>
							<a href="#" class="pp_adb_action_btn" onclick="_Pict.views['PP-ADB'].editAppData(); return false;" title="Edit AppData JSON">ed</a>
							<a href="#" class="pp_adb_action_btn pp_adb_refresh_btn" onclick="_Pict.views['PP-ADB'].render(); return false;" title="Refresh">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M320 146s24.36-12-64-12a160 160 0 10160 160"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 58l80 80-80 80"/></svg>
							</a>
						</div>
					</div>
					<div class="pp_adb_editor" id="pp_adb_editor" style="display:none;">
						<textarea class="pp_adb_editor_textarea" id="pp_adb_editor_textarea"></textarea>
						<div class="pp_adb_editor_actions">
							<a href="#" class="pp_adb_action_btn pp_adb_editor_save" onclick="_Pict.views['PP-ADB'].saveAppData(); return false;">save</a>
							<a href="#" class="pp_adb_action_btn pp_adb_editor_cancel" onclick="_Pict.views['PP-ADB'].closeEditor(); return false;">cancel</a>
						</div>
					</div>
					<div class="pp_adb_root pp_adb_target" data-i-objectpath="{~D:Context[0].rootAddress~}" data-i-parentpath="">
					</div>
				</div>
`
			},
			{
				Hash: "PP-AppDataEntry-Leaf",
				Template: /*HTML*/`
				<div class="pp_adb_entry pp_adb_leaf">
					<div class="pp_adb_datarow">
						<div class="pp_adb_record_metadata">
							<span class="pp_adb_key">{~D:Record.Key~}</span>
							<span class="pp_adb_type">{~D:Record.DataType~}</span>
						</div>
						<div class="pp_adb_record_data">
							<span class="pp_adb_value pp_adb_value_{~D:Record.DataType~}">{~D:Record.Value~}</span>
						</div>
					</div>
				</div>
`
			},
			{
				Hash: "PP-AppDataEntry-Branch",
				Template: /*HTML*/`
				<div class="pp_adb_entry pp_adb_branch">
					<div class="pp_adb_datarow pp_adb_expandable" onclick="_Pict.views['PP-ADB'].toggleChildTree('{~D:Record.ParentPath~}','{~D:Record.ObjectPath~}','{~D:Record.Key~}'); return false;">
						<div class="pp_adb_record_metadata">
							<span class="pp_adb_expand_icon pp_adb_collapsed">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M184 112l144 144-144 144"/></svg>
							</span>
							<span class="pp_adb_key">{~D:Record.Key~}</span>
							<span class="pp_adb_type">{~D:Record.DataType~}</span>
							<span class="pp_adb_count">{~D:Record.ChildCount~}</span>
						</div>
					</div>
					<div class="pp_adb_children pp_adb_target" data-i-objectpath="{~D:Record.ObjectPath~}" data-i-parentpath="{~D:Record.ParentPath~}" style="display:none;">
					</div>
				</div>
`
			}
		],
		Renderables: [
			{
				RenderableHash: "PP-AppDataBrowser",
				TemplateHash: "PP-AppDataBrowser",
				ContentDestinationAddress: "#Pict-Panel .pp_content"
			}]
	});

class PictPanelAppDataBrowser extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.prototypeTemplate = new libPictTemplate(this.pict, libPictTemplate.default_configuration);

		this.rootAddress = 'AppData';
	}

	onAfterRender()
	{
		return this.renderChildTree('', this.rootAddress, '');
	}

	downloadAppData()
	{
		let tmpData = JSON.stringify(this.pict.AppData, null, '\t');
		let tmpBlob = new Blob([tmpData], { type: 'application/json' });
		let tmpURL = URL.createObjectURL(tmpBlob);
		let tmpLink = document.createElement('a');
		tmpLink.href = tmpURL;
		tmpLink.download = 'AppData.json';
		document.body.appendChild(tmpLink);
		tmpLink.click();
		document.body.removeChild(tmpLink);
		URL.revokeObjectURL(tmpURL);
	}

	editAppData()
	{
		let tmpEditor = document.getElementById('pp_adb_editor');
		let tmpTextarea = document.getElementById('pp_adb_editor_textarea');
		if (!tmpEditor || !tmpTextarea) return;

		tmpTextarea.value = JSON.stringify(this.pict.AppData, null, '\t');
		tmpEditor.style.display = 'block';
		tmpTextarea.focus();
	}

	saveAppData()
	{
		let tmpTextarea = document.getElementById('pp_adb_editor_textarea');
		if (!tmpTextarea) return;

		try
		{
			let tmpNewData = JSON.parse(tmpTextarea.value);
			// Replace AppData contents
			let tmpKeys = Object.keys(this.pict.AppData);
			for (let i = 0; i < tmpKeys.length; i++)
			{
				delete this.pict.AppData[tmpKeys[i]];
			}
			Object.assign(this.pict.AppData, tmpNewData);
			this.closeEditor();
			this.render();
		}
		catch (pError)
		{
			this.log.error('Invalid JSON: ' + pError.message);
			tmpTextarea.classList.add('pp_adb_editor_error');
			setTimeout(() => { tmpTextarea.classList.remove('pp_adb_editor_error'); }, 1500);
		}
	}

	closeEditor()
	{
		let tmpEditor = document.getElementById('pp_adb_editor');
		if (tmpEditor) tmpEditor.style.display = 'none';
	}

	getValueSummary(pValue)
	{
		if (pValue === null)
		{
			return 'null';
		}
		if (pValue === undefined)
		{
			return 'undefined';
		}
		if (Array.isArray(pValue))
		{
			return `Array(${pValue.length})`;
		}
		if (typeof(pValue) === 'object')
		{
			let tmpKeys = Object.keys(pValue);
			return `{${tmpKeys.length} keys}`;
		}
		let tmpStr = String(pValue);
		if (tmpStr.length > 80)
		{
			return tmpStr.substring(0, 77) + '...';
		}
		return tmpStr;
	}

	isExpandable(pValue)
	{
		if (pValue === null || pValue === undefined)
		{
			return false;
		}
		if (Array.isArray(pValue))
		{
			return pValue.length > 0;
		}
		if (typeof(pValue) === 'object')
		{
			return Object.keys(pValue).length > 0;
		}
		return false;
	}

	getDataType(pValue)
	{
		if (pValue === null)
		{
			return 'null';
		}
		if (Array.isArray(pValue))
		{
			return 'array';
		}
		return typeof(pValue);
	}

	getChildCount(pValue)
	{
		if (Array.isArray(pValue))
		{
			return `[${pValue.length}]`;
		}
		if (typeof(pValue) === 'object' && pValue !== null)
		{
			return `{${Object.keys(pValue).length}}`;
		}
		return '';
	}

	toggleChildTree(pParentPath, pObjectPath, pKey)
	{
		let tmpTargetElementAddress = `#Pict-Panel div.pp_adb_target[data-i-parentpath="${pParentPath}"][data-i-objectpath="${pObjectPath}"]`;
		let tmpTargetElement = this.pict.ContentAssignment.getElement(tmpTargetElementAddress);

		if (!tmpTargetElement || !tmpTargetElement.length)
		{
			this.log.error(`PP ADB could not find target element for Parent[${pParentPath}] Object[${pObjectPath}] key [${pKey}].`);
			return false;
		}

		let tmpElement = tmpTargetElement[0];
		let tmpParentEntry = tmpElement.closest('.pp_adb_branch');
		let tmpExpandIcon = tmpParentEntry ? tmpParentEntry.querySelector('.pp_adb_expand_icon') : null;

		if (tmpElement.style.display === 'none')
		{
			// Expand: render children if not yet populated
			if (tmpElement.innerHTML.trim() === '')
			{
				this.renderChildTree(pParentPath, pObjectPath, pKey);
			}
			tmpElement.style.display = 'block';
			if (tmpExpandIcon)
			{
				tmpExpandIcon.classList.remove('pp_adb_collapsed');
				tmpExpandIcon.classList.add('pp_adb_expanded');
			}
		}
		else
		{
			// Collapse
			tmpElement.style.display = 'none';
			if (tmpExpandIcon)
			{
				tmpExpandIcon.classList.remove('pp_adb_expanded');
				tmpExpandIcon.classList.add('pp_adb_collapsed');
			}
		}
	}

	renderChildTree(pParentPath, pObjectPath, pKey)
	{
		let tmpTargetElementAddress = `#Pict-Panel div.pp_adb_target[data-i-parentpath="${pParentPath}"][data-i-objectpath="${pObjectPath}"]`;
		let tmpTargetElement = this.pict.ContentAssignment.getElement(tmpTargetElementAddress);

		if (!tmpTargetElement)
		{
			this.log.error(`PP ADB could not find target element to render to for Parent[${pParentPath}] Object[${pObjectPath}] key [${pKey}].`);
			return false;
		}

		let tmpObject = this.prototypeTemplate.resolveStateFromAddress(pObjectPath);

		let tmpLeaves = [];
		let tmpBranches = [];

		if (Array.isArray(tmpObject))
		{
			for (let i = 0; i < tmpObject.length; i++)
			{
				let tmpValue = tmpObject[i];
				let tmpEntry = (
					{
						Key: i,
						Value: this.getValueSummary(tmpValue),
						ParentPath: pObjectPath,
						ObjectPath: `${pObjectPath}[${i}]`,
						DataType: this.getDataType(tmpValue),
						ChildCount: this.getChildCount(tmpValue)
					});

				if (this.isExpandable(tmpValue))
				{
					tmpBranches.push(tmpEntry);
				}
				else
				{
					tmpLeaves.push(tmpEntry);
				}
			}
		}
		else if (typeof(tmpObject) === 'object' && tmpObject !== null)
		{
			let tmpObjectEntries = Object.keys(tmpObject);
			for (let i = 0; i < tmpObjectEntries.length; i++)
			{
				let tmpValueKey = tmpObjectEntries[i];
				let tmpValue = tmpObject[tmpValueKey];

				let tmpEntry = (
					{
						Key: tmpValueKey,
						Value: this.getValueSummary(tmpValue),
						ParentPath: pObjectPath,
						ObjectPath: `${pObjectPath}.${tmpValueKey}`,
						DataType: this.getDataType(tmpValue),
						ChildCount: this.getChildCount(tmpValue)
					});

				if (this.isExpandable(tmpValue))
				{
					tmpBranches.push(tmpEntry);
				}
				else
				{
					tmpLeaves.push(tmpEntry);
				}
			}
		}
		else
		{
			// Scalar value at root -- show it directly
			let tmpOutput = `<div class="pp_adb_scalar_value">${this.getValueSummary(tmpObject)}</div>`;
			this.pict.ContentAssignment.assignContent(tmpTargetElementAddress, tmpOutput);
			return tmpOutput;
		}

		// Render leaves first (simple values), then branches (expandable)
		let tmpOutput = '';
		if (tmpLeaves.length > 0)
		{
			tmpOutput += this.pict.parseTemplateSetByHash('PP-AppDataEntry-Leaf', tmpLeaves, null, [this]);
		}
		if (tmpBranches.length > 0)
		{
			tmpOutput += this.pict.parseTemplateSetByHash('PP-AppDataEntry-Branch', tmpBranches, null, [this]);
		}

		this.pict.ContentAssignment.assignContent(tmpTargetElementAddress, tmpOutput);

		return tmpOutput;
	}
}

module.exports = PictPanelAppDataBrowser;
module.exports.default_configuration = _ViewConfiguration;