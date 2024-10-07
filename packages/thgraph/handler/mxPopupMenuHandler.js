
/**
 * Class: mxPopupMenuHandler
 *
 * Event handler that creates popupmenus.
 *
 * Constructor: mxPopupMenuHandler
 *
 * Constructs an event handler that creates a <mxPopupMenu>.
 */

import { mxUtils, mxEvent, mxPopupMenu } from '../util/index.js';

export class mxPopupMenuHandler extends mxPopupMenu {

  /**
   * Variable: graph
   *
   * Reference to the enclosing <mxGraph>.
   */
  graph = null;

  /**
   * Variable: selectOnPopup
   *
   * Specifies if cells should be selected if a popupmenu is displayed for
   * them. Default is true.
   */
  selectOnPopup = true;

  /**
   * Variable: clearSelectionOnBackground
   *
   * Specifies if cells should be deselected if a popupmenu is displayed for
   * the diagram background. Default is true.
   */
  clearSelectionOnBackground = true;

  /**
   * Variable: triggerX
   *
   * X-coordinate of the mouse down event.
   */
  triggerX = null;

  /**
   * Variable: triggerY
   *
   * Y-coordinate of the mouse down event.
   */
  triggerY = null;

  /**
   * Variable: screenX
   *
   * Screen X-coordinate of the mouse down event.
   */
  screenX = null;

  /**
   * Variable: screenY
   *
   * Screen Y-coordinate of the mouse down event.
   */
  screenY = null;


  constructor(graph, factoryMethod) {
    super();
    if (graph != null) {
      this.graph = graph;
      this.factoryMethod = factoryMethod;
      this.graph.addMouseListener(this);

      // Does not show menu if any touch gestures take place after the trigger
      this.gestureHandler = (sender, eo) => {
        this.inTolerance = false;
      };

      this.graph.addListener(mxEvent.GESTURE, this.gestureHandler);

      this.init();
    }
  }


  /**
   * Function: init
   *
   * Initializes the shapes required for this vertex handler.
   */
  init() {
    // Supercall
    super.init();

    // Hides the tooltip if the mouse is over
    // the context menu
    mxEvent.addGestureListeners(
      this.div,
      (evt) => {
        this.graph.tooltipHandler.hide();
      },
    );
  };

  /**
   * Function: isSelectOnPopup
   *
   * Hook for returning if a cell should be selected for a given <mxMouseEvent>.
   * This implementation returns <selectOnPopup>.
   */
  isSelectOnPopup(me) {
    return this.selectOnPopup;
  };

  /**
   * Function: mouseDown
   *
   * Handles the event by initiating the panning. By consuming the event all
   * subsequent events of the gesture are redirected to this handler.
   */
  mouseDown(sender, me) {
    if (this.isEnabled() && !mxEvent.isMultiTouchEvent(me.getEvent())) {
      // Hides the popupmenu if is is being displayed
      this.hideMenu();
      this.triggerX = me.getGraphX();
      this.triggerY = me.getGraphY();
      this.screenX = mxEvent.getMainEvent(me.getEvent()).screenX;
      this.screenY = mxEvent.getMainEvent(me.getEvent()).screenY;
      this.popupTrigger = this.isPopupTrigger(me);
      this.inTolerance = true;
    }
  };

  /**
   * Function: mouseMove
   *
   * Handles the event by updating the panning on the graph.
   */
  mouseMove(sender, me) {
    // Popup trigger may change on mouseUp so ignore it
    if (this.inTolerance && this.screenX != null && this.screenY != null) {
      if (
        Math.abs(mxEvent.getMainEvent(me.getEvent()).screenX - this.screenX) >
        this.graph.tolerance ||
        Math.abs(mxEvent.getMainEvent(me.getEvent()).screenY - this.screenY) >
        this.graph.tolerance
      ) {
        this.inTolerance = false;
      }
    }
  };

  /**
   * Function: mouseUp
   *
   * Handles the event by setting the translation on the view or showing the
   * popupmenu.
   */
  mouseUp(sender, me) {
    if (
      this.popupTrigger &&
      this.inTolerance &&
      this.triggerX != null &&
      this.triggerY != null
    ) {
      var cell = this.getCellForPopupEvent(me);

      // Selects the cell for which the context menu is being displayed
      if (
        this.graph.isEnabled() &&
        this.isSelectOnPopup(me) &&
        cell != null &&
        !this.graph.isCellSelected(cell)
      ) {
        this.graph.setSelectionCell(cell);
      } else if (this.clearSelectionOnBackground && cell == null) {
        this.graph.clearSelection();
      }

      // Hides the tooltip if there is one
      this.graph.tooltipHandler.hide();

      // Menu is shifted by 1 pixel so that the mouse up event
      // is routed via the underlying shape instead of the DIV
      var origin = mxUtils.getScrollOrigin();
      this.popup(
        me.getX() + origin.x + 1,
        me.getY() + origin.y + 1,
        cell,
        me.getEvent(),
      );
      me.consume();
    }

    this.popupTrigger = false;
    this.inTolerance = false;
  };

  /**
   * Function: getCellForPopupEvent
   *
   * Hook to return the cell for the mouse up popup trigger handling.
   */
  getCellForPopupEvent(me) {
    return me.getCell();
  };

  /**
   * Function: destroy
   *
   * Destroys the handler and all its resources and DOM nodes.
   */
  destroy() {
    this.graph.removeMouseListener(this);
    this.graph.removeListener(this.gestureHandler);

    // Supercall
    super.destroy();
  };
}


console.log('graph/handler/mxPopupMenuHandler.js');