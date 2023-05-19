import * as Cartesian from '../../js/cartesianDrawer.js'
import { canvasScripts } from '../../js/canvasScripts.js'
import { TableBuilder, RowBuilder, TableItem } from '../../js/domUI/tableBuilder.js'
import { BindableObject, BindableValue } from '../../js/core/bindables.js'
import { complex } from '../../js/math/complex.js'
import { colorPalette } from '../../js/graphics/palette.js'
import { RMath } from '../../js/math/rmath.js'

canvasScripts.set('complexMultiplyGraph', {
  time: 0,
  graph: {},
  vecA: {},
  vecB: {},
  mulVec: {},

  init: function (gfxContext) {
    let data = new Cartesian.Data();
    data.axis.yLabel.text = "i";
    data.axis.maxUnit = 3;
    this.graph = new Cartesian.Graph(gfxContext, data);

    this.vecA = this.graph.addPoint(
      new Cartesian.PointInitData({ 
        color: colorPalette[0], 
        lineFrom: [{point: this.graph.center}], 
        angleDisplay: new Cartesian.AngleDisplayInitData({ 
          color: colorPalette[0]
        }) 
      })
    );
    this.vecB = this.graph.addPoint(
      new Cartesian.PointInitData({ 
        color: colorPalette[1], 
        lineFrom: [{point: this.graph.center}], 
        customRender: (point) => {
          point.graphics.lineStyle(Cartesian.AngleDisplayDefaults.size, point.graphics.color);
          let vecAAngle = Math.atan2(this.vecA.getY(), this.vecA.getX());
          let vecBAngle = Math.atan2(this.vecB.getY(), this.vecB.getX());
          point.graphics.arc(0, 0, Cartesian.AngleDisplayDefaults.radius, -vecAAngle, -(vecBAngle + vecAAngle), true);
        }
      })
    );
    this.mulVec = this.graph.addPoint(
      new Cartesian.PointInitData({ 
        color: colorPalette[2], 
        lineFrom: [{point: this.graph.center}], 
        interactive: false,
        customRender: (point) => {
          let vecAAngle = Math.atan2(this.vecA.getY(), this.vecA.getX());
          let vecBAngle = Math.atan2(this.vecB.getY(), this.vecB.getX());
          point.graphics.lineStyle(Cartesian.AngleDisplayDefaults.size, this.vecA.graphics.color);
          point.graphics.arc(0, 0, Cartesian.AngleDisplayDefaults.radius, 0, -vecAAngle, true);
          point.graphics.finishPoly();
          point.graphics.lineStyle(Cartesian.AngleDisplayDefaults.size, this.vecB.graphics.color);
          point.graphics.arc(0, 0, Cartesian.AngleDisplayDefaults.radius + 6, -vecAAngle, -(vecBAngle + vecAAngle), true);
          point.graphics.finishPoly();
        }
      })
    );

    let recalculateMulVec = (function() { 
      let complexA = complex.create(this.vecA.getX(), this.vecA.getY());
      let complexB = complex.create(this.vecB.getX(), this.vecB.getY());
      let complexMul = complexA.mul(complexB);
      this.mulVec.setXY(complexMul.a, complexMul.b);
    }).bind(this);
    this.vecA.onChanged.addEventListener(recalculateMulVec);
    this.vecB.onChanged.addEventListener(recalculateMulVec);

    let valFormat = (val) => { return val.toFixed(2); };
    let strConversion = (str) => { return parseFloat(str); };

    this.angleA = new BindableValue(0);
    this.angleB = new BindableValue(0);
    this.mulAngle = new BindableValue(0);
    const mulAngleCalculation = function(vec) { this.set(Math.atan2(vec.y, vec.x)); };
    this.vecA.onChanged.addEventListener(mulAngleCalculation.bind(this.angleA));
    this.vecB.onChanged.addEventListener(mulAngleCalculation.bind(this.angleB));
    this.mulVec.onChanged.addEventListener(mulAngleCalculation.bind(this.mulAngle));

    let degreeFormat = (val) => { 
      if (val < 0) val = 2.0 * Math.PI + val;
      return (val * 180.0 / Math.PI).toFixed(1); 
    };
    let degreeStrConversion = (str) => { return parseFloat(str) * Math.PI / 180.0; };

    this.radiusA = new BindableValue(0);
    this.radiusB = new BindableValue(0);
    this.mulRadius = new BindableValue(0);
    const mulRadiusCalculation = function(vec) { this.set(vec.length()); };
    this.vecA.onChanged.addEventListener(mulRadiusCalculation.bind(this.radiusA));
    this.vecB.onChanged.addEventListener(mulRadiusCalculation.bind(this.radiusB));
    this.mulVec.onChanged.addEventListener(mulRadiusCalculation.bind(this.mulRadius));

    this.vecA.setXY(1, 1);
    this.vecB.setXY(-1, 1);

    let parameterDOM = document.getElementById("complex-mul-cartesian-data");
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
        .addLabel(new TableItem({ value: "*" }))
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
      ).toTable()
    );
    
    let polarToVector = function(radius, angle) {
      let vec = RMath.angleToVec(angle);
      return vec.mulScalar(radius);
    }

    parameterDOM.appendChild(new TableBuilder()
      .addHeader([
        new TableItem({value: ""}), 
        new TableItem({value: "r"}),
        new TableItem({value: "θ"})
      ])
      .addRow(new RowBuilder()
        .addLabel(new TableItem({ value: "A", color: this.vecA.graphics.color }))
        .addInput(new TableItem({
          value: this.radiusA,
          format: valFormat,
          strConversion: strConversion,
          customInputAction: () => { 
            let vec = polarToVector(this.radiusA.get(), this.angleA.get());
            this.vecA.setXY(vec.x, vec.y); 
          }
        }))
        .addInput(new TableItem({
          value: this.angleA,
          format: degreeFormat,
          strConversion: degreeStrConversion,
          customInputAction: () => { 
            let vec = polarToVector(this.radiusA.get(), this.angleA.get());
            this.vecA.setXY(vec.x, vec.y); 
          }
        }))
        .toRow()
      )
      .addRow(new RowBuilder()
        .addLabel(new TableItem({ value: "*" }))
        .addEmpty()
        .addEmpty()
        .toRow()
      )
      .addRow(new RowBuilder()
        .addLabel(new TableItem({ value: "B", color: this.vecB.graphics.color }))
        .addInput(new TableItem({
          value: this.radiusB,
          format: valFormat,
          strConversion: strConversion,
          customInputAction: () => {
            let vec = polarToVector(this.radiusB.get(), this.angleB.get());
            this.vecB.setXY(vec.x, vec.y); 
          }
        }))
        .addInput(new TableItem({
          value: this.angleB,
          format: degreeFormat,
          strConversion: degreeStrConversion,
          customInputAction: () => { 
            let vec = polarToVector(this.radiusB.get(), this.angleB.get());
            this.vecB.setXY(vec.x, vec.y); 
          }
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
        .addLabel(new TableItem({ value: "A*B", color: this.mulVec.graphics.color }))
        .addLabel(new TableItem({
          value: this.mulRadius,
          format: valFormat,
          strConversion: strConversion
        }))
        .addLabel(new TableItem({
          value: this.mulAngle,
          format: degreeFormat,
          strConversion: degreeStrConversion
        }))
        .toRow()
      ).toTable()
    );
  },

  render: function (app, dt) {
    this.time += dt;
    this.graph.render();
  }
});