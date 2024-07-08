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
				<div>
					<h4><span>[ .</span>AppData<span>. ]</span></h4>
					<div class="pp_adb_root pp_adb_target" data-i-objectpath="{~D:Context[0].rootAddress~}" data-i-parentpath="">
					</div>
				</div>
`
			},
			{
				Hash: "PP-AppDataEntry",
				Template: /*HTML*/`
				<div class="pp_adb_entry">
					<div class="pp_adb_datarow">
						<div class="pp_adb_record_metadata">
							<span class="pp_adb_key">{~D:Record.Key~}:</span>
							<span class="pp_adb_type">{~D:Record.DataType~}</span>
						</div>
						<div class="pp_adb_record_data">
							<div class="pp_adb_value">{~D:Record.Value~}</div>
						</div>
						<div class="pp_adb_menu">
							<a href="#" onclick="_Pict.views['PP-ADB'].renderChildTree('{~D:Record.ParentPath~}','{~D:Record.ObjectPath~}','{~D:Record.Key~}')">
								<svg xmlns="http://www.w3.org/2000/svg" class="pp_adb_menu_icon" viewBox="0 0 512 512"><circle cx="256" cy="256" r="26"/><circle cx="256" cy="346" r="26"/><circle cx="256" cy="166" r="26"/><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>
							</a>
						</div>
					</div>
					<div class="pp_adb_target" data-i-objectpath="{~D:Record.ObjectPath~}"  data-i-parentpath="{~D:Record.ParentPath~}"></div>
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

		let tmpResult = [];

		if (typeof(tmpObject) === 'array')
		{
			for (let i = 0; i < tmpObject.length; i++)
			{
				let tmpValue = tmpObject[i];

				tmpResult.push(
					{
						Key: i,
						Value: tmpValue,
						ParentPath: pObjectPath,
						ObjectPath: `${pObjectPath}[${i}]`,
						DataType: typeof(tmpValue)
					});
			}
		}
		else if (typeof(tmpObject) === 'object')
		{
			let tmpObjectEntries = Object.keys(tmpObject);
			for (let i = 0; i < tmpObjectEntries.length; i++)
			{
				let tmpValueKey = tmpObjectEntries[i];
				let tmpValue = tmpObject[tmpValueKey];

				tmpResult.push(
					{
						Key: tmpValueKey,
						Value: tmpValue,
						ParentPath: pObjectPath,
						ObjectPath: `${pObjectPath}.${tmpValueKey}`,
						DataType: typeof(tmpValue)
					});
			}
		}

		let tmpOutput = this.pict.parseTemplateSetByHash('PP-AppDataEntry', tmpResult, null, [this]);

		this.pict.ContentAssignment.assignContent(tmpTargetElementAddress, tmpOutput);

		return tmpOutput;
	}
}

module.exports = PictPanelAppDataBrowser;
module.exports.default_configuration = _ViewConfiguration;