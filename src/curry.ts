type FirstArg<T> = T extends () => any
    ? void
    : T extends (a: infer Arg, ...rest: any) => any
    ? Arg
    : never;

type CurryRest<T> = T extends () => infer ReturnValue
    ? ReturnValue
    : T extends (a: infer SingleArg) => any
    ? SingleArg
    : T extends (a: any, ...rest: infer RestArgs) => infer ReturnValue
    ? Curried<(...args: RestArgs) => ReturnValue>
    : never;

type Curried<T extends (...args: any) => any> = (
    arg: FirstArg<T>
) => CurryRest<T>;

const curry = <T extends (...args: any) => any>(fn: T): Curried<T> => {
    // Handle functions with no args.
    if (fn.length === 0) return fn;

    const _curry = <T extends (...args: any) => any>(fn: T): CurryRest<T> =>
        fn.length === 0
            ? fn.call(null)
            : (arg: FirstArg<T>) => _curry(fn.bind(null, arg));

    return _curry(fn);
};

export default curry;
export { curry };
