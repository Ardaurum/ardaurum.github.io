import { float2 } from './math/float2.js'
import * as PIXI from '../external/pixi.min.mjs'
import { Event } from './core/events.js';

export function Label(text, color, fontSize) {
  this.text = text;
  this.color = color;
  this.fontSize = fontSize;
}

export function Data() {
  this.grid = {
    count: 19,
    lineSize: 1,
    color: 0x464646,
  };
  this.axis = {
    lineSize: 2,
    maxUnit: 10,
    xColor: 0xDDDDDD,
    yColor: 0xDDDDDD,
    xLabel: new Label("x", 0xE6E6E6, 16),
    yLabel: new Label("y", 0xE6E6E6, 16)
  };
}

export const AngleDisplayDefaults = {
  radius: 20,
  color: 0xE6E6E6,
  size: 4
}

export function AngleDisplayInitData(init) {
  init = init || {};
  this.radius = init.radius == null ? AngleDisplayDefaults.radius : init.radius;
  this.color = init.color == null ? AngleDisplayDefaults.color : init.color;
  this.size = init.size == null ? AngleDisplayDefaults.size : init.size;
}

export const PointDefaults = {
  size: 10,
  lineSize: 6,
  color: 0xE6E6E6
}

export function PointInitData(init) {
  init = init || {};
  this.x = init.x == null ? 0 : init.x;
  this.y = init.y == null ? 0 : init.y;
  this.color = init.color == null ? PointDefaults.color : init.color;
  this.visible = init.visible == null ? true : init.visible;
  this.angleDisplay = init.angleDisplay == null ? [] : init.angleDisplay;
  this.interactive = init.interactive == null ? true : init.interactive;
  this.lineFrom = init.lineFrom == null ? [] : init.lineFrom;
  this.lineSize = init.lineSize == null ? PointDefaults.lineSize : init.lineSize;
  this.size = init.size == null ? PointDefaults.size : init.size;
  this.customRender = init.customRender;
}

export class Point {
  constructor(context, pointData) {
    let graphics = new PIXI.Graphics();
    context.app.stage.addChild(graphics);
    this.graphics = graphics;
    graphics.point = this;
    this.context = context;
    this.pos = new float2();
		this.onChanged = new Event();

    this.setXY(pointData.x, pointData.y);

    this.size = pointData.size;
    this.lineFrom = pointData.lineFrom;
    this.angleDisplay = pointData.angleDisplay;
    this.customRender = pointData.customRender;

    graphics.visible = pointData.visible;
    graphics.interactive = pointData.interactive;
    graphics.buttonMode = pointData.interactive;
    graphics.color = pointData.color;

    if (pointData.interactive) {
      graphics.on('pointerdown', context.onDragStart.bind(context, this.graphics), this.graphics);
      graphics.cursor = 'pointer';

      graphics.hitArea = new PIXI.Circle(0, 0, pointData.size);
    }
  }

  getX() {
    return this.pos.x;
  }
  setX(x) {
    this.pos.x = x;
    this.graphics.x = this.context.app.screen.width * (x / this.context.maxUnit + 0.5);
		this.onChanged.dispatch(this.pos);
  }
  setScreenX(x) {
    this.graphics.x = x;
    this.pos.x = this.context.maxUnit * (x / this.context.app.screen.width - 0.5);
		this.onChanged.dispatch(this.pos);
  }

  getY() {
    return this.pos.y;
  }
  getScreenY() {
    return this.graphics.y;
  }
  setY(y) {
    this.pos.y = y;
    this.graphics.y = this.context.app.screen.height * (-y / this.context.maxUnit + 0.5);
		this.onChanged.dispatch(this.pos);
  }
  setScreenY(y) {
    this.graphics.y = y;
    this.pos.y = this.context.maxUnit * -(y / this.context.app.screen.height - 0.5);
		this.onChanged.dispatch(this.pos);
  }

  getXY() {
    return {
      x: this.getX(),
      y: this.getY()
    };
  }
  getScreenXY() {
    return {
      x: this.getScreenX(),
      y: this.getScreenY()
    }
  }

  setXY(x, y) {
    this.setX(x);
    this.setY(y);
  }
  setScreenXY(x, y) {
    this.setScreenX(x);
    this.setScreenY(y);
  }
}

export class Graph {
  constructor(app, data) {
    this.maxUnit = data.axis.maxUnit * 2.0;
    this.app = app;
    this.data = data;

		this.app.onResize.addEventListener(this.resize.bind(this));
    this.prepareBackground();
    this.initInteractivity();

    //LINES
    let lines = new PIXI.Graphics();
    this.lines = lines;

    //ADD TO RENDER
    app.stage.addChild(this.graphics);
    app.stage.addChild(this.xText);
    app.stage.addChild(this.yText);
    app.stage.addChild(this.lines);

    //POINTS SETUP
    this.points = [];

    //Special case center
    this.center = {
      pos: {
        x: 0,
        y: 0,
      },
      graphics: {
        x: app.screen.width / 2.0,
        y: app.screen.height / 2.0,
      }
    };
  }

  prepareBackground() {
    //GRID
    if (this.graphics) {
      this.graphics.clear();
    } else {
      this.graphics = new PIXI.Graphics();
    }

    this.graphics.lineStyle(this.data.grid.lineSize, this.data.grid.color);
    const gridLineCount = this.data.grid.count;
    for (let i = 0; i < gridLineCount; i++) {
      let x = (i + 1) * this.app.screen.width / (gridLineCount + 1);
      this.graphics.moveTo(x, 0);
      this.graphics.lineTo(x, this.app.screen.height);

      let y = (i + 1) * this.app.screen.height / (gridLineCount + 1);
      this.graphics.moveTo(0, y);
      this.graphics.lineTo(this.app.screen.width, y);
    }

    //AXIS
    let halfWidth = this.app.screen.width / 2.0;
    let halfHeight = this.app.screen.height / 2.0;

    this.graphics.lineStyle(this.data.axis.lineSize, this.data.axis.yColor);
    this.graphics.moveTo(halfWidth, this.app.screen.height);
    this.graphics.lineTo(halfWidth, 2);
    this.graphics.beginFill(this.data.axis.yColor);
    this.graphics.moveTo(halfWidth, 1);
    this.graphics.lineTo(halfWidth - 6, 8);
    this.graphics.lineTo(halfWidth + 6, 8);
    this.graphics.lineTo(halfWidth, 1);
    this.graphics.endFill();

    this.graphics.lineStyle(this.data.axis.lineSize, this.data.axis.xColor);
    this.graphics.moveTo(0, halfHeight);
    this.graphics.lineTo(this.app.screen.width, halfHeight);
    this.graphics.beginFill(this.data.axis.yColor);
    this.graphics.moveTo(this.app.screen.width - 1, halfHeight);
    this.graphics.lineTo(this.app.screen.width - 8, halfHeight - 6);
    this.graphics.lineTo(this.app.screen.width - 8, halfHeight + 6);
    this.graphics.lineTo(this.app.screen.width - 1, halfHeight);
    this.graphics.endFill();

    //AXIS NAMES
    if (!this.xText) {
      this.xText = new PIXI.Text(this.data.axis.xLabel.text);
    }

    if (!this.yText) {
      this.yText = new PIXI.Text(this.data.axis.yLabel.text);
    }

    this.xText.style.fill = this.data.axis.xLabel.color;
    this.yText.style.fill = this.data.axis.yLabel.color
    this.xText.style.fontSize = this.data.axis.xLabel.fontSize;
    this.yText.style.fontSize = this.data.axis.yLabel.fontSize;

    this.xText.x = this.app.screen.width - 20;
    this.xText.y = this.app.screen.height / 2.0;

    this.yText.x = this.app.screen.width / 2.0 + 5;
    this.yText.y = 10;
  }

  onDragMove(event) {
    if (this.dragging) {
      const newPos = this.dragTarget.parent.toLocal(event.global, null, this.dragTarget.position);
      this.dragTarget.point.setScreenXY(newPos.x, newPos.y);
    }
  }

  onDragStart(target) {
    this.dragging = true;
    this.dragTarget = target;
    this.dragTarget.onMove = this.onDragMove.bind(this);
    this.app.stage.on('pointermove', this.dragTarget.onMove);
  }

  onDragEnd() {
    if (this.dragging)
    {
      this.app.stage.off('pointermove', this.dragTarget.onMove);
      this.dragging = false;
      this.dragTarget = null;
    }
  }

  initInteractivity() {
    this.dragging = false;
    this.dragTarget = null;
    this.app.stage.interactive = true;
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on('pointerup', this.onDragEnd.bind(this));
    this.app.stage.on('pointerupoutside', this.onDragEnd.bind(this));
  }

  resize() {
    this.points.forEach(function (point) {
      point.setXY(point.pos.x, point.pos.y);
    });
    this.center.graphics.x = this.app.screen.width / 2.0;
    this.center.graphics.y = this.app.screen.height / 2.0;

    this.prepareBackground();
  }

  render() {
    let app = this.app;
    let lines = this.lines;
    lines.clear();

    this.points.forEach(function (point) {
      point.graphics.clear();
      point.graphics.lineStyle(0);
			let size = point.size;
			if (point.graphics.interactive)
			{
        point.graphics.beginFill(point.graphics.color, 1.0);
      	point.graphics.drawCircle(0, 0, size);
        point.graphics.endFill();
			}
			else
			{
        point.graphics.beginFill(0x212123, 1.0);
        point.graphics.lineStyle(size / 2.0, point.graphics.color);
				point.graphics.drawRoundedRect(-size, -size, size * 2.0, size * 2.0, 1);
        point.graphics.endFill();
			}
      point.lineFrom.forEach(function (from) {
        lines.lineStyle(from.size || 4, from.color || point.graphics.color);
        lines.moveTo(from.point.graphics.x, from.point.graphics.y);
        lines.lineTo(point.graphics.x, point.graphics.y);
      });

      if (point.angleDisplay)
      {
        point.graphics.lineStyle(point.angleDisplay.size, point.angleDisplay.color);
        point.graphics.arc(0, 0, point.angleDisplay.radius, 0, -Math.atan2(point.pos.y, point.pos.x), true);
      }

      if (point.customRender)
      {
        point.customRender(point);
      }
    });
  }

  addPoint(pointData) {
    let point = new Point(this, pointData);
    this.points.push(point);
    return point;
  }
}