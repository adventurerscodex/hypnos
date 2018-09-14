'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModelToken = exports.InstanceToken = undefined;

var _hypnos = require('./hypnos');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * An Instance Token provides quick access to the Hypnos
 * client methods through a model instance. You can use an
 * object's Instance Token to easily and clearly perform queries and updates to the
 * backing API using syntax bound to the Instance itself, rather than using
 * the normal Hypnos API.
 *
 * Example
 * -------
 *
 * Let's say you want to search for all books in your collection. Using the
 * normal Hypnos API you could perform a query for all books like this:
 *
 *      const { object: book } = await Hypnos.client.update(Book, {
 *          id: '123',
 *          title: 'A new title'
 *      });
 *      // Do stuff with the updated book...
 *
 * But using the InstanceToken API on a given Model would allow the
 * following shortcut syntax.
 *
 *      const { object: book } = await Book.ps.read({ id: '1234' });
 *      book.title = 'A new title';
 *      book.ps.save();
 *
 * For more information about what queries are available with this API, please
 * see the associated documentation below.
 */
var InstanceToken = exports.InstanceToken = function InstanceToken(model, instance) {
    var _this = this;

    _classCallCheck(this, InstanceToken);

    this.create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var keys, params, cleanedParams, schemaValues;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        keys = [].concat(_toConsumableArray(_this.model.__skeys__), ['create']);
                        params = _this.instance.exportValues();
                        cleanedParams = _this.instance.clean(keys, params);
                        schemaValues = _this.instance.toSchemaValues(cleanedParams);
                        _context.next = 6;
                        return _this.client.action({
                            keys: keys,
                            params: schemaValues,
                            raw: false,
                            model: _this.model,
                            many: false
                        });

                    case 6:
                        return _context.abrupt('return', _context.sent);

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, _this);
    }));
    this.refresh = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var keys, params, cleanedParams, schemaValues;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        keys = [].concat(_toConsumableArray(_this.model.__skeys__), ['read']);
                        params = _this.instance.exportValues();
                        cleanedParams = _this.instance.clean(keys, params);
                        schemaValues = _this.instance.toSchemaValues(cleanedParams);
                        _context2.next = 6;
                        return _this.client.action({
                            keys: keys,
                            params: schemaValues,
                            raw: false,
                            model: _this.model,
                            many: false
                        });

                    case 6:
                        return _context2.abrupt('return', _context2.sent);

                    case 7:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, _this);
    }));

    this.save = function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
            var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var method, params, keys, cleanedParams, schemaValues;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            method = 'update';
                            params = _this.instance.exportValues();

                            // Trim out unneeded fields if `fields` is provided and
                            // set the active method to use partial_update.

                            if (fields && fields.length > 0) {
                                method = 'partialUpdate';
                                Object.keys(params).forEach(function (key) {
                                    if (fields.indexOf(key) == -1) {
                                        delete params[key];
                                    }
                                });
                            }

                            keys = [].concat(_toConsumableArray(_this.model.__skeys__), [method]);
                            cleanedParams = _this.instance.clean(keys, params);
                            schemaValues = _this.instance.toSchemaValues(cleanedParams);
                            _context3.next = 8;
                            return _this.client.action({
                                keys: keys,
                                params: schemaValues,
                                raw: raw,
                                model: _this.model,
                                many: false
                            });

                        case 8:
                            return _context3.abrupt('return', _context3.sent);

                        case 9:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this);
        }));

        return function () {
            return _ref3.apply(this, arguments);
        };
    }();

    this.delete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var keys, params, cleanedParams, schemaValues;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        keys = [].concat(_toConsumableArray(_this.model.__skeys__), ['delete']);
                        params = _this.instance.exportValues();
                        cleanedParams = _this.instance.clean(keys, params);
                        schemaValues = _this.instance.toSchemaValues(cleanedParams);
                        _context4.next = 6;
                        return _this.client.action({
                            keys: keys,
                            params: schemaValues,
                            raw: true,
                            model: _this.model,
                            many: false
                        });

                    case 6:
                        return _context4.abrupt('return', _context4.sent);

                    case 7:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, _this);
    }));

    this.model = model;
    this.instance = instance;
    this.client = _hypnos.Hypnos.client;
}

/**
 * This method allows the creation of model object data directly to the
 * remote API.
 *
 * WARNING: Once you've used the original "template" instance to create an
 * object, you should not continue using that object in your code. Always
 * use the instance returned from the response since it has all of the required
 * data from the API to perform the rest of the expected functionality.
 *
 * Example
 * -------
 *
 * Let's assume that you have a model you've created locally, you've
 * filed in the values, and now you want to tell your API to create that
 * new object.
 *
 *      const instance = new MyModel();
 *      // ...fill in the values...
 *      instance.ps.create().then(response => {
 *          const persistedInstance = response.object;
 *      });
 */


/**
 * Refresh the data for the given object from the remote store.
 */


/**
 * Persist the object's data to the remote store. This only works for
 * existing objects.
 *
 * If a list of fields is provided, then only update those fields.
 */


/**
 * Tell the remote store to destroy the current object.
 *
 * WARNING: This does not remove the object from memory, only from
 * the remote store.
 */
;

/**
 * A ModelToken, like an InstanceToken provides quick access to the Hypnos
 * client methods without an active model instance to use. You can use an
 * object's Model Token to easily and clearly perform queries and updates to the
 * backing API using syntax bound to the Model class itself, rather than using
 * the normal Hypnos API.
 *
 * Example
 * -------
 *
 * Let's say you want to search for all books in your collection. Using the
 * normal Hypnos API you could perform a query for all books like this:
 *
 *      const response = await Hypnos.client.list(Book);
 *      const books = response.objects;
 *      // Do stuff with books...
 *
 * But implementing the ModelToken API on a given Model would allow the
 * following shortcut syntax.
 *
 *      const response = await Book.ps.list();
 *      const books = response.objects;
 *      // Do stuff with books...
 *
 * For more information about what queries are available with this API, please
 * see the associated documentation below.
 *
 * For more information about performing queries on mapped Model instances
 * (i.e. your new book instances) please refer to the InstanceToken documentation.
 */


var ModelToken = exports.ModelToken = function ModelToken(model) {
    var _this2 = this;

    _classCallCheck(this, ModelToken);

    this.list = function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var useCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var flushDepsCache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['list']);
                            _context5.next = 3;
                            return _this2.client.action({
                                keys: keys,
                                params: params,
                                raw: raw,
                                model: _this2.model,
                                many: true,
                                useCache: useCache,
                                flushDepsCache: flushDepsCache
                            });

                        case 3:
                            return _context5.abrupt('return', _context5.sent);

                        case 4:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this2);
        }));

        return function () {
            return _ref5.apply(this, arguments);
        };
    }();

    this.read = function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var useCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var flushDepsCache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['read']);
                            _context6.next = 3;
                            return _this2.client.action({
                                keys: keys,
                                params: params,
                                raw: raw,
                                model: _this2.model,
                                many: false,
                                useCache: useCache,
                                flushDepsCache: flushDepsCache
                            });

                        case 3:
                            return _context6.abrupt('return', _context6.sent);

                        case 4:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, _this2);
        }));

        return function () {
            return _ref6.apply(this, arguments);
        };
    }();

    this.create = function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['create']);
                            _context7.next = 3;
                            return _this2.client.action({
                                keys: keys,
                                params: params,
                                raw: raw,
                                model: _this2.model,
                                many: false
                            });

                        case 3:
                            return _context7.abrupt('return', _context7.sent);

                        case 4:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, _this2);
        }));

        return function () {
            return _ref7.apply(this, arguments);
        };
    }();

    this.update = function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['update']);
                            _context8.next = 3;
                            return _this2.client.action({
                                keys: keys,
                                params: params,
                                raw: raw,
                                model: _this2.model,
                                many: false
                            });

                        case 3:
                            return _context8.abrupt('return', _context8.sent);

                        case 4:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, _this2);
        }));

        return function () {
            return _ref8.apply(this, arguments);
        };
    }();

    this.delete = function () {
        var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var keys;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['delete']);
                            _context9.next = 3;
                            return _this2.client.action({
                                keys: keys,
                                params: params,
                                raw: raw,
                                model: _this2.model,
                                many: false
                            });

                        case 3:
                            return _context9.abrupt('return', _context9.sent);

                        case 4:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, _this2);
        }));

        return function () {
            return _ref9.apply(this, arguments);
        };
    }();

    this.model = model;
    this.client = _hypnos.Hypnos.client;
}

/**
 * Given a model type and an optional set of parameters, perform a list query
 * against the backing API and return a promise of results in the form of a
 * FetchResponse (see FetchResponse for more information).
 *
 * Example
 * -------
 *
 *     Book.ps.list().then(response => {
 *         const books = response.objects;
 *         // Do stuff with books...
 *     });
 */


/**
 * Given a model type and an optional set of parameters, perform a retrieve
 * query against the backing API and return a promise of results in the
 * form of a FetchResponse (see FetchResponse for more information).
 *
 * Example
 * -------
 *
 *     Book.ps.read({ id: '1234' }).then(response => {
 *         const book = response.object;
 *         // Do stuff with your book...
 *     });
 */


/**
 * Given a model type and an optional set of parameters, perform a create
 * against the backing API and return a promise of results in the
 * form of a FetchResponse (see FetchResponse for more information).
 *
 * Example
 * -------
 *
 *     const data = { title: 'An Adventure', author: 'John Smith' };
 *     Book.ps.create(data).then(response => {
 *         const book = response.object;
 *         // Do stuff with your new book...
 *     });
 */


/**
 * Given a model type and an optional set of parameters, perform an update
 * against the backing API and return a promise of results in the
 * form of a FetchResponse (see FetchResponse for more information).
 *
 * Example
 * -------
 *
 *     const data = { id: '1234', title: 'An Adventure II', author: 'John Smith' };
 *     Book.ps.update(data).then(response => {
 *         const book = response.object;
 *         // Do stuff with your updated book...
 *     });
 */


/**
 * Given a model type and an optional set of parameters, perform a destroy
 * against the backing API and return a promise of results in the
 * form of a FetchResponse (see FetchResponse for more information).
 *
 * Example
 * -------
 *
 *     Book.ps.delete({ id: '1234' });
 */
;