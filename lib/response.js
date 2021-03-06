'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * An APIResponse is a convenience wrapper around the data received when doing
 * a mapped query to the API.
 *
 * If a model instance is provided, the APIResponse will map the response data
 * to the model (see Model Serialization for more information). The APIResponse
 * also remembers the original response data for reference.
 *
 * Accessing the Response Objects
 * ------------------------------
 * Depending on the type of query, responses are mapped to either the `object`
 * or `objects` (note the plural) property on the APIResponse. In the case of
 * a query that will return multiple objects (i.e. when the `many` flag is set)
 * the resulting objects will be mapped and set to the `objects` property.
 * Otherwise single objects are always mapped to the `object` property.
 *
 * Navigating Paginated Responses
 * ------------------------------
 * A APIResponse provides an easy way to navigate through paginated results.
 * When retrieving a result set that is paginated (i.e. with
 * `Persistence.service.list()`), APIResponse provides two convenience methods:
 *
 * - getNextPage: Will fetch the next page in a result set if there is one.
 * - getPreviousPage: Will fetch the previous page in a result set if there is one.
 *
 * Using these two methods you can navigate the results of the query you made
 * originally. Note that you cannot change the parameters or modify the state
 * of the query once it is made. To sort and filter based on different critera,
 * you'll need to make a new query from the Persistence.service.
 *
 */
var APIResponse = function APIResponse(_ref) {
    var _this = this;

    var data = _ref.data,
        keys = _ref.keys,
        params = _ref.params,
        _ref$model = _ref.model,
        model = _ref$model === undefined ? null : _ref$model,
        _ref$many = _ref.many,
        many = _ref$many === undefined ? false : _ref$many,
        _ref$fromCache = _ref.fromCache,
        fromCache = _ref$fromCache === undefined ? false : _ref$fromCache;

    _classCallCheck(this, APIResponse);

    this.hasNextPage = function () {
        return _this.many && _this.data.next;
    };

    this.hasPreviousPage = function () {
        return _this.many && _this.data.previous;
    };

    this.getNextPage = function () {
        return new Promise(function (resolve) {
            if (!_this.many || !_this.hasNextPage()) {
                throw new Error('Given APIResponse: ' + _this.id + ' does not have a next value.');
            }

            var nextPageFetchParams = _extends({}, _this.fetchParams, { page: _this._getNextPageNumber() });
            return Persistence.service.action(_this.fetchKeys, nextPageFetchParams, false, _this.model, _this.many).then(resolve);
        });
    };

    this.getPreviousPage = function () {
        return new Promise(function (resolve) {
            if (!_this.many || !_this.hasPreviousPage()) {
                throw new Error('Given APIResponse: ' + _this.id + ' does not have a previous value.');
            }
            var previousPageFetchParams = _extends({}, _this.fetchParams, { page: _this._getPreviousPageNumber() });
            return Persistence.service.action(_this.fetchKeys, previousPageFetchParams, false, _this.model, _this.many).then(resolve);
        });
    };

    this._getCurrentPage = function () {
        return _this.fetchParams.page ? _this.fetchParams.page : 1;
    };

    this._getNextPageNumber = function () {
        return _this._getCurrentPage() + 1;
    };

    this._getPreviousPageNumber = function () {
        return _this._getCurrentPage() - 1;
    };

    this.id = _uuid2.default.v4().toString();
    this.fetchParams = params;
    this.fetchKeys = keys;
    this.data = data;
    this.many = many;
    this.model = model;
    this.fromCache = fromCache;

    // Map response to model object(s).
    if (model && data) {
        if (many && data.results) {
            this.objects = data.results.map(function (result) {
                var instance = new model();
                var schemaValues = instance.fromSchemaValues(result);
                instance.importValues(schemaValues);
                return instance;
            });
        } else {
            var instance = new model();
            var schemaValues = instance.fromSchemaValues(data);
            instance.importValues(schemaValues);
            this.object = instance;
        }
    }
}

/**
 * Returns whether or not the given fetch response has a next page.
 */


/**
 * Returns whether or not the given fetch response has a previous page.
 */


/**
 * Fetch the next page of results in a paginated result set.
 *
 * This method returns a promise to the APIResponse of the next page.
 *
 * WARNING: This method will throw an error when attempting to fetch a next
 * page for a single object result set or if there is no next page.
 * To avoid this, check if the APIResponse `hasNextPage` before calling.
 */


/**
 * Fetch the previous page of results in a paginated result set.
 *
 * This method returns a promise to the APIResponse of the previous page.
 *
 * WARNING: This method will throw an error when attempting to fetch a previous
 * page for a single object result set or if there is no previous page.
 * To avoid this, check if the APIResponse `hasPreviousPage` before calling.
 */


/* Private Methods */

;

exports.default = APIResponse;