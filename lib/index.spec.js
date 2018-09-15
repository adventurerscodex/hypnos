'use strict';

var _index = require('./index');

var _coreapi = require('coreapi');

var _coreapi2 = _interopRequireDefault(_coreapi);

var _schema = require('./__mocks__/schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Main Index', function () {
    it('should import things', function () {
        expect(_index.KOModel).toBeDefined();
    });
});