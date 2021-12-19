import { TMap } from "../types";
import { mxConstants } from "./mxConstants";
import { mxObjectIdentity } from "./mxObjectIdentity";
import { mxPoint } from "./mxPoint";
import { mxXmlRequest } from "./mxXmlRequest";

export const mxUtils = {
    /**
     * Function: bind
     * 
     * Returns a wrapper function that locks the execution scope of the given
     * function to the specified scope. Inside funct, the "this" keyword
     * becomes a reference to that scope.
     */
    bind: function (scope: any, funct: any) {
        return function () {
            return funct.apply(scope, arguments);
        };
    },

    /**
     * Function: isInteger
     * 
     * Returns true if the given value is an valid integer number.
     * 
     * Parameters:
     * 
     * n - String representing the possibly numeric value.
     */
    isInteger: function (n: string) {
        return String(parseInt(n)) === String(n);
    },


    /**
     * Function: isNumeric
     * 
     * Returns true if the specified value is numeric, that is, if it is not
     * null, not an empty string, not a HEX number and isNaN returns false.
     * 
     * Parameters:
     * 
     * n - String representing the possibly numeric value.
     */
    isNumeric: function (n: string) {
        return !isNaN(parseFloat(n)) && isFinite(parseFloat(n)) && (typeof (n) != 'string' || n.toLowerCase().indexOf('0x') < 0);
    },

    /**
     * Function: eval
     * 
     * Evaluates the given expression using eval and returns the JavaScript
     * object that represents the expression result. Supports evaluation of
     * expressions that define functions and returns the function object for
     * these expressions.
     * 
     * Parameters:
     * 
     * expr - A string that represents a JavaScript expression.
     */
    eval: function (expr: string) {
        // var result = null;

        // if (expr.indexOf('function') >= 0) {
        //     try {
        //         eval('var _mxJavaScriptExpression=' + expr);
        //         result = _mxJavaScriptExpression;
        //         // TODO: Use delete here?
        //         _mxJavaScriptExpression = null;
        //     }
        //     catch (e) {
        //         mxLog.warn(e.message + ' while evaluating ' + expr);
        //     }
        // }
        // else {
        //     try {
        //         result = eval(expr);
        //     }
        //     catch (e) {
        //         mxLog.warn(e.message + ' while evaluating ' + expr);
        //     }
        // }

        // return result;
    },



    /**
     * Function: load
     * 
     * Loads the specified URL *synchronously* and returns the <mxXmlRequest>.
     * Throws an exception if the file cannot be loaded. See <mxUtils.get> for
     * an asynchronous implementation.
     *
     * Example:
     * 
     * (code)
     * try
     * {
     *   var req = mxUtils.load(filename);
     *   var root = req.getDocumentElement();
     *   // Process XML DOM...
     * }
     * catch (ex)
     * {
     *   mxUtils.alert('Cannot load '+filename+': '+ex);
     * }
     * (end)
     * 
     * Parameters:
     * 
     * url - URL to get the data from.
     * !
     */
    load: function (url: string) {
        // var req = new mxXmlRequest(url, null, 'GET', false);
        // req.send();

        // return req;
    },


    /**
     * Function: toRadians
     * 
     * Converts the given degree to radians.
     */
    toRadians: function (deg: number) {
        return Math.PI * deg / 180;
    },

    /**
     * Function: getRotatedPoint
     * 
     * Rotates the given point by the given cos and sin.
     */
    getRotatedPoint: function (pt: mxPoint, cos: number, sin: number, c?: mxPoint) {
        c = (c != null) ? c : new mxPoint();
        var x = pt.x - c.x;
        var y = pt.y - c.y;

        var x1 = x * cos - y * sin;
        var y1 = y * cos + x * sin;

        return new mxPoint(x1 + c.x, y1 + c.y);
    },

    /**
     * Function: indexOf
     * 
     * Returns the index of obj in array or -1 if the array does not contain
     * the given object.
     * 
     * Parameters:
     * 
     * array - Array to check for the given obj.
     * obj - Object to find in the given array.
     */
    indexOf: function (array: any[], obj: any) {
        if (array != null && obj != null) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == obj) {
                    return i;
                }
            }
        }

        return -1;
    },

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
    clone: function (obj, transients, shallow = false) {
        var clone = null;

        if (obj != null && typeof (obj.constructor) == 'function') {
            clone = new obj.constructor();

            for (var i in obj) {
                if (i != mxObjectIdentity.FIELD_NAME && (transients == null ||
                    mxUtils.indexOf(transients, i) < 0)) {
                    if (!shallow && typeof (obj[i]) == 'object') {
                        clone[i] = mxUtils.clone(obj[i], []);
                    }
                    else {
                        clone[i] = obj[i];
                    }
                }
            }
        }

        return clone;
    },


    /**
     * Function: getFunctionName
     * 
     * Returns the name for the given function.
     * 
     * Parameters:
     * 
     * f - JavaScript object that represents a function.
     */
    getFunctionName: function (f) {
        var str = null;

        if (f != null) {
            if (f.name != null) {
                str = f.name;
            }
            else {
                str = f.toString().trim();

                if (/^function\s/.test(str)) {
                    str = mxUtils.ltrim(str.substring(9), null);
                    var idx2 = str.indexOf('(');

                    if (idx2 > 0) {
                        str = str.substring(0, idx2);
                    }
                }
            }
        }

        return str;
    },
    /**
     * Function: ltrim
     * 
     * Strips all whitespaces from the beginning of the string. Without the
     * second parameter, this will trim these characters:
     * 
     * - " " (ASCII 32 (0x20)), an ordinary space
     * - "\t" (ASCII 9 (0x09)), a tab
     * - "\n" (ASCII 10 (0x0A)), a new line (line feed)
     * - "\r" (ASCII 13 (0x0D)), a carriage return
     * - "\0" (ASCII 0 (0x00)), the NUL-byte
     * - "\x0B" (ASCII 11 (0x0B)), a vertical tab
     */
    ltrim: function (str, chars) {
        chars = chars || "\\s";

        return (str != null) ? str.replace(new RegExp("^[" + chars + "]+", "g"), "") : null;
    },

    /**
     * Function: rtrim
     * 
     * Strips all whitespaces from the end of the string. Without the second
     * parameter, this will trim these characters:
     * 
     * - " " (ASCII 32 (0x20)), an ordinary space
     * - "\t" (ASCII 9 (0x09)), a tab
     * - "\n" (ASCII 10 (0x0A)), a new line (line feed)
     * - "\r" (ASCII 13 (0x0D)), a carriage return
     * - "\0" (ASCII 0 (0x00)), the NUL-byte
     * - "\x0B" (ASCII 11 (0x0B)), a vertical tab
     */
    rtrim: function (str, chars) {
        chars = chars || "\\s";

        return (str != null) ? str.replace(new RegExp("[" + chars + "]+$", "g"), "") : null;
    },


    /**
     * Function: isAncestorNode
     * 
     * Returns true if the given ancestor is an ancestor of the
     * given DOM node in the DOM. This also returns true if the
     * child is the ancestor.
     * 
     * Parameters:
     * 
     * ancestor - DOM node that represents the ancestor.
     * child - DOM node that represents the child.
     */
    isAncestorNode: function (ancestor: any, child: any) {
        var parent = child;

        while (parent != null) {
            if (parent == ancestor) {
                return true;
            }

            parent = parent.parentNode;
        }

        return false;
    },

    /**
     * Function: isNode
     * 
     * Returns true if the given value is an XML node with the node name
     * and if the optional attribute has the specified value.
     * 
     * This implementation assumes that the given value is a DOM node if the
     * nodeType property is numeric, that is, if isNaN returns false for
     * value.nodeType.
     * 
     * Parameters:
     * 
     * value - Object that should be examined as a node.
     * nodeName - String that specifies the node name.
     * attributeName - Optional attribute name to check.
     * attributeValue - Optional attribute value to check.
     */
    isNode: function (value?: any, nodeName?: any, attributeName?: any, attributeValue?: any): boolean {
        if (value != null && !isNaN(value.nodeType) && (nodeName == null ||
            value.nodeName.toLowerCase() == nodeName.toLowerCase())) {
            return attributeName == null ||
                value.getAttribute(attributeName) == attributeValue;
        }

        return false;
    },


    /**
     * Function: getTextContent
     * 
     * Returns the text content of the specified node.
     * 
     * Parameters:
     * 
     * node - DOM node to return the text content for.
     */
    getTextContent: function (node: HTMLElement) {
        return node.textContent;
    },

    /**
     * Function: getChildNodes
     * 
     * Returns an array of child nodes that are of the given node type.
     * 
     * Parameters:
     * 
     * node - Parent DOM node to return the children from.
     * nodeType - Optional node type to return. Default is
     * <mxConstants.NODETYPE_ELEMENT>.
     */
    getChildNodes: function (node: Element, nodeType = mxConstants.NODETYPE_ELEMENT) {

        var children = [];
        var tmp = node.firstChild;

        while (tmp != null) {
            if (tmp.nodeType == nodeType) {
                children.push(tmp);
            }

            tmp = tmp.nextSibling;
        }

        return children;
    },

    /**
     * Function: mod
     * 
     * Returns the remainder of division of n by m. You should use this instead
     * of the built-in operation as the built-in operation does not properly
     * handle negative numbers.
     */
    mod: function (n: number, m: number) {
        return ((n % m) + m) % m;
    },


    /**
     * Function: getValue
     * 
     * Returns the value for the given key in the given associative array or
     * the given default value if the value is null.
     * 
     * Parameters:
     * 
     * array - Associative array that contains the value for the key.
     * key - Key whose value should be returned.
     * defaultValue - Value to be returned if the value for the given
     * key is null.
     */
    getValue: function (obj: TMap, key: string, defaultValue?: any) {

        return obj?.[key] ?? defaultValue;

    },


}