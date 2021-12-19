// import { mxActor } from "../shape/mxActor";
// import { mxConnector } from "../shape/mxConnector";
// import { mxCylinder } from "../shape/mxCylinder";
// import { mxEllipse } from "../shape/mxEllipse";
// import { mxRectangleShape } from "../shape/mxRectangleShape";
// import { mxRhombus } from "../shape/mxRhombus";
// import { mxShape } from "../shape/mxShape";
// import { mxTriangle } from "../shape/mxTriangle";
// import { mxConstants } from "../util/mxConstants";


// export interface IShapeMap {
//     [key: string]: any
// }

// export class mxCellRenderer {
//     static defaultShapes: IShapeMap = {};
//     /**
//      * Function: registerShape
//      * 
//      * Registers the given constructor under the specified key in this instance
//      * of the renderer.
//      * 
//      * Example:
//      * 
//      * (code)
//      * mxCellRenderer.registerShape(mxConstants.SHAPE_RECTANGLE, mxRectangleShape);
//      * (end)
//      * 
//      * Parameters:
//      * 
//      * key - String representing the shape name.
//      * shape - Constructor of the <mxShape> subclass.
//      */
//     static registerShape(key: string, shape: any) {
//         mxCellRenderer.defaultShapes[key] = shape;
//     };
// }

// // Adds default shapes into the default shapes array
// mxCellRenderer.registerShape(mxConstants.SHAPE_RECTANGLE, mxRectangleShape);
// mxCellRenderer.registerShape(mxConstants.SHAPE_ELLIPSE, mxEllipse);
// mxCellRenderer.registerShape(mxConstants.SHAPE_RHOMBUS, mxRhombus);
// mxCellRenderer.registerShape(mxConstants.SHAPE_CYLINDER, mxCylinder);
// mxCellRenderer.registerShape(mxConstants.SHAPE_CONNECTOR, mxConnector);
// mxCellRenderer.registerShape(mxConstants.SHAPE_ACTOR, mxActor);
// mxCellRenderer.registerShape(mxConstants.SHAPE_TRIANGLE, mxTriangle);
// mxCellRenderer.registerShape(mxConstants.SHAPE_HEXAGON, mxHexagon);
// mxCellRenderer.registerShape(mxConstants.SHAPE_CLOUD, mxCloud);
// mxCellRenderer.registerShape(mxConstants.SHAPE_LINE, mxLine);
// mxCellRenderer.registerShape(mxConstants.SHAPE_ARROW, mxArrow);
// mxCellRenderer.registerShape(mxConstants.SHAPE_ARROW_CONNECTOR, mxArrowConnector);
// mxCellRenderer.registerShape(mxConstants.SHAPE_DOUBLE_ELLIPSE, mxDoubleEllipse);
// mxCellRenderer.registerShape(mxConstants.SHAPE_SWIMLANE, mxSwimlane);
// mxCellRenderer.registerShape(mxConstants.SHAPE_IMAGE, mxImageShape);
// mxCellRenderer.registerShape(mxConstants.SHAPE_LABEL, mxLabel);