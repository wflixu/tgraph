
/**
 * Class: mxMouseEvent
 * 
 * Base class for all mouse events in mxGraph. A listener for this event should
 * implement the following methods:
 * 
 * (code)
 * graph.addMouseListener(
 * {
 *   mouseDown: function(sender, evt)
 *   {
 *     mxLog.debug('mouseDown');
 *   },
 *   mouseMove: function(sender, evt)
 *   {
 *     mxLog.debug('mouseMove');
 *   },
 *   mouseUp: function(sender, evt)
 *   {
 *     mxLog.debug('mouseUp');
 *   }
 * });
 * (end)
 * 
 * Constructor: mxMouseEvent
 *
 * Constructs a new event object for the given arguments.
 * 
 * Parameters:
 * 
 * evt - Native mouse event.
 * state - Optional <mxCellState> under the mouse.
 * 
 */

import { mxUtils } from "./mxUtils.js";
import { getSource as eventGetSource, getClientX, getClientY } from './tools.js'
import { isPopupTrigger, isMouseEvent } from "./eventUtil.js"

export class mxMouseEvent {

	/**
 * Variable: consumed
 *
 * Holds the consumed state of this event.
 */
	consumed = false;

	/**
	 * Variable: evt
	 *
	 * Holds the inner event object.
	 */
	evt = null;

	/**
	 * Variable: graphX
	 *
	 * Holds the x-coordinate of the event in the graph. This value is set in
	 * <mxGraph.fireMouseEvent>.
	 */
	graphX = null;

	/**
	 * Variable: graphY
	 *
	 * Holds the y-coordinate of the event in the graph. This value is set in
	 * <mxGraph.fireMouseEvent>.
	 */
	graphY = null;

	/**
	 * Variable: state
	 *
	 * Holds the optional <mxCellState> associated with this event.
	 */
	state = null;

	/**
	 * Variable: sourceState
	 * 
	 * Holds the <mxCellState> that was passed to the constructor. This can be
	 * different from <state> depending on the result of <mxGraph.getEventState>.
	 */
	sourceState = null;



	constructor(evt, state) {
		this.evt = evt;
		this.state = state;
		this.sourceState = state;
	};


	/**
	 * Function: getEvent
	 * 
	 * Returns <evt>.
	 */
	getEvent() {
		return this.evt;
	};

	/**
	 * Function: getSource
	 * 
	 * Returns the target DOM element using <mxEvent.getSource> for <evt>.
	 */
	getSource() {
		return eventGetSource(this.evt);
	};

	/**
	 * Function: isSource
	 * 
	 * Returns true if the given <mxShape> is the source of <evt>.
	 */
	isSource(shape) {
		if (shape != null) {
			return mxUtils.isAncestorNode(shape.node, this.getSource());
		}

		return false;
	};

	/**
	 * Function: getX
	 * 
	 * Returns <evt.clientX>.
	 */
	getX() {
		return getClientX(this.getEvent());
	};

	/**
	 * Function: getY
	 * 
	 * Returns <evt.clientY>.
	 */
	getY() {
		return getClientY(this.getEvent());
	};

	/**
	 * Function: getGraphX
	 * 
	 * Returns <graphX>.
	 */
	getGraphX() {
		return this.graphX;
	};

	/**
	 * Function: getGraphY
	 * 
	 * Returns <graphY>.
	 */
	getGraphY() {
		return this.graphY;
	};

	/**
	 * Function: getState
	 * 
	 * Returns <state>.
	 */
	getState() {
		return this.state;
	};

	/**
	 * Function: getCell
	 * 
	 * Returns the <mxCell> in <state> is not null.
	 */
	getCell() {
		var state = this.getState();

		if (state != null) {
			return state.cell;
		}

		return null;
	};

	/**
	 * Function: isPopupTrigger
	 *
	 * Returns true if the event is a popup trigger.
	 */
	isPopupTrigger() {
		return isPopupTrigger(this.getEvent());
	};

	/**
	 * Function: isConsumed
	 *
	 * Returns <consumed>.
	 */
	isConsumed() {
		return this.consumed;
	};

	/**
	 * Function: consume
	 *
	 * Sets <consumed> to true and invokes preventDefault on the native event
	 * if such a method is defined. This is used mainly to avoid the cursor from
	 * being changed to a text cursor in Webkit. You can use the preventDefault
	 * flag to disable this functionality.
	 * 
	 * Parameters:
	 * 
	 * preventDefault - Specifies if the native event should be canceled. Default
	 * is true.
	 */
	consume(preventDefault) {
		preventDefault = (preventDefault != null) ? preventDefault :
			(this.evt.touches != null || isMouseEvent(this.evt));

		if (preventDefault && this.evt.preventDefault) {
			this.evt.preventDefault();
		}



		// Sets local consumed state
		this.consumed = true;
	};
}

console.log('graph/util/mxMouseEvent.js');