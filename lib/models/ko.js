'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KOModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _knockout = require('knockout');

var _knockout2 = _interopRequireDefault(_knockout);

var _base = require('./base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A subclass of the Base `Model` class which adds serialization and
 * deserialization via Knockout's built-in mapping functionality.
 */
var KOModel = exports.KOModel = function (_BaseModel) {
    _inherits(KOModel, _BaseModel);

    function KOModel() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, KOModel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = KOModel.__proto__ || Object.getPrototypeOf(KOModel)).call.apply(_ref, [this].concat(args))), _this), _this.importValues = function (values) {
            _knockout2.default.mapping.fromJS(values, _this._mapping, _this);
        }, _this.exportValues = function () {
            return _knockout2.default.mapping.toJS(_this, _this._mapping);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(KOModel, [{
        key: '_mapping',


        /**
         * Check to see if the subclasses provide a mapping, if they do
         * not, then raise an exception.
         */
        get: function get() {
            var mapping = this.constructor.mapping;
            if (!mapping) {
                throw new Error('Model: "' + this.constructor.name + '" does not provide a mapping.');
            }
            return mapping;
        }

        /**
         * A default implementation of object deserialization using Knockout autoignore
         * mapping. For custom mapping, subclasses can override this method.
         */


        /**
         * A default implementation of object serialization using Knockout autoignore
         * mapping. For custom mapping, subclasses can override this method.
         */

    }]);

    return KOModel;
}(_base.BaseModel);