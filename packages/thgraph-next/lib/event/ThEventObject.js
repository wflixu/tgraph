/**
 * Class: ThEventObject
 *
 * The ThEventObject is a wrapper for all properties of a single event.
 * Additionally, it also offers functions to consume the event and check if it
 * was consumed as follows:
 *
 * (code)
 * evt.consume();
 * INV: evt.isConsumed() == true
 * (end)
 *
 * Constructor: ThEventObject
 *
 * Constructs a new event object with the specified name. An optional
 * sequence of key, value pairs can be appended to define properties.
 *
 * Example:
 *
 * (code)
 * new ThEventObject("eventName", key1, val1, .., keyN, valN)
 * (end)
 */
export class ThEventObject {
    /**
     * Variable: name
     *
     * Holds the name.
     */
    name;
    /**
     * Variable: properties
     *
     * Holds the properties as an associative array.
     */
    properties = {};
    /**
     * Variable: consumed
     *
     * Holds the consumed state. Default is false.
     */
    consumed = false;
    constructor(name, ...other) {
        this.name = name;
        for (var i = 0; i < other.length; i += 2) {
            if (other[i + 1] != null) {
                this.properties[other[i]] = other[i + 1];
            }
        }
    }
    ;
    /**
     * Function: getName
     *
     * Returns <name>.
     */
    getName() {
        return this.name;
    }
    ;
    /**
     * Function: getProperties
     *
     * Returns <properties>.
     */
    getProperties() {
        return this.properties;
    }
    ;
    /**
     * Function: getProperty
     *
     * Returns the property for the given key.
     */
    getProperty(key) {
        return this.properties[key];
    }
    ;
    /**
     * Function: isConsumed
     *
     * Returns true if the event has been consumed.
     */
    isConsumed() {
        return this.consumed;
    }
    ;
    /**
     * Function: consume
     *
     * Consumes the event.
     */
    consume() {
        this.consumed = true;
    }
    ;
}
