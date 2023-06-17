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

i.e. `type OperationResult = Result<number, 'oh no, I failed'>;`
