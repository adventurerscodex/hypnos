'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _tokens = require('../tokens');

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _schema = require('schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class is the base definition of all ES6 style model objects.
 *
 * Models extending this class will gain the following benefits:
 * - Automatic Persistence Service Token registration.
 * - Automatic mapping via FetchResponses and mapped queries.
 *
 * This model provides no default implementation of serialization or
 * deserialization. Subclasses must implement this feature for their respective
 * use-cases. This framework provides a few default implementations of usable
 * model classes like: JSONModel and KOModel.
 */
var BaseModel = exports.BaseModel = function () {
    _createClass(BaseModel, null, [{
        key: 'ps',


        // Automatically register the given class to the persistence service.
        get: function get() {
            return new _tokens.ModelToken(this);
        }
    }]);

    function BaseModel() {
        var _this = this;

        _classCallCheck(this, BaseModel);

        this.clean = function (values) {
            // Get the link to the given action in the schema.
            var path = _this.__skeys__.join('.');
            var link = (0, _lodash.get)(_schema2.default.content, path, null);
            if (!link) {
                throw new Error('Field ' + _this.__skeys__.join(' ') + ' on type ' + _this.contructor.name + ' does not exit.');
            }

            // Get the names for the fields in the given schema action.
            var fieldNames = link.fields.map(function (_ref) {
                var name = _ref.name;
                return name;
            });

            // Omit all of the fields that are not required in the schema for the
            // action that the user specified.
            return (0, _lodash.pick)(values, fieldNames);
        };

        this.importValues = function (values) {
            throw new Error('Model: "' + _this.constructor.name + '" must override importValues.');
        };

        this.exportValues = function () {
            throw new Error('Model: "' + _this.constructor.name + '" must override exportValues.');
        };

        // Automatically register the given object to the persistence service.
        this.ps = new _tokens.InstanceToken(this.constructor, this);
    }

    /**
     * Given a set of values exported from the given model instance, clean
     * the fields and do any preparation before handing off the data to the
     * Hypnos API client.
     *
     * By default this method removes and fields in the values that are not
     * listed in the schema fields for the action that the user is trying to take.
     *
     * Subclasses can override this method to provide custom clean behavior.
     */


    return BaseModel;
}();