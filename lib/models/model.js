'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Model = undefined;

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A subclass of the Base `Model` class which provides serialization and
 * deserialization via a whitelist of fields to serialize/deserialize.
 */
var Model = exports.Model = function (_BaseModel) {
    _inherits(Model, _BaseModel);

    function Model() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Model);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Model.__proto__ || Object.getPrototypeOf(Model)).call.apply(_ref, [this].concat(args))), _this), _this.importValues = function (values) {
            _this.constructor.FIELDS.forEach(function (field) {
                _this[field] = values[field];
            });
        }, _this.exportValues = function () {
            var values = {};
            _this.constructor.FIELDS.forEach(function (field) {
                values[field] = _this[field];
            });
            return values;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return Model;
}(_base2.default);

Model.FIELDS = [];