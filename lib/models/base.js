'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseModel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tokens = require('../tokens');

var _lodash = require('lodash');

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
 * model classes like: Model and KOModel.
 *
 * ## Mapping Models to the API Schema
 *
 * Once you have an API schema you'll need to specify how your model classes
 * map to the schema definition. You do this by specifying the path in the
 * model's `__skeys__` static attribute.
 *
 *      class Book extends Model {
 *          static __skeys__ = ['resources', 'books'];
 *      }
 *
 * ## Specifying Dependents
 *
 * Hypnos automatically takes care of caching and re-serving cached responses for
 * identical queries. If your API has situations where model data is altered by
 * changes to other referenced models in your API (i.e. if updating an Author's name
 * should invalidate the cached Book objects so that their new Author information
 * is immediately visible), then you should specify these relations in your models
 * using the `__dependents__` key.
 *
 * NOTE: The values in `__dependents__` can be either classes or strings, but the
 * string should be of the same form as the class name `(Author == 'Author' != 'author')`.
 *
 *      class Book extends Model {
 *          static __dependents__ = [Author];
 *      }
 *
 * If your API contains cases where updating either an Author, or a Book should
 * invalidate the other, then you must specify the dependents in both models.
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

        this.toSchemaValues = function (values) {
            return values;
        };

        this.fromSchemaValues = function (schemaValues) {
            return schemaValues;
        };

        this.clean = function (keys, values) {
            // Get the link to the given action in the schema.
            var path = keys.join('.');
            var link = (0, _lodash.get)(_schema2.default.content, path, null);
            if (!link) {
                throw new Error('Field ' + keys.join(' ') + ' on type ' + _this.constructor.name + ' does not exit.');
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

    /* Model Mapping Methods */

    /**
     * An optional callback, useful for performing any transformations on the
     * serialized data before it is sent to the API client. This method is invoked
     * after the instance has exported its data, and after it is cleaned, but
     * before it is sent to the API client and the schema.
     *
     * Note: The return values from this method must match the fields in the
     * schema, or the schema will throw an error.
     *
     * This method is useful if a subclass contains nested data, but the server
     * is expecting a simple UUID for association.
     *
     * Example
     * -------
     *      // Our data model
     *      Book = {
     *          author: {
     *              name: "",
     *              authorId: "1234.434"
     *          }
     *      }
     *
     *      // What the schema expects
     *      Book = {
     *          author: "1234.434"
     *      }
     *
     *      class Book extends Model {
     *          toSchemaValues = (values) => {
     *              return { ...values, authorId: values.author.authorId }
     *          }
     *      }
     *
     */


    /**
     * An optional callback, useful for performing any transformations on the
     * recieved data before it is sent to the model instance to be imported.
     * This method is invoked after the new instance is created, and the API
     * response is received, but before it is sent to the API client and the schema.
     *
     * This method is useful if the server sends nested data, but the data model
     * is expecting a simple UUID for association.
     *
     * Example
     * -------
     *      // API response
     *      Book = {
     *          author: {
     *              name: "",
     *              authorId: "1234.434"
     *          }
     *      }
     *
     *      // What the Models require
     *      Book = {
     *          author: "1234.434"
     *      }
     *
     *      class Book extends Model {
     *          fromSchemaValues = (values) => {
     *              return { ...values, authorId: values.author.authorId }
     *          }
     *      }
     *
     */


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