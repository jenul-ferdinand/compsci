/// Functions, currying, closures

const log = console.log;

//
// Q1)
// Rewrite
// function add(a, b) {
//    return a + b;
//}
// In curried arrow form. What does add(3) alone evaluate to?

const add = (a) => (b) => a + b;

// add(3)(3) = 6, works. But... add(3) becomes a closure that remembers the
// value 3 + b as an anonymous function. So this allows us to do things like
// const addThree = add(3), then call addThree(5) = 8...

//
// Q2)
// Name the free and bound variables in x => y => x + y + z

// x and y are bound variables because they are passed in as parameters.
// z is a free variable from the outer scope via a closure.

//
// Q3)
// What does this print and why?

const counter = () => {
  let n = 0;
  return () => ++n;
};
const c1 = counter(),
  c2 = counter();
log(c1(), c1(), c2());

// The variable n is shared across repeated function calls. This is because
// calling counter() creates an environment record holding n=0 separately on c1
// AND c2.
//
// So first c1 call = 1, second = 2, and the separate c2 call = 1.
//
// ++n is a pre-increment, which increments then yields the value. So the first
// call yields 1. n++ would yield 0 first and print 0 1 0 instead of 1 2 1.

//
// Q4)
// Write twice such that twice(f)(x) applied f to x twice. Give its TypeScript
// type.

const twice = (f) => (x) => f(f(x));

// Type <A>(f: (x: A) => A) => (x: A) => A
// twice takes a function f and returns a new function that applies the
// function f twice on a value x of type A, always the same type A but f can be
// any function given it's A => A

//
// Q5)
// Define purity. Why is nums.map(x => x*2) pure but
// nums.forEach(x => console.log(x)) not?

// A function is pure if it is deterministic and has no side effects.
//
// nums.map is pure because mapping x => x*2 creates an output determined by
// the input, and it has no side effects (touches nothing else). map creates
// a new array and nums remains unchanged.
//
// nums.forEach however, makes a console.log call, this breaks rule 2, it has
// a side effect and touches the outside world...
//
// Purity is what lets us reason about code by substitution.

//
// Q6)
// What is closure capturing, exactly: the value of the variable, or the
// variable itself? Prove your answer with a for loop example using var versus
// let.

// Closure capturing allows an inner function or code block to read and write
// variables from the outer scope.

let x = 1;
const f = () => x;
x = 2;
f(x); // 2 not 1

// f was created when x was 1, if closures captured values then f(x) would be
// 1 not 2. But it is 2, this means what it holds is a reference to the binding
// x.

const varFns = [];
for (var i = 0; i < 3; i++) {
  varFns.push(() => i);
}

const letFns = [];
for (let i = 0; i < 3; i++) {
  letFns.push(() => i);
}

log(varFns.map((g) => g())); // [3,3,3]
log(letFns.map((g) => g())); // [0,1,2]

// var i is function-scoped, so the declaration is seen outside of the loop,
// the final value of i=3, is read from .map(g => g()). This is why we don't
// use var anymore... Whereas let gets a fresh binding per iteration.