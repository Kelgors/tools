(function (namespace) {
  "use strict";
  var LOCKED_PROPERTY = "__locked__";
  /**
   * The locker is used to be a very simple semaphore
   * To be simpliest, you should add a pending queue that wait for unlocking resources
   *   and notify the first pending element to use resources and remove it.
   * @constructor
   * @author Kelgors {@link https://github.com/kelgors}
  **/
  function Locker() {
    this[LOCKED_PROPERTY] = [];
  }

  Locker.prototype.dispose = function dispose() {
    this[LOCKED_PROPERTY].length = 0;
  };
  /**
   * lock the resource given in param
   * @param {?} instance maybe an object or an id or somethin else that identify a resource
   * @todo throw error if the given resource is already locked
   *
  **/
  Locker.prototype.lock = function lock(instance) {
    this[LOCKED_PROPERTY].push(instance);
  };
  /**
   * unlock a resource already locked
   * if the resource not already block return false
   * @param {?} instance maybe an object or an id or somethin else that identify a resource
   * @return {boolean} the resource is unlock or not
  **/
  Locker.prototype.unlock = function unlock(instance) {
    var index = this[LOCKED_PROPERTY].indexOf(instance);
    if (index === -1) { return false; }
    return this[LOCKED_PROPERTY].splice(index, 1).length > 0;
  };
  /**
   * check if the given resource is locked or not
   * @param {?} instance maybe an object or an id or somethin else that identify a resource
   * @return {boolean} the resource is locked or not
  **/
  Locker.prototype.locked = function locked() {
    return this[LOCKED_PROPERTY].indexOf(instance) !== -1;
  };

  namespace["Locker"] = Locker;
})(window);
