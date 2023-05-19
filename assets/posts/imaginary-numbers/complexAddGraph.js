import * as Cartesian from '../../js/cartesianDrawer.js'
import { canvasScripts } from '../../js/canvasScripts.js'
import { TableBuilder, RowBuilder, TableItem } from '../../js/domUI/tableBuilder.js'
import { BindableObject } from '../../js/core/bindables.js'
import { colorPalette } from '../../js/graphics/palette.js'

canvasScripts.set('complexAddGraph', {
  time: 0,
  graph: {},
  vecA: {},
  vecB: {},
  addVec: {},

  init: function (gfxContext) {
    let data = new Cartesian.Data();
    data.axis.yLabel.text = "i";
    this.graph = new Cartesian.Graph(gfxContext, data);

    this.vecA = this.graph.addPoint(
      new Cartesian.PointInitData({ x: 2, y: 2, color: colorPalette[0], lineFrom: [{point: this.graph.center}] })
    );
    this.vecB = this.graph.addPoint(
      new Cartesian.PointInitData({ x: -2, y: 2, color: colorPalette[1], lineFrom: [{point: this.graph.center}] })
    );
    this.addVec = this.graph.addPoint(
      new Cartesian.PointInitData({
        color: colorPalette[2],
        lineFrom: [{point: this.vecB, color: colorPalette[0]}, {point: this.vecA, color: colorPalette[1]}],
        interactive: false
      })
    );

    let parameterDOM = document.getElementById("complex-add-cartesian-data");
    let valFormat = (val) => { return val.toFixed(2); };
    let strConversion = (str) => { return parseFloat(str); };

    parameterDOM.appendChild(new TableBuilder()
      .addHeader([
        new TableItem({value: ""}), 
        new TableItem({value: "x"}), 
        new TableItem({value: "i"})
      ])
      .addRow(new RowBuilder()
        .addLabel(new TableItem({ value: "A", color: this.vecA.graphics.color }))
        .addInput(new TableItem({
          value: new BindableObject(this.vecA.getX.bind(this.vecA), this.vecA.setX.bind(this.vecA), this.vecA.onChanged),
          format: valFormat,
          strConversion: strConversion
        }))
        .addInput(new TableItem({
          value: new BindableObject(this.vecA.getY.bind(this.vecA), this.vecA.setY.bind(this.vecA), this.vecA.onChanged),
          format: valFormat,
          strConversion: strConversion
        }))
        .toRow()
      )
      .addRow(new RowBuilder()
        .addLabel(new TableItem({ value: "+" }))
        .addEmpty()
        .addEmpty()
        .toRow()
      )
      .addRow(new RowBuilder()
        .addLabel(new TableItem({ value: "B", color: this.vecB.graphics.color }))
        .addInput(new TableItem({
          value: new BindableObject(this.vecB.getX.bind(this.vecB), this.vecB.setX.bind(this.vecB), this.vecB.onChanged),
          format: valFormat,
          strConversion: strConversion
        }))
        .addInput(new TableItem({
          value: new BindableObject(this.vecB.getY.bind(this.vecB), this.vecB.setY.bind(this.vecB), this.vecB.onChanged),
          format: valFormat,
          strConversion: strConversion
        }))
        .toRow()
      )
      .addRow(new RowBuilder()
        .addLabel(new TableItem({ value: "=" }))
        .addEmpty()
        .addEmpty()
        .toRow()
      )
      .addRow(new RowBuilder()
        .addLabel(new TableItem({ value: "A+B", color: this.addVec.graphics.color }))
        .addLabel(new TableItem({
          value: new BindableObject(this.addVec.getX.bind(this.addVec), this.addVec.setX.bind(this.addVec), this.addVec.onChanged),
          format: valFormat,
          strConversion: strConversion
        }))
        .addLabel(new TableItem({
          value: new BindableObject(this.addVec.getY.bind(this.addVec), this.addVec.setY.bind(this.addVec), this.addVec.onChanged),
          format: valFormat,
          strConversion: strConversion
        }))
        .toRow()
      ).toTable());
    
  },

  render: function (app, dt) {
    this.time += dt;
    this.addVec.setXY(
      this.vecA.getX() + this.vecB.getX(),
      this.vecA.getY() + this.vecB.getY()
    );
    this.graph.render();
  }
});