const log = console.log;

// Q1)
// Rewrite 
// function add(a, b) { 
//    return a + b;
//}
// In curried arrow form. What does add(3) alone evaluate to?

const add = a => b => a + b;

// add(3)(3) = 6, works. But... add(3) becomes a closure that remembers the 
// value 3 + b as an anonymous function. So this allows us to do things like
// const addThree = add(3), then call addThree(5) = 8...


// Q2)
// Name the free and bound variables in x => y => x + y + z

// x and y are bound variables because they are passed in as parameters.
// z is a free variable from the outer scope via a closure.


// Q3)
// What does this print and why?

const counter = () => { let n = 0; return () => ++n }
const c1 = counter(), c2 = counter();
log(c1(), c1(), c2());

// The variable n is shared across repeated function calls. This is because
// calling counter() creates an environment record holding n=0 separately on c1 
// AND c2.
//
// So first c1 call = 1, second = 2, and the separate c2 call = 1. 
//
// ++n is a pre-increment, which increments then yields the value. So the first
// call yields 1. n++ would yield 0 first and print 0 1 0 instead of 1 2 1.

