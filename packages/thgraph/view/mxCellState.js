
/**
 * Class: mxCellState
 * 
 * Represents the current state of a cell in a given <mxGraphView>.
 * 
 * For edges, the edge label position is stored in <absoluteOffset>.
 * 
 * The size for oversize labels can be retrieved using the boundingBox property
 * of the <text> field as shown below.
 * 
 * (code)
 * var bbox = (state.text != null) ? state.text.boundingBox : null;
 * (end)
 * 
 * Constructor: mxCellState
 * 
 * Constructs a new object that represents the current state of the given
 * cell in the specified view.
 * 
 * Parameters:
 * 
 * view - <mxGraphView> that contains the state.
 * cell - <mxCell> that this state represents.
 * style - Array of key, value pairs that constitute the style.
 */

import { mxRectangle } from '../util/mxRectangle.js';
import { mxPoint } from '../util/mxPoint.js';

export class mxCellState extends mxRectangle {

	/**
	 * Variable: view
	 * 
	 * Reference to the enclosing <mxGraphView>.
	 */
	view = null;

	/**
	 * Variable: cell
	 *
	 * Reference to the <mxCell> that is represented by this state.
	 */
	cell = null;

	/**
	 * Variable: style
	 * 
	 * Contains an array of key, value pairs that represent the style of the
	 * cell.
	 */
	style = null;

	/**
	 * Variable: invalidStyle
	 * 
	 * Specifies if the style is invalid. Default is false.
	 */
	invalidStyle = false;

	/**
	 * Variable: invalid
	 * 
	 * Specifies if the state is invalid. Default is true.
	 */
	invalid = true;

	/**
	 * Variable: origin
	 *
	 * <mxPoint> that holds the origin for all child cells. Default is a new
	 * empty <mxPoint>.
	 */
	origin = null;

	/**
	 * Variable: absolutePoints
	 * 
	 * Holds an array of <mxPoints> that represent the absolute points of an
	 * edge.
	 */
	absolutePoints = null;

	/**
	 * Variable: absoluteOffset
	 *
	 * <mxPoint> that holds the absolute offset. For edges, this is the
	 * absolute coordinates of the label position. For vertices, this is the
	 * offset of the label relative to the top, left corner of the vertex. 
	 */
	absoluteOffset = null;

	/**
	 * Variable: visibleSourceState
	 * 
	 * Caches the visible source terminal state.
	 */
	visibleSourceState = null;

	/**
	 * Variable: visibleTargetState
	 * 
	 * Caches the visible target terminal state.
	 */
	visibleTargetState = null;

	/**
	 * Variable: terminalDistance
	 * 
	 * Caches the distance between the end points for an edge.
	 */
	terminalDistance = 0;

	/**
	 * Variable: length
	 *
	 * Caches the length of an edge.
	 */
	length = 0;

	/**
	 * Variable: segments
	 * 
	 * Array of numbers that represent the cached length of each segment of the
	 * edge.
	 */
	segments = null;

	/**
	 * Variable: shape
	 * 
	 * Holds the <mxShape> that represents the cell graphically.
	 */
	shape = null;

	/**
	 * Variable: text
	 * 
	 * Holds the <mxText> that represents the label of the cell. Thi smay be
	 * null if the cell has no label.
	 */
	text = null;

	/**
	 * Variable: unscaledWidth
	 * 
	 * Holds the unscaled width of the state.
	 */
	unscaledWidth = null;

	/**
	 * Variable: unscaledHeight
	 * 
	 * Holds the unscaled height of the state.
	 */
	unscaledHeight = null;



	constructor(view, cell, style) {
		super();
		this.view = view;
		this.cell = cell;
		this.style = (style != null) ? style : {};

		this.origin = new mxPoint();
		this.absoluteOffset = new mxPoint();
	}

	/**
	 * Function: getPerimeterBounds
	 * 
	 * Returns the <mxRectangle> that should be used as the perimeter of the
	 * cell.
	 * 
	 * Parameters:
	 * 
	 * border - Optional border to be added around the perimeter bounds.
	 * bounds - Optional <mxRectangle> to be used as the initial bounds.
	 */
	getPerimeterBounds(border, bounds) {
		border = border || 0;
		bounds = (bounds != null) ? bounds : new mxRectangle(this.x, this.y, this.width, this.height);

		if (this.shape != null && this.shape.stencil != null && this.shape.stencil.aspect == 'fixed') {
			var aspect = this.shape.stencil.computeAspect(this.style, bounds.x, bounds.y, bounds.width, bounds.height);

			bounds.x = aspect.x;
			bounds.y = aspect.y;
			bounds.width = this.shape.stencil.w0 * aspect.width;
			bounds.height = this.shape.stencil.h0 * aspect.height;
		}

		if (border != 0) {
			bounds.grow(border);
		}

		return bounds;
	};

	/**
	 * Function: setAbsoluteTerminalPoint
	 * 
	 * Sets the first or last point in <absolutePoints> depending on isSource.
	 * 
	 * Parameters:
	 * 
	 * point - <mxPoint> that represents the terminal point.
	 * isSource - Boolean that specifies if the first or last point should
	 * be assigned.
	 */
	setAbsoluteTerminalPoint(point, isSource) {
		if (isSource) {
			if (this.absolutePoints == null) {
				this.absolutePoints = [];
			}

			if (this.absolutePoints.length == 0) {
				this.absolutePoints.push(point);
			}
			else {
				this.absolutePoints[0] = point;
			}
		}
		else {
			if (this.absolutePoints == null) {
				this.absolutePoints = [];
				this.absolutePoints.push(null);
				this.absolutePoints.push(point);
			}
			else if (this.absolutePoints.length == 1) {
				this.absolutePoints.push(point);
			}
			else {
				this.absolutePoints[this.absolutePoints.length - 1] = point;
			}
		}
	};

	/**
	 * Function: setCursor
	 * 
	 * Sets the given cursor on the shape and text shape.
	 */
	setCursor(cursor) {
		if (this.shape != null) {
			this.shape.setCursor(cursor);
		}

		if (this.text != null) {
			this.text.setCursor(cursor);
		}
	};

	/**
	 * Function: getVisibleTerminal
	 * 
	 * Returns the visible source or target terminal cell.
	 * 
	 * Parameters:
	 * 
	 * source - Boolean that specifies if the source or target cell should be
	 * returned.
	 */
	getVisibleTerminal(source) {
		var tmp = this.getVisibleTerminalState(source);

		return (tmp != null) ? tmp.cell : null;
	};

	/**
	 * Function: getVisibleTerminalState
	 * 
	 * Returns the visible source or target terminal state.
	 * 
	 * Parameters:
	 * 
	 * source - Boolean that specifies if the source or target state should be
	 * returned.
	 */
	getVisibleTerminalState(source) {
		return (source) ? this.visibleSourceState : this.visibleTargetState;
	};

	/**
	 * Function: setVisibleTerminalState
	 * 
	 * Sets the visible source or target terminal state.
	 * 
	 * Parameters:
	 * 
	 * terminalState - <mxCellState> that represents the terminal.
	 * source - Boolean that specifies if the source or target state should be set.
	 */
	setVisibleTerminalState(terminalState, source) {
		if (source) {
			this.visibleSourceState = terminalState;
		}
		else {
			this.visibleTargetState = terminalState;
		}
	};

	/**
	 * Function: getCellBounds
	 * 
	 * Returns the unscaled, untranslated bounds.
	 */
	getCellBounds() {
		return this.cellBounds;
	};

	/**
	 * Function: getPaintBounds
	 * 
	 * Returns the unscaled, untranslated paint bounds. This is the same as
	 * <getCellBounds> but with a 90 degree rotation if the shape's
	 * isPaintBoundsInverted returns true.
	 */
	getPaintBounds() {
		return this.paintBounds;
	};

	/**
	 * Function: updateCachedBounds
	 * 
	 * Updates the cellBounds and paintBounds.
	 */
	updateCachedBounds() {
		var tr = this.view.translate;
		var s = this.view.scale;
		this.cellBounds = new mxRectangle(this.x / s - tr.x, this.y / s - tr.y, this.width / s, this.height / s);
		this.paintBounds = mxRectangle.fromRectangle(this.cellBounds);

		if (this.shape != null && this.shape.isPaintBoundsInverted()) {
			this.paintBounds.rotate90();
		}
	};

	/**
	 * Destructor: setState
	 * 
	 * Copies all fields from the given state to this state.
	 */
	setState(state) {
		this.view = state.view;
		this.cell = state.cell;
		this.style = state.style;
		this.absolutePoints = state.absolutePoints;
		this.origin = state.origin;
		this.absoluteOffset = state.absoluteOffset;
		this.boundingBox = state.boundingBox;
		this.terminalDistance = state.terminalDistance;
		this.segments = state.segments;
		this.length = state.length;
		this.x = state.x;
		this.y = state.y;
		this.width = state.width;
		this.height = state.height;
		this.unscaledWidth = state.unscaledWidth;
		this.unscaledHeight = state.unscaledHeight;
	};

	/**
	 * Function: clone
	 *
	 * Returns a clone of this <mxPoint>.
	 */
	clone() {
		var clone = new mxCellState(this.view, this.cell, this.style);

		// Clones the absolute points
		if (this.absolutePoints != null) {
			clone.absolutePoints = [];

			for (var i = 0; i < this.absolutePoints.length; i++) {
				clone.absolutePoints[i] = this.absolutePoints[i].clone();
			}
		}

		if (this.origin != null) {
			clone.origin = this.origin.clone();
		}

		if (this.absoluteOffset != null) {
			clone.absoluteOffset = this.absoluteOffset.clone();
		}

		if (this.boundingBox != null) {
			clone.boundingBox = this.boundingBox.clone();
		}

		clone.terminalDistance = this.terminalDistance;
		clone.segments = this.segments;
		clone.length = this.length;
		clone.x = this.x;
		clone.y = this.y;
		clone.width = this.width;
		clone.height = this.height;
		clone.unscaledWidth = this.unscaledWidth;
		clone.unscaledHeight = this.unscaledHeight;

		return clone;
	};

	/**
	 * Destructor: destroy
	 * 
	 * Destroys the state and all associated resources.
	 */
	destroy() {
		this.view.graph.cellRenderer.destroy(this);
	};

};


console.log('graph/view/mxCellState.js');