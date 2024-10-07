import { mxClient } from '../mxClient.js';


/**
 * Class: mxEvent
 * 
 * Cross-browser DOM event support. For internal event handling,
 * <mxEventSource> and the graph event dispatch loop in <mxGraph> are used.
 * 
 * Memory Leaks:
 * 
 * Use this class for adding and removing listeners to/from DOM nodes. The
 * <removeAllListeners> function is provided to remove all listeners that
 * have been added using <addListener>. The function should be invoked when
 * the last reference is removed in the JavaScript code, typically when the
 * referenced DOM node is removed from the DOM.
 *
 * Function: addListener
 * 
 * Binds the function to the specified event on the given element. 
 */
export function addListener(element, eventName, funct) {
    const updateListenerList = (element, eventName, funct) => {
        if (!element.mxListenerList) {
            element.mxListenerList = [];
        }
        const entry = { name: eventName, f: funct };
        element.mxListenerList.push(entry);
    };

    if (window?.addEventListener) {
        element.addEventListener(eventName, funct, false);
        updateListenerList(element, eventName, funct);
    } else {
        element.attachEvent('on' + eventName, funct);
        updateListenerList(element, eventName, funct);
    }
}

/**
 * Function: isMouseEvent
 * 
 * Returns true if the event was generated using a mouse (not a pen or touch device).
 */
export function isMouseEvent(evt) {
    return (evt.pointerType != null) ? (evt.pointerType == 'mouse' || evt.pointerType ===
        evt.MSPOINTER_TYPE_MOUSE) : ((evt.mozInputSource != null) ?
            evt.mozInputSource == 1 : evt.type.indexOf('mouse') == 0);
}

/**
 * Function: isAltDown
 * 
 * Returns true if the alt key is pressed for the given event.
 */
export function isAltDown(evt) {
    return (evt != null) ? evt.altKey : false;
}

/**
 * Function: isMetaDown
 * 
 * Returns true if the meta key is pressed for the given event.
 */
export function isMetaDown(evt) {
    return (evt != null) ? evt.metaKey : false;
}

/**
 * Function: isPopupTrigger
 * 
 * Returns true if the event is a popup trigger. This implementation
 * returns true if the right button or the left button and control was
 * pressed on a Mac.
 */
export function isPopupTrigger(evt) {
    return isRightMouseButton(evt) || (mxClient.IS_MAC && isControlDown(evt) &&
        !isShiftDown(evt) && !isMetaDown(evt) && !isAltDown(evt));
}


/**
 * Function: isRightMouseButton
 * 
 * Returns true if the right mouse button was pressed. Note that this
 * button might not be available on some systems. For handling a popup
 * trigger <isPopupTrigger> should be used.
 */
export function isRightMouseButton(evt) {
    if ('which' in evt) {
        return evt.which === 3;
    }
    else {
        return evt.button === 2;
    }
}

/**
     * Function: isControlDown
     * 
     * Returns true if the control key is pressed for the given event.
     */
export function isControlDown(evt) {
    return (evt != null) ? evt.ctrlKey : false;
}

/**
 * Function: isShiftDown
 * 
 * Returns true if the shift key is pressed for the given event.
 */
export function isShiftDown(evt) {
    return (evt != null) ? evt.shiftKey : false;
}