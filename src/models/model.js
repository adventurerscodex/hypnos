import BaseModel from './base';

/**
 * A subclass of the Base `Model` class which provides serialization and
 * deserialization via a whitelist of fields to serialize/deserialize.
 */
export class Model extends BaseModel {

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
