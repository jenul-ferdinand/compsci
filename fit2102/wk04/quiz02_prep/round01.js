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
