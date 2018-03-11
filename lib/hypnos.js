'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Hypnos = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*eslint no-console:0*/


var _coreapi = require('coreapi');

var _coreapi2 = _interopRequireDefault(_coreapi);

var _schema = require('schema');

var _schema2 = _interopRequireDefault(_schema);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
 *     Hypnos.retrieve(Book, { id: '1234' }).then(response => {
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
        value: function flush() {
            this._client = null;
        }
    }, {
        key: 'client',
        get: function get() {
            if (!Hypnos._client) {
                Hypnos._client = new _Hypnos(Hypnos.configuration.credentials, Hypnos.configuration.schema);
            }
            return Hypnos._client;
        }
    }]);

    return Hypnos;
}();

Hypnos.configuration = {};
Hypnos._client = null;

var _Hypnos = function _Hypnos(credentials, schema) {
    var _this = this;

    _classCallCheck(this, _Hypnos);

    this.hash = function (keys, params) {
        // TODO: Implement hashing for caching purposes.
        return '';
    };

    this.action = function (keys, params, raw) {
        for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            rest[_key - 3] = arguments[_key];
        }

        return new Promise(function (resolve) {
            _this.client.action(_this.schema, keys, params).then(function (response) {
                if (raw) {
                    resolve(response);
                } else {
                    var hash = _this.hash(keys, params);
                    resolve(new (Function.prototype.bind.apply(_response2.default, [null].concat([response, keys, params, hash], rest)))());
                }
            });
        });
    };

    this.list = function (model) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var keys = [].concat(_toConsumableArray(model.__skeys__), ['list']);
        return _this.action(keys, params, raw, model, true);
    };

    this.read = function (model) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var keys = [].concat(_toConsumableArray(model.__skeys__), ['read']);
        return _this.action(keys, params, raw, model, false);
    };

    this.create = function (model) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var keys = [].concat(_toConsumableArray(model.__skeys__), ['create']);
        return _this.action(keys, params, raw, model, false);
    };

    this.update = function (model) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var keys = [].concat(_toConsumableArray(model.__skeys__), ['update']);
        return _this.action(keys, params, raw, model, false);
    };

    this.delete = function (model) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var raw = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var keys = [].concat(_toConsumableArray(model.__skeys__), ['delete']);
        return _this.action(keys, params, raw, model, false);
    };

    this.schema = schema;

    // Initialize the CoreAPI Client
    var auth = new _coreapi2.default.auth.TokenAuthentication(credentials);
    this.client = new _coreapi2.default.Client({ auth: auth });
}

// TODO: Implement Caching

/**
 * TODO: Document
 */


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
 *     Hypnos.read(Book, { id: '1234' }).then(response => {
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
 *     Hypnos.create(Book, data).then(response => {
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
 *     Hypnos.update(Book, data).then(response => {
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

;