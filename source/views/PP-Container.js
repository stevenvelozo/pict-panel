const libPictView = require('pict-view');

const _ViewConfiguration = (
	{
		ViewIdentifier: "PP-Panel",

		DefaultRenderable: "Pict-Panel-Container",
		DefaultDestinationAddress: "body",

		AutoRender: false,
		AutoSolveWithApp: false,

		Templates: [
			{
				Hash: "Pict-Panel-Container",
				Template: /*html*/`<div id="Pict-Panel-Container"></div>`
			}
		],
		Renderables: [
			{
				RenderableHash: "Pict-Panel-Container",
				TemplateHash: "Pict-Panel-Container",
				ContentDestinationAddress: "body",
				RenderMethod: "append_once",
				TestAddress: "#Pict-Panel-Container"
			}]
	});

class PictPanelContainer extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onBeforeRender()
	{
		this.pict.providers['PP-CSS-Hotloader'].hotloadCSS();
	}

	onAfterRender()
	{
		this.pict.views['PP-Main'].render();
		return super.onAfterRender();
	}
}

module.exports = PictPanelContainer;
module.exports.default_configuration = _ViewConfiguration;