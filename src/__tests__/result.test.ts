import { err, implyFrom, ok, resultify } from '../result';

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
