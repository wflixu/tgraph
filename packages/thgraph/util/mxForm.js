// TODO UI
/**
 * Class: mxForm
 *
 * A simple class for creating HTML forms.
 *
 * Constructor: mxForm
 *
 * Creates a HTML table using the specified classname.
 */

import { mxUtils } from './mxUtils.js';


export class mxForm {
  /**
   * Variable: table
   *
   * Holds the DOM node that represents the table.
   */
  table = null;

  /**
   * Variable: body
   *
   * Holds the DOM node that represents the tbody (table body). New rows
   * can be added to this object using DOM API.
   */
  body = false;

  constructor(className) {
    this.table = document.createElement('table');
    this.table.className = className;
    this.body = document.createElement('tbody');

    this.table.appendChild(this.body);
  }

  /**
   * Function: getTable
   *
   * Returns the table that contains this form.
   */
  getTable() {
    return this.table;
  }

  /**
   * Function: addButtons
   *
   * Helper method to add an OK and Cancel button using the respective
   * functions.
   */
  addButtons(okFunct, cancelFunct) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tr.appendChild(td);
    td = document.createElement('td');

    // Adds the ok button
    var button = document.createElement('button');
    mxUtils.write(button, mxResources.get('ok') || 'OK');
    td.appendChild(button);

    mxEvent.addListener(button, 'click', function () {
      okFunct();
    });

    // Adds the cancel button
    button = document.createElement('button');
    mxUtils.write(button, mxResources.get('cancel') || 'Cancel');
    td.appendChild(button);

    mxEvent.addListener(button, 'click', function () {
      cancelFunct();
    });

    tr.appendChild(td);
    this.body.appendChild(tr);
  }

  /**
   * Function: addText
   *
   * Adds an input for the given name, type and value and returns it.
   */
  addText(name, value, type) {
    var input = document.createElement('input');

    input.setAttribute('type', type || 'text');
    input.value = value;

    return this.addField(name, input);
  }

  /**
   * Function: addCheckbox
   *
   * Adds a checkbox for the given name and value and returns the textfield.
   */
  addCheckbox(name, value) {
    var input = document.createElement('input');

    input.setAttribute('type', 'checkbox');
    this.addField(name, input);

    // IE can only change the checked value if the input is inside the DOM
    if (value) {
      input.checked = true;
    }

    return input;
  }

  /**
   * Function: addTextarea
   *
   * Adds a textarea for the given name and value and returns the textarea.
   */
  addTextarea(name, value, rows) {
    var input = document.createElement('textarea');


    input.setAttribute('rows', rows || 2);
    input.value = value;

    return this.addField(name, input);
  }

  /**
   * Function: addCombo
   *
   * Adds a combo for the given name and returns the combo.
   */
  addCombo(name, isMultiSelect, size) {
    var select = document.createElement('select');

    if (size != null) {
      select.setAttribute('size', size);
    }

    if (isMultiSelect) {
      select.setAttribute('multiple', 'true');
    }

    return this.addField(name, select);
  }

  /**
   * Function: addOption
   *
   * Adds an option for the given label to the specified combo.
   */
  addOption(combo, label, value, isSelected) {
    var option = document.createElement('option');

    mxUtils.writeln(option, label);
    option.setAttribute('value', value);

    if (isSelected) {
      option.setAttribute('selected', isSelected);
    }

    combo.appendChild(option);
  }

  /**
   * Function: addField
   *
   * Adds a new row with the name and the input field in two columns and
   * returns the given input.
   */
  addField(name, input) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    mxUtils.write(td, name);
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(input);
    tr.appendChild(td);
    this.body.appendChild(tr);

    return input;
  }
}

console.log('graph/util/mxForm.js');
