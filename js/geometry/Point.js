(function (global) {
  "use strict";

  var SUPER = Object.prototype;

  /**
   * Represent a point in a 2D space
   * @constructor
   * @extends {Milky.BaseObject}
   * @param {number=} x
   * @param {number=} y
  **/
  function Point(x, y) {
    if (x instanceof Milky.Point) {
      y = x.y;
      x = x.x;
    }
    /**
     * The x-coordinate of the shape
     * @type {number}
    **/
    this.x = x || 0;
    /**
     * The y-coordinate of the shape
     * @type {number}
    **/
    this.y = y || 0;
  };

  Point.prototype = Object.create(SUPER);
  Point.prototype.constructor = Point;

  /**
   *
   * @param {!(number|Point)} x
   * @param {?number} y
  **/
  Point.prototype.add = function add(x, y) {
    if (x instanceof Point) {
      y = x.y;
      x = x.x;
    }
    return new Point(this.x + x, this.y + y);
  };
  /**
   *
   * @param {!(number|Point)} x
   * @param {?number} y
  **/
  Point.prototype.sub = function sub(x, y) {
    if (x instanceof Point) {
      y = x.y;
      x = x.x;
    }
    return new Point(this.x - x, this.y - y);
  };

  /**
   *
   * @param {!(number|Point)} x
   * @param {?number} y
  **/
  Point.prototype.scl = function scl(x, y) {
    if (x instanceof Point) {
      y = x.y;
      x = x.x;
    }
    return new Point(this.x * x, this.y * y);
  };
  /**
   *
   * @param {!(number|Point)} x
   * @param {?number} y
  **/
  Point.prototype.div = function div(x, y) {
    if (x instanceof Point) {
      y = x.y;
      x = x.x;
    }
    return new Point(this.x / x, this.y / y);
  };
  /**
   * Set the x, y value of this instance
   * @param {!(number|Point)} x
   * @param {?number} y
  **/
  Point.prototype.setXY: function setXY(x, y) {
    if (x instanceof Point) {
      y = x.y;
      x = x.x;
    }
    this.x = x;
    this.y = y;
  };
  /**
   * calc the distance squared between this point and x, y coordinate
   * @param {!(number|Point)} x
   * @param {?number} y
  **/
  Point.prototype.dst2 = function dst2(x, y) {
    if (x instanceof Point) {
      y = x.y;
      x = x.x;
    }
    return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y);
  };
  /**
   * calc the distance between this point and x, y coordinate
   * @param {!(number|Point)} x
   * @param {?number} y
  **/
  Point.prototype.dst = function dst(x, y) {
    if (x instanceof Point) {
      y = x.y;
      x = x.x;
    }
    return Math.sqrt((x - this.x) * (x - this.x) + (y - this.y) * (y - this.y));
  };
  Point.prototype.toString = function toString() {
    return ('{ x: ' + this.x + ', y: ' + this.y + ' }');
  };

  ["floor", "ceil", "abs"].forEach(function (methodName) {
    Point.prototype[methodName] = function () { return new Point(Math[methodName](this.x), Math[methodName](this.y)); };
  });

  global.Point = Point;
})(this);