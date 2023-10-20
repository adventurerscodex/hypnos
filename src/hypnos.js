import APIResponse from './response';
import Cache from 'node-cache';
import coreapi from 'coreapi';
import hash from 'object-hash';
import schema from 'schema';

/**
 * Hypnos is a light-weight ORM and API Client for Javascript Web Clients.
 *
 * It uses a CoreAPI client and a given API schema to allow clients easy access
 * to both raw response data and mapped custom Model objects.
 *
 * Hypnos returns all normal responses in the form of a APIResponse
 * which allows for easy navigation through paginated responses as well as automatic
 * mapping to custom Models (see `Model` and `APIResponse` for more information).
 *
 * Once a Model is mapped from a response, it is also registered with
 * Hypnos and has access to shortcut methods via it's `ps` property.
 *
 * Example
 * -------
 *
 *     Hypnos.client.retrieve(Book, { id: '1234' }).then(response => {
 *         const book = response.object;
 *         // Update the local properties of the book object.
 *         book.title('My new favorite book');
 *
 *         // Persist your changes back to the API.
 *         book.ps.save();
 *
 *         // ...You can even refresh your local object from the API.
 *         book.ps.refresh();
 *
 *         // ...Or delete it easily.
 *         book.ps.delete();
 *     });
 */
export class Hypnos {
    static configuration = {};

    static _client = null;

    static get client() {
        if (!Hypnos._client) {
            Hypnos._client = new _Hypnos(
                Hypnos.configuration.credentials,
                Hypnos.configuration.schema,
                Hypnos.configuration.cacheConfig
            );
        }
        return Hypnos._client;
    }

    /**
     * Flush the cache and destroy the current Hypnos client.
     */
    static flush() {
        if (this.client.cache) {
            this.client.cache.flushAll();
        }
        this._client = null;
    }
}

class _Hypnos {

    constructor(credentials, schema, cacheConfig) {
        this.schema = schema;

        if (cacheConfig) {
            this.cache = new Cache(cacheConfig);
        }

        // Initialize the CoreAPI Client
        const auth = new coreapi.auth.TokenAuthentication(credentials);
        this.client = new coreapi.Client({ auth: auth });
    }

    /**
     * TODO: Document
     */
    action = async ({ keys, params, raw, useCache=false, flushDepsCache=true, model=null, many=false, ttl=null }) => {
        // If we can and should, prefer the cache.
        if (this.cache && useCache) {
            const key = this.cacheKey(model, keys, params, raw);
            const cachedValue = this.cache.get(key);

            if (cachedValue !== undefined) {
                return raw ? cachedValue : new APIResponse({
                    data: cachedValue,
                    keys,
                    params,
                    model,
                    fromCache: true,
                    many,
                });
            }
        }

        const data = await this.client.action(this.schema, keys, params);

        // If we should, store the new value in the cache.
        if (this.cache && useCache) {
            const key = this.cacheKey(model, keys, params, raw);
            this.cache.set(key, data, ttl);
        }

        // If this is a model-based request and we should clear the dep cache, do so.
        if (this.cache && model && flushDepsCache) {
            const dependents = model.getDependents();
            const dependentKeys = this.cache.keys().filter(key => (
                dependents.some(dependent => {
                    if (typeof dependent === 'string') {
                        // The dependent was specified as a string.
                        return key.indexOf(dependent) == 0;
                    } else {
                        // The dependent was specified as a model.
                        return key.indexOf(dependent.name) == 0;
                    }
                })
            ));
            this.cache.del(dependentKeys);
        }

        return raw ? data : new APIResponse({ data, keys, params, model, many });
    };

    cacheKey = (model, ...keys) => {
        let key = (model && model.name) ? `${model.name}__` : '';
        key += hash(keys);
        return key;
    };

    /**
     * API Operations Methods
     * ======================
     * The following methods allow for easy interaction with the backing API
     * using the provided API Schema.
     * If you need functionality beyond the scope of these methods, refer to
     * the lower-level `action` API which simply wraps the coreapi.Client and
     * returns a APIResponse.
     *
     * Unmapped Responses
     * ------------------
     * To perform the query without mapping the results to a APIResponse set
     * `raw` to true. This will return the JSON results of the query directly.
     *
     * Using Custom Models
     * -------------------
     * Most times it is easiest to use subclasses of the base `Model` type
     * (see Model for more information), and if you need to provide a custom
     * object, you can refer to the `Model` documentation to see what fields
     * are required in order to conform with the Hypnos API.
     */

    /**
     * Given a model type and an optional set of parameters, perform a list query
     * against the backing API and return a promise of results in the form of a
     * APIResponse (see APIResponse for more information).
     *
     * Example
     * -------
     *
     *     Hypnos.list(Book).then(response => {
     *         const books = response.objects;
     *         // Do stuff with books...
     *     });
     */
    list = async (model, params={}, raw=false, useCache=true, flushDepsCache=false, ttl=null) => {
        const keys = [...model.__skeys__, 'list'];
        return await this.action({ keys, params, raw, model, many: true, useCache, flushDepsCache, ttl });
    };

    /**
     * Given a model type and an optional set of parameters, perform a retrieve
     * query against the backing API and return a promise of results in the
     * form of a APIResponse (see APIResponse for more information).
     *
     * Example
     * -------
     *
     *     Hypnos.client.read(Book, { id: '1234' }).then(response => {
     *         const book = response.object;
     *         // Do stuff with your book...
     *     });
     */
    read = async (model, params={}, raw=false, useCache=true, flushDepsCache=false, ttl=null) => {
        const keys = [...model.__skeys__, 'read'];
        return await this.action({ keys, params, raw, model, many: false, useCache, flushDepsCache, ttl });
    };

    /**
     * Given a model type and an optional set of parameters, perform a create
     * against the backing API and return a promise of results in the
     * form of a APIResponse (see APIResponse for more information).
     *
     * Example
     * -------
     *
     *     const data = { title: 'An Adventure', author: 'John Smith' };
     *     Hypnos.client.create(Book, data).then(response => {
     *         const book = response.object;
     *         // Do stuff with your new book...
     *     });
     */
    create = async (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'create'];
        return await this.action({ keys, params, raw, model, many: false });
    };

    /**
     * Given a model type and an optional set of parameters, perform an update
     * against the backing API and return a promise of results in the
     * form of a APIResponse (see APIResponse for more information).
     *
     * Example
     * -------
     *
     *     const data = { id: '1234', title: 'An Adventure II', author: 'John Smith' };
     *     Hypnos.client.update(Book, data).then(response => {
     *         const book = response.object;
     *         // Do stuff with your updated book...
     *     });
     */
    update = async (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'update'];
        return await this.action({ keys, params, raw, model, many: false });
    };

    /**
     * Given a model type and an optional set of parameters, perform a destroy
     * against the backing API and return a promise of results in the
     * form of a APIResponse (see APIResponse for more information).
     *
     * Example
     * -------
     *
     *     Hypnos.delete(Book, { id: '1234' });
     */
    delete = async (model, params={}, raw=false) => {
        const keys = [...model.__skeys__, 'delete'];
        return await this.action({ keys, params, raw, model, many: false });
    };
}
