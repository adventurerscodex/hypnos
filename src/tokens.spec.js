import { Author, Book } from './__mocks__/models';
import { Hypnos } from './index';
import coreapi from 'coreapi';
import { mockedFetch } from './__helpers__/utils';
import schema from './__mocks__/schema';

const defaultConfiguration = {
    schema,
    credentials: {},
    cacheConfig: {},
};

describe('Tokens', () => {
    beforeEach(() => {
        Hypnos.flush();

        Hypnos.configuration = { ...defaultConfiguration };
    });

    describe('Model Tokens', () => {
        it('should attempt to create a book model', async () => {
            const bookFixture = {
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });

            const response = await Book.ps.create({ ...bookFixture });

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual(bookFixture);
            expect(response.many).toEqual(false);

            const book = response.object;

            expect(book.title).toEqual(bookFixture.title);
            expect(book.author).toEqual(bookFixture.author);
            expect(book.isBestseller).toEqual(bookFixture.isBestseller);
        });

        it('should attempt to list all book models -- uncached', async () => {
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

            const response = await Book.ps.list();

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual({});
            expect(response.many).toEqual(true);

            const books = response.objects;

            expect(books[0].title).toEqual(bookFixtures[0].title);
            expect(books[0].author).toEqual(bookFixtures[0].author);
            expect(books[0].isBestseller).toEqual(bookFixtures[0].isBestseller);
        });

        it('should attempt to retrieve a book model -- uncached', async () => {
            const bookFixture = {
                uuid: '12345-123-4352-1234',
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });

            const response = await Book.ps.read({ uuid: bookFixture.uuid });

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual({ uuid: bookFixture.uuid });
            expect(response.many).toEqual(false);

            const book = response.object;

            expect(book.title).toEqual(bookFixture.title);
            expect(book.author).toEqual(bookFixture.author);
            expect(book.isBestseller).toEqual(bookFixture.isBestseller);
        });

        it('should attempt to update a book model', async () => {
            const bookFixture = {
                uuid: '12345-123-4352-1234',
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });

            const response = await Book.ps.update(bookFixture);

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual(bookFixture);
            expect(response.many).toEqual(false);

            const book = response.object;

            expect(book.title).toEqual(bookFixture.title);
            expect(book.author).toEqual(bookFixture.author);
            expect(book.isBestseller).toEqual(bookFixture.isBestseller);
        });
    });

    describe('Instance Tokens', () => {
        it('should attempt to create a book instance', async () => {
            const bookFixture = {
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });

            const book = new Book(
                bookFixture.title,
                bookFixture.author,
                bookFixture.isBestseller
            );
            const response = await book.ps.create();

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual(bookFixture);
            expect(response.many).toEqual(false);

            expect(book.title).toEqual(bookFixture.title);
            expect(book.author).toEqual(bookFixture.author);
            expect(book.isBestseller).toEqual(bookFixture.isBestseller);
        });

        it('should attempt to refresh a book instance that changed remotely', async () => {
            const bookFixture = {
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });

            const book = new Book(
                'Some first draft title',
                'N/A',
                false
            );
            book.uuid = '09876543';
            const response = await book.ps.refresh();

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams.uuid).toEqual(book.uuid);
            expect(response.many).toEqual(false);

            expect(response.object.title).toEqual(bookFixture.title);
            expect(response.object.author).toEqual(bookFixture.author);
            expect(response.object.isBestseller).toEqual(bookFixture.isBestseller);
        });

        it('should attempt to save a book instance', async () => {
            const bookFixture = {
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });

            const book = new Book(
                bookFixture.title,
                bookFixture.author,
                bookFixture.isBestseller
            );
            const response = await book.ps.create();

            expect(response.fromCache).toBe(false);
            expect(response.fetchParams).toEqual(bookFixture);
            expect(response.many).toEqual(false);

            expect(book.title).toEqual(bookFixture.title);
            expect(book.author).toEqual(bookFixture.author);
            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

            // Alter and save
            book.title = 'This new value';
            const saveResponse = await book.ps.save();

            expect(saveResponse.fromCache).toBe(false);
            expect(saveResponse.fetchParams.uuid).toEqual(book.uuid);
            expect(saveResponse.fetchParams.title).toEqual('This new value');
            expect(saveResponse.many).toEqual(false);
        });

        it('should attempt to partially update a book instance', async () => {
            const bookFixture = {
                uuid: '12345-123-4352-1234',
                title: 'A Title',
                author: 'Me',
                isBestseller: false,
            };

            const transport = new coreapi.transports.HTTPTransport({
                fetch: mockedFetch(JSON.stringify({ ...bookFixture }), 'application/json')
            });
            Hypnos.client.client = new coreapi.Client({ transports: [transport] });

            const book = new Book(
                bookFixture.title,
                bookFixture.author,
                bookFixture.isBestseller
            );
            book.uuid = bookFixture.uuid;
            const response = await book.ps.create();

            expect(book.title).toEqual(bookFixture.title);

            // Alter and save
            book.title = 'This new value';
            const saveResponse = await book.ps.save(['title', 'uuid']);

            expect(saveResponse.fromCache).toBe(false);
            expect(saveResponse.fetchParams.uuid).toEqual(book.uuid);
            expect(saveResponse.fetchParams.title).toEqual('This new value');
            expect(saveResponse.fetchKeys[1]).toEqual('partialUpdate');
            expect(saveResponse.many).toEqual(false);
        });

        describe('Cache Dependencies', () => {
            it('should attempt to create an author instance and flush the cached books', async () => {
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
                    fetch: mockedFetch(JSON.stringify({ ...bookFixtures }), 'application/json')
                });
                Hypnos.client.client = new coreapi.Client({ transports: [transport] });

                // Fetch all books.
                const response1 = await Book.ps.list();
                expect(response1.fromCache).toBe(false);

                // Fetch again, this time from the cache.
                const response2 = await Book.ps.list();
                expect(response2.fromCache).toBe(true);

                // List the authors, which SHOULD NOT clear the book cache.
                const response3 = await Author.ps.list();

                const response4 = await Book.ps.list();
                expect(response4.fromCache).toBe(true);

                // Update an author, which SHOULD clear the book cache.
                const response5 = await Author.ps.create({
                    firstName: 'test',
                    lastName: 'testersson'
                });

                const response6 = await Book.ps.list();
                expect(response6.fromCache).toBe(false);

                // And if we were to request the book list agin, it SHOULD be cached.
                const response7 = await Book.ps.list();
                expect(response7.fromCache).toBe(true);
            });
        });
    });
});
