'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _models = require('./__mocks__/models');

var _index = require('./index');

var _coreapi = require('coreapi');

var _coreapi2 = _interopRequireDefault(_coreapi);

var _objectHash = require('object-hash');

var _objectHash2 = _interopRequireDefault(_objectHash);

var _utils = require('./__helpers__/utils');

var _schema = require('./__mocks__/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var defaultConfiguration = {
    schema: _schema2.default,
    credentials: {},
    cacheConfig: {}
};

describe('Hypnos', function () {
    beforeEach(function () {
        _index.Hypnos.flush();
    });

    it('should attempt an uncached API request', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var time, transport, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        time = new Date().getTime();
                        transport = new _coreapi2.default.transports.HTTPTransport({
                            fetch: (0, _utils.mockedFetch)(JSON.stringify({
                                time: time
                            }), 'application/json')
                        });


                        _index.Hypnos.configuration = _extends({}, defaultConfiguration);
                        _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                        _context.next = 6;
                        return _index.Hypnos.client.action({
                            keys: ['books', 'list'],
                            params: {}
                        });

                    case 6:
                        response = _context.sent;


                        expect(response.fromCache).toBe(false);
                        expect(response.data.time).toEqual(time);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    })));

    it('should attempt a cached API request after an uncached one', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var time, transport, response1, response2;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        time = new Date().getTime();
                        transport = new _coreapi2.default.transports.HTTPTransport({
                            fetch: (0, _utils.mockedFetch)(JSON.stringify({
                                time: time
                            }), 'application/json')
                        });


                        _index.Hypnos.configuration = _extends({}, defaultConfiguration, {
                            cacheConfig: {
                                ttl: 0
                            }
                        });
                        _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                        _context2.next = 6;
                        return _index.Hypnos.client.action({
                            keys: ['books', 'list'],
                            params: {},
                            useCache: true
                        });

                    case 6:
                        response1 = _context2.sent;


                        expect(response1.fromCache).toBe(false);
                        expect(response1.data.time).toEqual(time);

                        // Do the same request again.
                        _context2.next = 11;
                        return _index.Hypnos.client.action({
                            keys: ['books', 'list'],
                            params: {},
                            useCache: true
                        });

                    case 11:
                        response2 = _context2.sent;


                        expect(response2.fromCache).toBe(true);
                        expect(response2.data.time).toEqual(time);

                    case 14:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    })));

    it('should attempt a cached API request after an uncached one with a custom ttl', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var time, transport, ttl, response1, response2, cacheKey;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        time = new Date().getTime();
                        transport = new _coreapi2.default.transports.HTTPTransport({
                            fetch: (0, _utils.mockedFetch)(JSON.stringify({
                                time: time
                            }), 'application/json')
                        });


                        _index.Hypnos.configuration = _extends({}, defaultConfiguration, {
                            cacheConfig: {
                                ttl: 0
                            }
                        });
                        _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });

                        ttl = parseInt(Math.random() * 1000);
                        _context3.next = 7;
                        return _index.Hypnos.client.action({
                            keys: ['books', 'list'],
                            params: {},
                            useCache: true,
                            ttl: ttl
                        });

                    case 7:
                        response1 = _context3.sent;


                        expect(response1.fromCache).toBe(false);
                        expect(response1.data.time).toEqual(time);

                        // Do the same request again.
                        _context3.next = 12;
                        return _index.Hypnos.client.action({
                            keys: ['books', 'list'],
                            params: {},
                            useCache: true
                        });

                    case 12:
                        response2 = _context3.sent;


                        expect(response2.fromCache).toBe(true);
                        expect(response2.data.time).toEqual(time);

                        cacheKey = _index.Hypnos.client.cacheKey(['books', 'list']);

                        expect(_index.Hypnos.client.cache.getTtl(cacheKey), ttl);

                    case 17:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    })));

    describe('Shortcut Actions', function () {
        it('should attempt to list objects and cache the results', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var bookFixtures, transport, response, book, cachedValue;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
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
                            _index.Hypnos.configuration = _extends({}, defaultConfiguration);

                            _context4.next = 6;
                            return _index.Hypnos.client.list(_models.Book);

                        case 6:
                            response = _context4.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual({});
                            expect(response.many).toEqual(true);

                            book = response.objects[0];


                            expect(book.title).toEqual(bookFixtures[0].title);
                            expect(book.author).toEqual(bookFixtures[0].author);
                            expect(book.isBestseller).toEqual(bookFixtures[0].isBestseller);

                            // Check that the result was cached
                            cachedValue = _index.Hypnos.client.cache.get(_index.Hypnos.client.cacheKey(_models.Book, [].concat(_toConsumableArray(_models.Book.__skeys__), ['list']), {}, false));


                            expect(cachedValue).toEqual({ results: [].concat(bookFixtures) });

                        case 16:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        })));

        it('should attempt to retrieve an object and cache the result', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var bookFixture, transport, response, book, cachedValue;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            bookFixture = {
                                uuid: '2345-676543-23456-6543',
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });
                            _index.Hypnos.configuration = _extends({}, defaultConfiguration);

                            _context5.next = 6;
                            return _index.Hypnos.client.read(_models.Book, { uuid: bookFixture.uuid });

                        case 6:
                            response = _context5.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual({ uuid: bookFixture.uuid });
                            expect(response.many).toEqual(false);

                            book = response.object;


                            expect(book.title).toEqual(bookFixture.title);
                            expect(book.author).toEqual(bookFixture.author);
                            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

                            // Check that the result was cached
                            cachedValue = _index.Hypnos.client.cache.get(_index.Hypnos.client.cacheKey(_models.Book, [].concat(_toConsumableArray(_models.Book.__skeys__), ['read']), { uuid: bookFixture.uuid }, false));


                            expect(cachedValue).toEqual(bookFixture);

                        case 16:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined);
        })));

        it('should attempt to create an object and not cache the result', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var bookFixture, transport, response, book, cachedValue;
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
                            _index.Hypnos.configuration = _extends({}, defaultConfiguration);

                            _context6.next = 6;
                            return _index.Hypnos.client.create(_models.Book, _extends({}, bookFixture));

                        case 6:
                            response = _context6.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual(bookFixture);
                            expect(response.many).toEqual(false);

                            book = response.object;


                            expect(book.title).toEqual(bookFixture.title);
                            expect(book.author).toEqual(bookFixture.author);
                            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

                            // Check that the result was cached
                            cachedValue = _index.Hypnos.client.cache.get(_index.Hypnos.client.cacheKey(_models.Book, [].concat(_toConsumableArray(_models.Book.__skeys__), ['create']), { uuid: bookFixture.uuid }, false));


                            expect(cachedValue).toEqual(undefined);

                        case 16:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined);
        })));

        it('should attempt to update an object and not cache the result', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            var bookFixture, transport, response, book, cachedValue;
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            bookFixture = {
                                uuid: '2345-676543-23456-6543',
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });
                            _index.Hypnos.configuration = _extends({}, defaultConfiguration);

                            _context7.next = 6;
                            return _index.Hypnos.client.update(_models.Book, _extends({}, bookFixture));

                        case 6:
                            response = _context7.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual(bookFixture);
                            expect(response.many).toEqual(false);

                            book = response.object;


                            expect(book.title).toEqual(bookFixture.title);
                            expect(book.author).toEqual(bookFixture.author);
                            expect(book.isBestseller).toEqual(bookFixture.isBestseller);

                            // Check that the result was cached
                            cachedValue = _index.Hypnos.client.cache.get(_index.Hypnos.client.cacheKey(_models.Book, [].concat(_toConsumableArray(_models.Book.__skeys__), ['update']), { uuid: bookFixture.uuid }, false));


                            expect(cachedValue).toEqual(undefined);

                        case 16:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, undefined);
        })));

        it('should attempt to delete an object and not cache the result', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var bookFixture, transport, response, book, cachedValue;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            bookFixture = {
                                uuid: '2345-676543-23456-6543'
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });
                            _index.Hypnos.configuration = _extends({}, defaultConfiguration);

                            _context8.next = 6;
                            return _index.Hypnos.client.delete(_models.Book, _extends({}, bookFixture));

                        case 6:
                            response = _context8.sent;


                            expect(response.fromCache).toBe(false);
                            expect(response.fetchParams).toEqual(bookFixture);
                            expect(response.many).toEqual(false);

                            book = response.object;


                            expect(book.uuid).toEqual(bookFixture.uuid);

                            // Check that the result was cached
                            cachedValue = _index.Hypnos.client.cache.get(_index.Hypnos.client.cacheKey(_models.Book, [].concat(_toConsumableArray(_models.Book.__skeys__), ['delete']), { uuid: bookFixture.uuid }, false));


                            expect(cachedValue).toEqual(undefined);

                        case 14:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, undefined);
        })));
    });

    describe('Raw Results', function () {
        it('should attempt to retrieve a raw response and cache the result', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
            var bookFixture, transport, data, cachedValue;
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            bookFixture = {
                                uuid: '2345-676543-23456-6543',
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });
                            _index.Hypnos.configuration = _extends({}, defaultConfiguration);

                            _context9.next = 6;
                            return _index.Hypnos.client.read(_models.Book, { uuid: bookFixture.uuid }, true);

                        case 6:
                            data = _context9.sent;


                            expect(data.title).toEqual(bookFixture.title);
                            expect(data.author).toEqual(bookFixture.author);
                            expect(data.isBestseller).toEqual(bookFixture.isBestseller);

                            // Check that the result was cached
                            cachedValue = _index.Hypnos.client.cache.get(_index.Hypnos.client.cacheKey(_models.Book, [].concat(_toConsumableArray(_models.Book.__skeys__), ['read']), { uuid: bookFixture.uuid }, true));


                            expect(cachedValue).toEqual(bookFixture);

                        case 12:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, undefined);
        })));

        it('should attempt to retrieve a raw response using the cached result', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
            var bookFixture, transport, data1, data2;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            bookFixture = {
                                uuid: '2345-676543-23456-6543',
                                title: 'A Title',
                                author: 'Me',
                                isBestseller: false
                            };
                            transport = new _coreapi2.default.transports.HTTPTransport({
                                fetch: (0, _utils.mockedFetch)(JSON.stringify(_extends({}, bookFixture)), 'application/json')
                            });

                            _index.Hypnos.client.client = new _coreapi2.default.Client({ transports: [transport] });
                            _index.Hypnos.configuration = _extends({}, defaultConfiguration);

                            _context10.next = 6;
                            return _index.Hypnos.client.read(_models.Book, { uuid: bookFixture.uuid }, true);

                        case 6:
                            data1 = _context10.sent;


                            expect(data1.title).toEqual(bookFixture.title);
                            expect(data1.author).toEqual(bookFixture.author);
                            expect(data1.isBestseller).toEqual(bookFixture.isBestseller);

                            // Make a second request and ensure that the network was never used.
                            _index.Hypnos.client.client.action = jest.fn();
                            _context10.next = 13;
                            return _index.Hypnos.client.read(_models.Book, { uuid: bookFixture.uuid }, true);

                        case 13:
                            data2 = _context10.sent;

                            expect(data2.title).toEqual(bookFixture.title);
                            expect(_index.Hypnos.client.client.action).toHaveBeenCalledTimes(0);

                        case 16:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, undefined);
        })));
    });

    describe('Cache Configurations', function () {
        it('should validate that the cache config is being used', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
            var client;
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            _index.Hypnos.configuration = _extends({}, defaultConfiguration, {
                                cacheConfig: {
                                    stdTTL: 10,
                                    checkperiod: 10,
                                    errorOnMissing: true,
                                    useClones: false
                                }
                            });

                            client = _index.Hypnos.client;


                            expect(client.cache.options.stdTTL).toEqual(10);
                            expect(client.cache.options.checkperiod).toEqual(10);
                            expect(client.cache.options.errorOnMissing).toEqual(true);
                            expect(client.cache.options.useClones).toEqual(false);

                        case 6:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, undefined);
        })));
    });

    describe('Cache Key Generation', function () {
        it('should validate that the cache key generation algorithm is correct', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
            var key1;
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            key1 = _index.Hypnos.client.cacheKey(_models.Book, ['an entry']);

                            expect(key1).toContain('Book__');

                        case 2:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, _callee12, undefined);
        })));
        it('should validate that the cache key generation algorithm is correct when no model is used', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
            var key;
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            key = _index.Hypnos.client.cacheKey(null, ['an entry']);

                            expect(key).not.toContain('__');

                        case 2:
                        case 'end':
                            return _context13.stop();
                    }
                }
            }, _callee13, undefined);
        })));
    });
});