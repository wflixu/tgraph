
/**
 * Function: clone
 *
 * Recursively clones the specified object ignoring all fieldnames in the
 * given array of transient fields. <mxObjectIdentity.FIELD_NAME> is always
 * ignored by this function.
 *
 * Parameters:
 *
 * obj - Object to be cloned.
 * transients - Optional array of strings representing the fieldname to be
 * ignored.
 * shallow - Optional boolean argument to specify if a shallow clone should
 * be created, that is, one where all object references are not cloned or,
 * in other words, one where only atomic (strings, numbers) values are
 * cloned. Default is false.
 */


const FIELD_NAME = 'mxObjectId'

export function clone(obj, transients, shallow ) {
    shallow = shallow != null ? shallow : false;
    let res = null;

    if (obj != null && typeof obj.constructor == 'function') {
        res = new obj.constructor();

        for (var i in obj) {
            if (
                i != FIELD_NAME &&
                (!Array.isArray(transients) || transients.findIndex((t) => t == i) < 0)
            ) {
                if (!shallow && typeof obj[i] == 'object') {
                    res[i] = clone(obj[i]);
                } else {
                    res[i] = obj[i];
                }
            }
        }
    }

    return res;
}


/**
* Function: getFunctionName
*
* Returns the name for the given function.
*
* Parameters:
*
* f - JavaScript object that represents a function.
*/
export function getFunctionName(f) {
    var str = null;

    if (f != null) {
        if (f.name != null) {
            str = f.name;
        } else {
            str = mxUtils.trim(f.toString());

            if (/^function\s/.test(str)) {
                str = mxUtils.ltrim(str.substring(9));
                var idx2 = str.indexOf('(');

                if (idx2 > 0) {
                    str = str.substring(0, idx2);
                }
            }
        }
    }

    return str;
}


/**
 * Function: getSource
 * 
 * Returns the event's target or srcElement depending on the browser.
 */
export function getSource(evt) {
    return (evt.srcElement != null) ? evt.srcElement : evt.target;
}


/**
 * Function: getMainEvent
 * 
 * Returns the touch or mouse event that contains the mouse coordinates.
 */
export function getMainEvent(e) {
    if ((e.type == 'touchstart' || e.type == 'touchmove') && e.touches != null && e.touches[0] != null) {
        e = e.touches[0];
    }
    else if (e.type == 'touchend' && e.changedTouches != null && e.changedTouches[0] != null) {
        e = e.changedTouches[0];
    }

    return e;
}

/**
 * Function: getClientX
 * 
 * Returns true if the meta key is pressed for the given event.
 */
export function getClientX(e) {
    return getMainEvent(e).clientX;
}

/**
 * Function: getClientY
 * 
 * Returns true if the meta key is pressed for the given event.
 */

export function getClientY(e) {
    return getMainEvent(e).clientY;
}


/**
  * Function: write
  *
  * Creates a text node for the given string and appends it to the given
  * parent. Returns the text node.
  *
  * Parameters:
  *
  * parent - DOM node to append the text node to.
  * text - String representing the text to be added.
  */
export function write(parent, text) {
    var doc = parent.ownerDocument;
    var node = doc.createTextNode(text);

    if (parent != null) {
        parent.appendChild(node);
    }

    return node;
}


/**
 * Function: parseXml
 *
 * Parses the specified XML string into a new XML document and returns the
 * new document.
 *
 * Example:
 *
 * (code)
 * var doc = mxUtils.parseXml(
 *   '<mxGraphModel><root><MyDiagram id="0"><mxCell/></MyDiagram>'+
 *   '<MyLayer id="1"><mxCell parent="0" /></MyLayer><MyObject id="2">'+
 *   '<mxCell style="strokeColor=blue;fillColor=red" parent="1" vertex="1">'+
 *   '<mxGeometry x="10" y="10" width="80" height="30" as="geometry"/>'+
 *   '</mxCell></MyObject></root></mxGraphModel>');
 * (end)
 *
 * Parameters:
 *
 * xml - String that contains the XML data.
 */
export function parseXml(xml) {
    var parser = new DOMParser();

    return parser.parseFromString(xml, 'text/xml');
}