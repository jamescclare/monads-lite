type Path<T, R> = (data: T) => R;

type Nothing = void | null;
type Either<A, B> = A | B;

const identity = <A>(i: A): A => i;

export { Path, Either, Nothing, identity };
