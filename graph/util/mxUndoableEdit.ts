/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 */

import { mxEvent } from "./mxEvent";
import { mxEventObject } from "./mxEventObject";

/**
 * Class: mxUndoableEdit
 * 
 * Implements a composite undoable edit. Here is an example for a custom change
 * which gets executed via the model:
 * 
 * (code)
 * function CustomChange(model, name)
 * {
 *   this.model = model;
 *   this.name = name;
 *   this.previous = name;
 * };
 * 
 * CustomChange.prototype.execute = function()
 * {
 *   var tmp = this.model.name;
 *   this.model.name = this.previous;
 *   this.previous = tmp;
 * };
 * 
 * var name = prompt('Enter name');
 * graph.model.execute(new CustomChange(graph.model, name));
 * (end)
 * 
 * Event: mxEvent.EXECUTED
 * 
 * Fires between START_EDIT and END_EDIT after an atomic change was executed.
 * The <code>change</code> property contains the change that was executed.
 * 
 * Event: mxEvent.START_EDIT
 * 
 * Fires before a set of changes will be executed in <undo> or <redo>.
 * This event contains no properties.
 * 
 * Event: mxEvent.END_EDIT
 *
 * Fires after a set of changeswas executed in <undo> or <redo>.
 * This event contains no properties.
 * 
 * Constructor: mxUndoableEdit
 * 
 * Constructs a new undoable edit for the given source.
 */
export class mxUndoableEdit {
    source: any;
    changes: any[] = [];
    significant: boolean;
    undone: boolean = false;
    redone: boolean = false;

    constructor(source: any, significant = true) {
        this.source = source;
        this.significant = significant;
    }
    isEmpty() {
        return !this.changes.length
    }
    isSignificant() {
        return this.significant;
    }
    add(change: any) {
        this.changes.push(change)
    }
    notify() {
        
    }
    die() {

    }

    undo() {
        if (!this.undone) {
            this.source.fireEvent(new mxEventObject(mxEvent.START_EDIT));
            var count = this.changes.length;

            for (var i = count - 1; i >= 0; i--) {
                var change = this.changes[i];

                if (change.execute != null) {
                    change.execute();
                }
                else if (change.undo != null) {
                    change.undo();
                }

                // New global executed event
                this.source.fireEvent(new mxEventObject(mxEvent.EXECUTED, 'change', change));
            }

            this.undone = true;
            this.redone = false;
            this.source.fireEvent(new mxEventObject(mxEvent.END_EDIT));
        }

        this.notify();
    }


    redo() {
        if (!this.redone) {
            this.source.fireEvent(new mxEventObject(mxEvent.START_EDIT));
            var count = this.changes.length;

            for (var i = 0; i < count; i++) {
                var change = this.changes[i];

                if (change.execute != null) {
                    change.execute();
                }
                else if (change.redo != null) {
                    change.redo();
                }

                // New global executed event
                this.source.fireEvent(new mxEventObject(mxEvent.EXECUTED, 'change', change));
            }

            this.undone = false;
            this.redone = true;
            this.source.fireEvent(new mxEventObject(mxEvent.END_EDIT));
        }

        this.notify();
    }

};

