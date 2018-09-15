import { KOModel } from './index';
import coreapi from 'coreapi';
import schema from './__mocks__/schema';

describe('Main Index', () => {
    it('should import things', () => {
        expect(KOModel).toBeDefined();
    });
});
