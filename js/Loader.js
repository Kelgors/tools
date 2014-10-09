(function (global) {
  "use strict";
  var
    ID = 0,
    SUPER = Eventable.prototype;

  /**
   * @param {SocialPlayer.utils.Loader} loader
   * @param {string} type event type name
   * @param {?} target the related instance
   * @param {number} loadedIndex the index
  **/
  function dispatchProgressEvent(loader, type, target, hasError) {
    var
      offset = 0,
      index = -1,
      len = loader.domObjects.length,
      event;
    if (target !== loader) {
      while (++index < len) {
        if (!loader.isLoading(loader.domObjects[index])) {
          offset += 1;
        } else {
          break;
        }
      }
    }
    event = {
      "type": type,
      "origin": loader,
      "target": target,
      "progress": Number((loader.loadedElements.length + loader.notLoadedElements.length) / loader.domObjects.length),
      "isPartial": loader.domObjects.length === loader.loadedElements.length + loader.notLoadedElements.length,
      "beginAt": loader.beginAt,
      "endAt": loader.endAt,
      "success": !hasError
    };
    if (target !== loader) {
      event["loadedIndex"] = offset;
      event["lastIndexLoaded"] = loader.lastIndexTriggered;
      loader.lastIndexTriggered = offset;
    }
    loader.trigger(type, event);
  };


  /**
   * Loader
   * Used to load somethin' as script|img (potentially audio|video|link and xhr)
   * Loader triggers some events:
   *   - 'loadstart' when a loading is starting
   *   - 'progress' when one loading is over
   *   - 'load' when all elements has been loaded
   *   - 'ready' when the Loader can be disposed or reset, reused for something else
   * @constructor
   * @extends {Eventable}
   * @author Matthieu {@link https://github.com/kelgors}
  **/
  function Loader() {
    this.id = "loader-" + (++ID);
    this.initialize();
  }

  Loader.prototype = Object.create(SUPER);

  Loader.prototype.constructor = Loader;

  Loader.prototype.initialize = function() {
    this.domObjects = [];
    this.loadingElements = [];
    this.loadedElements = [];
    this.notLoadedElements = [];
    this.lastIndexTriggered = -1;
    this.timeoutPerElement = 1000;
    this.beginAt = this.endAt = null;
    return this;
  };

  Loader.prototype.dispose = function() {
    while (this.notLoadedElements.pop()){}
    while (this.loadedElements.pop()){}
    while (this.domObjects.pop()){}
    this.notLoadedElements = this.loadedElements = this.domObjects = null;
    SUPER.dispose.call(this);
  };

  Loader.prototype.reset = function() {
    return this.initialize();
  };


  /**
   * Create a dom object
   * @param {string} type DOM Element tag name
   * @param {Object.<string, string>} object dom element description attributes
   * @return {HTMLElement}
  **/
  Loader.prototype.createDOMObject = function(type, object) {
    var domElement, key, loadstarted, onEvent, sourcable, that;
    that = this;
    sourcable = type === "img" || type === "script";
    loadstarted = false;
    this.domObjects.push(domElement = document.createElement(type));
    for (key in object) {
      if (sourcable && key !== "src") {
        domElement.setAttribute(key, object[key]);
      }
    }
    onEvent = function(arrayOfElements, success, event) {
      var element;
      if (this.domObjects === null) {
        return false;
      }
      element = event.target;
      arrayOfElements.push(this.loadingElements.splice(this.loadingElements.indexOf(element), 1)[0]);
      element.onerror = element.onload = null;
      dispatchProgressBackboneEvent(this, "progress", element, true);
      this.checkLoadingState();
      return true;
    };
    domElement.onerror = onEvent.bind(this, this.notLoadedElements, true);
    domElement.onload = onEvent.bind(this, this.loadedElements, true);
    this.beginAt = Date.now();
    if (sourcable) {
      domElement.src = object.src || "";
      loadstarted = true;
    }
    if (typeof domElement.load === "function") {
      domElement.load();
      loadstarted = true;
    }
    if (loadstarted) {
      that.loadingElements.push(domElement);
      dispatchProgressBackboneEvent(that, "loadstart", domElement, false);
    }
    return domElement;
  };


  /**
   * check the loading state and trigger events
   * @private
  **/
  Loader.prototype.checkLoadingState = function() {
    if (this.domObjects.length === this.notLoadedElements.length + this.loadedElements.length) {
      this.endAt = Date.now();
      dispatchProgressBackboneEvent(this, "load", this, false);
      this.trigger("ready", {
        type: "ready",
        origin: this,
        target: this
      });
    }
  };


  /**
   * add an array of representative objects of a DOM Object
   *   this method will perform loading of each images
   *   and trigger loadstart|progress|load|ready backbone events
   *
   * @param {string} type DOM tag name
   * @param {Array.<Object.<String, String>>} arrayOfObject
   * @return {Array.<Image>}
  **/
  Loader.prototype.loadDOMElement = function(type, arrayOfObjects) {
    var object, _i, _len;
    this.beginAt = Date.now();
    for (_i = 0, _len = arrayOfObjects.length; _i < _len; _i++) {
      object = arrayOfObjects[_i];
      this.createDOMObject(type, object);
    }
    return this.domObjects;
  };

  Loader.prototype.isLoading = function(element) {
    return this.loadedElements.indexOf(element) === -1 && this.notLoadedElements.indexOf(element) === -1;
  };

  global.Loader = Loader;

})(this);
