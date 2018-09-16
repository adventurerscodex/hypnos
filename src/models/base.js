import { InstanceToken, ModelToken } from '../tokens';
import { get, pick } from 'lodash';
import ko from 'knockout';
import schema from 'schema';


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
export class BaseModel {

    // Automatically register the given class to the persistence service.
    static get ps() {
        return new ModelToken(this);
    }

    constructor() {
        // Automatically register the given object to the persistence service.
        this.ps = new InstanceToken(this.constructor, this);
    }

    static getDependents() {
        return [
            this.name,
            ...(this.__dependents__ || []),
        ];
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
    toSchemaValues = (values) => {
        return values;
    };

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
    fromSchemaValues = (schemaValues) => {
        return schemaValues;
    };

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
    clean = (keys, values) => {
        // Get the link to the given action in the schema.
        const path = keys.join('.');
        const link = get(schema.content, path, null);
        if (!link) {
            throw new Error(`Field ${keys.join(' ')} on type ${this.constructor.name} does not exit.`);
        }

        // Get the names for the fields in the given schema action.
        const fieldNames = link.fields.map(({name}) => (name));

        // Omit all of the fields that are not required in the schema for the
        // action that the user specified.
        return pick(values, fieldNames);
    };

    importValues = (values) => {
        throw new Error(`Model: "${this.constructor.name}" must override importValues.`);
    }

    exportValues = () => {
        throw new Error(`Model: "${this.constructor.name}" must override exportValues.`);
    };
}
