import { mxEvent } from './mxEvent.js';
import { mxEventObject } from './mxEventObject.js';
import { mxEventSource } from './mxEventSource.js';
import { mxUtils } from './mxUtils.js';

/**
 *
 * Class: mxAnimation
 *
 * Implements a basic animation in JavaScript.
 *
 * Constructor: mxAnimation
 *
 * Constructs an animation.
 *
 * Parameters:
 *
 * graph - Reference to the enclosing <mxGraph>.
 */

export class mxAnimation extends mxEventSource {
  /**
   * Variable: delay
   *
   * Specifies the delay between the animation steps. Defaul is 30ms.
   */
  delay = null;

  /**
   * Variable: thread
   *
   * Reference to the thread while the animation is running.
   */
  thread = null;
  constructor(delay = 20) {
    super();
    this.delay = delay;
  }

  /**
   * Function: isRunning
   *
   * Returns true if the animation is running.
   */
  isRunning() {
    return this.thread != null;
  }

  /**
   * Function: startAnimation
   *
   * Starts the animation by repeatedly invoking updateAnimation.
   */
  startAnimation() {
    if (this.thread == null) {
      this.thread = window?.setInterval(
        mxUtils.bind(this, this.updateAnimation),
        this.delay,
      );
    }
  }

  /**
   * Function: updateAnimation
   *
   * Hook for subclassers to implement the animation. Invoke stopAnimation
   * when finished, startAnimation to resume. This is called whenever the
   * timer fires and fires an mxEvent.EXECUTE event with no properties.
   */
  updateAnimation() {
    this.fireEvent(new mxEventObject(mxEvent.EXECUTE));
  }

  /**
   * Function: stopAnimation
   *
   * Stops the animation by deleting the timer and fires an <mxEvent.DONE>.
   */
  stopAnimation() {
    if (this.thread != null) {
      window?.clearInterval(this.thread);
      this.thread = null;
      this.fireEvent(new mxEventObject(mxEvent.DONE));
    }
  }
}
