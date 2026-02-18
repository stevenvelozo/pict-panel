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
				pin_right: false,
				night_mode: false,
				resize_handle: true,
				show_ui: true,
				show_navigation: true,
				visible: true
			},

			ManualTop: 0,
			ManualLeft: 0,
			ManualWidth: 300,

			// Saved position/size before maximize
			SavedPosition: false,
			// Saved position/size before tab mode
			SavedTabPosition: false
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

		let tmpPanelElement = document.getElementById('Pict-Panel');
		if (!tmpPanelElement) return;

		if (pBehaviorHash === 'maximize_mode')
		{
			if (this.uiState.Behaviors.maximize_mode)
			{
				// Save current position and size before maximizing
				this.uiState.SavedPosition = {
					top: tmpPanelElement.style.top,
					left: tmpPanelElement.style.left,
					right: tmpPanelElement.style.right,
					width: tmpPanelElement.style.width,
					minWidth: tmpPanelElement.style.minWidth,
					maxWidth: tmpPanelElement.style.maxWidth,
					height: tmpPanelElement.style.height,
					maxHeight: tmpPanelElement.style.maxHeight
				};

				// Maximize with 15px padding on all sides
				tmpPanelElement.style.top = '15px';
				tmpPanelElement.style.left = '15px';
				tmpPanelElement.style.right = '15px';
				tmpPanelElement.style.width = 'calc(100vw - 30px)';
				tmpPanelElement.style.minWidth = '0';
				tmpPanelElement.style.maxWidth = 'none';
				tmpPanelElement.style.height = 'calc(100vh - 30px)';
				tmpPanelElement.style.maxHeight = 'none';
			}
			else
			{
				// Restore saved position and size
				if (this.uiState.SavedPosition)
				{
					tmpPanelElement.style.top = this.uiState.SavedPosition.top;
					tmpPanelElement.style.left = this.uiState.SavedPosition.left;
					tmpPanelElement.style.right = this.uiState.SavedPosition.right;
					tmpPanelElement.style.width = this.uiState.SavedPosition.width;
					tmpPanelElement.style.minWidth = this.uiState.SavedPosition.minWidth;
					tmpPanelElement.style.maxWidth = this.uiState.SavedPosition.maxWidth;
					tmpPanelElement.style.height = this.uiState.SavedPosition.height;
					tmpPanelElement.style.maxHeight = this.uiState.SavedPosition.maxHeight;
					this.uiState.SavedPosition = false;
				}
				else
				{
					// No saved position -- reset to defaults
					tmpPanelElement.style.top = '';
					tmpPanelElement.style.left = '';
					tmpPanelElement.style.right = '';
					tmpPanelElement.style.width = '';
					tmpPanelElement.style.minWidth = '';
					tmpPanelElement.style.maxWidth = '';
					tmpPanelElement.style.height = '';
					tmpPanelElement.style.maxHeight = '';
				}
			}
		}

		if (pBehaviorHash === 'tab_mode')
		{
			if (this.uiState.Behaviors.tab_mode)
			{
				// Save current position/size before collapsing
				this.uiState.SavedTabPosition = {
					top: tmpPanelElement.style.top,
					left: tmpPanelElement.style.left,
					right: tmpPanelElement.style.right,
					width: tmpPanelElement.style.width,
					minWidth: tmpPanelElement.style.minWidth,
					maxWidth: tmpPanelElement.style.maxWidth,
					height: tmpPanelElement.style.height,
					maxHeight: tmpPanelElement.style.maxHeight
				};
				// Clear inline styles so the CSS class takes effect
				tmpPanelElement.style.top = '';
				tmpPanelElement.style.left = '';
				tmpPanelElement.style.right = '';
				tmpPanelElement.style.width = '';
				tmpPanelElement.style.minWidth = '';
				tmpPanelElement.style.maxWidth = '';
				tmpPanelElement.style.height = '';
				tmpPanelElement.style.maxHeight = '';
				tmpPanelElement.classList.add('pp_tab_mode');
			}
			else
			{
				tmpPanelElement.classList.remove('pp_tab_mode');
				// Restore saved position/size
				if (this.uiState.SavedTabPosition)
				{
					tmpPanelElement.style.top = this.uiState.SavedTabPosition.top;
					tmpPanelElement.style.left = this.uiState.SavedTabPosition.left;
					tmpPanelElement.style.right = this.uiState.SavedTabPosition.right;
					tmpPanelElement.style.width = this.uiState.SavedTabPosition.width;
					tmpPanelElement.style.minWidth = this.uiState.SavedTabPosition.minWidth;
					tmpPanelElement.style.maxWidth = this.uiState.SavedTabPosition.maxWidth;
					tmpPanelElement.style.height = this.uiState.SavedTabPosition.height;
					tmpPanelElement.style.maxHeight = this.uiState.SavedTabPosition.maxHeight;
					this.uiState.SavedTabPosition = false;
				}
			}
		}

		if (pBehaviorHash === 'resize_handle')
		{
			if (this.uiState.Behaviors.resize_handle)
			{
				tmpPanelElement.classList.remove('pp_no_resize');
			}
			else
			{
				tmpPanelElement.classList.add('pp_no_resize');
			}
		}

		if (pBehaviorHash === 'pin_right')
		{
			if (this.uiState.Behaviors.pin_right)
			{
				tmpPanelElement.style.left = '';
				tmpPanelElement.style.right = '-3px';
			}
		}

		if (pBehaviorHash === 'pin_top')
		{
			if (this.uiState.Behaviors.pin_top)
			{
				tmpPanelElement.style.top = '-3px';
			}
		}

		if (pBehaviorHash === 'show_ui')
		{
			let tmpNavElement = tmpPanelElement.querySelector('.pp_nav');
			let tmpContentElement = tmpPanelElement.querySelector('.pp_content');
			let tmpDisplay = this.uiState.Behaviors.show_ui ? '' : 'none';
			if (tmpNavElement)
			{
				tmpNavElement.style.display = tmpDisplay;
			}
			if (tmpContentElement)
			{
				tmpContentElement.style.display = tmpDisplay;
			}
			// When maximized, collapse height to just the header bar
			if (this.uiState.Behaviors.maximize_mode)
			{
				if (!this.uiState.Behaviors.show_ui)
				{
					tmpPanelElement.style.height = 'auto';
					tmpPanelElement.style.maxHeight = 'none';
				}
				else
				{
					tmpPanelElement.style.height = 'calc(100vh - 30px)';
					tmpPanelElement.style.maxHeight = 'none';
				}
			}
		}

		if (pBehaviorHash === 'show_navigation')
		{
			let tmpNavElement = tmpPanelElement.querySelector('.pp_nav');
			if (tmpNavElement)
			{
				tmpNavElement.style.display = (this.uiState.Behaviors.show_navigation && this.uiState.Behaviors.show_ui) ? '' : 'none';
			}
		}

		if (pBehaviorHash === 'night_mode')
		{
			if (this.uiState.Behaviors.night_mode)
			{
				tmpPanelElement.classList.add('pp_dark_mode');
			}
			else
			{
				tmpPanelElement.classList.remove('pp_dark_mode');
			}
		}

		// Persist config after every toggle
		if (this.pict.providers['PP-ConfigStorage'])
		{
			this.pict.providers['PP-ConfigStorage'].save(this.uiState);
		}
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
				// In tab mode, clicking the logo expands the panel
				if (__View.uiState.Behaviors.tab_mode)
				{
					__View.toggleUIBehavior('tab_mode');
					return;
				}

				let tmpOffsetX = pEvent.offsetX + tmpPanelDragElement.clientLeft;
				let tmpOffsetY = pEvent.offsetY + tmpPanelDragElement.clientTop;
				function dragHandler(pEvent)
				{
					pEvent.stopPropagation();

					if (__View.uiState.Behaviors.lock_position) return;

					if (!__View.uiState.Behaviors.pin_right)
					{
						tmpPanelElement.style.right = '';
						tmpPanelElement.style.left = (pEvent.clientX - tmpOffsetX) + 'px';
					}
					if (!__View.uiState.Behaviors.pin_top)
					{
						tmpPanelElement.style.top = (pEvent.clientY - tmpOffsetY) + 'px';
					}
				}
				function dragStop(pEvent)
				{
					window.removeEventListener('pointermove', dragHandler);
					window.removeEventListener('pointerup', dragStop);
					// Persist position after drag
					if (__View.pict.providers['PP-ConfigStorage'])
					{
						__View.pict.providers['PP-ConfigStorage'].save(__View.uiState);
					}
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