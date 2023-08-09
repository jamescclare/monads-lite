import {
    err,
    implyFrom,
    ok,
    resultify,
    onValue,
    onResult,
    match,
    Result,
} from '../result';

describe('ok', () => {
    it('should create an Ok', () => {
        const data = 123;
        const item = ok(data);

        expect(item.status).toBe('ok');
        expect(item.data).toBe(123);
    });
});

describe('err', () => {
    it('should create an Err', () => {
        const data = 123;
        const item = err(data);

        expect(item.status).toBe('err');
        expect(item.data).toBe(123);
    });
});

describe('resultify', () => {
    it('should resultify a resolving promise', async () => {
        const promise = Promise.resolve(123);

        const promisedResult = resultify<number, never>(promise);

        const result = await promisedResult;

        expect(result.status).toBe('ok');
        expect(result.data).toBe(123);
    });

    it('should resultify a rejecting promise', async () => {
        const promise = Promise.reject(123);

        const promisedResult = resultify<never, number>(promise);

        const result = await promisedResult;

        expect(result.status).toBe('err');
        expect(result.data).toBe(123);
    });

    it('should imply T from a resolving promise, then resultify', async () => {
        const promise = Promise.resolve(123);

        const promisedResult = implyFrom(promise).resultify<never>();

        const result = await promisedResult;

        expect(result.status).toBe('ok');
        expect(result.data).toBe(123);
    });

    it('should imply T from a rejecting promise, then resultify', async () => {
        const promise = Promise.reject(123);

        const promisedResult = implyFrom(promise).resultify<number>();

        const result = await promisedResult;

        expect(result.status).toBe('err');
        expect(result.data).toBe(123);
    });
});

describe('act', () => {
    it('should chain actions on ok results', () => {
        const result = onValue(2)
            .act((n) => n + 1)
            .act((n) => n * 2)
            .done();

        expect(result.status).toBe('ok');
        expect(result.data).toBe(6);
    });

    it('should not perform actions on err results', () => {
        // TODO: Infer the never.
        const result = onResult<never, string>(err('failed'))
            .act((n) => n + 1)
            .act((n) => n * 2)
            .done();

        expect(result.status).toBe('err');
        expect(result.data).toBe('failed');
    });

    it('should chain async actions on ok results', async () => {
        const result = await onValue(2)
            .actAsync(async (n) => n + 1)
            .actAsync(async (n) => n * 2)
            .done();

        expect(result.status).toBe('ok');
        expect(result.data).toBe(6);
    });

    it('should not chain async actions on err results', async () => {
        const result = await onResult<never, string>(err('failed'))
            .actAsync(async (n) => n + 1)
            .actAsync(async (n) => n * 2)
            .done();

        expect(result.status).toBe('err');
        expect(result.data).toBe('failed');
    });

    it('should infer result from promise', async () => {
        const promise = new Promise<number>((resolve) => resolve(5));
        const result = await implyFrom(promise).resultify();

        const final = onResult(result)
            .act((n) => n * 2)
            .done();

        expect(final.status).toBe('ok');
        expect(final.data).toBe(10);
    });

    it('should handle error in action chain', () => {
        const result = onValue<number, Error>(2)
            .act((n) => n + 1)
            .act(() => {
                throw new Error('fail 1');
            })
            .act((n) => n * 2)
            .act(() => {
                throw new Error('fail 2');
            })
            .done();

        expect(result.status).toBe('err');
        expect(result.data.message).toBe('fail 1');
    });
});

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

        const waitForOk = (result: Result<number, string>): number =>
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
