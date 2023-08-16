import { identity, Nothing, Either } from './core';

type Maybe<A> = Either<A, Nothing>;

const act = <A, Return>(
    maybe: Maybe<A>,
    action: (has: A) => Return
): Maybe<Return> => {
    if (maybe) return action(maybe);
};

const on = <A>(maybe: Maybe<A>) => ({
    act: <Return>(action: (has: A) => Return) => {
        const next = act(maybe, action);
        return on(next);
    },
    done: () => act(maybe, identity),
});

const match = <T, Return>(
    value: T,
    statements: Array<(value: T) => Maybe<false | ((value: T) => Return)>>,
    defaultAction?: (value: T) => Return
): Maybe<Return> => {
    const iter = statements[Symbol.iterator]();

    for (const statement of iter) {
        const action = statement(value);
        if (action) {
            return action(value);
        }
    }

    if (defaultAction) return defaultAction(value);
};

export { Maybe, Nothing, act, on, match };
