import { Result } from '../index';
const { ok, err, match } = Result;

describe('match', () => {
    it('should match an Ok to a final value', () => {
        const result = ok({ count: 123 });

        const final = match(result, [({ count }) => count, () => 0]);

        expect(final).toBe(123);
    });

    it('should match an Ok with okPath', () => {
        const result = ok({ count: 123 });

        const okPath = jest.fn();
        const errPath = jest.fn();

        match(result, [okPath, errPath]);

        expect(okPath).toHaveBeenCalledTimes(1);
        expect(errPath).toHaveBeenCalledTimes(0);
    });

    it('should match an Err to a final value', () => {
        const result = err({ count: 123 });

        const final = match(result, [() => 0, ({ count }) => count]);

        expect(final).toBe(123);
    });

    it('should match an Err with errPath', () => {
        const result = err({ count: 123 });

        const okPath = jest.fn();
        const errPath = jest.fn();

        match(result, [okPath, errPath]);

        expect(okPath).toHaveBeenCalledTimes(0);
        expect(errPath).toHaveBeenCalledTimes(1);
    });

    it('can handle loop control with recursive matching', () => {
        let i = 0;
        const action = () => {
            if (i >= 10) {
                return ok(i);
            }
            i++;
            return err('Action still pending');
        };

        const waitForOk = (result: Result.Result<number, string>): number =>
            match(result, [(i) => i, () => waitForOk(action())]);

        const result = waitForOk(action());

        expect(result).toBe(10);
    });

    it('can resolve error case that will not occur', () => {
        const result = match(ok(123), [
            (i) => i,
            () => {
                throw new Error('this should not occur');
            },
        ]);

        expect(result).toBe(123);
    });
});
