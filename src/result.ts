type Ok<T> = { status: 'ok'; data: T };
const ok = <T>(data: T): Ok<T> => ({ status: 'ok', data });

type Err<T> = { status: 'err'; data: T };
const err = <T>(data: T): Err<T> => ({ status: 'err', data });

type Result<T, E> = Ok<T> | Err<E>;

const resultify = <T, E>(promise: Promise<T>): Promise<Result<T, E>> =>
    promise.then(ok).catch((t: E) => err(t));

const implyFrom = <T>(promise: Promise<T>) => ({
    resultify: <E>() => resultify<T, E>(promise),
});

type Path<T, R> = (data: T) => R;
const match = <T, E, Return>(
    result: Result<T, E>,
    statments: [Path<T, Return>, Path<E, Return>]
): Return => {
    const [okPath, errPath] = statments;

    return result.status === 'ok' ? okPath(result.data) : errPath(result.data);
};

export { Ok, Err, Result, ok, err, resultify, implyFrom, match };
