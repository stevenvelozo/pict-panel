const libPictView = require('pict-view');

const _ViewConfiguration = (
	{
		ViewIdentifier: "Pict-Panel-Nav",

		DefaultRenderable: "PP-Nav",
		DefaultDestinationAddress: "#Pict-Panel .pp_nav_elements",

		AutoRender: false,
		AutoSolveWithApp: false,

		Templates: [
			{
				Hash: "PP-Nav",
				Template: require('../html/PP-Nav-HTML.js').HTML
			}
		],
		Renderables: [
			{
				RenderableHash: "PP-Nav",
				TemplateHash: "PP-Nav",
				ContentDestinationAddress: "#Pict-Panel .pp_nav_elements"
			}]
	});

class PictPanelNav extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender()
	{
		// Show the last view we had loaded
		this.pict.views['PP-ADB'].render();
	}
}

module.exports = PictPanelNav;
module.exports.default_configuration = _ViewConfiguration;