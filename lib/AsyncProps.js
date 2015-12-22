/*global __ASYNC_PROPS__*/
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.loadPropsOnServer = loadPropsOnServer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterLibRoutingContext = require('react-router/lib/RoutingContext');

var _reactRouterLibRoutingContext2 = _interopRequireDefault(_reactRouterLibRoutingContext);

var _React$PropTypes = _react2['default'].PropTypes;
var array = _React$PropTypes.array;
var func = _React$PropTypes.func;
var object = _React$PropTypes.object;

function last(arr) {
  return arr[arr.length - 1];
}

function eachComponents(components, iterator) {
  for (var i = 0, l = components.length; i < l; i++) {
    if (typeof components[i] === 'object') {
      for (var key in components[i]) {
        iterator(components[i][key], i, key);
      }
    } else {
      iterator(components[i], i);
    }
  }
}

function filterAndFlattenComponents(components) {
  var flattened = [];
  eachComponents(components, function (Component) {
    if (Component.loadProps) flattened.push(Component);
  });
  return flattened;
}

function _loadAsyncProps(components, params, cb) {
  // flatten the multi-component routes
  var componentsArray = [];
  var propsArray = [];
  var needToLoadCounter = components.length;

  var maybeFinish = function maybeFinish() {
    if (needToLoadCounter === 0) cb(null, { propsArray: propsArray, componentsArray: componentsArray });
  };

  // If there is no components we should resolve directly
  if (needToLoadCounter === 0) {
    return maybeFinish();
  }

  components.forEach(function (Component, index) {
    Component.loadProps(params, function (error, props) {
      needToLoadCounter--;
      propsArray[index] = props;
      componentsArray[index] = Component;
      maybeFinish();
    });
  });
}

function lookupPropsForComponent(Component, propsAndComponents) {
  var componentsArray = propsAndComponents.componentsArray;
  var propsArray = propsAndComponents.propsArray;

  var index = componentsArray.indexOf(Component);
  return propsArray[index];
}

function mergePropsAndComponents(current, changes) {
  for (var i = 0, l = changes.propsArray.length; i < l; i++) {
    var Component = changes.componentsArray[i];
    var position = current.componentsArray.indexOf(Component);
    var isNew = position === -1;

    if (isNew) {
      current.propsArray.push(changes.propsArray[i]);
      current.componentsArray.push(changes.componentsArray[i]);
    } else {
      current.propsArray[position] = changes.propsArray[i];
    }
  }
  return current;
}

function arrayDiff(previous, next) {
  var diff = [];

  for (var i = 0, l = next.length; i < l; i++) if (previous.indexOf(next[i]) === -1) diff.push(next[i]);

  return diff;
}

function shallowEqual(a, b) {
  var key;
  var ka = 0;
  var kb = 0;

  for (key in a) {
    if (a.hasOwnProperty(key) && a[key] !== b[key]) return false;
    ka++;
  }

  for (key in b) if (b.hasOwnProperty(key)) kb++;

  return ka === kb;
}

function createElement(Component, props) {
  if (Component.loadProps) return _react2['default'].createElement(AsyncPropsContainer, { Component: Component, routerProps: props });else return _react2['default'].createElement(Component, props);
}

function loadPropsOnServer(_ref, cb) {
  var components = _ref.components;
  var params = _ref.params;

  _loadAsyncProps(filterAndFlattenComponents(components), params, function (err, propsAndComponents) {
    if (err) {
      cb(err);
    } else {
      var json = JSON.stringify(propsAndComponents.propsArray, null, 2);
      var scriptString = '<script>__ASYNC_PROPS__ = ' + json + '</script>';
      cb(null, propsAndComponents, scriptString);
    }
  });
}

function hydrate(props) {
  if (typeof __ASYNC_PROPS__ !== 'undefined') return {
    propsArray: __ASYNC_PROPS__,
    componentsArray: filterAndFlattenComponents(props.components)
  };else return null;
}

var AsyncPropsContainer = (function (_React$Component) {
  _inherits(AsyncPropsContainer, _React$Component);

  function AsyncPropsContainer() {
    _classCallCheck(this, AsyncPropsContainer);

    _React$Component.apply(this, arguments);
  }

  AsyncPropsContainer.prototype.render = function render() {
    var _props = this.props;
    var Component = _props.Component;
    var routerProps = _props.routerProps;

    var props = _objectWithoutProperties(_props, ['Component', 'routerProps']);

    var _context$asyncProps = this.context.asyncProps;
    var propsAndComponents = _context$asyncProps.propsAndComponents;
    var loading = _context$asyncProps.loading;
    var reloadComponent = _context$asyncProps.reloadComponent;

    var asyncProps = lookupPropsForComponent(Component, propsAndComponents);
    var reload = function reload() {
      return reloadComponent(Component);
    };
    return _react2['default'].createElement(Component, _extends({}, props, routerProps, asyncProps, {
      reloadAsyncProps: reload,
      loading: loading
    }));
  };

  _createClass(AsyncPropsContainer, null, [{
    key: 'propTypes',
    value: {
      Component: func.isRequired,
      routerProps: object.isRequired
    },
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {
      asyncProps: object.isRequired
    },
    enumerable: true
  }]);

  return AsyncPropsContainer;
})(_react2['default'].Component);

var AsyncProps = (function (_React$Component2) {
  _inherits(AsyncProps, _React$Component2);

  _createClass(AsyncProps, null, [{
    key: 'childContextTypes',
    value: {
      asyncProps: object
    },
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      components: array.isRequired,
      params: object.isRequired,
      location: object.isRequired,
      onError: func.isRequired,
      renderLoading: func.isRequired,

      // server rendering
      propsArray: array,
      componentsArray: array
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      onError: function onError(err) {
        throw err;
      },
      renderLoading: function renderLoading() {
        return null;
      }
    },
    enumerable: true
  }]);

  function AsyncProps(props, context) {
    _classCallCheck(this, AsyncProps);

    _React$Component2.call(this, props, context);
    var _props2 = this.props;
    var propsArray = _props2.propsArray;
    var componentsArray = _props2.componentsArray;

    var isServerRender = propsArray && componentsArray;
    this.state = {
      loading: false,
      prevProps: null,
      propsAndComponents: isServerRender ? { propsArray: propsArray, componentsArray: componentsArray } : hydrate(props)
    };
  }

  AsyncProps.prototype.getChildContext = function getChildContext() {
    var _this = this;

    var _state = this.state;
    var loading = _state.loading;
    var propsAndComponents = _state.propsAndComponents;

    return {
      asyncProps: {
        loading: loading,
        propsAndComponents: propsAndComponents,
        reloadComponent: function reloadComponent(Component) {
          _this.reloadComponent(Component);
        }
      }
    };
  };

  AsyncProps.prototype.componentDidMount = function componentDidMount() {
    var _props3 = this.props;
    var components = _props3.components;
    var params = _props3.params;
    var location = _props3.location;

    this.loadAsyncProps(components, params, location);
  };

  AsyncProps.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var routeChanged = nextProps.location !== this.props.location;
    if (!routeChanged) return;

    var oldComponents = filterAndFlattenComponents(this.props.components);
    var newComponents = filterAndFlattenComponents(nextProps.components);
    var components = arrayDiff(oldComponents, newComponents);

    if (components.length === 0) {
      var sameComponents = shallowEqual(oldComponents, newComponents);
      if (sameComponents) {
        var paramsChanged = !shallowEqual(nextProps.params, this.props.params);
        if (paramsChanged) components = [last(newComponents)];
      }
    }

    if (components.length > 0) this.loadAsyncProps(components, nextProps.params, nextProps.location);
  };

  AsyncProps.prototype.handleError = function handleError(cb) {
    var _this2 = this;

    return function (err) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (err && _this2.props.onError) _this2.props.onError(err);else cb.apply(undefined, [null].concat(args));
    };
  };

  AsyncProps.prototype.componentWillUnmount = function componentWillUnmount() {
    this._unmounted = true;
  };

  AsyncProps.prototype.loadAsyncProps = function loadAsyncProps(components, params, location, options) {
    var _this3 = this;

    this.setState({
      loading: true,
      prevProps: this.props
    });
    _loadAsyncProps(filterAndFlattenComponents(components), params, this.handleError(function (err, propsAndComponents) {
      var force = options && options.force;
      var sameLocation = _this3.props.location === location;
      // FIXME: next line has potential (rare) race conditions I think. If
      // somebody calls reloadAsyncProps, changes location, then changes
      // location again before its done and state gets out of whack (Rx folks
      // are like "LOL FLAT MAP LATEST NEWB"). Will revisit later.
      if ((force || sameLocation) && !_this3._unmounted) {
        if (_this3.state.propsAndComponents) {
          propsAndComponents = mergePropsAndComponents(_this3.state.propsAndComponents, propsAndComponents);
        }
        _this3.setState({
          loading: false,
          propsAndComponents: propsAndComponents,
          prevProps: null
        });
      }
    }));
  };

  AsyncProps.prototype.reloadComponent = function reloadComponent(Component) {
    var params = this.props.params;

    this.loadAsyncProps([Component], params, null, { force: true });
  };

  AsyncProps.prototype.render = function render() {
    var propsAndComponents = this.state.propsAndComponents;

    if (!propsAndComponents) {
      return this.props.renderLoading();
    } else {
      var props = this.state.loading ? this.state.prevProps : this.props;
      return _react2['default'].createElement(_reactRouterLibRoutingContext2['default'], _extends({}, props, { createElement: createElement }));
    }
  };

  return AsyncProps;
})(_react2['default'].Component);

exports['default'] = AsyncProps;