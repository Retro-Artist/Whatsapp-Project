var ListenerTracker = new function () {
    var targets = [];
    // listener tracking datas
    var _elements_ = [];
    var _listeners_ = [];
    this.init = function () {
        this.listen(Element, window);
    };
    this.listen = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (targets.indexOf(arguments[i]) === -1) {
                targets.push(arguments[i]);//avoid duplicate call
                intercep_events_listeners(arguments[i]);
            }
        }
    };
    // register individual element an returns its corresponding listeners
    var register_element = function (element) {
        if (_elements_.indexOf(element) == -1) {
            // NB : split by useCapture to make listener easier to find when removing
            var elt_listeners = [{/*useCapture=false*/ }, {/*useCapture=true*/ }];
            _elements_.push(element);
            _listeners_.push(elt_listeners);
        }
        return _listeners_[_elements_.indexOf(element)];
    };
    var intercep_events_listeners = function (target) {
        var _target = target;
        if (target.prototype) _target = target.prototype;
        if (_target.getEventListeners) return;
        if (typeof (_target.addEventListener) !== 'function' || typeof (_target.removeEventListener) !== 'function') {
            // console.log('target=', target);
            throw ('\nListenerTracker Error:\nUnwrappable target.');
        }
        // backup overrided methods
        var _super_ = {
            "addEventListener": _target.addEventListener,
            "removeEventListener": _target.removeEventListener
        };

        _target["addEventListener"] = function (type, listener, useCapture) {
            var listeners = register_element(this);
            // add event before to avoid registering if an error is thrown
            _super_["addEventListener"].apply(this, arguments);
            // adapt to 'elt_listeners' index
            var uc = (typeof (useCapture) === 'object' ? useCapture.useCapture : useCapture) ? 1 : 0;
            if (!listeners[uc][type]) listeners[uc][type] = [];
            listeners[uc][type].push({ cb: listener, args: arguments });
        };
        _target["removeEventListener"] = function (type, listener, useCapture) {
            var listeners = register_element(this);
            // add event before to avoid registering if an error is thrown
            _super_["removeEventListener"].apply(this, arguments);
            // adapt to 'elt_listeners' index
            useCapture = (typeof (useCapture) === 'object' ? useCapture.useCapture : useCapture) ? 1 : 0;
            if (!listeners[useCapture][type]) return;
            var lid = listeners[useCapture][type].findIndex(obj => obj.cb === listener);
            if (lid > -1) listeners[useCapture][type].splice(lid, 1);
        };
        _target["getEventListeners"] = function (type) {
            var listeners = register_element(this);
            // convert to listener datas list
            var result = [];
            for (var useCapture = 0, list; list = listeners[useCapture]; useCapture++) {
                if (typeof (type) == "string") {// filtered by type
                    if (list[type]) {
                        for (var id in list[type]) {
                            result.push({
                                "type": type,
                                "listener": list[type][id].cb,
                                "args": list[type][id].args,
                                "useCapture": !!useCapture
                            });
                        }
                    }
                } else {// all
                    for (var _type in list) {
                        for (var id in list[_type]) {
                            result.push({
                                "type": _type,
                                "listener": list[_type][id].cb,
                                "args": list[_type][id].args,
                                "useCapture": !!useCapture
                            });
                        }
                    }
                }
            }
            return result;
        };
    };

}();
ListenerTracker.init();