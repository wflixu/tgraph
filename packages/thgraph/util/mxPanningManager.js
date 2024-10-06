
/**
 * Class: mxPanningManager
 *
 * Implements a handler for panning.
 */
export class mxPanningManager {


	/**
	 * Variable: damper
	 * 
	 * Damper value for the panning. Default is 1/6.
	 */
	damper = 1 / 6;

	/**
	 * Variable: delay
	 * 
	 * Delay in milliseconds for the panning. Default is 10.
	 */
	delay = 10;

	/**
	 * Variable: handleMouseOut
	 * 
	 * Specifies if mouse events outside of the component should be handled. Default is true. 
	 */
	handleMouseOut = true;

	/**
	 * Variable: border
	 * 
	 * Border to handle automatic panning inside the component. Default is 0 (disabled).
	 */
	border = 0;


	constructor(graph) {
		this.graph = graph;

		this.thread = null;
		this.active = false;
		this.tdx = 0;
		this.tdy = 0;
		this.t0x = 0;
		this.t0y = 0;
		this.dx = 0;
		this.dy = 0;
		this.scrollbars = false;
		this.scrollLeft = 0;
		this.scrollTop = 0;

		this.mouseListener =
		{
			mouseDown: function (sender, me) { },
			mouseMove: function (sender, me) { },
			mouseUp: (sender, me) => {
				if (this.active) {
					this.stop();
				}
			}
		};

		graph.addMouseListener(this.mouseListener);

		this.mouseUpListener = () => {
			if (this.active) {
				this.stop();
			}
		};

		// Stops scrolling on every mouseup anywhere in the document
		mxEvent.addListener(document, 'mouseup', this.mouseUpListener);


	};

	createThread() {
		this.scrollbars = mxUtils.hasScrollbars(this.graph.container);
		this.scrollLeft = graph.container.scrollLeft;
		this.scrollTop = graph.container.scrollTop;

		return window?.setInterval(() => {
			this.tdx -= this.dx;
			this.tdy -= this.dy;

			if (this.scrollbars) {
				var left = -graph.container.scrollLeft - Math.ceil(this.dx);
				var top = -graph.container.scrollTop - Math.ceil(this.dy);
				graph.panGraph(left, top);
				graph.panDx = this.scrollLeft - graph.container.scrollLeft;
				graph.panDy = this.scrollTop - graph.container.scrollTop;
				graph.fireEvent(new mxEventObject(mxEvent.PAN));
				// TODO: Implement graph.autoExtend
			}
			else {
				graph.panGraph(this.getDx(), this.getDy());
			}
		}, this.delay);
	};

	isActive() {
		return this.active;
	};

	getDx() {
		return Math.round(this.tdx);
	};


	getDy() {
		return Math.round(this.tdy);
	};

	start() {
		this.t0x = graph.view.translate.x;
		this.t0y = graph.view.translate.y;
		this.active = true;
	};

	panTo(x, y, w, h) {
		if (!this.active) {
			this.start();
		}

		this.scrollLeft = graph.container.scrollLeft;
		this.scrollTop = graph.container.scrollTop;

		w = (w != null) ? w : 0;
		h = (h != null) ? h : 0;

		var c = graph.container;
		this.dx = x + w - c.scrollLeft - c.clientWidth;

		if (this.dx < 0 && Math.abs(this.dx) < this.border) {
			this.dx = this.border + this.dx;
		}
		else if (this.handleMouseOut) {
			this.dx = Math.max(this.dx, 0);
		}
		else {
			this.dx = 0;
		}

		if (this.dx == 0) {
			this.dx = x - c.scrollLeft;

			if (this.dx > 0 && this.dx < this.border) {
				this.dx = this.dx - this.border;
			}
			else if (this.handleMouseOut) {
				this.dx = Math.min(0, this.dx);
			}
			else {
				this.dx = 0;
			}
		}

		this.dy = y + h - c.scrollTop - c.clientHeight;

		if (this.dy < 0 && Math.abs(this.dy) < this.border) {
			this.dy = this.border + this.dy;
		}
		else if (this.handleMouseOut) {
			this.dy = Math.max(this.dy, 0);
		}
		else {
			this.dy = 0;
		}

		if (this.dy == 0) {
			this.dy = y - c.scrollTop;

			if (this.dy > 0 && this.dy < this.border) {
				this.dy = this.dy - this.border;
			}
			else if (this.handleMouseOut) {
				this.dy = Math.min(0, this.dy);
			}
			else {
				this.dy = 0;
			}
		}

		if (this.dx != 0 || this.dy != 0) {
			this.dx *= this.damper;
			this.dy *= this.damper;

			if (this.thread == null) {
				this.thread = this.createThread();
			}
		}
		else if (this.thread != null) {
			window?.clearInterval(this.thread);
			this.thread = null;
		}
	};

	stop() {
		if (this.active) {
			this.active = false;

			if (this.thread != null) {
				window?.clearInterval(this.thread);
				this.thread = null;
			}

			this.tdx = 0;
			this.tdy = 0;

			if (!this.scrollbars) {
				var px = graph.panDx;
				var py = graph.panDy;

				if (px != 0 || py != 0) {
					graph.panGraph(0, 0);
					graph.view.setTranslate(this.t0x + px / graph.view.scale, this.t0y + py / graph.view.scale);
				}
			}
			else {
				graph.panDx = 0;
				graph.panDy = 0;
				graph.fireEvent(new mxEventObject(mxEvent.PAN));
			}
		}
	};

	destroy() {
		this.graph.removeMouseListener(this.mouseListener);
		mxEvent.removeListener(document, 'mouseup', this.mouseUpListener);
	};

}

console.log('graph/util/mxPanningManager.js');