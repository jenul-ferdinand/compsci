//
// Q15)
// In cons = x => y => f => f(x)(y), what is a cons list made of at runtime?
// No arrays, no objects. What actually holds the data?

const cons = (x) => (y) => (f) => f(x)(y);

// Let's beta reduce this one.
// cons = x => [y => f => f(x)(y)]
// cons(1) = y => [f => f(1)(y)]
// cons(1)(2) = f => f(1)(2)
// This means it's a closure as a function value. The values in this example, 1
// and 2 live in the captured environment record.

//
// Q16)
// Define head and tail as plain lambdas over that cons.

const first = (a) => (b) => a;
const second = (a) => (b) => b;
const head = (c) => c(first);
const tail = (c) => c(second);

//
// Q17)
// Now defin head and tail using only K and I

const K = (x) => (y) => x;
const I = (x) => x;

const headd = (c) => c(K);
const taill = (c) => c(K(I));
// K(I) gives second because K returns its first argument (I) and trashes a,
// then I returns b

//
// Q18)
// Given const lazyNats = v => sel => sel(v, lazyNats(v+1)), define the value
// and next selectors. Why doesn't this recurse forever at definition time.

const lazyNats = (v) => (sel) => sel(v, lazyNats(v + 1));

const value = (s) => s((v, n) => v);
const next = (s) => s((v, n) => n);

let nats = lazyNats(0); // example
for (let i = 0; i < 5; i++) {
  console.log(value(nats));
  nats = next(nats);
}

// a function body doesn't run until the function is called. The lambda is
// preventing lazyNats(v+1) from being called. sel => is called the thunk.
//
// this is a counterexample that does recurse forever (if called) bc there's
// no lambda beforehand.
const natsBroken = (v) => [v, ...natsBroken(v + 1)];

//
// Q19)
// Write getNth(n, seq) for that sequence type.

const getNth = (n, seq) => (n === 0 ? value(seq) : getNth(n - 1, next(seq)));
// n tells us how many steps down to take. So we decrement on each recursive
// call and we also pass in the next lazyNats function. When n reaches 0 we know
// we complete, returning the value.

//
// Q20)
// Write map(f, seq) for that sequence type. Why must the recursive call sit
// inside the returned function rather than outside it?
const seqMap = (f, seq) => sel => sel(f(value(seq)), seqMap(f, next(seq)))
// same reason as Q18, evaluation stops at a lambda. So the recursive call only
// runs when the sequence is applied.
