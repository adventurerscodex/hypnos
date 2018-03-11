'use strict';

var _index = require('./index');

describe('Main Index', function () {
    it('should import things', function () {
        expect(_index.KOModel).toBeDefined();
    });
});