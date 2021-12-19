
/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */

import { mxUtils } from "../util/mxUtils";
import { mxGeometry } from "./mxGeometry";
import { mxConstants } from '../util/mxConstants';

/**
 * Class: mxCell
 *
 * Cells are the elements of the graph model. They represent the state
 * of the groups, vertices and edges in a graph.
 * 
 * Custom attributes:
 * 
 * For custom attributes we recommend using an XML node as the value of a cell.
 * The following code can be used to create a cell with an XML node as the
 * value:
 * 
 * (code)
 * var doc = mxUtils.createXmlDocument();
 * var node = doc.createElement('MyNode')
 * node.setAttribute('label', 'MyLabel');
 * node.setAttribute('attribute1', 'value1');
 * graph.insertVertex(graph.getDefaultParent(), null, node, 40, 40, 80, 30);
 * (end)
 * 
 * For the label to work, <mxGraph.convertValueToString> and
 * <mxGraph.cellLabelChanged> should be overridden as follows:
 * 
 * (code)
 * graph.convertValueToString = function(cell)
 * {
 *   if (mxUtils.isNode(cell.value))
 *   {
 *     return cell.getAttribute('label', '')
 *   }
 * };
 * 
 * var cellLabelChanged = graph.cellLabelChanged;
 * graph.cellLabelChanged = function(cell, newValue, autoSize)
 * {
 *   if (mxUtils.isNode(cell.value))
 *   {
 *     // Clones the value for correct undo/redo
 *     var elt = cell.value.cloneNode(true);
 *     elt.setAttribute('label', newValue);
 *     newValue = elt;
 *   }
 *   
 *   cellLabelChanged.apply(this, arguments);
 * };
 * (end)
 * 
 * Callback: onInit
 *
 * Called from within the constructor.
 * 
 * Constructor: mxCell
 *
 * Constructs a new cell to be used in a graph model.
 * This method invokes <onInit> upon completion.
 * 
 * Parameters:
 * 
 * value - Optional object that represents the cell value.
 * geometry - Optional <mxGeometry> that specifies the geometry.
 * style - Optional formatted string that defines the style.
 */
export class mxCell {
	value: any;
	id: any;
	geometry: mxGeometry | null = null;
	style: string | null = null;
	vertex = false;
	edge = false;
	connectable = true;
	visible = true;
	collapsed = false;
	parent: mxCell | null = null;
	source: any = null;
	target: any = null;
	children: mxCell[] | null = null;
	edges: any[] | null = null;
	mxTransient: string[] = ['id', 'value', 'parent', 'source',
		'target', 'children', 'edges'];

	invalidating: boolean | undefined;



	constructor(value: any = null, geometry: mxGeometry | null = null, style?: any) {
		this.value = value;
		this.setGeometry(geometry);
		if (style) {
			this.setStyle(style);
		}

		if (this.onInit != null) {
			this.onInit();
		}
	}
	onInit() {

	}



	getId() {
		return this.id;
	}
	setId(value: string | null) {
		this.id = value;
	}
	getValue(): any {
		this.value;
	}
	setValue(val: any) {
		this.value = val;
	}

	valueChanged(newValue: any) {
		var previous = this.getValue();
		this.setValue(newValue);

		return previous;
	}

	getGeometry() {
		this.geometry;
	}
	setGeometry(geometry: mxGeometry | null) {
		this.geometry = geometry;
	}

	getStyle() {
		return this.style;
	}


	setStyle(style: any) {
		this.style = style;
	}

	isVertex() {
		return this.vertex;
	}
	setVertex(vertex: boolean) {
		this.vertex = vertex
	}

	isEdge() {
		return this.edge;
	}

	setEdge(edge: boolean) {
		this.edge = edge;
	}
	isConnectable() {
		return this.connectable;
	}

	setConnectable(connectable: boolean) {
		this.connectable = connectable;
	}

	isVisible() {
		return this.visible;
	}

	setVisible(visible: boolean) {
		this.visible = visible;
	}

	isCollapsed() {
		return this.collapsed;
	}



	setCollapsed(collapsed: boolean) {
		this.collapsed = collapsed;
	};

	/**
	 * Function: getParent
	 *
	 * Returns the cell's parent.
	 */
	getParent() {
		return this.parent;
	};

	/**
	 * Function: setParent
	 *
	 * Sets the parent cell.
	 * 
	 * Parameters:
	 * 
	 * parent - <mxCell> that represents the new parent.
	 */
	setParent(parent: mxCell | null) {
		this.parent = parent;
	};

	/**
	 * Function: getTerminal
	 *
	 * Returns the source or target terminal.
	 * 
	 * Parameters:
	 * 
	 * source - Boolean that specifies if the source terminal should be
	 * returned.
	 */
	getTerminal(source: boolean) {
		return (source) ? this.source : this.target;
	};

	/**
	 * Function: setTerminal
	 *
	 * Sets the source or target terminal and returns the new terminal.
	 * 
	 * Parameters:
	 * 
	 * terminal - <mxCell> that represents the new source or target terminal.
	 * isSource - Boolean that specifies if the source or target terminal
	 * should be set.
	 */
	setTerminal(terminal: this | null, isSource: boolean) {
		if (isSource) {
			this.source = terminal;
		}
		else {
			this.target = terminal;
		}

		return terminal;
	};

	/**
	 * Function: getChildCount
	 *
	 * Returns the number of child cells.
	 */
	getChildCount() {
		return (this.children == null) ? 0 : this.children.length;
	};

	/**
	 * Function: getIndex
	 *
	 * Returns the index of the specified child in the child array.
	 * 
	 * Parameters:
	 * 
	 * child - Child whose index should be returned.
	 */
	getIndex(child: mxCell) {
		return mxUtils.indexOf(this.children ?? [], child);
	};

	/**
	 * Function: getChildAt
	 *
	 * Returns the child at the specified index.
	 * 
	 * Parameters:
	 * 
	 * index - Integer that specifies the child to be returned.
	 */
	getChildAt(index: number) {
		return (this.children == null) ? null : this.children[index];
	};

	/**
	 * Function: insert
	 *
	 * Inserts the specified child into the child array at the specified index
	 * and updates the parent reference of the child. If not childIndex is
	 * specified then the child is appended to the child array. Returns the
	 * inserted child.
	 * 
	 * Parameters:
	 * 
	 * child - <mxCell> to be inserted or appended to the child array.
	 * index - Optional integer that specifies the index at which the child
	 * should be inserted into the child array.
	 */
	insert(child: mxCell, index: number) {
		if (child != null) {
			if (index == null) {
				index = this.getChildCount();

				if (child.getParent() == this) {
					index--;
				}
			}

			child.removeFromParent();
			child.setParent(this);

			if (this.children == null) {
				this.children = [];
				this.children.push(child);
			}
			else {
				this.children.splice(index, 0, child);
			}
		}

		return child;
	};

	/**
	 * Function: remove
	 *
	 * Removes the child at the specified index from the child array and
	 * returns the child that was removed. Will remove the parent reference of
	 * the child.
	 * 
	 * Parameters:
	 * 
	 * index - Integer that specifies the index of the child to be
	 * removed.
	 */
	remove(index: number) {
		var child = null;

		if (this.children != null && index >= 0) {
			child = this.getChildAt(index);

			if (child != null) {
				this.children.splice(index, 1);
				child.setParent(null);
			}
		}

		return child;
	};

	/**
	 * Function: removeFromParent
	 *
	 * Removes the cell from its parent.
	 */
	removeFromParent() {
		if (this.parent != null) {
			var index = this.parent.getIndex(this);
			this.parent.remove(index);
		}
	};

	/**
	 * Function: getEdgeCount
	 *
	 * Returns the number of edges in the edge array.
	 */
	getEdgeCount() {
		return (this.edges == null) ? 0 : this.edges.length;
	};

	/**
	 * Function: getEdgeIndex
	 *
	 * Returns the index of the specified edge in <edges>.
	 * 
	 * Parameters:
	 * 
	 * edge - <mxCell> whose index in <edges> should be returned.
	 */
	getEdgeIndex(edge: any) {
		return mxUtils.indexOf(this.edges ?? [], edge);
	};

	/**
	 * Function: getEdgeAt
	 *
	 * Returns the edge at the specified index in <edges>.
	 * 
	 * Parameters:
	 * 
	 * index - Integer that specifies the index of the edge to be returned.
	 */
	getEdgeAt(index: number) {

		return this.edges?.[index];
	};

	/**
	 * Function: insertEdge
	 *
	 * Inserts the specified edge into the edge array and returns the edge.
	 * Will update the respective terminal reference of the edge.
	 * 
	 * Parameters:
	 * 
	 * edge - <mxCell> to be inserted into the edge array.
	 * isOutgoing - Boolean that specifies if the edge is outgoing.
	 */
	insertEdge(edge: mxCell, isOutgoing: boolean) {
		if (edge != null) {
			edge.removeFromTerminal(isOutgoing);
			edge.setTerminal(this, isOutgoing);

			if (this.edges == null ||
				edge.getTerminal(!isOutgoing) != this ||
				mxUtils.indexOf(this.edges, edge) < 0) {
				if (this.edges == null) {
					this.edges = [];
				}

				this.edges.push(edge);
			}
		}

		return edge;
	};

	/**
	 * Function: removeEdge
	 *
	 * Removes the specified edge from the edge array and returns the edge.
	 * Will remove the respective terminal reference from the edge.
	 * 
	 * Parameters:
	 * 
	 * edge - <mxCell> to be removed from the edge array.
	 * isOutgoing - Boolean that specifies if the edge is outgoing.
	 */
	removeEdge(edge: mxCell, isOutgoing: boolean) {
		if (edge != null) {
			if (edge.getTerminal(!isOutgoing) != this &&
				this.edges != null) {
				var index = this.getEdgeIndex(edge);

				if (index >= 0) {
					this.edges.splice(index, 1);
				}
			}

			edge.setTerminal(null, isOutgoing);
		}

		return edge;
	};

	/**
	 * Function: removeFromTerminal
	 *
	 * Removes the edge from its source or target terminal.
	 * 
	 * Parameters:
	 * 
	 * isSource - Boolean that specifies if the edge should be removed from its
	 * source or target terminal.
	 */
	removeFromTerminal(isSource: boolean) {
		var terminal = this.getTerminal(isSource);

		if (terminal != null) {
			terminal.removeEdge(this, isSource);
		}
	};

	/**
	 * Function: hasAttribute
	 * 
	 * Returns true if the user object is an XML node that contains the given
	 * attribute.
	 * 
	 * Parameters:
	 * 
	 * name - Name of the attribute.
	 */
	hasAttribute(name: string) {
		var userObject = this.getValue();

		return (userObject != null &&
			userObject.nodeType == mxConstants.NODETYPE_ELEMENT && userObject.hasAttribute) ?
			userObject.hasAttribute(name) : userObject.getAttribute(name) != null;
	};

	/**
	 * Function: getAttribute
	 *
	 * Returns the specified attribute from the user object if it is an XML
	 * node.
	 * 
	 * Parameters:
	 * 
	 * name - Name of the attribute whose value should be returned.
	 * defaultValue - Optional default value to use if the attribute has no
	 * value.
	 */
	getAttribute(name: any, defaultValue: any) {
		var userObject = this.getValue();

		var val = (userObject != null &&
			userObject.nodeType == mxConstants.NODETYPE_ELEMENT) ?
			userObject.getAttribute(name) : null;

		return (val != null) ? val : defaultValue;
	};

	/**
	 * Function: setAttribute
	 *
	 * Sets the specified attribute on the user object if it is an XML node.
	 * 
	 * Parameters:
	 * 
	 * name - Name of the attribute whose value should be set.
	 * value - New value of the attribute.
	 */
	setAttribute(name: string, value: any) {
		var userObject = this.getValue();

		if (userObject != null &&
			userObject.nodeType == mxConstants.NODETYPE_ELEMENT) {
			userObject.setAttribute(name, value);
		}
	};

	/**
	 * Function: clone
	 *
	 * Returns a clone of the cell. Uses <cloneValue> to clone
	 * the user object. All fields in <mxTransient> are ignored
	 * during the cloning.
	 */
	clone() {
		var clone = mxUtils.clone(this, this.mxTransient);
		clone.setValue(this.cloneValue());

		return clone;
	};

	/**
	 * Function: cloneValue
	 *
	 * Returns a clone of the cell's user object.
	 */
	cloneValue() {
		var value = this.getValue();

		if (value != null) {
			if (typeof (value.clone) == 'function') {
				value = value.clone();
			}
			else if (!isNaN(value.nodeType)) {
				value = value.cloneNode(true);
			}
		}

		return value;
	};
}
;



