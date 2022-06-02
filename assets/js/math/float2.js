export class float2 {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  static create(x, y) {
    let res = new float2();
    res.x = x;
    res.y = y;
    return res;
  }

  add(v) {
    return float2.create(this.x + v.x, this.y + v.y);
  }

  addScalar(v) {
    return float2.create(this.x + v, this.y + v)
  }

  sub(v) {
    return float2.create(this.x - v.x, this.y - v.y);
  }

  subScalar(v) {
    return float2.create(this.x - v, this.y - v);
  }

  div(v) {
    return float2.create(this.x / v.x, this.y / v.y);
  }

  divScalar(v) {
    return float2.create(this.x / v, this.y / v);
  }

  mul(v) {
    return float2.create(this.x * v.x, this.y * v.y);
  }

  mulScalar(v) {
    return float2.create(this.x * v, this.y * v);
  }

  scale(v) {
    return mulScalar(this, v);
  }

  negate() {
    return float2.create(-this.x, -this.y);
  }

  equals(v) {
    return this.x == v.x && this.y == v.y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    return v.divScalar(v.length());
  }
}