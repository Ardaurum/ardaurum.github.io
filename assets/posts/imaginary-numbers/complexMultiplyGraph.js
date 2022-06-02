import * as Cartesian from '../../js/cartesianDrawer.js'
import { canvasScripts } from '../../js/canvasScripts.js'
import { TableBuilder, RowBuilder, TableItem } from '../../js/domUI/tableBuilder.js'
import { BindableObject } from '../../js/core/bindables.js'
import { complex } from '../../js/math/complex.js'

canvasScripts.set('complexMultiplyGraph', {
  time: 0,
  graph: {},
  vecA: {},
  vecB: {},
  mulVec: {},

  init: function (gfxContext) {
    let data = new Cartesian.Data();
    data.axis.yLabel.text = "i";
    this.graph = new Cartesian.Graph(gfxContext, data);

    this.vecA = this.graph.addPoint(
      new Cartesian.PointInitData({ x: 2, y: 2, color: 0xAA2222, lineFrom: [{point: this.graph.center}] })
    );
    this.vecB = this.graph.addPoint(
      new Cartesian.PointInitData({ x: -2, y: 2, color: 0x22AA22, lineFrom: [{point: this.graph.center}] })
    );
    this.mulVec = this.graph.addPoint(
      new Cartesian.PointInitData({ color: 0xBBBB22, lineFrom: [{point: this.graph.center}], interactive: false }));

    let parameterDOM = document.getElementById("complex-mul-cartesian-data");
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
        .addLabel(new TableItem({ value: "A*B", color: this.mulVec.graphics.color }))
        .addLabel(new TableItem({
          value: new BindableObject(this.mulVec.getX.bind(this.mulVec), this.mulVec.setX.bind(this.mulVec), this.mulVec.onChanged),
          format: valFormat,
          strConversion: strConversion
        }))
        .addLabel(new TableItem({
          value: new BindableObject(this.mulVec.getY.bind(this.mulVec), this.mulVec.setY.bind(this.mulVec), this.mulVec.onChanged),
          format: valFormat,
          strConversion: strConversion
        }))
        .toRow()
      ).toTable());
    
  },

  render: function (app, dt) {
    this.time += dt;
    let complexA = complex.create(this.vecA.getX(), this.vecA.getY());
    let complexB = complex.create(this.vecB.getX(), this.vecB.getY());
    let complexMul = complexA.mul(complexB);
    this.mulVec.setXY(complexMul.a, complexMul.b);
    this.graph.render();
  }
});