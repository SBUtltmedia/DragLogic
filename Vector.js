class Vector {

  constructor(x, y) {

    this.x = x
    this.y = y
  }



  qOr(vector) {
    var sum = this.add(vector)
    if (sum.isGreaterThan1()) {
      return sum.getNorm()

    }
    return sum
  }
  qAnd(vector) {

    return (this.not().qOr(vector.not())).not()
  }

  qIf(vector) {

    return this.not().qOr(vector)
  }

  qIff(vector) {

    return this.qIf(vector).qAnd(vector.qIf(this))
  }



  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y)

  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y)

  }

  square(vector) {

    return new Vector((this.x ** 2 - this.y ** 2), 2 * (this.x * this.y))
  }

  not() {
    return this.getNorm().subtract(this)
  }
  isGreaterThan1() {
    return this.hypoteneuse() > 1;
  }

  hypoteneuse() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)

  }
  getNorm() {
    return new Vector(this.x / this.hypoteneuse(), this.y / this.hypoteneuse());


  }


}
