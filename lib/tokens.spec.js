'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _models = require('./__mocks__/models');

var _index = require('./index');

var _coreapi = require('coreapi');

var _coreapi2 = _interopRequireDefault(_coreapi);

var _utils = require('./__helpers__/utils');

var _schema = require('./__mocks__/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var defaultConfiguration = {
    schema: _schema2.default,
    credentials: {},
    cacheConfig: {}
};

describe('Tokens', function () {
    beforeEach(function () {
        _index.Hypnos.flush();

        _index.Hypnos.configuration = _extends({}, defaultConfiguration);
    });

    describe('Model Tokens', function () {
        it('should attempt to create a book model', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var bookFixture, transport, response, book;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            bookFixture = {
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                            _context.next = 5;
                            return _models.Book.ps.create(_extends({}, bookFixture));

                        case 5:
                            response = _context.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual(bookFixture);
                            expect(response.many).toEqual(false);

                            book = response.object;


                            expect(book.title).toEqual(bookFixture.title);
                            expect(book.author).toEqual(bookFixture.author);
                            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

                        case 13:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        })));

        it('should attempt to list all book models -- uncached', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var bookFixtures, transport, response, books;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            bookFixtures = [{
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            }, {
                                title: 'Another Title',
                                author: 'You',
                                isBestseller: true
                            }];
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify({ results: [].concat(bookFixtures) }), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                            _context2.next = 5;
                            return _models.Book.ps.list();

                        case 5:
                            response = _context2.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual({});
                            expect(response.many).toEqual(true);

                            books = response.objects;


                            expect(books[0].title).toEqual(bookFixtures[0].title);
                            expect(books[0].author).toEqual(bookFixtures[0].author);
                            expect(books[0].isBestseller).toEqual(bookFixtures[0].isBestseller);

                        case 13:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined);
        })));

        it('should attempt to retrieve a book model -- uncached', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var bookFixture, transport, response, book;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            bookFixture = {
                                uuid: '12345-123-4352-1234',
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                            _context3.next = 5;
                            return _models.Book.ps.read({ uuid: bookFixture.uuid });

                        case 5:
                            response = _context3.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual({ uuid: bookFixture.uuid });
                            expect(response.many).toEqual(false);

                            book = response.object;


                            expect(book.title).toEqual(bookFixture.title);
                            expect(book.author).toEqual(bookFixture.author);
                            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

                        case 13:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined);
        })));

        it('should attempt to update a book model', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var bookFixture, transport, response, book;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            bookFixture = {
                                uuid: '12345-123-4352-1234',
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                            _context4.next = 5;
                            return _models.Book.ps.update(bookFixture);

                        case 5:
                            response = _context4.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual(bookFixture);
                            expect(response.many).toEqual(false);

                            book = response.object;


                            expect(book.title).toEqual(bookFixture.title);
                            expect(book.author).toEqual(bookFixture.author);
                            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

                        case 13:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        })));
    });

    describe('Instance Tokens', function () {
        it('should attempt to create a book instance', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var bookFixture, transport, book, response;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            bookFixture = {
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                            book = new _models.Book(bookFixture.title, bookFixture.author, bookFixture.isBestseller);
                            _context5.next = 6;
                            return book.ps.create();

                        case 6:
                            response = _context5.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual(bookFixture);
                            expect(response.many).toEqual(false);

                            expect(book.title).toEqual(bookFixture.title);
                            expect(book.author).toEqual(bookFixture.author);
                            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

                        case 13:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined);
        })));

        it('should attempt to refresh a book instance that changed remotely', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var bookFixture, transport, book, response;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            bookFixture = {
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                            book = new _models.Book('Some first draft title', 'N/A', false);

                            book.uuid = '09876543';
                            _context6.next = 7;
                            return book.ps.refresh();

                        case 7:
                            response = _context6.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams.uuid).toEqual(book.uuid);
                            expect(response.many).toEqual(false);

                            expect(response.object.title).toEqual(bookFixture.title);
                            expect(response.object.author).toEqual(bookFixture.author);
                            expect(response.object.isBestseller).toEqual(bookFixture.isBestseller);

                        case 14:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined);
        })));

        it('should attempt to save a book instance', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var bookFixture, transport, book, response, saveResponse;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            bookFixture = {
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                            book = new _models.Book(bookFixture.title, bookFixture.author, bookFixture.isBestseller);
                            _context7.next = 6;
                            return book.ps.create();

                        case 6:
                            response = _context7.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual(bookFixture);
                            expect(response.many).toEqual(false);

                            expect(book.title).toEqual(bookFixture.title);
                            expect(book.author).toEqual(bookFixture.author);
                            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

                            // Alter and save
                            book.title = 'This new value';
                            _context7.next = 16;
                            return book.ps.save();

                        case 16:
                            saveResponse = _context7.sent;


                            expect(saveResponse.fromCache).toBe(false);
                            expect(saveResponse.fetchParams.uuid).toEqual(book.uuid);
                            expect(saveResponse.fetchParams.title).toEqual('This new value');
                            expect(saveResponse.many).toEqual(false);

                        case 21:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, undefined);
        })));

        it('should attempt to partially update a book instance', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var bookFixture, transport, book, response, saveResponse;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            bookFixture = {
                                uuid: '12345-123-4352-1234',
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                            book = new _models.Book(bookFixture.title, bookFixture.author, bookFixture.isBestseller);

                            book.uuid = bookFixture.uuid;
                            _context8.next = 7;
                            return book.ps.create();

                        case 7:
                            response = _context8.sent;


                            expect(book.title).toEqual(bookFixture.title);

                            // Alter and save
                            book.title = 'This new value';
                            _context8.next = 12;
                            return book.ps.save(['title', 'uuid']);

                        case 12:
                            saveResponse = _context8.sent;


                            expect(saveResponse.fromCache).toBe(false);
                            expect(saveResponse.fetchParams.uuid).toEqual(book.uuid);
                            expect(saveResponse.fetchParams.title).toEqual('This new value');
                            expect(saveResponse.fetchKeys[1]).toEqual('partialUpdate');
                            expect(saveResponse.many).toEqual(false);

                        case 18:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, undefined);
        })));

        describe('Cache Dependencies', function () {
            it('should attempt to create an author instance and flush the cached books', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var bookFixtures, transport, response1, response2, response3, response4, response5, response6, response7, response8;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                bookFixtures = [{
                                    title: 'A Title',
                                    author: 'Me',
                                    isBestseller: false
                                }, {
                                    title: 'Another Title',
                                    author: 'You',
                                    isBestseller: true
                                }];
                                transport = new _coreapi2.default.transports.HTTPTransport({
                                    fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixtures)), 'application/json')
                                });

                                _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                                // Fetch all books.
                                _context9.next = 5;
                                return _models.Book.ps.list();

                            case 5:
                                response1 = _context9.sent;

                                expect(response1.fromCache).toBe(false);

                                // Fetch again, this time from the cache.
                                _context9.next = 9;
                                return _models.Book.ps.list();

                            case 9:
                                response2 = _context9.sent;

                                expect(response2.fromCache).toBe(true);

                                // List the authors, which SHOULD NOT clear the book cache.
                                _context9.next = 13;
                                return _models.Author.ps.list();

                            case 13:
                                response3 = _context9.sent;
                                _context9.next = 16;
                                return _models.Book.ps.list();

                            case 16:
                                response4 = _context9.sent;

                                expect(response4.fromCache).toBe(true);

                                // Update an author, which SHOULD clear the book and the author cache.
                                _context9.next = 20;
                                return _models.Author.ps.create({
                                    firstName: 'test',
                                    lastName: 'testersson'
                                });

                            case 20:
                                response5 = _context9.sent;
                                _context9.next = 23;
                                return _models.Book.ps.list();

                            case 23:
                                response6 = _context9.sent;

                                expect(response6.fromCache).toBe(false);

                                _context9.next = 27;
                                return _models.Author.ps.list();

                            case 27:
                                response7 = _context9.sent;

                                expect(response7.fromCache).toBe(false);

                                // And if we were to request the book list agin, it SHOULD be cached.
                                _context9.next = 31;
                                return _models.Book.ps.list();

                            case 31:
                                response8 = _context9.sent;

                                expect(response8.fromCache).toBe(true);

                            case 33:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, undefined);
            })));
        });
    });
});