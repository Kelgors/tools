(function (global) {
  "use strict";

  var EVENT_PROPERTY = "__events__";

  function Eventable() {
    this[EVENT_PROPERTY] = {};
  }

  Eventable.prototype.constructor = Eventable;
  Eventable.prototype.dispose = function dispose() {
    for (events in this[EVENT_PROPERTY]) {
      while (events.pop()) {}
    }
  };
  Eventable.prototype.on = function on(type, callback, context) {
    if (!this[EVENT_PROPERTY][type]) this[EVENT_PROPERTY][type] = [];
    this[EVENT_PROPERTY][type].push({ type: type, callback: callback, context: context || this });
    return this;
  };
  Eventable.prototype.once = function once(type, callback, context) {
    if (!this[EVENT_PROPERTY][type]) this[EVENT_PROPERTY][type] = [];
    this[EVENT_PROPERTY][type].push({ type: type, callback: callback, context: context || this, once: true });
    return this;
  };
  Eventable.prototype.off = function (type, callback, context) {
    var
      comparator,
      keys,
      keysLen,
      keysIndex = -1,
      events,
      eventsIndex,
      eventsLen;
    if (!type && !callback && !context) {
      this[EVENT_PROPERTY] = {};
    }
    else if (type && !callback && !context) {
      this[EVENT_PROPERTY][type] = [];
    }
    else {
      keys = Object.keys(this[EVENT_PROPERTY]) || [type];
      keysLen = keys.length;
      // No types given, so iterate on all
      if (callback && context) {
        comparator = function CallbackContextComparator(event) { return event.callback === callback && event.context === context; };
      } else if (callback) {
        comparator = function CallbackComparator(event) { return event.callback === callback; };
      } else /* if (context) */ {
        comparator = function ContextComparator(event) { return event.context === context; };
      }

      while (++keysIndex < keysLen) {
        eventsLen = (events = this[EVENT_PROPERTY][keys[keysIndex]] || []).length;
        eventsIndex = -1;
        while (++eventsIndex < eventsLen) {
          if (comparator(events[eventsIndex]) && events.splice(eventsIndex, 1).length === 1) {
            eventsLen -= 1;
            eventsIndex -= 1;
          }
        }
      }
    }
    return this;
  };

  Eventable.prototype.trigger = function (type, data) {
    var
      events = this[EVENT_PROPERTY][type] || [],
      index = -1, len = events.length;
    if (data && !data.type) { data.type = type; }
    while (++index < len) {
      events[index].callback.call(events[index].context, data);
      if (events[index].once && events.splice(index, 1).length === 1) {
        index -= 1;
        len -= 1;
      }
    }
    return this;
  };

  Eventable.extend = function (object) {
    var
      keys = Object.getOwnPropertyKeys(Eventable.prototype),
      index = -1, len = keys.length;
    while (++index < len) {
      object[keys[index]] = Eventable.prototype[keys[index]];
    }
    if (!object["__extensions__"]) object["__extensions__"] = [];
    object["__extensions__"].push("Eventable");
  };

  global.Eventable = Eventable;

})(this);