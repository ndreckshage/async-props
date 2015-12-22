(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["AsyncProps"] = factory(require("react"));
	else
		root["AsyncProps"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouterLibRoutingContext = __webpack_require__(2);

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _invariant = __webpack_require__(4);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _RouteUtils = __webpack_require__(5);

	var _getRouteParams = __webpack_require__(7);

	var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

	var _React$PropTypes = _react2['default'].PropTypes;
	var array = _React$PropTypes.array;
	var func = _React$PropTypes.func;
	var object = _React$PropTypes.object;

	/**
	 * A <RoutingContext> renders the component tree for a given router state
	 * and sets the history object and the current location in context.
	 */

	var RoutingContext = (function (_Component) {
	  _inherits(RoutingContext, _Component);

	  function RoutingContext() {
	    _classCallCheck(this, RoutingContext);

	    _Component.apply(this, arguments);
	  }

	  RoutingContext.prototype.getChildContext = function getChildContext() {
	    var _props = this.props;
	    var history = _props.history;
	    var location = _props.location;

	    return { history: history, location: location };
	  };

	  RoutingContext.prototype.createElement = function createElement(component, props) {
	    return component == null ? null : this.props.createElement(component, props);
	  };

	  RoutingContext.prototype.render = function render() {
	    var _this = this;

	    var _props2 = this.props;
	    var history = _props2.history;
	    var location = _props2.location;
	    var routes = _props2.routes;
	    var params = _props2.params;
	    var components = _props2.components;

	    var element = null;

	    if (components) {
	      element = components.reduceRight(function (element, components, index) {
	        if (components == null) return element; // Don't create new children; use the grandchildren.

	        var route = routes[index];
	        var routeParams = _getRouteParams2['default'](route, params);
	        var props = {
	          history: history,
	          location: location,
	          params: params,
	          route: route,
	          routeParams: routeParams,
	          routes: routes
	        };

	        if (_RouteUtils.isReactChildren(element)) {
	          props.children = element;
	        } else if (element) {
	          for (var prop in element) {
	            if (element.hasOwnProperty(prop)) props[prop] = element[prop];
	          }
	        }

	        if (typeof components === 'object') {
	          var elements = {};

	          for (var key in components) {
	            if (components.hasOwnProperty(key)) {
	              // Pass through the key as a prop to createElement to allow
	              // custom createElement functions to know which named component
	              // they're rendering, for e.g. matching up to fetched data.
	              elements[key] = _this.createElement(components[key], _extends({
	                key: key }, props));
	            }
	          }

	          return elements;
	        }

	        return _this.createElement(components, props);
	      }, element);
	    }

	    !(element === null || element === false || _react2['default'].isValidElement(element)) ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'The root route must render a single element') : _invariant2['default'](false) : undefined;

	    return element;
	  };

	  return RoutingContext;
	})(_react.Component);

	RoutingContext.propTypes = {
	  history: object.isRequired,
	  createElement: func.isRequired,
	  location: object.isRequired,
	  routes: array.isRequired,
	  params: object.isRequired,
	  components: array.isRequired
	};

	RoutingContext.defaultProps = {
	  createElement: _react2['default'].createElement
	};

	RoutingContext.childContextTypes = {
	  history: object.isRequired,
	  location: object.isRequired
	};

	exports['default'] = RoutingContext;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.isReactChildren = isReactChildren;
	exports.createRouteFromReactElement = createRouteFromReactElement;
	exports.createRoutesFromReactChildren = createRoutesFromReactChildren;
	exports.createRoutes = createRoutes;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _warning = __webpack_require__(6);

	var _warning2 = _interopRequireDefault(_warning);

	function isValidChild(object) {
	  return object == null || _react2['default'].isValidElement(object);
	}

	function isReactChildren(object) {
	  return isValidChild(object) || Array.isArray(object) && object.every(isValidChild);
	}

	function checkPropTypes(componentName, propTypes, props) {
	  componentName = componentName || 'UnknownComponent';

	  for (var propName in propTypes) {
	    if (propTypes.hasOwnProperty(propName)) {
	      var error = propTypes[propName](props, propName, componentName);

	      /* istanbul ignore if: error logging */
	      if (error instanceof Error) process.env.NODE_ENV !== 'production' ? _warning2['default'](false, error.message) : undefined;
	    }
	  }
	}

	function createRoute(defaultProps, props) {
	  return _extends({}, defaultProps, props);
	}

	function createRouteFromReactElement(element) {
	  var type = element.type;
	  var route = createRoute(type.defaultProps, element.props);

	  if (type.propTypes) checkPropTypes(type.displayName || type.name, type.propTypes, route);

	  if (route.children) {
	    var childRoutes = createRoutesFromReactChildren(route.children, route);

	    if (childRoutes.length) route.childRoutes = childRoutes;

	    delete route.children;
	  }

	  return route;
	}

	/**
	 * Creates and returns a routes object from the given ReactChildren. JSX
	 * provides a convenient way to visualize how routes in the hierarchy are
	 * nested.
	 *
	 *   import { Route, createRoutesFromReactChildren } from 'react-router'
	 *   
	 *   const routes = createRoutesFromReactChildren(
	 *     <Route component={App}>
	 *       <Route path="home" component={Dashboard}/>
	 *       <Route path="news" component={NewsFeed}/>
	 *     </Route>
	 *   )
	 *
	 * Note: This method is automatically used when you provide <Route> children
	 * to a <Router> component.
	 */

	function createRoutesFromReactChildren(children, parentRoute) {
	  var routes = [];

	  _react2['default'].Children.forEach(children, function (element) {
	    if (_react2['default'].isValidElement(element)) {
	      // Component classes may have a static create* method.
	      if (element.type.createRouteFromReactElement) {
	        var route = element.type.createRouteFromReactElement(element, parentRoute);

	        if (route) routes.push(route);
	      } else {
	        routes.push(createRouteFromReactElement(element));
	      }
	    }
	  });

	  return routes;
	}

	/**
	 * Creates and returns an array of routes from the given object which
	 * may be a JSX route, a plain object route, or an array of either.
	 */

	function createRoutes(routes) {
	  if (isReactChildren(routes)) {
	    routes = createRoutesFromReactChildren(routes);
	  } else if (routes && !Array.isArray(routes)) {
	    routes = [routes];
	  }

	  return routes;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = function() {};

	if (process.env.NODE_ENV !== 'production') {
	  warning = function(condition, format, args) {
	    var len = arguments.length;
	    args = new Array(len > 2 ? len - 2 : 0);
	    for (var key = 2; key < len; key++) {
	      args[key - 2] = arguments[key];
	    }
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }

	    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' +
	        format.replace(/%s/g, function() {
	          return args[argIndex++];
	        });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}

	module.exports = warning;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _PatternUtils = __webpack_require__(8);

	/**
	 * Extracts an object of params the given route cares about from
	 * the given params object.
	 */
	function getRouteParams(route, params) {
	  var routeParams = {};

	  if (!route.path) return routeParams;

	  var paramNames = _PatternUtils.getParamNames(route.path);

	  for (var p in params) {
	    if (params.hasOwnProperty(p) && paramNames.indexOf(p) !== -1) routeParams[p] = params[p];
	  }return routeParams;
	}

	exports['default'] = getRouteParams;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports.compilePattern = compilePattern;
	exports.matchPattern = matchPattern;
	exports.getParamNames = getParamNames;
	exports.getParams = getParams;
	exports.formatPattern = formatPattern;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _invariant = __webpack_require__(4);

	var _invariant2 = _interopRequireDefault(_invariant);

	function escapeRegExp(string) {
	  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function escapeSource(string) {
	  return escapeRegExp(string).replace(/\/+/g, '/+');
	}

	function _compilePattern(pattern) {
	  var regexpSource = '';
	  var paramNames = [];
	  var tokens = [];

	  var match = undefined,
	      lastIndex = 0,
	      matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g;
	  while (match = matcher.exec(pattern)) {
	    if (match.index !== lastIndex) {
	      tokens.push(pattern.slice(lastIndex, match.index));
	      regexpSource += escapeSource(pattern.slice(lastIndex, match.index));
	    }

	    if (match[1]) {
	      regexpSource += '([^/?#]+)';
	      paramNames.push(match[1]);
	    } else if (match[0] === '**') {
	      regexpSource += '([\\s\\S]*)';
	      paramNames.push('splat');
	    } else if (match[0] === '*') {
	      regexpSource += '([\\s\\S]*?)';
	      paramNames.push('splat');
	    } else if (match[0] === '(') {
	      regexpSource += '(?:';
	    } else if (match[0] === ')') {
	      regexpSource += ')?';
	    }

	    tokens.push(match[0]);

	    lastIndex = matcher.lastIndex;
	  }

	  if (lastIndex !== pattern.length) {
	    tokens.push(pattern.slice(lastIndex, pattern.length));
	    regexpSource += escapeSource(pattern.slice(lastIndex, pattern.length));
	  }

	  return {
	    pattern: pattern,
	    regexpSource: regexpSource,
	    paramNames: paramNames,
	    tokens: tokens
	  };
	}

	var CompiledPatternsCache = {};

	function compilePattern(pattern) {
	  if (!(pattern in CompiledPatternsCache)) CompiledPatternsCache[pattern] = _compilePattern(pattern);

	  return CompiledPatternsCache[pattern];
	}

	/**
	 * Attempts to match a pattern on the given pathname. Patterns may use
	 * the following special characters:
	 *
	 * - :paramName     Matches a URL segment up to the next /, ?, or #. The
	 *                  captured string is considered a "param"
	 * - ()             Wraps a segment of the URL that is optional
	 * - *              Consumes (non-greedy) all characters up to the next
	 *                  character in the pattern, or to the end of the URL if
	 *                  there is none
	 * - **             Consumes (greedy) all characters up to the next character
	 *                  in the pattern, or to the end of the URL if there is none
	 *
	 * The return value is an object with the following properties:
	 *
	 * - remainingPathname
	 * - paramNames
	 * - paramValues
	 */

	function matchPattern(pattern, pathname) {
	  // Make leading slashes consistent between pattern and pathname.
	  if (pattern.charAt(0) !== '/') {
	    pattern = '/' + pattern;
	  }
	  if (pathname.charAt(0) !== '/') {
	    pathname = '/' + pathname;
	  }

	  var _compilePattern2 = compilePattern(pattern);

	  var regexpSource = _compilePattern2.regexpSource;
	  var paramNames = _compilePattern2.paramNames;
	  var tokens = _compilePattern2.tokens;

	  regexpSource += '/*'; // Capture path separators

	  // Special-case patterns like '*' for catch-all routes.
	  var captureRemaining = tokens[tokens.length - 1] !== '*';

	  if (captureRemaining) {
	    // This will match newlines in the remaining path.
	    regexpSource += '([\\s\\S]*?)';
	  }

	  var match = pathname.match(new RegExp('^' + regexpSource + '$', 'i'));

	  var remainingPathname = undefined,
	      paramValues = undefined;
	  if (match != null) {
	    if (captureRemaining) {
	      remainingPathname = match.pop();
	      var matchedPath = match[0].substr(0, match[0].length - remainingPathname.length);

	      // If we didn't match the entire pathname, then make sure that the match
	      // we did get ends at a path separator (potentially the one we added
	      // above at the beginning of the path, if the actual match was empty).
	      if (remainingPathname && matchedPath.charAt(matchedPath.length - 1) !== '/') {
	        return {
	          remainingPathname: null,
	          paramNames: paramNames,
	          paramValues: null
	        };
	      }
	    } else {
	      // If this matched at all, then the match was the entire pathname.
	      remainingPathname = '';
	    }

	    paramValues = match.slice(1).map(function (v) {
	      return v != null ? decodeURIComponent(v) : v;
	    });
	  } else {
	    remainingPathname = paramValues = null;
	  }

	  return {
	    remainingPathname: remainingPathname,
	    paramNames: paramNames,
	    paramValues: paramValues
	  };
	}

	function getParamNames(pattern) {
	  return compilePattern(pattern).paramNames;
	}

	function getParams(pattern, pathname) {
	  var _matchPattern = matchPattern(pattern, pathname);

	  var paramNames = _matchPattern.paramNames;
	  var paramValues = _matchPattern.paramValues;

	  if (paramValues != null) {
	    return paramNames.reduce(function (memo, paramName, index) {
	      memo[paramName] = paramValues[index];
	      return memo;
	    }, {});
	  }

	  return null;
	}

	/**
	 * Returns a version of the given pattern with params interpolated. Throws
	 * if there is a dynamic segment of the pattern for which there is no param.
	 */

	function formatPattern(pattern, params) {
	  params = params || {};

	  var _compilePattern3 = compilePattern(pattern);

	  var tokens = _compilePattern3.tokens;

	  var parenCount = 0,
	      pathname = '',
	      splatIndex = 0;

	  var token = undefined,
	      paramName = undefined,
	      paramValue = undefined;
	  for (var i = 0, len = tokens.length; i < len; ++i) {
	    token = tokens[i];

	    if (token === '*' || token === '**') {
	      paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;

	      !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Missing splat #%s for path "%s"', splatIndex, pattern) : _invariant2['default'](false) : undefined;

	      if (paramValue != null) pathname += encodeURI(paramValue);
	    } else if (token === '(') {
	      parenCount += 1;
	    } else if (token === ')') {
	      parenCount -= 1;
	    } else if (token.charAt(0) === ':') {
	      paramName = token.substring(1);
	      paramValue = params[paramName];

	      !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== 'production' ? _invariant2['default'](false, 'Missing "%s" parameter for path "%s"', paramName, pattern) : _invariant2['default'](false) : undefined;

	      if (paramValue != null) pathname += encodeURIComponent(paramValue);
	    } else {
	      pathname += token;
	    }
	  }

	  return pathname.replace(/\/+/g, '/');
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }
/******/ ])
});
;