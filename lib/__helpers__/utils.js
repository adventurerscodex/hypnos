'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mockedFetch = exports.mockedFetch = function mockedFetch(responseBody, contentType) {
    var statusCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

    return function (url) {
        return new Promise(function (resolve, reject) {
            var textPromise = function textPromise() {
                return new Promise(function (resolve, reject) {
                    process.nextTick(resolve(responseBody));
                });
            };

            process.nextTick(resolve({
                url: url,
                status: statusCode,
                statusText: statusCode === 200 ? 'OK' : 'BAD REQUEST',
                ok: statusCode === 200,
                headers: {
                    get: function get(header) {
                        return contentType;
                    }
                },
                text: textPromise
            }));
        });
    };
};