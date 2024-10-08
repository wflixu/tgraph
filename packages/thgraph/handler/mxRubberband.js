

import { mxEvent, mxPoint, mxRectangle, mxUtils } from "../util/index.js";
import { mxClient } from '../mxClient.js';


/**
 * Class: mxRubberband
 * 
 * Event handler that selects rectangular regions. This is not built-into
 * <mxGraph>. To enable rubberband selection in a graph, use the following code.
 * 
 * Example:
 * 
 * (code)
 * var rubberband = new mxRubberband(graph);
 * (end)
 * 
 * Constructor: mxRubberband
 * 
 * Constructs an event handler that selects rectangular regions in the graph
 * using rubberband selection.
 */

export class mxRubberband {

	/**
	 * Variable: defaultOpacity
	 * 
	 * Specifies the default opacity to be used for the rubberband div. Default
	 * is 20.
	 */
	defaultOpacity = 20;

	/**
	 * Variable: enabled
	 * 
	 * Specifies if events are handled. Default is true.
	 */
	enabled = true;

	/**
	 * Variable: div
	 * 
	 * Holds the DIV element which is currently visible.
	 */
	div = null;

	/**
	 * Variable: sharedDiv
	 * 
	 * Holds the DIV element which is used to display the rubberband.
	 */
	sharedDiv = null;

	/**
	 * Variable: currentX
	 * 
	 * Holds the value of the x argument in the last call to <update>.
	 */
	currentX = 0;

	/**
	 * Variable: currentY
	 * 
	 * Holds the value of the y argument in the last call to <update>.
	 */
	currentY = 0;

	/**
	 * Variable: fadeOut
	 * 
	 * Optional fade out effect. Default is false.
	 */
	fadeOut = false;


	constructor(graph) {
		if (graph != null) {
			this.graph = graph;
			this.graph.addMouseListener(this);

			// Handles force rubberband event
			this.forceRubberbandHandler =  (sender, evt) => {
				var evtName = evt.getProperty('eventName');
				var me = evt.getProperty('event');

				if (evtName == mxEvent.MOUSE_DOWN && this.isForceRubberbandEvent(me)) {
					var offset = mxUtils.getOffset(this.graph.container);
					var origin = mxUtils.getScrollOrigin(this.graph.container);
					origin.x -= offset.x;
					origin.y -= offset.y;
					this.start(me.getX() + origin.x, me.getY() + origin.y);
					me.consume(false);
				}
			};

			this.graph.addListener(mxEvent.FIRE_MOUSE_EVENT, this.forceRubberbandHandler);

			// Repaints the marquee after autoscroll
			this.panHandler = () => {
				this.repaint();
			};

			this.graph.addListener(mxEvent.PAN, this.panHandler);

			// Does not show menu if any touch gestures take place after the trigger
			this.gestureHandler = (sender, eo) => {
				if (this.first != null) {
					this.reset();
				}
			};

			this.graph.addListener(mxEvent.GESTURE, this.gestureHandler);
		}
	}


	/**
	 * Function: isEnabled
	 * 
	 * Returns true if events are handled. This implementation returns
	 * <enabled>.
	 */
	isEnabled() {
		return this.enabled;
	};

	/**
	 * Function: setEnabled
	 * 
	 * Enables or disables event handling. This implementation updates
	 * <enabled>.
	 */
	setEnabled(enabled) {
		this.enabled = enabled;
	};

	/**
	 * Function: isForceRubberbandEvent
	 * 
	 * Returns true if the given <mxMouseEvent> should start rubberband selection.
	 * This implementation returns true if the alt key is pressed.
	 */
	isForceRubberbandEvent(me) {
		return mxEvent.isAltDown(me.getEvent());
	};

	/**
	 * Function: mouseDown
	 * 
	 * Handles the event by initiating a rubberband selection. By consuming the
	 * event all subsequent events of the gesture are redirected to this
	 * handler.
	 */
	mouseDown(sender, me) {
		if (!me.isConsumed() && this.isEnabled() && this.graph.isEnabled() &&
			me.getState() == null && !mxEvent.isMultiTouchEvent(me.getEvent())) {
			var offset = mxUtils.getOffset(this.graph.container);
			var origin = mxUtils.getScrollOrigin(this.graph.container);
			origin.x -= offset.x;
			origin.y -= offset.y;
			this.start(me.getX() + origin.x, me.getY() + origin.y);

			// Does not prevent the default for this event so that the
			// event processing chain is still executed even if we start
			// rubberbanding. This is required eg. in ExtJs to hide the
			// current context menu. In mouseMove we'll make sure we're
			// not selecting anything while we're rubberbanding.
			me.consume(false);
		}
	};

	/**
	 * Function: start
	 * 
	 * Sets the start point for the rubberband selection.
	 */
	start(x, y) {
		this.first = new mxPoint(x, y);

		var container = this.graph.container;

		function createMouseEvent(evt) {
			var me = new mxMouseEvent(evt);
			var pt = mxUtils.convertPoint(container, me.getX(), me.getY());

			me.graphX = pt.x;
			me.graphY = pt.y;

			return me;
		};

		this.dragHandler = (evt) => {
			this.mouseMove(this.graph, createMouseEvent(evt));
		};

		this.dropHandler = (evt) => {
			this.mouseUp(this.graph, createMouseEvent(evt));
		};

		// Workaround for rubberband stopping if the mouse leaves the container in Firefox
		if (mxClient.IS_FF) {
			mxEvent.addGestureListeners(document, null, this.dragHandler, this.dropHandler);
		}
	};

	/**
	 * Function: mouseMove
	 * 
	 * Handles the event by updating therubberband selection.
	 */
	mouseMove(sender, me) {
		if (!me.isConsumed() && this.first != null) {
			var origin = mxUtils.getScrollOrigin(this.graph.container);
			var offset = mxUtils.getOffset(this.graph.container);
			origin.x -= offset.x;
			origin.y -= offset.y;
			var x = me.getX() + origin.x;
			var y = me.getY() + origin.y;
			var dx = this.first.x - x;
			var dy = this.first.y - y;
			var tol = this.graph.tolerance;

			if (this.div != null || Math.abs(dx) > tol || Math.abs(dy) > tol) {
				if (this.div == null) {
					this.div = this.createShape();
				}

				// Clears selection while rubberbanding. This is required because
				// the event is not consumed in mouseDown.
				mxUtils.clearSelection();

				this.update(x, y);
				me.consume();
			}
		}
	};

	/**
	 * Function: createShape
	 * 
	 * Creates the rubberband selection shape.
	 */
	createShape() {
		if (this.sharedDiv == null) {
			this.sharedDiv = document.createElement('div');
			this.sharedDiv.className = 'mxRubberband';
			mxUtils.setOpacity(this.sharedDiv, this.defaultOpacity);
		}

		this.graph.container.appendChild(this.sharedDiv);
		var result = this.sharedDiv;

		if (mxClient.IS_SVG && this.fadeOut) {
			this.sharedDiv = null;
		}

		return result;
	};

	/**
	 * Function: isActive
	 * 
	 * Returns true if this handler is active.
	 */
	isActive(sender, me) {
		return this.div != null && this.div.style.display != 'none';
	};

	/**
	 * Function: mouseUp
	 * 
	 * Handles the event by selecting the region of the rubberband using
	 * <mxGraph.selectRegion>.
	 */
	mouseUp(sender, me) {
		var active = this.isActive();
		this.reset();

		if (active) {
			this.execute(me.getEvent());
			me.consume();
		}
	};

	/**
	 * Function: execute
	 * 
	 * Resets the state of this handler and selects the current region
	 * for the given event.
	 */
	execute(evt) {
		var rect = new mxRectangle(this.x, this.y, this.width, this.height);
		this.graph.selectRegion(rect, evt);
	};

	/**
	 * Function: reset
	 * 
	 * Resets the state of the rubberband selection.
	 */
	reset() {
		if (this.div != null) {
			if (mxClient.IS_SVG && this.fadeOut) {
				var temp = this.div;
				mxUtils.setPrefixedStyle(temp.style, 'transition', 'all 0.2s linear');
				temp.style.pointerEvents = 'none';
				temp.style.opacity = 0;

				window?.setTimeout(function () {
					temp.parentNode.removeChild(temp);
				}, 200);
			}
			else {
				this.div.parentNode.removeChild(this.div);
			}
		}

		mxEvent.removeGestureListeners(document, null, this.dragHandler, this.dropHandler);
		this.dragHandler = null;
		this.dropHandler = null;

		this.currentX = 0;
		this.currentY = 0;
		this.first = null;
		this.div = null;
	};

	/**
	 * Function: update
	 * 
	 * Sets <currentX> and <currentY> and calls <repaint>.
	 */
	update(x, y) {
		this.currentX = x;
		this.currentY = y;

		this.repaint();
	};

	/**
	 * Function: repaint
	 * 
	 * Computes the bounding box and updates the style of the <div>.
	 */
	repaint() {
		if (this.div != null) {
			var x = this.currentX - this.graph.panDx;
			var y = this.currentY - this.graph.panDy;

			this.x = Math.min(this.first.x, x);
			this.y = Math.min(this.first.y, y);
			this.width = Math.max(this.first.x, x) - this.x;
			this.height = Math.max(this.first.y, y) - this.y;

			var dx = 0;
			var dy = 0;

			this.div.style.left = (this.x + dx) + 'px';
			this.div.style.top = (this.y + dy) + 'px';
			this.div.style.width = Math.max(1, this.width) + 'px';
			this.div.style.height = Math.max(1, this.height) + 'px';
		}
	};

	/**
	 * Function: destroy
	 * 
	 * Destroys the handler and all its resources and DOM nodes. This does
	 * normally not need to be called, it is called automatically when the
	 * window unloads.
	 */
	destroy() {
		if (!this.destroyed) {
			this.destroyed = true;
			this.graph.removeMouseListener(this);
			this.graph.removeListener(this.forceRubberbandHandler);
			this.graph.removeListener(this.panHandler);
			this.reset();

			if (this.sharedDiv != null) {
				this.sharedDiv = null;
			}
		}
	};
};

console.log('graph/handler/mxRubberband.js');