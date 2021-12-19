import { mxStencil } from "./mxStencil";

/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * 
 * Code to add stencils.
 * 
 * (code)
 * var req = mxUtils.load('test/stencils.xml');
 * var root = req.getDocumentElement();
 * var shape = root.firstChild;
 * 
 * while (shape != null)
 * {
 * 	 if (shape.nodeType == mxConstants.NODETYPE_ELEMENT)
 *   {
 *     mxStencilRegistry.addStencil(shape.getAttribute('name'), new mxStencil(shape));
 *   }
 *   
 *   shape = shape.nextSibling;
 * }
 * (end)
 */

export interface IStencilMap {
	[key: string]: mxStencil;
}
export class mxStencilRegistry {
	/**
	 * Class: mxStencilRegistry
	 * 
	 * A singleton class that provides a registry for stencils and the methods
	 * for painting those stencils onto a canvas or into a DOM.
	 */
	static stencils: IStencilMap = {};

	/**
	 * Function: addStencil
	 * 
	 * Adds the given <mxStencil>.
	 */
	static addStencil(name: string, stencil: mxStencil) {
		mxStencilRegistry.stencils[name] = stencil;
	}

	/**
	 * Function: getStencil
	 * 
	 * Returns the <mxStencil> for the given name.
	 */
	static getStencil(name: string) {
		return mxStencilRegistry.stencils[name];
	}
};
