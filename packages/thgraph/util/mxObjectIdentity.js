
import { FIELD_NAME } from "./mxConstants.js"
import { getFunctionName } from "./tools.js"

export const mxObjectIdentity = {

  /**
   * Variable: counter
   *
   * Current counter.
   */
  counter: 0,

  /**
   * Function: get
   *
   * Returns the ID for the given object or function or null if no object
   * is specified.
   */
  get: function (obj) {
    if (obj != null) {
      if (obj[FIELD_NAME] == null) {
        if (typeof obj === 'object') {
          var ctor = getFunctionName(obj.constructor);
          obj[FIELD_NAME] =
            ctor + '#' + mxObjectIdentity.counter++;
        } else if (typeof obj === 'function') {
          obj[FIELD_NAME] =
            'Function#' + mxObjectIdentity.counter++;
        }
      }

      return obj[FIELD_NAME];
    }

    return null;
  },

  /**
   * Function: clear
   *
   * Deletes the ID from the given object or function.
   */
  clear: function (obj) {
    if (typeof obj === 'object' || typeof obj === 'function') {
      delete obj[FIELD_NAME];
    }
  },
};
console.log('graph/util/mxObjectIdentity.js');