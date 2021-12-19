/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */
/**
 * Class: mxEventObject
 *
 * The mxEventObject is a wrapper for all properties of a single event.
 * Additionally, it also offers functions to consume the event and check if it
 * was consumed as follows:
 *
 * (code)
 * evt.consume();
 * INV: evt.isConsumed() == true
 * (end)
 *
 * Constructor: mxEventObject
 *
 * Constructs a new event object with the specified name. An optional
 * sequence of key, value pairs can be appended to define properties.
 *
 * Example:
 *
 * (code)
 * new mxEventObject("eventName", key1, val1, .., keyN, valN)
 * (end)
 */
export class mxEventObject {
  /**
   * Variable: name
   *
   * Holds the name.
   */
  name: string;
  /**
   * Variable: properties
   *
   * Holds the properties as an associative array.
   */
  properties: any = {};
  /**
   * Variable: consumed
   *
   * Holds the consumed state. Default is false.
   */
  consumed: boolean = false;

  constructor(name: string, ...args: any[]) {
    this.name = name;
    for (var i = 0; i < args.length; i += 2) {
      if (args[i + 1]) {
        this.properties[args[i]] = args[i + 1];
      }
    }
  }

  getName() {
    return this.name;
  }

  getProperties() {
    return this.properties;
  }

  getProperty(key: string) {
    this.properties[key];
  }
  isConsumed() {
    return this.consumed;
  }

  consume(value: boolean = true) {
    this.consumed = value;
  }


}

