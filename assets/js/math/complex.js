export class complex {
  constructor() {
    this.a = 0;
    this.b = 0;
  }

  static create(a, b) {
    let res = new complex();
    res.a = a;
    res.b = b;
    return res;
  }

  add(v) {
    return complex.create(this.a + v.a, this.b + v.b);
  }

  addScalar(v) {
    return complex.create(this.a + v, this.b + v)
  }

  sub(v) {
    return complex.create(this.a - v.a, this.b - v.b);
  }

  subScalar(v) {
    return complex.create(this.a - v, this.b - v);
  }

  div(v) {
    if (Math.abs(v.b) < Math.abs(v.a)) {
      let d = v.b / v.a;
      return complex.create((this.a + this.b * d) / (v.a + v.b * d), (this.b - this.a * d) / (v.a + v.b * d));
    } else {
      let d = v.a / v.b;
      return complex.create((this.b + this.a * d) / (v.b + v.a * d), (-this.a + this.b * d) / (v.b + v.a * d));
    }
  }

  divScalar(v) {
    return complex.create(this.a / v, this.b / v);
  }

  mul(v) {
    return complex.create(this.a * v.a - this.b * v.b, this.a * v.b + this.b * v.a);
  }

  mulScalar(v) {
    return complex.create(this.a * v, this.b * v);
  }

  scale(v) {
    return mulScalar(this, v);
  }

  negate() {
    return complex.create(-this.a, -this.b);
  }

  equals(v) {
    return this.a == v.a && this.b == v.b;
  }
}