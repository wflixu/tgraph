
/**
 * Class: mxCellHighlight
 * 
 * A helper class to highlight cells. Here is an example for a given cell.
 * 
 * (code)
 * var highlight = new mxCellHighlight(graph, '#ff0000', 2);
 * highlight.highlight(graph.view.getState(cell)));
 * (end)
 * 
 * Constructor: mxCellHighlight
 * 
 * Constructs a cell highlight.
 */

import { mxConstants } from '../util/mxConstants.js';
import { mxUtils } from '../util/mxUtils.js';
import { mxEvent } from '../util/mxEvent.js';
import { mxRectangle } from '../util/mxRectangle.js';


export class mxCellHighlight {

	/**
	 * Variable: keepOnTop
	 * 
	 * Specifies if the highlights should appear on top of everything
	 * else in the overlay pane. Default is false.
	 */
	keepOnTop = false;

	/**
	 * Variable: graph
	 * 
	 * Reference to the enclosing <mxGraph>.
	 */
	graph = null;

	/**
	 * Variable: state
	 * 
	 * Reference to the <mxCellState>.
	 */
	state = null;

	/**
	 * Variable: spacing
	 * 
	 * Specifies the spacing between the highlight for vertices and the vertex.
	 * Default is 2.
	 */
	spacing = 2;

	/**
	 * Variable: resetHandler
	 * 
	 * Holds the handler that automatically invokes reset if the highlight
	 * should be hidden.
	 */
	resetHandler = null;

	constructor(graph, highlightColor, strokeWidth, dashed) {
		if (graph != null) {
			this.graph = graph;
			this.highlightColor = (highlightColor != null) ? highlightColor : mxConstants.DEFAULT_VALID_COLOR;
			this.strokeWidth = (strokeWidth != null) ? strokeWidth : mxConstants.HIGHLIGHT_STROKEWIDTH;
			this.dashed = (dashed != null) ? dashed : false;
			this.opacity = mxConstants.HIGHLIGHT_OPACITY;

			// Updates the marker if the graph changes
			this.repaintHandler = () => {
				// Updates reference to state
				if (this.state != null) {
					var tmp = this.graph.view.getState(this.state.cell);

					if (tmp == null) {
						this.hide();
					}
					else {
						this.state = tmp;
						this.repaint();
					}
				}
			};

			this.graph.getView().addListener(mxEvent.SCALE, this.repaintHandler);
			this.graph.getView().addListener(mxEvent.TRANSLATE, this.repaintHandler);
			this.graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, this.repaintHandler);
			this.graph.getModel().addListener(mxEvent.CHANGE, this.repaintHandler);

			// Hides the marker if the current root changes
			this.resetHandler = () => {
				this.hide();
			};

			this.graph.getView().addListener(mxEvent.DOWN, this.resetHandler);
			this.graph.getView().addListener(mxEvent.UP, this.resetHandler);
		}
	}

	/**
	 * Function: setHighlightColor
	 * 
	 * Sets the color of the rectangle used to highlight drop targets.
	 * 
	 * Parameters:
	 * 
	 * color - String that represents the new highlight color.
	 */
	setHighlightColor(color) {
		this.highlightColor = color;

		if (this.shape != null) {
			this.shape.stroke = color;
		}
	}


	/**
	 * Function: drawHighlight
	 * 
	 * Creates and returns the highlight shape for the given state.
	 */
	drawHighlight() {
		this.shape = this.createShape();
		this.repaint();

		if (!this.keepOnTop && this.shape.node.parentNode.firstChild != this.shape.node) {
			this.shape.node.parentNode.insertBefore(this.shape.node, this.shape.node.parentNode.firstChild);
		}
	};

	/**
	 * Function: createShape
	 * 
	 * Creates and returns the highlight shape for the given state.
	 */
	createShape() {
		var shape = this.graph.cellRenderer.createShape(this.state);

		shape.svgStrokeTolerance = this.graph.tolerance;
		shape.points = this.state.absolutePoints;
		shape.apply(this.state);
		shape.stroke = this.highlightColor;
		shape.opacity = this.opacity;
		shape.isDashed = this.dashed;
		shape.isShadow = false;

		shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML : mxConstants.DIALECT_SVG;
		shape.init(this.graph.getView().getOverlayPane());
		mxEvent.redirectMouseEvents(shape.node, this.graph, this.state);

		if (this.graph.dialect != mxConstants.DIALECT_SVG) {
			shape.pointerEvents = false;
		}
		else {
			shape.svgPointerEvents = 'stroke';
		}

		return shape;
	};

	/**
	 * Function: getStrokeWidth
	 * 
	 * Returns the stroke width.
	 */
	getStrokeWidth(state) {
		return this.strokeWidth;
	};


	/**
	 * Function: repaint
	 * 
	 * Updates the highlight after a change of the model or view.
	 */
	repaint() {
		if (this.state != null && this.shape != null) {
			this.shape.scale = this.state.view.scale;

			if (this.graph.model.isEdge(this.state.cell)) {
				this.shape.strokewidth = this.getStrokeWidth();
				this.shape.points = this.state.absolutePoints;
				this.shape.outline = false;
			}
			else {
				this.shape.bounds = new mxRectangle(this.state.x - this.spacing, this.state.y - this.spacing,
					this.state.width + 2 * this.spacing, this.state.height + 2 * this.spacing);
				this.shape.rotation = Number(this.state.style[mxConstants.STYLE_ROTATION] || '0');
				this.shape.strokewidth = this.getStrokeWidth() / this.state.view.scale;
				this.shape.outline = true;
			}

			// Uses cursor from shape in highlight
			if (this.state.shape != null) {
				this.shape.setCursor(this.state.shape.getCursor());
			}



			this.shape.redraw();
		}
	};

	/**
	 * Function: hide
	 * 
	 * Resets the state of the cell marker.
	 */
	hide() {
		this.highlight(null);
	};

	/**
	 * Function: mark
	 * 
	 * Marks the <markedState> and fires a <mark> event.
	 */
	highlight(state) {
		if (this.state != state) {
			if (this.shape != null) {
				this.shape.destroy();
				this.shape = null;
			}

			this.state = state;

			if (this.state != null) {
				this.drawHighlight();
			}
		}
	};

	/**
	 * Function: isHighlightAt
	 * 
	 * Returns true if this highlight is at the given position.
	 */
	isHighlightAt(x, y) {
		var hit = false;

		// Quirks mode is currently not supported as it used a different coordinate system
		if (this.shape != null && document.elementFromPoint != null) {
			var elt = document.elementFromPoint(x, y);

			while (elt != null) {
				if (elt == this.shape.node) {
					hit = true;
					break;
				}

				elt = elt.parentNode;
			}
		}

		return hit;
	};

	/**
	 * Function: destroy
	 * 
	 * Destroys the handler and all its resources and DOM nodes.
	 */
	destroy() {
		this.graph.getView().removeListener(this.resetHandler);
		this.graph.getView().removeListener(this.repaintHandler);
		this.graph.getModel().removeListener(this.repaintHandler);

		if (this.shape != null) {
			this.shape.destroy();
			this.shape = null;
		}
	};
}











console.log('graph/handler/mxCellHighlight.js');