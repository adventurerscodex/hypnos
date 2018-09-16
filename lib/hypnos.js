'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Hypnos = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _nodeCache = require('node-cache');

var _nodeCache2 = _interopRequireDefault(_nodeCache);

var _coreapi = require('coreapi');

var _coreapi2 = _interopRequireDefault(_coreapi);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _schema = require('schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Hypnos is a light-weight ORM and API Client for Javascript Web Clients.
 *
 * It uses a CoreAPI client and a given API schema to allow clients easy access
 * to both raw response data and mapped custom Model objects.
 *
 * Hypnos returns all normal responses in the form of a APIResponse
 * which allows for easy navigation through paginated responses as well as automatic
 * mapping to custom Models (see `Model` and `APIResponse` for more information).
 *
 * Once a Model is mapped from a response, it is also registered with
 * Hypnos and has access to shortcut methods via it's `ps` property.
 *
 * Example
 * -------
 *
 *     Hypnos.client.retrieve(Book, { id: '1234' }).then(response => {
 *         const book = response.object;
 *         // Update the local properties of the book object.
 *         book.title('My new favorite book');
 *
 *         // Persist your changes back to the API.
 *         book.ps.save();
 *
 *         // ...You can even refresh your local object from the API.
 *         book.ps.refresh();
 *
 *         // ...Or delete it easily.
 *         book.ps.delete();
 *     });
 */
var Hypnos = exports.Hypnos = function () {
    function Hypnos() {
        _classCallCheck(this, Hypnos);
    }

    _createClass(Hypnos, null, [{
        key: 'flush',


        /**
         * Flush the cache and destroy the current Hypnos client.
         */
        value: function flush() {
            if (this.client.cache) {
                this.client.cache.flushAll();
            }
            this._client = null;
        }
    }, {
        key: 'client',
        get: function get() {
            if (!Hypnos._client) {
                Hypnos._client = new _Hypnos(Hypnos.configuration.credentials, Hypnos.configuration.schema, Hypnos.configuration.cacheConfig);
            }
            return Hypnos._client;
        }
    }]);

    return Hypnos;
}();

Hypnos.configuration = {};
Hypnos._client = null;

var _Hypnos = function _Hypnos(credentials, schema, cacheConfig) {
    var _this = this;

    _classCallCheck(this, _Hypnos);

    this.action = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
            var keys = _ref2.keys,
                params = _ref2.params,
                raw = _ref2.raw,
                _ref2$useCache = _ref2.useCache,
                useCache = _ref2$useCache === undefined ? false : _ref2$useCache,
                _ref2$flushDepsCache = _ref2.flushDepsCache,
                flushDepsCache = _ref2$flushDepsCache === undefined ? true : _ref2$flushDepsCache,
                _ref2$model = _ref2.model,
                model = _ref2$model === undefined ? null : _ref2$model,
                _ref2$many = _ref2.many,
                many = _ref2$many === undefined ? false : _ref2$many;

            var key, cachedValue, data, _key, dependents, dependentKeys;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(_this.cache && useCache)) {
                                _context.next = 5;
                                break;
                            }

                            key = _this.cacheKey(model, keys, params, raw);
                            cachedValue = _this.cache.get(key);

                            if (!(cachedValue !== undefined)) {
                                _context.next = 5;
                                break;
                            }

                            return _context.abrupt('return', raw ? cachedValue : new _response2.default({
                                data: cachedValue,
                                keys: keys,
                                params: params,
                                model: model,
                                fromCache: true,
                                many: many
                            }));

                        case 5:
                            _context.next = 7;
                            return _this.client.action(_this.schema, keys, params);

                        case 7:
                            data = _context.sent;


                            // If we should, store the new value in the cache.
                            if (_this.cache && useCache) {
                                _key = _this.cacheKey(model, keys, params, raw);

                                _this.cache.set(_key, data);
                            }

                            // If this is a model-based request and we should clear the dep cache, do so.
                            if (_this.cache && model && flushDepsCache) {
                                dependents = model.getDependents();
                                dependentKeys = _this.cache.keys().filter(function (key) {
                                    return dependents.some(function (dependent) {
                                        if (typeof dependent === 'string') {
                                            // The dependent was specified as a string.
                                            return key.indexOf(dependent) == 0;
                                        } else {
                                            // The dependent was specified as a model.
                                            return key.indexOf(dependent.name) == 0;
                                        }
                                    });
                                });

                                _this.cache.del(dependentKeys);
                            }

                            return _context.abrupt('return', raw ? data : new _response2.default({ data: data, keys: keys, params: params, model: model, many: many }));

                        case 11:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }();

    this.cacheKey = function (model) {
        for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key2 = 1; _key2 < _len; _key2++) {
            keys[_key2 - 1] = arguments[_key2];
        }

        var key = model && model.name ? model.name + '__' : '';
        key += (0, _objectHash2.default)(keys);
        return key;
    };

    this.list = function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(model) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var useCache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
            var flushDepsCache = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(model.__skeys__), ['list']);
                            _context2.next = 3;
                            return _this.action({ keys: keys, params: params, raw: raw, model: model, many: true, useCache: useCache, flushDepsCache: flushDepsCache });

                        case 3:
                            return _context2.abrupt('return', _context2.sent);

                        case 4:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this);
        }));

        return function (_x2) {
            return _ref3.apply(this, arguments);
        };
    }();

    this.read = function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(model) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var useCache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
            var flushDepsCache = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(model.__skeys__), ['read']);
                            _context3.next = 3;
                            return _this.action({ keys: keys, params: params, raw: raw, model: model, many: false, useCache: useCache, flushDepsCache: flushDepsCache });

                        case 3:
                            return _context3.abrupt('return', _context3.sent);

                        case 4:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this);
        }));

        return function (_x7) {
            return _ref4.apply(this, arguments);
        };
    }();

    this.create = function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(model) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(model.__skeys__), ['create']);
                            _context4.next = 3;
                            return _this.action({ keys: keys, params: params, raw: raw, model: model, many: false });

                        case 3:
                            return _context4.abrupt('return', _context4.sent);

                        case 4:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this);
        }));

        return function (_x12) {
            return _ref5.apply(this, arguments);
        };
    }();

    this.update = function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(model) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(model.__skeys__), ['update']);
                            _context5.next = 3;
                            return _this.action({ keys: keys, params: params, raw: raw, model: model, many: false });

                        case 3:
                            return _context5.abrupt('return', _context5.sent);

                        case 4:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this);
        }));

        return function (_x15) {
            return _ref6.apply(this, arguments);
        };
    }();

    this.delete = function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(model) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(model.__skeys__), ['delete']);
                            _context6.next = 3;
                            return _this.action({ keys: keys, params: params, raw: raw, model: model, many: false });

                        case 3:
                            return _context6.abrupt('return', _context6.sent);

                        case 4:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this);
        }));

        return function (_x18) {
            return _ref7.apply(this, arguments);
        };
    }();

    this.schema = schema;

    if (cacheConfig) {
        this.cache = new _nodeCache2.default(cacheConfig);
    }

    // Initialize the CoreAPI Client
    var auth = new _coreapi2.default.auth.TokenAuthentication(credentials);
    this.client = new _coreapi2.default.Client({ auth: auth });
}

/**
 * TODO: Document
 */


/**
 * API Operations Methods
 * ======================
 * The following methods allow for easy interaction with the backing API
 * using the provided API Schema.
 * If you need functionality beyond the scope of these methods, refer to
 * the lower-level `action` API which simply wraps the coreapi.Client and
 * returns a APIResponse.
 *
 * Unmapped Responses
 * ------------------
 * To perform the query without mapping the results to a APIResponse set
 * `raw` to true. This will return the JSON results of the query directly.
 *
 * Using Custom Models
 * -------------------
 * Most times it is easiest to use subclasses of the base `Model` type
 * (see Model for more information), and if you need to provide a custom
 * object, you can refer to the `Model` documentation to see what fields
 * are required in order to conform with the Hypnos API.
 */

/**
 * Given a model type and an optional set of parameters, perform a list query
 * against the backing API and return a promise of results in the form of a
 * APIResponse (see APIResponse for more information).
 *
 * Example
 * -------
 *
 *     Hypnos.list(Book).then(response => {
 *         const books = response.objects;
 *         // Do stuff with books...
 *     });
 */


/**
 * Given a model type and an optional set of parameters, perform a retrieve
 * query against the backing API and return a promise of results in the
 * form of a APIResponse (see APIResponse for more information).
 *
 * Example
 * -------
 *
 *     Hypnos.client.read(Book, { id: '1234' }).then(response => {
 *         const book = response.object;
 *         // Do stuff with your book...
 *     });
 */


/**
 * Given a model type and an optional set of parameters, perform a create
 * against the backing API and return a promise of results in the
 * form of a APIResponse (see APIResponse for more information).
 *
 * Example
 * -------
 *
 *     const data = { title: 'An Adventure', author: 'John Smith' };
 *     Hypnos.client.create(Book, data).then(response => {
 *         const book = response.object;
 *         // Do stuff with your new book...
 *     });
 */


/**
 * Given a model type and an optional set of parameters, perform an update
 * against the backing API and return a promise of results in the
 * form of a APIResponse (see APIResponse for more information).
 *
 * Example
 * -------
 *
 *     const data = { id: '1234', title: 'An Adventure II', author: 'John Smith' };
 *     Hypnos.client.update(Book, data).then(response => {
 *         const book = response.object;
 *         // Do stuff with your updated book...
 *     });
 */


/**
 * Given a model type and an optional set of parameters, perform a destroy
 * against the backing API and return a promise of results in the
 * form of a APIResponse (see APIResponse for more information).
 *
 * Example
 * -------
 *
 *     Hypnos.delete(Book, { id: '1234' });
 */
;