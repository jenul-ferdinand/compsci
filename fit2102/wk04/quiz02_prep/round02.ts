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