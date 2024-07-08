const libPictView = require('pict-view');

const _ViewConfiguration = (
	{
		ViewIdentifier: "PP-Main",

		DefaultRenderable: "PP-Main",
		DefaultDestinationAddress: "#Pict-Panel-Container",

		AutoRender: false,
		AutoSolveWithApp: false,

		Templates: [
			{
				Hash: "PP-Main",
				Template: require('../html/PP-Main-HTML.js').HTML,
			}
		],
		Renderables: [
			{
				RenderableHash: "PP-Main",
				TemplateHash: "PP-Main",
				ContentDestinationAddress: "#Pict-Panel-Container"
			}]
	});

class PictPanelMain extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.uiState = {
			Wired: false,

			Behaviors:
			{
				// Put the panel in tab mode
				tab_mode: false,
				// Make the panel header big or small
				maximize_mode: false,
				// Lock the position of the panel.
				lock_position: false,
				// Pin current top location to the top of the screen.
				pin_top: false,
				// Pin current right location to the right side of the screen.
				pin_right: true,
				night_mode: false,
				resize_handle: true,
				show_ui: true,
				show_navigation: true,
				visible: true
			},

			ManualTop: 0,
			ManualLeft: 0,
			ManualWidth: 300
		};
	}

	onAfterRender()
	{
		// After rendering the panel, wire up the drag events.
		this.wireDragEvents();

		// Render the navigation
		this.pict.views['PP-Nav'].render();

		return super.onAfterRender();
	}

	updateUIBehaviorDisplay(pBehaviorHash)
	{
		let tmpBehaviorToggleElementAddress = `#Pict-Panel [data-i-toggle=${pBehaviorHash}]`;
		let tmpBehaviorToggleElement = this.pict.ContentAssignment.getElement(tmpBehaviorToggleElementAddress);
		if (!tmpBehaviorToggleElement) return;

		let tmpBehaviorState = this.uiState.Behaviors[pBehaviorHash];
		if (tmpBehaviorState)
		{
			if (this.pict.ContentAssignment.hasClass(tmpBehaviorToggleElementAddress, "unchecked"))
			{
				this.pict.ContentAssignment.removeClass(tmpBehaviorToggleElementAddress, "unchecked")
			}
			if (!this.pict.ContentAssignment.hasClass(tmpBehaviorToggleElementAddress, "checked"))
			{
				this.pict.ContentAssignment.addClass(tmpBehaviorToggleElementAddress, "checked")
			}
		}
		else
		{
			if (this.pict.ContentAssignment.hasClass(tmpBehaviorToggleElementAddress, "checked"))
			{
				this.pict.ContentAssignment.removeClass(tmpBehaviorToggleElementAddress, "checked")
			}
			if (!this.pict.ContentAssignment.hasClass(tmpBehaviorToggleElementAddress, "unchecked"))
			{
				this.pict.ContentAssignment.addClass(tmpBehaviorToggleElementAddress, "unchecked")
			}
		}
	}

	toggleUIBehavior(pBehaviorHash)
	{
		this.log.trace(`Toggling behavior ${pBehaviorHash} ...`);
		this.uiState.Behaviors[pBehaviorHash] = !this.uiState.Behaviors[pBehaviorHash];
		this.updateUIBehaviorDisplay(pBehaviorHash);
	}

	initializePanelIcons()
	{
		let tmpBehaviors = Object.keys(this.uiState.Behaviors);
		for (let i = 0; i < tmpBehaviors.length; i++)
		{
			this.updateUIBehaviorDisplay(tmpBehaviors[i]);
		}
	}

	wireDragEvents()
	{
		if (this.uiState.Wired) return;

		let __View = this;

		// Setup the draggable behavior for the window
		let tmpPanelElement = document.getElementById('Pict-Panel');
		let tmpPanelDragElement = document.getElementById('Pict-Panel-Drag');
		if (!tmpPanelElement) return;
		if (!tmpPanelDragElement) return;

		tmpPanelDragElement.addEventListener('mousedown',
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * BEGIN of browser event code block
			 *
			 * The below code is meant to run in response to a browser event.
			 * --> Therefore the "this" context is the element that fired the event.
			 * --> There is passed in a "__View" reference to this view.
			 * --> Happy trails.
			 */
			function (pEvent)
			{
				let tmpOffsetX = pEvent.offsetX + tmpPanelDragElement.clientLeft;
				let tmpOffsetY = pEvent.offsetY + tmpPanelDragElement.clientTop;
				function dragHandler(pEvent)
				{
					pEvent.stopPropagation();
					
					if (__View.uiState.Behaviors.lock_position) return;

					tmpPanelElement.style.left = (pEvent.clientX - tmpOffsetX) + 'px';
					tmpPanelElement.style.top = (pEvent.clientY - tmpOffsetY) + 'px';

					
				}
				function dragStop(pEvent)
				{
					window.removeEventListener('pointermove', dragHandler);
					window.removeEventListener('pointerup', dragStop);
				}
				window.addEventListener('pointermove', dragHandler);
				window.addEventListener('pointerup', dragStop);
			});
			/*
			 * END of browser event code block
			 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

		// .addEventListener("dblclick",
		// 

		let tmpUIBehaviorIcons = this.pict.ContentAssignment.getElement('#Pict-Panel .pp_sz_con div');
		for (let i = 0; i < tmpUIBehaviorIcons.length; i++)
		{
			/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
			 * START of browser event code block
			 *
			 * Same same as above.
			 */
			tmpUIBehaviorIcons[i].addEventListener('click',
				function (pEvent)
				{
					if (('currentTarget' in pEvent) && ('attributes' in pEvent.currentTarget))
					{
						let tmpToggleProperty = pEvent.currentTarget.attributes['data-i-toggle'];
						__View.toggleUIBehavior(tmpToggleProperty.value);
					}
					else
					{
						__View.log.error(`Pict-Panel toggleUIBehavior handler received an invalid event object.`)
					}
				});
			/*
			 * END of browser event code block
			 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		}

		this.initializePanelIcons();

		this.uiState.Wired = true;
	}
}

module.exports = PictPanelMain;
module.exports.default_configuration = _ViewConfiguration;