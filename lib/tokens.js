'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModelToken = exports.InstanceToken = undefined;

var _hypnos = require('./hypnos');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * TODO: Document
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
var InstanceToken = exports.InstanceToken = function InstanceToken(model, instance) {
    var _this = this;

    _classCallCheck(this, InstanceToken);

    this.create = function () {
        var keys = [].concat(_toConsumableArray(_this.model.__skeys__), ['create']);
        var params = _this.instance.exportValues();
        var cleanedParams = _this.instance.clean(params);
        return _this.client.action(keys, params, false, _this.model, false);
    };

    this.refresh = function () {
        var keys = [].concat(_toConsumableArray(_this.model.__skeys__), ['read']);
        var params = _this.instance.exportValues();
        var cleanedParams = _this.instance.clean(_this.model, keys, params);
        return _this.client.action(keys, params, false, _this.model, false);
    };

    this.save = function () {
        var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var method = 'update';
        var params = _this.instance.exportValues();
        var cleanedParams = _this.instance.clean(_this.model, keys, params);

        // Trim out unneeded fields if `fields` is provided and
        // set the active method to use partial_update.
        if (fields && fields.length > 0) {
            method = 'partial_update';
            for (key in params) {
                if (!fields.contains(key)) {
                    delete params[key];
                }
            }
        }

        var keys = [].concat(_toConsumableArray(_this.model.__skeys__), [method]);
        return _this.client.action(keys, params, raw, _this.model, false);
    };

    this.delete = function () {
        var keys = [].concat(_toConsumableArray(_this.model.__skeys__), ['delete']);
        var params = _this.instance.exportValues();
        var cleanedParams = _this.instance.clean(_this.model, keys, params);
        return _this.client.action(keys, params, true, _this.model, false);
    };

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
 * A ModelToken, like an InstanceToken provides quick access to the Persistence
 * client methods without an active model instance to use. You can use an
 * object's Model Token to easily and clearly perform queries and updates to the
 * backing API using syntax bound to the Model class itself, rather than using
 * the normal Persistence API.
 *
 * Example
 * -------
 *
 * Let's say you want to search for all books in your collection. Using the
 * normal Persistence API you could perform a query for all books like this:
 *
 *      Persistence.client.list(Book).then(response => {
 *          const books = response.objects;
 *          // Do stuff with books...
 *      });
 *
 * But implementing the ModelToken API on a given Model would allow the
 * following shortcut syntax.
 *
 *      Book.ps.list().then(response => {
 *          const books = response.objects;
 *          // Do stuff with books...
 *      });
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
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['list']);
        return _this2.client.action(keys, params, raw, _this2.model, true);
    };

    this.read = function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['read']);
        return _this2.client.action(keys, params, raw, _this2.model, false);
    };

    this.create = function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['create']);
        return _this2.client.action(keys, params, raw, _this2.model, false);
    };

    this.update = function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['update']);
        return _this2.client.action(keys, params, raw, _this2.model, false);
    };

    this.delete = function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var raw = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var keys = [].concat(_toConsumableArray(_this2.model.__skeys__), ['delete']);
        return _this2.client.action(keys, params, raw, _this2.model, false);
    };

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