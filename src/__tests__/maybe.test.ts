// TODO: we need some tests for Maybe.
import { Maybe, act, on, match } from '../maybe';

describe('act', () => {
    it('should act on maybe that does exist', () => {
        const maybe: Maybe<number> = 1;

        const value = act(maybe, (n) => n * 2);
        expect(value).toBe(2);
    });

    it('should not act on maybe that does not exist', () => {
        const maybe: Maybe<number> = null;

        const fn = jest.fn();

        const value = act(maybe, fn);
        expect(fn).not.toHaveBeenCalled();
        expect(maybe).toBe(null);
        expect(value).toBe(undefined);
    });
});

describe('on', () => {
    it('should chain actions on maybe that does exist', () => {
        const maybe: Maybe<number> = 1;

        const value = on(maybe)
            .act((n) => n + 1)
            .act((n) => n * 2)
            .done();

        expect(value).toBe(4);
    });

    it('should not chain actions on maybe that does not exist', () => {
        const maybe: Maybe<number> = null;

        const fn = jest.fn();

        const value = on(maybe).act(fn).act(fn).act(fn).done();

        expect(fn).not.toHaveBeenCalled();
        expect(maybe).toBe(null);
        expect(value).toBe(undefined);
    });
});

describe('match', () => {
    it('should match cases', () => {
        const value = match(9, [
            // TODO: not sure if I love that you need to
            // return null for the no match case...
            (n) => (n === 2 ? () => 22222 : null),
            (n) => (n === 3 ? () => 33333 : null),
            (n) => (n === 9 ? () => 99999 : null),
        ]);

        expect(value).toBe(99999);
    });
    it('should return nothing if no cases match and no default is provided', () => {
        const value = match(10, [
            (n) => (n === 2 ? () => 22222 : null),
            (n) => (n === 3 ? () => 33333 : null),
            (n) => (n === 9 ? () => 99999 : null),
        ]);

        expect(value).toBe(undefined);
    });

    it('should return nothing if no cases match', () => {
        const value = match(
            10,
            [
                (n) => (n === 2 ? () => 22222 : null),
                (n) => (n === 3 ? () => 33333 : null),
                (n) => (n === 9 ? () => 99999 : null),
            ],
            (n) => n
        );

        expect(value).toBe(10);
    });
});
