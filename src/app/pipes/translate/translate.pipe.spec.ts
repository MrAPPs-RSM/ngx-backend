import {TranslatePipe} from './translate.pipe';

describe('TranslatePipe', () => {
    it('create an instance', () => {
        const pipe = new TranslatePipe({ translate: (value: any) => value } as any);
        expect(pipe).toBeTruthy();
    });
});
