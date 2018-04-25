import { get, pick } from 'lodash';
import { InstanceToken, ModelToken } from '../tokens';
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
 * model classes like: JSONModel and KOModel.
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

    /* Model Mapping Methods */

    toSchemaValues = (values) => {
        return values;
    };

    fromSchemaValues = (schemaValues) => {
        return schemaValues
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
        const path = keys.join('.')
        const link = get(schema.content, path, null);
        if (!link) {
            throw new Error(`Field ${keys.join(' ')} on type ${this.contructor.name} does not exit.`);
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
