// Higher-order functions and combinators

//
// Q7)
// Define compose and flip in curried arrow form. Give TypeScript types for
// both.

// f => g => x => f(g(x))
// f takes Y and returns Z
// g takes X and returns Y
const compose =
  <Y, Z>(f: (y: Y) => Z) =>
  <X>(g: (x: X) => Y) =>
  (x: X): Z =>
    f(g(x));

// a => b => f(a)(b)
// f takes a and b curried, returning C
const flip =
  <A, B, C>(f: (a: A) => (b: B) => C) =>
  (a: A) =>
  (b: B): C =>
    f(a)(b);

//
// Q8)
// Given the compose function, evaluate compose(x => x+1)(x => x*2)(5). Which
// function runs first?

// The outer value 5, is passed in to g(x)=g(5)=10, then finally f(x)=f(10)=11
// So yes... g runs first. Just like you would do math...

//
// Q9)
// Define I and K in JavaScript. Reduce K(I) by hand. What does the result do
// when applied to two arguments?

// beta reduction..
// 1. take the body, everything RHS of the first =>
// 2. replace every occurrence of param in it with arg
// 3. the result is the body. The parameter and its arrow are gone.

// K = x => (y => x) [identity]
// I = x => x [constant]
// beta reduced... Original parameter got consumed.
// K(I) = y => I

//
// Q9)
// Express map and filter purely in terms of reduce.

// reduce allows us to combine stuff into a single output value.
[1, 2, 3].reduce((acc, x) => acc + x, 1);

// creating map with reduce, we need to curry a function in
// remembering that map returns a NEW array with mutated values.
const arr = [1, 2, 3];
const map =
  <A, B>(f: (a: A) => B) =>
  (arr: A[]): B[] =>
    arr.reduce<B[]>((acc, x) => [...acc, f(x)], []);
//             ^ accumulator type, array of mapped B values that bubble up.

// filter creates a new array that contains only the elements that pass a
// specific condition given by a function, doesn't have to be boolean just has
// to be truthy or falsy.
const filter =
  <A>(pred: (a: A) => boolean) =>
  (arr: A[]): A[] =>
    arr.reduce<A[]>((acc, x) => (pred(x) ? [...acc, x] : acc), []);

//
// Q10)
//
