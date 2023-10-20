import { Author, Book } from './__mocks__/models';
import { Hypnos, KOModel } from './index';
import coreapi from 'coreapi';
import hash from 'object-hash';
import { mockedFetch } from './__helpers__/utils';
import schema from './__mocks__/schema';

const defaultConfiguration = {
    schema,
    credentials: {},
    cacheConfig: {},
};

describe('Hypnos', () => {
    beforeEach(() => {
        Hypnos.flush();
    });

    it('should attempt an uncached API request', async () => {
        const time = (new Date()).getTime();

        const transport = new coreapi.transports.HTTPTransport({
            fetch: mockedFetch(JSON.stringify({
                time,
            }), 'application/json')
        });

        Hypnos.configuration = { ...defaultConfiguration };
        Hypnos.client.client = new coreapi.Client({ transports: [transport] });

        const response = await Hypnos.client.action({
            keys: ['books', 'list'],
            params: {},
        });

        expect(response.fromCache).toBe(false);
        expect(response.data.time).toEqual(time);
    });

    it('should attempt a cached API request after an uncached one', async () => {
        const time = (new Date()).getTime();

        const transport = new coreapi.transports.HTTPTransport({
            fetch: mockedFetch(JSON.stringify({
                time,
            }), 'application/json')
        });

        Hypnos.configuration = {
            ...defaultConfiguration,
            cacheConfig: {
                ttl: 0,
            }
        };
        Hypnos.client.client = new coreapi.Client({ transports: [transport] });

        const response1 = await Hypnos.client.action({
            keys: ['books', 'list'],
            params: {},
            useCache: true,
        });

        expect(response1.fromCache).toBe(false);
        expect(response1.data.time).toEqual(time);

        // Do the same request again.
        const response2 = await Hypnos.client.action({
            keys: ['books', 'list'],
            params: {},
            useCache: true,
        });

        expect(response2.fromCache).toBe(true);
        expect(response2.data.time).toEqual(time);
    });

    it('should attempt a cached API request after an uncached one with a custom ttl', async () => {
        const time = (new Date()).getTime();

        const transport = new coreapi.transports.HTTPTransport({
            fetch: mockedFetch(JSON.stringify({
                time,
            }), 'application/json')
        });

        Hypnos.configuration = {
            ...defaultConfiguration,
            cacheConfig: {
                ttl: 0,
            }
        };
        Hypnos.client.client = new coreapi.Client({ transports: [transport] });

        const ttl = parseInt(Math.random() * 1000);
        const response1 = await Hypnos.client.action({
            keys: ['books', 'list'],
            params: {},
            useCache: true,
            ttl: ttl,
        });

        expect(response1.fromCache).toBe(false);
        expect(response1.data.time).toEqual(time);

        // Do the same request again.
        const response2 = await Hypnos.client.action({
            keys: ['books', 'list'],
            params: {},
            useCache: true,
        });

        expect(response2.fromCache).toBe(true);
        expect(response2.data.time).toEqual(time);

        const cacheKey = Hypnos.client.cacheKey(['books', 'list']);
        expect(Hypnos.client.cache.getTtl(cacheKey), ttl);
    });

    describe('Shortcut Actions', () => {
        it('should attempt to list objects and cache the results', async () => {
            const bookFixtures = [
                {
                    title: 'A Title',
                    author: 'Me',
                    isBestseller: false,
                },
                {
                    title: 'Another Title',
                    author: 'You',
                    isBestseller: true,
                },
            ];

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ results: [...bookFixtures] }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });
            Hypnos.configuration = { ...defaultConfiguration };

            const response = await Hypnos.client.list(Book);

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual({});
            expect(response.many).toEqual(true);

            const book = response.objects[0];

            expect(book.title).toEqual(bookFixtures[0].title);
            expect(book.author).toEqual(bookFixtures[0].author);
            expect(book.isBestseller).toEqual(bookFixtures[0].isBestseller);

            // Check that the result was cached
            const cachedValue = Hypnos.client.cache.get(Hypnos.client.cacheKey(
                Book,
                [...Book.__skeys__, 'list'],
                {},
                false,
            ));

            expect(cachedValue).toEqual({ results: [...bookFixtures] });
        });

        it('should attempt to retrieve an object and cache the result', async () => {
            const bookFixture = {
                uuid: '2345-676543-23456-6543',
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });
            Hypnos.configuration = { ...defaultConfiguration };

            const response = await Hypnos.client.read(Book, { uuid: bookFixture.uuid });

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual({ uuid: bookFixture.uuid });
            expect(response.many).toEqual(false);

            const book = response.object;

            expect(book.title).toEqual(bookFixture.title);
            expect(book.author).toEqual(bookFixture.author);
            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

            // Check that the result was cached
            const cachedValue = Hypnos.client.cache.get(Hypnos.client.cacheKey(
                Book,
                [...Book.__skeys__, 'read'],
                { uuid: bookFixture.uuid },
                false
            ));

            expect(cachedValue).toEqual(bookFixture);
        });

        it('should attempt to create an object and not cache the result', async () => {
            const bookFixture = {
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });
            Hypnos.configuration = { ...defaultConfiguration };

            const response = await Hypnos.client.create(Book, { ...bookFixture });

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual(bookFixture);
            expect(response.many).toEqual(false);

            const book = response.object;

            expect(book.title).toEqual(bookFixture.title);
            expect(book.author).toEqual(bookFixture.author);
            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

            // Check that the result was cached
            const cachedValue = Hypnos.client.cache.get(Hypnos.client.cacheKey(
                Book,
                [...Book.__skeys__, 'create'],
                { uuid: bookFixture.uuid },
                false
            ));

            expect(cachedValue).toEqual(undefined);
        });

        it('should attempt to update an object and not cache the result', async () => {
            const bookFixture = {
                uuid: '2345-676543-23456-6543',
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });
            Hypnos.configuration = { ...defaultConfiguration };

            const response = await Hypnos.client.update(Book, { ...bookFixture });

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual(bookFixture);
            expect(response.many).toEqual(false);

            const book = response.object;

            expect(book.title).toEqual(bookFixture.title);
            expect(book.author).toEqual(bookFixture.author);
            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

            // Check that the result was cached
            const cachedValue = Hypnos.client.cache.get(Hypnos.client.cacheKey(
                Book,
                [...Book.__skeys__, 'update'],
                { uuid: bookFixture.uuid },
                false
            ));

            expect(cachedValue).toEqual(undefined);
        });

        it('should attempt to delete an object and not cache the result', async () => {
            const bookFixture = {
                uuid: '2345-676543-23456-6543',
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });
            Hypnos.configuration = { ...defaultConfiguration };

            const response = await Hypnos.client.delete(Book, { ...bookFixture });

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual(bookFixture);
            expect(response.many).toEqual(false);

            const book = response.object;

            expect(book.uuid).toEqual(bookFixture.uuid);

            // Check that the result was cached
            const cachedValue = Hypnos.client.cache.get(Hypnos.client.cacheKey(
                Book,
                [...Book.__skeys__, 'delete'],
                { uuid: bookFixture.uuid },
                false
            ));

            expect(cachedValue).toEqual(undefined);
        });
    });

    describe('Raw Results', () => {
        it('should attempt to retrieve a raw response and cache the result', async () => {
            const bookFixture = {
                uuid: '2345-676543-23456-6543',
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });
            Hypnos.configuration = { ...defaultConfiguration };

            const data = await Hypnos.client.read(Book, { uuid: bookFixture.uuid }, true);

            expect(data.title).toEqual(bookFixture.title);
            expect(data.author).toEqual(bookFixture.author);
            expect(data.isBestseller).toEqual(bookFixture.isBestseller);

            // Check that the result was cached
            const cachedValue = Hypnos.client.cache.get(Hypnos.client.cacheKey(
                Book,
                [...Book.__skeys__, 'read'],
                { uuid: bookFixture.uuid },
                true
            ));

            expect(cachedValue).toEqual(bookFixture);
        });

        it('should attempt to retrieve a raw response using the cached result', async () => {
            const bookFixture = {
                uuid: '2345-676543-23456-6543',
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });
            Hypnos.configuration = { ...defaultConfiguration };

            const data1 = await Hypnos.client.read(Book, { uuid: bookFixture.uuid }, true);

            expect(data1.title).toEqual(bookFixture.title);
            expect(data1.author).toEqual(bookFixture.author);
            expect(data1.isBestseller).toEqual(bookFixture.isBestseller);

            // Make a second request and ensure that the network was never used.
            Hypnos.client.client.action = jest.fn();
            const data2 = await Hypnos.client.read(Book, { uuid: bookFixture.uuid }, true);
            expect(data2.title).toEqual(bookFixture.title);
            expect(Hypnos.client.client.action).toHaveBeenCalledTimes(0);
        });
    });

    describe('Cache Configurations', () => {
        it('should validate that the cache config is being used', async () => {
            Hypnos.configuration = {
                ...defaultConfiguration,
                cacheConfig: {
                    stdTTL: 10,
                    checkperiod: 10,
                    errorOnMissing: true,
                    useClones: false,
                },
            };

            const client = Hypnos.client;

            expect(client.cache.options.stdTTL).toEqual(10);
            expect(client.cache.options.checkperiod).toEqual(10);
            expect(client.cache.options.errorOnMissing).toEqual(true);
            expect(client.cache.options.useClones).toEqual(false);
        });
    });

    describe('Cache Key Generation', () => {
        it('should validate that the cache key generation algorithm is correct', async () => {
            const key1 = Hypnos.client.cacheKey(
                Book,
                ['an entry'],
            );
            expect(key1).toContain('Book__');
        });
        it('should validate that the cache key generation algorithm is correct when no model is used', async () => {
            const key = Hypnos.client.cacheKey(
                null,
                ['an entry'],
            );
            expect(key).not.toContain('__');
        });
    });
});
