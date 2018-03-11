import ko from 'knockout';
import BaseModel from './base';

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
