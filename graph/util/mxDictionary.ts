import { mxCell } from "../model/mxCell";
import { mxObjectIdentity } from "./mxObjectIdentity";

export class mxDictionary {
    map: any = {};
    constructor() {
        this.clear();
    }


    /**
     * Function: clear
     *
     * Clears the dictionary.
     */
    clear() {
        this.map = {};
    };

    /**
     * Function: get
     *
     * Returns the value for the given key.
     */
    get(key: any) {
        var id = mxObjectIdentity.get(key);

        return this.map[id];
    };

    /**
     * Function: put
     *
     * Stores the value under the given key and returns the previous
     * value for that key.
     */
    put(key, value) {
        var id = mxObjectIdentity.get(key);
        var previous = this.map[id];
        this.map[id] = value;

        return previous;
    };

    /**
     * Function: remove
     *
     * Removes the value for the given key and returns the value that
     * has been removed.
     */
    remove(key) {
        var id = mxObjectIdentity.get(key);
        var previous = this.map[id];
        delete this.map[id];

        return previous;
    };

    /**
     * Function: getKeys
     *
     * Returns all keys as an array.
     */
    getKeys() {
        var result = [];

        for (var key in this.map) {
            result.push(key);
        }

        return result;
    };

    /**
     * Function: getValues
     *
     * Returns all values as an array.
     */
    getValues = function () {
        var result = [];

        for (var key in this.map) {
            result.push(this.map[key]);
        }

        return result;
    };

    /**
     * Function: visit
     *
     * Visits all entries in the dictionary using the given function with the
     * following signature: function(key, value) where key is a string and
     * value is an object.
     * 
     * Parameters:
     * 
     * visitor - A function that takes the key and value as arguments.
     */
    visit(visitor) {
        for (var key in this.map) {
            visitor(key, this.map[key]);
        }
    };

}