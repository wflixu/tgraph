
/**
 * Class: mxCellMarker
 * 
 * A helper class to process mouse locations and highlight cells.
 * 
 * Helper class to highlight cells. To add a cell marker to an existing graph
 * for highlighting all cells, the following code is used:
 * 
 * (code)
 * var marker = new mxCellMarker(graph);
 * graph.addMouseListener({
 *   mouseDown: function() {},
 *   mouseMove: function(sender, me)
 *   {
 *     marker.process(me);
 *   },
 *   mouseUp: function() {}
 * });
 * (end)
 *
 * Event: mxEvent.MARK
 * 
 * Fires after a cell has been marked or unmarked. The <code>state</code>
 * property contains the marked <mxCellState> or null if no state is marked.
 * 
 * Constructor: mxCellMarker
 * 
 * Constructs a new cell marker.
 * 
 * Parameters:
 * 
 * graph - Reference to the enclosing <mxGraph>.
 * validColor - Optional marker color for valid states. Default is
 * <mxConstants.DEFAULT_VALID_COLOR>.
 * invalidColor - Optional marker color for invalid states. Default is
 * <mxConstants.DEFAULT_INVALID_COLOR>.
 * hotspot - Portion of the width and hight where a state intersects a
 * given coordinate pair. A value of 0 means always highlight. Default is
 * <mxConstants.DEFAULT_HOTSPOT>.
 */
import { mxUtils } from '../util/mxUtils.js';
import { mxEventSource } from '../util/mxEventSource.js';
import { mxConstants } from '../util/mxConstants.js';
import { mxCellHighlight } from './mxCellHighlight.js';
import { mxEventObject } from '../util/mxEventObject.js';
import { mxEvent } from '../util/mxEvent.js';


export class mxCellMarker extends mxEventSource {


	/**
	 * Variable: graph
	 * 
	 * Reference to the enclosing <mxGraph>.
	 */
	graph = null;

	/**
	 * Variable: enabled
	 * 
	 * Specifies if the marker is enabled. Default is true.
	 */
	enabled = true;

	/**
	 * Variable: hotspot
	 * 
	 * Specifies the portion of the width and height that should trigger
	 * a highlight. The area around the center of the cell to be marked is used
	 * as the hotspot. Possible values are between 0 and 1. Default is
	 * mxConstants.DEFAULT_HOTSPOT.
	 */
	hotspot = mxConstants.DEFAULT_HOTSPOT;

	/**
	 * Variable: hotspotEnabled
	 * 
	 * Specifies if the hotspot is enabled. Default is false.
	 */
	hotspotEnabled = false;

	/**
	 * Variable: validColor
	 * 
	 * Holds the valid marker color.
	 */
	validColor = null;

	/**
	 * Variable: invalidColor
	 * 
	 * Holds the invalid marker color.
	 */
	invalidColor = null;

	/**
	 * Variable: currentColor
	 * 
	 * Holds the current marker color.
	 */
	currentColor = null;

	/**
	 * Variable: validState
	 * 
	 * Holds the marked <mxCellState> if it is valid.
	 */
	validState = null;

	/**
	 * Variable: markedState
	 * 
	 * Holds the marked <mxCellState>.
	 */
	markedState = null;



	constructor(graph, validColor, invalidColor, hotspot) {
		super();

		if (graph != null) {
			this.graph = graph;
			this.validColor = (validColor != null) ? validColor : mxConstants.DEFAULT_VALID_COLOR;
			this.invalidColor = (invalidColor != null) ? invalidColor : mxConstants.DEFAULT_INVALID_COLOR;
			this.hotspot = (hotspot != null) ? hotspot : mxConstants.DEFAULT_HOTSPOT;

			this.highlight = new mxCellHighlight(graph);
		}
	};


	/**
	 * Function: setEnabled
	 * 
	 * Enables or disables event handling. This implementation
	 * updates <enabled>.
	 * 
	 * Parameters:
	 * 
	 * enabled - Boolean that specifies the new enabled state.
	 */
	setEnabled(enabled) {
		this.enabled = enabled;
	};

	/**
	 * Function: isEnabled
	 * 
	 * Returns true if events are handled. This implementation
	 * returns <enabled>.
	 */
	isEnabled() {
		return this.enabled;
	};

	/**
	 * Function: setHotspot
	 * 
	 * Sets the <hotspot>.
	 */
	setHotspot(hotspot) {
		this.hotspot = hotspot;
	};

	/**
	 * Function: getHotspot
	 * 
	 * Returns the <hotspot>.
	 */
	getHotspot() {
		return this.hotspot;
	};

	/**
	 * Function: setHotspotEnabled
	 * 
	 * Specifies whether the hotspot should be used in <intersects>.
	 */
	setHotspotEnabled(enabled) {
		this.hotspotEnabled = enabled;
	};

	/**
	 * Function: isHotspotEnabled
	 * 
	 * Returns true if hotspot is used in <intersects>.
	 */
	isHotspotEnabled() {
		return this.hotspotEnabled;
	};

	/**
	 * Function: hasValidState
	 * 
	 * Returns true if <validState> is not null.
	 */
	hasValidState() {
		return this.validState != null;
	};

	/**
	 * Function: getValidState
	 * 
	 * Returns the <validState>.
	 */
	getValidState() {
		return this.validState;
	};

	/**
	 * Function: getMarkedState
	 * 
	 * Returns the <markedState>.
	 */
	getMarkedState() {
		return this.markedState;
	};

	/**
	 * Function: reset
	 * 
	 * Resets the state of the cell marker.
	 */
	reset() {
		this.validState = null;

		if (this.markedState != null) {
			this.markedState = null;
			this.unmark();
		}
	};

	/**
	 * Function: process
	 * 
	 * Processes the given event and cell and marks the state returned by
	 * <getState> with the color returned by <getMarkerColor>. If the
	 * markerColor is not null, then the state is stored in <markedState>. If
	 * <isValidState> returns true, then the state is stored in <validState>
	 * regardless of the marker color. The state is returned regardless of the
	 * marker color and valid state. 
	 */
	process(me) {
		var state = null;

		if (this.isEnabled()) {
			state = this.getState(me);
			this.setCurrentState(state, me);
		}

		return state;
	};

	/**
	 * Function: setCurrentState
	 * 
	 * Sets and marks the current valid state.
	 */
	setCurrentState(state, me, color) {
		var isValid = (state != null) ? this.isValidState(state) : false;
		color = (color != null) ? color : this.getMarkerColor(me.getEvent(), state, isValid);

		if (isValid) {
			this.validState = state;
		}
		else {
			this.validState = null;
		}

		if (state != this.markedState || color != this.currentColor) {
			this.currentColor = color;

			if (state != null && this.currentColor != null) {
				this.markedState = state;
				this.mark();
			}
			else if (this.markedState != null) {
				this.markedState = null;
				this.unmark();
			}
		}
	};

	/**
	 * Function: markCell
	 * 
	 * Marks the given cell using the given color, or <validColor> if no color is specified.
	 */
	markCell(cell, color) {
		var state = this.graph.getView().getState(cell);

		if (state != null) {
			this.currentColor = (color != null) ? color : this.validColor;
			this.markedState = state;
			this.mark();
		}
	};

	/**
	 * Function: mark
	 * 
	 * Marks the <markedState> and fires a <mark> event.
	 */
	mark() {
		this.highlight.setHighlightColor(this.currentColor);
		this.highlight.highlight(this.markedState);
		this.fireEvent(new mxEventObject(mxEvent.MARK, 'state', this.markedState));
	};

	/**
	 * Function: unmark
	 * 
	 * Hides the marker and fires a <mark> event.
	 */
	unmark() {
		this.mark();
	};

	/**
	 * Function: isValidState
	 * 
	 * Returns true if the given <mxCellState> is a valid state. If this
	 * returns true, then the state is stored in <validState>. The return value
	 * of this method is used as the argument for <getMarkerColor>.
	 */
	isValidState(state) {
		return true;
	};

	/**
	 * Function: getMarkerColor
	 * 
	 * Returns the valid- or invalidColor depending on the value of isValid.
	 * The given <mxCellState> is ignored by this implementation.
	 */
	getMarkerColor(evt, state, isValid) {
		return (isValid) ? this.validColor : this.invalidColor;
	};

	/**
	 * Function: getState
	 * 
	 * Uses <getCell>, <getStateToMark> and <intersects> to return the
	 * <mxCellState> for the given <mxMouseEvent>.
	 */
	getState(me) {
		var view = this.graph.getView();
		var cell = this.getCell(me);
		var state = this.getStateToMark(view.getState(cell));

		return (state != null && this.intersects(state, me)) ? state : null;
	};

	/**
	 * Function: getCell
	 * 
	 * Returns the <mxCell> for the given event and cell. This returns the
	 * given cell.
	 */
	getCell(me) {
		return me.getCell();
	};

	/**
	 * Function: getStateToMark
	 * 
	 * Returns the <mxCellState> to be marked for the given <mxCellState> under
	 * the mouse. This returns the given state.
	 */
	getStateToMark(state) {
		return state;
	};

	/**
	 * Function: intersects
	 * 
	 * Returns true if the given coordinate pair intersects the given state.
	 * This returns true if the <hotspot> is 0 or the coordinates are inside
	 * the hotspot for the given cell state.
	 */
	intersects(state, me) {
		if (this.hotspotEnabled) {
			return mxUtils.intersectsHotspot(state, me.getGraphX(), me.getGraphY(),
				this.hotspot, mxConstants.MIN_HOTSPOT_SIZE,
				mxConstants.MAX_HOTSPOT_SIZE);
		}

		return true;
	};

	/**
	 * Function: destroy
	 * 
	 * Destroys the handler and all its resources and DOM nodes.
	 */
	destroy() {
		this.graph.getView().removeListener(this.resetHandler);
		this.graph.getModel().removeListener(this.resetHandler);
		this.highlight.destroy();
	};

}


console.log('graph/handler/mxCellMarker.js');