import { InstanceToken, ModelToken } from './tokens';
import ko from 'knockout';


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

    importValues = (values) => {
        throw new Error(`Model: "${this.constructor.name}" must override importValues.`);
    }

    exportValues = () => {
        throw new Error(`Model: "${this.constructor.name}" must override exportValues.`);
    };
}

/**
 * A subclass of the Base `Model` class which provides serialization and
 * deserialization via a whitelist of fields to serialize/deserialize.
 */
export class WhitelistModel extends BaseModel {

    static FIELDS = [];

    importValues = (values) => {
        this.constructor.FIELDS.forEach(field => {
            this[field] = values[field];
        });
    };

    exportValues = () => {
        let values = {};
        this.constructor.FIELDS.forEach(field => {
            values[field] = this[field];
        });
        return values;
    };
}

/**
 * A subclass of the Base `Model` class which adds serialization and
 * deserialization via Knockout's built-in mapping functionality.
 */
export class KOModel extends BaseModel {

    /**
     * Check to see if the subclasses provide a mapping, if they do
     * not, then raise an exception.
     */
    get _mapping() {
        const mapping = this.constructor.mapping;
        if (!mapping) {
            throw new Error(`Model: "${this.constructor.name}" does not provide a mapping.`);
        }
        return mapping;
    }

    /**
     * A default implementation of object deserialization using Knockout autoignore
     * mapping. For custom mapping, subclasses can override this method.
     */
    importValues = (values) => {
        const mapping = ko.mapping.autoignore(this, this._mapping);
        ko.mapping.fromJS(values, mapping, this);
    }

    /**
     * A default implementation of object serialization using Knockout autoignore
     * mapping. For custom mapping, subclasses can override this method.
     */
    exportValues = () => {
        const mapping = ko.mapping.autoignore(this, this._mapping);
        return ko.mapping.toJS(this, mapping);
    };
}
