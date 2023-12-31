import { identity, Either } from './core';

type Ok<T> = { status: 'ok'; data: T };
const ok = <T>(data: T): Ok<T> => ({ status: 'ok', data });

type Err<T> = { status: 'err'; data: T };
const err = <T>(data: T): Err<T> => ({ status: 'err', data });

type Result<T, E> = Ok<T> | Err<E>;

const resultify = <T, E>(promise: Promise<T>): Promise<Result<T, E>> =>
    promise.then(ok).catch((t: E) => err(t));

const inferFrom = <T>(promise: Promise<T>) => ({
    resultify: <E>() => resultify<T, E>(promise),
});

type Path<T, R> = (data: T) => R;
const match = <T, E, T2, E2>(
    result: Result<T, E>,
    statments: [Path<T, T2>, Path<E, E2>]
): Either<T2, E2> => {
    const [okPath, errPath] = statments;

    return result.status === 'ok' ? okPath(result.data) : errPath(result.data);
};

const act = <T, E, Return>(
    result: Result<T, E>,
    action: (has: T) => Return
): Result<Return, E> => {
    const handleAction = (a: T) => {
        try {
            const next = action(a);
            return ok(next);
        } catch (e: any) {
            return err(e);
        }
    };

    return match(result, [(a) => handleAction(a), (b) => err(b)]);
};

const actAsync = async <T, E, Return>(
    result: Promise<Result<T, E>>,
    action: (has: T) => Promise<Return>
): Promise<Result<Return, E>> => {
    return match(await result, [
        (a) => inferFrom(action(a)).resultify<E>(),
        (b) => Promise.resolve(err(b)),
    ]);
};

type AsyncResultActions<A, B> = {
    act: <Return>(action: (ok: A) => Return) => AsyncResultActions<Return, B>;
    actAsync: <Return>(
        action: (ok: A) => Promise<Return>
    ) => AsyncResultActions<Return, B>;
    done: () => Promise<Result<A, B>>;
};

const onPromise = <A, B>(
    result: Promise<Result<A, B>>
): AsyncResultActions<A, B> => ({
    act: <Return>(action: (ok: A) => Return) => {
        const wrappedAction = (ok) => Promise.resolve(action(ok));
        const next = actAsync(result, wrappedAction);
        return onPromise(next);
    },
    actAsync: <Return>(action: (ok: A) => Promise<Return>) => {
        const next = actAsync(result, action);
        return onPromise(next);
    },
    done: async () => act(await result, identity),
});

type ResultActions<A, B> = {
    act: <Return>(action: (ok: A) => Return) => ResultActions<Return, B>;
    actAsync: <Return>(
        action: (ok: A) => Promise<Return>
    ) => AsyncResultActions<Return, B>;
    done: () => Result<A, B>;
};

const onResult = <A, B>(result: Result<A, B>): ResultActions<A, B> => ({
    act: <Return>(action: (ok: A) => Return) => {
        const next = act(result, action);
        return onResult(next);
    },
    actAsync: <Return>(action: (ok: A) => Promise<Return>) => {
        const next = actAsync(Promise.resolve(result), action);
        return onPromise(next);
    },
    done: () => act(result, identity),
});

const onValue = <A, B>(a: A) => onResult<A, B>(ok(a));

export {
    Ok,
    Err,
    Result,
    ok,
    err,
    resultify,
    inferFrom,
    match,
    onValue,
    onResult,
    onPromise,
};
