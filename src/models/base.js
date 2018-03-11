import { InstanceToken, ModelToken } from '../tokens';
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
