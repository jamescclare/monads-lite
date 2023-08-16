# `monads-lite`

A TypeScript monad library with only the things you'll actually use.

## Is this you?

> I'm a JS/TS developer interested in using some more functional programming patterns in my code, but all these FP libs don't fit with the way I work!

## Then mondas-lite is what you need!

`monads-lite` is JS/TS library that brings mondic functional programming tools that don't take over your code, and let you expore the benifits functional programming without re-writing your codebase.

# Install

`npm i monads-lite`

# Library

## `Result`

The `Result<T, E>` type is a monadic construct that can represent the result of an operation which can either succeed or fail.

i.e. `type OperationResult = Result.Result<number, 'oh no, I failed'>;`

A Result can be infered from a Promise if a error type is provided:

```ts
const promise = Promise.resolve(123);
const result: Result<number, CustomErrorType> = 
    inferFrom(promise).resultify<CustomErrorType>();
```

A Result can be matched on if it is an Ok or Err:

```ts
// This is a powerful tool for program flow control.
const value = Result.match(result, [
    (okValue) => handleOk(okValue),
    (errValue) => handleErr(errValue),
]);
```

Actions can be run inside the Result monadic container so that they will only apply if the Result is of type Ok:

```ts
const value = Result.act(result, (okValue) => doNextThing(okValue));
```

These actions can be chained:

```ts
const value = Result.onResult(result)
    // These actions will only execute if the Result is Ok.
    .act(n => n + 1)
    .act(n => n * 2)
    // Unwrap the value from inside the Result.
    .done();
```

Actions can also be run asynchronously:

```ts
const result = await Result.onResult(result)
    .actAsync(async (n) => n + 1)
    .actAsync(async (n) => n * 2)
    .done();
```

Errors thrown anywhere in the act chain will be resolve out as Err:

```ts
const result = Result.onValue<number, Error>(2)
    .act((n) => n + 1) // This will run.
    .act(() => {
        // This will be caught and converted into an Err.
        throw new Error('fail 1');
    })
    .act((n) => n * 2) // This will not run.
    .act(() => {
        // This will not run.
        throw new Error('fail 2');
    })
    // This unwrap the Result.
    .done();

// or

const result = await Result.onValue<number, Error>(2)
    .act((n) => n + 1) // This will run.
    .act(() => {
        // This will be caught and converted into an Err.
        throw new Error('fail 1');
    })
    .act((n) => n * 2) // This will not run.
    .actAsync(async () => {
        // This will not run.
        throw new Error('fail 2');
    })
    // This unwrap the Result.
    .done();
```

## `Maybe`

The `Maybe<A>` type is a monadic construct that can represent a value that is either present or not present.

i.e. `type Username = Maybe<string>;`

Actions can be run inside the Maybe monadic container so that they will only apply if the Result is of type Ok:

```ts
const value = Maybe.act(maybe, (existingValue) => doNextThing(existingValue));
```

These actions can be chained:

```ts
const value = Maybe.onResult(maybe)
    // These actions will only execute if the Result is Ok.
    .act(n => n + 1)
    .act(n => n * 2)
    // Unwrap the value from inside the Result.
    .done();
```

A Maybe can be matched against cases:

```ts
// If 2, 3 or 9, repeat the digit 5 times.
const value = Maybe.match(maybe, [
    n => (n === 2 && (() => 22222)),
    n => (n === 3 && (() => 33333)),
    n => (n === 9 && (() => 99999)),
]);
```

When matching a Maybe a default case can also be provided:

```ts
// If 2, 3 or 9, repeat the digit 5 times,
// otherwise leave value unchanges.
const value = Maybe.match(maybe, [
    n => (n === 2 && (() => 22222)),
    n => (n === 3 && (() => 33333)),
    n => (n === 9 && (() => 99999)),
], n => n);
```