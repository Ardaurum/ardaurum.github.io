export function TableItem(init) {
	init = init || {};
  this.value = init.value == null ? "" : init.value;
  this.color = init.color == null ? 0xFFFFFF : init.color;
  this.format = init.format == null ? (val) => { return val; } : init.format;
	this.strConversion = init.strConversion == null ? (val) => { return val; } : init.strConversion;
}

export class TableBuilder {
  constructor() {
    this.table = document.createElement('table');
    this.tbody = document.createElement('tbody');
  }

  addHeader(labels) {
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    for (const header of labels) {
      let headerCell = document.createElement('th');
      headerCell.appendChild(document.createTextNode(header.format(header.value)));
			headerCell.style.color = "#" + header.color.toString(16);
      headerRow.appendChild(headerCell);
    }
    thead.appendChild(headerRow);
    this.table.appendChild(thead);
    return this;
  }

  addRow(row) {
    this.tbody.appendChild(row);
    return this;
  }

  toTable() {
    this.table.appendChild(this.tbody);
    return this.table;
  }
}

export class RowBuilder {
  constructor() {
    this.row = document.createElement('tr');
  }

  addLabel(item) {
    let cell = document.createElement('td');
    if (item.value.subscribe) {
      item.value.subscribe((v) => {
        cell.innerHTML = item.format(v);
      });
      cell.innerHTML = item.format(item.value.get());
    } else {
      cell.innerHTML = item.format(item.value);
    }
		cell.style.color = "#" + item.color.toString(16);
    this.row.appendChild(cell);
    return this;
  }

  addInput(item, type = "number") {
    let cell = document.createElement('td');
    if (item.value.subscribe) {
      cell.innerHTML = '';
      let input = document.createElement('input');
      input.type = type;
      input.step = "1";
      input.value = item.format(item.value.get());
      
      item.value.subscribe((v) => {
        let result = item.format(v);
        input.value = result;
      });
      input.addEventListener("change", () => {
        let result = item.strConversion(input.value);
        item.value.set(result);
      });
      cell.appendChild(input);
    } else {
      cell.innerHTML = item.format(item.value);
    }
		cell.style.color = "#" + item.color.toString(16);
    this.row.appendChild(cell);
    return this;
  }

  toRow() {
    return this.row;
  }
}