
/**
 * Class: mxEventSource
 *
 * Base class for objects that dispatch named events. To create a subclass that
 * inherits from mxEventSource, the following code is used.
 *

 * Known Subclasses:
 *
 * <mxGraphModel>, <mxGraph>, <mxGraphView>, <mxEditor>, <mxCellOverlay>,
 * <mxToolbar>, <mxWindow>
 * 
 * Constructor: mxEventSource
 *
 * Constructs a new event source.
 */

export class mxEventSource {


    /**
     * Variable: eventListeners
     *
     * Holds the event names and associated listeners in an array. The array
     * contains the event name followed by the respective listener for each
     * registered listener.
     */
    eventListeners = [];

    /**
     * Variable: eventsEnabled
     *
     * Specifies if events can be fired. Default is true.
     */
    eventsEnabled = true;

    /**
     * Variable: eventSource
     *
     * Optional source for events. Default is null.
     */
    eventSource = null;


    constructor(eventSource) {
        this.setEventSource(eventSource);
    }

    isEventsEnabled() {
        return this.eventsEnabled;
    }

    setEventsEnabled(value) {
        this.eventsEnabled = value;
    }

    getEventSource() {
        return this.eventSource;
    }

    setEventSource(value) {
        this.eventSource = value;
    }

    addListener(name, funct) {
        if (!this.eventListeners) {
            this.eventListeners = [];
        }
        this.eventListeners.push(name);
        this.eventListeners.push(funct);
    }

    removeListener(funct) {
        if (this.eventListeners) {
            let i = 0;
            while (i < this.eventListeners.length) {
                if (this.eventListeners[i + 1] === funct) {
                    this.eventListeners.splice(i, 2);
                } else {
                    i += 2;
                }
            }
        }
    }

    fireEvent(evt, sender) {
        if (this.eventListeners && this.isEventsEnabled()) {
            if (!evt) {
                evt = new mxEventObject();
            }
            if (!sender) {
                sender = this.getEventSource();
            }
            if (!sender) {
                sender = this;
            }
            const args = [sender, evt];
            for (let i = 0; i < this.eventListeners.length; i += 2) {
                const listen = this.eventListeners[i];
                if (!listen || listen === evt.getName()) {
                    this.eventListeners[i + 1].apply(this, args);
                }
            }
        }
    }
}
