import { noloop } from './../types';
import { mxEventObject } from './mxEventObject';
export class mxEventSource {
	eventSource: any;
	/**
	 * Variable: eventListeners
	 *
	 * Holds the event names and associated listeners in an array. The array
	 * contains the event name followed by the respective listener for each
	 * registered listener.
	  */
	eventListeners: any[] = [];
	/**
	 * Variable: eventsEnabled
	 *
	 * Specifies if events can be fired. Default is true.
	 */
	eventsEnabled = true;

	constructor(eventSource: any) {
		this.eventSource = eventSource;
	}

	isEventsEnabled() {
		return this.eventsEnabled
	}
	setEventsEnabled(value: boolean) {
		this.eventsEnabled = value;
	}
	getEventSource() {
		return this.eventSource;
	}
	setEventSource(value: any) {
		this.eventSource = value;
	}
	addListener(name: string, funct: any) {
		this.eventListeners.push(name);
		this.eventListeners.push(funct);
	}
	removeListener(funct: any) {
		if (this.eventListeners != null) {
			var i = 0;

			while (i < this.eventListeners.length) {
				if (this.eventListeners[i + 1] == funct) {
					this.eventListeners.splice(i, 2);
				}
				else {
					i += 2;
				}
			}
		}
	}

	/**
	 * Function: fireEvent
	 *
	 * Dispatches the given event to the listeners which are registered for
	 * the event. The sender argument is optional. The current execution scope
	 * ("this") is used for the listener invocation (see <mxUtils.bind>).
	 *
	 * Example:
	 *
	 * (code)
	 * fireEvent(new mxEventObject("eventName", key1, val1, .., keyN, valN))
	 * (end)
	 * 
	 * Parameters:
	 *
	 * evt - <mxEventObject> that represents the event.
	 * sender - Optional sender to be passed to the listener. Default value is
	 * the return value of <getEventSource>.
	 */

	fireEvent(evt=new mxEventObject('default'), sender:any = null) {
		if (this.eventListeners != null && this.isEventsEnabled()) {
			

			if (sender == null) {
				sender = this.getEventSource();
			}

			if (!sender) {
				sender = this;
			}

			var args = [sender, evt];

			for (var i = 0; i < this.eventListeners.length; i += 2) {
				var listen = this.eventListeners[i];

				if (listen == null || listen == evt.getName()) {
					this.eventListeners[i + 1].apply(this, args);
				}
			}
		}
	}

}


