'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tokens = require('../tokens');

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

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

        this.importValues = function (values) {
            throw new Error('Model: "' + _this.constructor.name + '" must override importValues.');
        };

        this.exportValues = function () {
            throw new Error('Model: "' + _this.constructor.name + '" must override exportValues.');
        };

        // Automatically register the given object to the persistence service.
        this.ps = new _tokens.InstanceToken(this.constructor, this);
    }

    return BaseModel;
}();