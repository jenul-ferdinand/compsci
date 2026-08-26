
//
// Q15)
// In cons = x => y => f => f(x)(y), what is a cons list made of at runtime?
// No arrays, no objects. What actually holds the data?

const cons = x => y => f => f(x)(y)

// Let's beta reduce this one.
// cons = x => [y => f => f(x)(y)]
// cons(1) = y => [f => f(1)(y)]
// cons(1)(2) = f => f(1)(2)
// This means it's a closure as a function value. The values in this example, 1
// and 2 live in the captured environment record.

//
// Q16)
// Define head and tail as plain lambdas over that cons.

const first = a => b => a
const second = a => b => b
const head = c => c(first)
const tail = c => c(second)