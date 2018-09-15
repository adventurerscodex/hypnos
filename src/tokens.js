import { Hypnos } from './hypnos';

/**
 * An Instance Token provides quick access to the Hypnos
 * client methods through a model instance. You can use an
 * object's Instance Token to easily and clearly perform queries and updates to the
 * backing API using syntax bound to the Instance itself, rather than using
 * the normal Hypnos API.
 *
 * Example
 * -------
 *
 * Let's say you want to search for all books in your collection. Using the
 * normal Hypnos API you could perform a query for all books like this:
 *
 *      const { object: book } = await Hypnos.client.update(Book, {
 *          id: '123',
 *          title: 'A new title'
 *      });
 *      // Do stuff with the updated book...
 *
 * But using the InstanceToken API on a given Model would allow the
 * following shortcut syntax.
 *
 *      const { object: book } = await Book.ps.read({ id: '1234' });
 *      book.title = 'A new title';
 *      book.ps.save();
 *
 * For more information about what queries are available with this API, please
 * see the associated documentation below.
 */
export class InstanceToken {

    constructor(model, instance) {
        this.model = model;
        this.instance = instance;
        this.client = Hypnos.client;
    }

    /**
     * This method allows the creation of model object data directly to the
     * remote API.
     *
     * WARNING: Once you've used the original "template" instance to create an
     * object, you should not continue using that object in your code. Always
     * use the instance returned from the response since it has all of the required
     * data from the API to perform the rest of the expected functionality.
     *
     * Example
     * -------
     *
     * Let's assume that you have a model you've created locally, you've
     * filed in the values, and now you want to tell your API to create that
     * new object.
     *
     *      const instance = new MyModel();
     *      // ...fill in the values...
     *      instance.ps.create().then(response => {
     *          const persistedInstance = response.object;
     *      });
     */
    create = async () => {
        const keys = [...this.model.__skeys__, 'create'];
        const params = this.instance.exportValues();
        const cleanedParams = this.instance.clean(keys, params);
        const schemaValues = this.instance.toSchemaValues(cleanedParams);
        return await this.client.action({
            keys,
            params: schemaValues,
            raw: false,
            model: this.model,
            many: false,
        });
    };

    /**
     * Refresh the data for the given object from the remote store.
     */
    refresh = async () => {
        const keys = [...this.model.__skeys__, 'read'];
        const params = this.instance.exportValues();
        const cleanedParams = this.instance.clean(keys, params);
        const schemaValues = this.instance.toSchemaValues(cleanedParams);
        return await this.client.action({
            keys,
            params: schemaValues,
            raw: false,
            model: this.model,
            many: false,
        });
    };

    /**
     * Persist the object's data to the remote store. This only works for
     * existing objects.
     *
     * If a list of fields is provided, then only update those fields.
     */
    save = async (fields=null, raw=false) => {
        let method = 'update';
        const params = this.instance.exportValues();

        // Trim out unneeded fields if `fields` is provided and
        // set the active method to use partial_update.
        if (fields && fields.length > 0) {
            method = 'partialUpdate';
            Object.keys(params).forEach(key => {
                if (fields.indexOf(key) == -1) {
                    delete params[key];
                }
            });
        }

        const keys = [...this.model.__skeys__, method];
        const cleanedParams = this.instance.clean(keys, params);
        const schemaValues = this.instance.toSchemaValues(cleanedParams);
        return await this.client.action({
            keys,
            params: schemaValues,
            raw,
            model: this.model,
            many: false,
        });
    };

    /**
     * Tell the remote store to destroy the current object.
     *
     * WARNING: This does not remove the object from memory, only from
     * the remote store.
     */
    delete = async () => {
        const keys = [...this.model.__skeys__, 'delete'];
        const params = this.instance.exportValues();
        const cleanedParams = this.instance.clean(keys, params);
        const schemaValues = this.instance.toSchemaValues(cleanedParams);
        return await this.client.action({
            keys,
            params: schemaValues,
            raw: true,
            model: this.model,
            many: false,
        });
    };
}


/**
 * A ModelToken, like an InstanceToken provides quick access to the Hypnos
 * client methods without an active model instance to use. You can use an
 * object's Model Token to easily and clearly perform queries and updates to the
 * backing API using syntax bound to the Model class itself, rather than using
 * the normal Hypnos API.
 *
 * Example
 * -------
 *
 * Let's say you want to search for all books in your collection. Using the
 * normal Hypnos API you could perform a query for all books like this:
 *
 *      const response = await Hypnos.client.list(Book);
 *      const books = response.objects;
 *      // Do stuff with books...
 *
 * But implementing the ModelToken API on a given Model would allow the
 * following shortcut syntax.
 *
 *      const response = await Book.ps.list();
 *      const books = response.objects;
 *      // Do stuff with books...
 *
 * For more information about what queries are available with this API, please
 * see the associated documentation below.
 *
 * For more information about performing queries on mapped Model instances
 * (i.e. your new book instances) please refer to the InstanceToken documentation.
 */
export class ModelToken {

    constructor(model) {
        this.model = model;
        this.client = Hypnos.client;
    }

    /**
     * Given a model type and an optional set of parameters, perform a list query
     * against the backing API and return a promise of results in the form of a
     * FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     Book.ps.list().then(response => {
     *         const books = response.objects;
     *         // Do stuff with books...
     *     });
     */
    list = async (params={}, raw=false, useCache=true, flushDepsCache=false) => {
        const keys = [...this.model.__skeys__, 'list'];
        return await this.client.action({
            keys,
            params,
            raw,
            model: this.model,
            many: true,
            useCache,
            flushDepsCache,
        });
    };

    /**
     * Given a model type and an optional set of parameters, perform a retrieve
     * query against the backing API and return a promise of results in the
     * form of a FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     Book.ps.read({ id: '1234' }).then(response => {
     *         const book = response.object;
     *         // Do stuff with your book...
     *     });
     */
    read = async (params={}, raw=false, useCache=true, flushDepsCache=false) => {
        const keys = [...this.model.__skeys__, 'read'];
        return await this.client.action({
            keys,
            params,
            raw,
            model: this.model,
            many: false,
            useCache,
            flushDepsCache,
        });
    };

    /**
     * Given a model type and an optional set of parameters, perform a create
     * against the backing API and return a promise of results in the
     * form of a FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     const data = { title: 'An Adventure', author: 'John Smith' };
     *     Book.ps.create(data).then(response => {
     *         const book = response.object;
     *         // Do stuff with your new book...
     *     });
     */
    create = async (params={}, raw=false) => {
        const keys = [...this.model.__skeys__, 'create'];
        return await this.client.action({
            keys,
            params,
            raw,
            model: this.model,
            many: false,
        });
    };

    /**
     * Given a model type and an optional set of parameters, perform an update
     * against the backing API and return a promise of results in the
     * form of a FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     const data = { id: '1234', title: 'An Adventure II', author: 'John Smith' };
     *     Book.ps.update(data).then(response => {
     *         const book = response.object;
     *         // Do stuff with your updated book...
     *     });
     */
    update = async (params={}, raw=false) => {
        const keys = [...this.model.__skeys__, 'update'];
        return await this.client.action({
            keys,
            params,
            raw,
            model: this.model,
            many: false,
        });
    };

    /**
     * Given a model type and an optional set of parameters, perform a destroy
     * against the backing API and return a promise of results in the
     * form of a FetchResponse (see FetchResponse for more information).
     *
     * Example
     * -------
     *
     *     Book.ps.delete({ id: '1234' });
     */
    delete = async (params={}, raw=false) => {
        const keys = [...this.model.__skeys__, 'delete'];
        return await this.client.action({
            keys,
            params,
            raw,
            model: this.model,
            many: false,
        });
    };
}
