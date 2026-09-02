/**
 * IMPORTANT: The README file contains important information on
 * getting started.
 * Please read before attempting these exercises.
 *
 * You must make all the tests pass, indicated by a green ✓, and
 * follow all the instructions given in the code file for each exercise.
 *
 * The code must compile with no Typescript warnings or errors.
 *
 * Marks are only awarded for correct understanding of the question
 * and demonstration of concepts.
 *
 * Completing the tasks with correctly compiling code does not guarantee
 * full marks.
 *
 * Make sure you understand the question and your solution.
 *
 * Ask a tutor if in doubt!
 *
 * **Reminders**
 *
 * You must **not** use for-loops, while-loops, or similar imperative
 * techniques in these exercises unless explicitly approved, required,
 * or provided.
 *
 * All code must also be pure and values immutable.
 *
 * This means declaring variables with `const`, using `Readonly` and
 * `... as const` to ensure immutable types, and avoiding using mutating
 * methods such as `Array.prototype.push()`.
 */

// Stub value to indicate an implementation
const IMPLEMENT_THIS: any = undefined;
type IMPLEMENT_THIS = any;

/*****************************************************************
 * Exercise 1
 *
 * Create an object called anObject with the property "x" set to 5.
 *
 * Create another object object called anotherObject that
 *  has the properties of anObject, and
 *  has the property "y" set to 10,
 * using the spread operator.
 *
 * Make sure to NOT mutate anything, including objects.
 *
 * see: https://tgdwyer.github.io/typescript1/#using-the-compiler-to-ensure-immutability
 */

const anObject = { x: 5 } as const;

const anotherObject = { ...anObject, y: 10 } as const;

/*****************************************************************
 * Exercise 2
 *
 * Part 1:
 * Write the types for the following code, which was introduced in https://tgdwyer.github.io/html/
 * - hint: look at the type of the object being passed in to animate in the call below.
 * - note: it's not just adding the type definitions, you'll also need to add code to handle nulls and convert types as necessary.
 */

// Define an animation function
function animate(
    rect: HTMLElement,
    startX: number,
    finalX: number,
    duration: number,
) {
    const startTime = performance.now();

    function nextFrame() {
        // Calculate elapsed time
        const currentTime = performance.now(),
            elapsedTime = currentTime - startTime;

        // Check if animation duration has elapsed
        if (elapsedTime >= duration) {
            // Set the final position of the rectangle.
            // We can use `setAttribute` to modify the HTML Element. In this case, we are changing the x attribute.
            rect.setAttribute("x", finalX.toString());
            return; // Stop the animation
        }

        // Calculate position based on elapsed time
        const x = startX + ((finalX - startX) * elapsedTime) / duration;

        // Set the intermediate position of the rectangle.
        rect.setAttribute("x", x.toString());

        // Call the nextFrame function again after a delay of 1000/60 milliseconds
        setTimeout(nextFrame, 1000 / 60); // 60 FPS
    }
    nextFrame();
}

const redRectangle = document.getElementById("redRectangle")!;
const duration = 5000; // 5 seconds in milliseconds
animate(redRectangle, 0, 370, duration);

/*
 * Part 2:
 * Add a second Blue rectangle, and animate it to move in the opposite direction for 10s.
 * - hint: start by declaratively defining the blue rectangle in the index.html file, similarly to the existing red one.
 */
const blueRectangle = document.getElementById("blueRectangle")!;
animate(blueRectangle, 370, 0, duration * 2);

/*****************************************************************
 * Exercise 3
 *
 * We will now look at defining recursive types with generics. This is
 * very useful in creating our own custom data types and data structures.
 *
 * see: https://tgdwyer.github.io/typescript1/#generic-types
 *
 * The binary tree is a very basic recursive data structure which stores
 * a data value, and two children.
 *
 * Tasks:
 * 1. Define a generic, immutable `BinaryTree<T>` type
 * 2. Write a `binaryTree` constructor function
 * 3. Implement a function `depthBinaryTree` to compute the maximum depth
 * 4. Implement a function `mapBinaryTree` to apply a function to all values
 */

type BinaryTree<T> = Readonly<{
    data: T;
    left?: BinaryTree<T>;
    right?: BinaryTree<T>;
}>;

/**
 * Creates a binary tree node
 *
 * /Hint/: Remember to declare the generic type!
 *
 * /Hint 2/: The ? is used to indicate an optional parameter
 *  e.g. (x: int, y?: int) => {}
 *
 * /Hint 3/: Always include left and right children, even if they are undefined.
 *
 * @param data Data to store at node
 * @param left Left child
 * @param right Right child
 * @returns Binary tree node
 */
const binaryTree = <T>(
    data: T,
    left?: BinaryTree<T>,
    right?: BinaryTree<T>,
): BinaryTree<T> => ({ data, left, right });

const binaryTreeExample = binaryTree(
    1,
    binaryTree(2, binaryTree(3)),
    binaryTree(4, binaryTree(5), binaryTree(6)),
);

// We should be able to store any type we like (not just numbers) inside the binary tree
const anotherBinaryTreeExample = binaryTree(
    "abc",
    binaryTree("def", binaryTree("ghi", binaryTree("jkl"))),
    binaryTree("mno", binaryTree("pqr")),
);

/**
 * Computes the maximum depth (height) of a binary tree.
 *
 * @param tree - The binary tree to measure
 * @returns A number representing the longest path from root to leaf (including root)
 *
 */
const depthBinaryTree = <T>(tree: BinaryTree<T>): number => {
    const leftDepth = tree.left ? depthBinaryTree(tree.left) : 0;
    const rightDepth = tree.right ? depthBinaryTree(tree.right) : 0;
    return 1 + Math.max(leftDepth, rightDepth);
};

/**
 * Applies a function to each value in a binary tree, returning a new tree with the same shape.
 *
 * @param tree - The binary tree to map over
 * @param fn - A function to apply to each node's data
 * @returns A new BinaryTree where each node's data is the result of applying `fn`
 *
 */
const mapBinaryTree = <T, U>(
    tree: BinaryTree<T>,
    fn: (data: T) => U,
): BinaryTree<U> => ({
    data: fn(tree.data),
    left: tree.left ? mapBinaryTree(tree.left, fn) : undefined,
    right: tree.right ? mapBinaryTree(tree.right, fn) : undefined,
});

/*****************************************************************
 * Exercise 4 — N-ary Trees with Generics
 *
 * An n-ary tree is a recursive data structure where each node contains:
 * - a single value (`data`)
 * - zero or more children stored in an array
 *
 * Tasks:
 * 1. Define a generic, immutable `NaryTree<T>` type
 * 2. Write a `naryTree` constructor function
 * 3. Implement a function `depthNaryTree` to compute the maximum depth
 * 4. Implement a function `mapNaryTree` to apply a function to all values
 *****************************************************************/

type NaryTree<T> = Readonly<{
    data: T;
    children: ReadonlyArray<NaryTree<T>>;
}>;

/**
 * Creates an N-ary tree node.
 *
 * @param data - The value at this node
 * @param children - An array of child NaryTree nodes
 * @returns A new immutable NaryTree<T> node
 *
 */
const naryTree = <T>(
    data: T,
    children: ReadonlyArray<NaryTree<T>> = [],
): NaryTree<T> => ({ data, children });

const naryTreeExample = naryTree(1, [
    naryTree(2),
    naryTree(3, [naryTree(41), naryTree(42), naryTree(43)]),
    naryTree(5, [naryTree(6)]),
]);

/**
 * Computes the maximum depth of an N-ary tree.
 *
 * The depth of a tree is the length of the longest path from the root node to any leaf.
 *
 * @param tree - The N-ary tree to measure
 * @returns The maximum depth of the tree
 *
 */
const depthNaryTree = <T>(tree: NaryTree<T>): number => {
    if (tree.children.length === 0) return 1;
    const childDepths = tree.children.map(depthNaryTree);
    return 1 + Math.max(...childDepths);
};

/**
 * Applies a function to each node's data in an N-ary tree, producing a new tree of the same shape.
 *
 * @param tree - The tree to map over
 * @param fn - A function to apply to each data value
 * @returns A new NaryTree with transformed data
 *
 */
const mapNaryTree = <T, U>(
    tree: NaryTree<T>,
    fn: (data: T) => U,
): NaryTree<U> => ({
    data: fn(tree.data),
    children: tree.children.map(child => mapNaryTree(child, fn)),
});

/*****************************************************************
 * Exercise 5 — Maybe Types
 *
 *****************************************************************/

/**
 * Represents an optional value: either a value of type `T` (`Just<T>`) or the absence of a value (`Nothing`).
 */
type Nothing = undefined;
type Just<T> = { Just: T };
type Maybe<T> = Just<T> | Nothing;

/**
 * Wraps a value in a `Just` container.
 *
 * @param value - The value to wrap
 * @returns A `Maybe<T>` representing the given value
 */
const just = <T>(value: T): Maybe<T> => ({ Just: value });
/**
 * A constant representing the absence of a value.
 */
const nothing: Nothing = undefined;

/**
 * Example of using the Maybe type
 * Adds 1 to a Maybe<number> if it contains a value.
 *
 * @param maybeNum - A Maybe<number> value
 * @returns A `Just<number>` with the result of adding 1, or `Nothing` if the input was `Nothing`
 */
function addOne(maybeNum: Maybe<number>): Maybe<number> {
    return maybeNum ? just(maybeNum.Just + 1) : nothing;
}

/**
 * Applies a function to the value inside a `Just`, producing a new `Maybe` value.
 * If the input is `Nothing`, it returns `Nothing`.
 *
 * @param m - The `Maybe` container
 * @param fn - Function to apply to the contained value if present
 * @returns A `Just<U>` with the transformed value, or `Nothing` if the input was `Nothing`
 */
function mapMaybe<T, U>(m: Maybe<T>, fn: (value: T) => U): Maybe<U> {
    return m ? just(fn(m.Just)) : nothing;
}

/**
 * Applies a function that returns a `Maybe` to the value inside a `Just`, flattening the result.
 * If the input is `Nothing`, it returns `Nothing`.
 *
 * @param m - The `Maybe` container
 * @param fn - Function to apply to the contained value if present, returning another `Maybe`
 * @returns A flattened `Maybe<U>`, or `Nothing` if the input was `Nothing`
 */
function flatMapMaybe<T, U>(m: Maybe<T>, fn: (value: T) => Maybe<U>): Maybe<U> {
    return m ? fn(m.Just) : nothing;
}

/**
 * Parses a string into a number wrapped in a `Maybe`.
 * Returns `Just<number>` if the string is a valid number, otherwise `Nothing`.
 *
 * @param str - The string to parse
 * @returns `Just<number>` if parsing succeeds, otherwise `Nothing`
 */
function parseNumber(str: string): Maybe<number> {
    const n = parseFloat(str);
    return isNaN(n) ? nothing : just(n);
}

/**
 * Checks that a number is non-zero.
 * Returns `Just<number>` if the input is not 0, otherwise `Nothing`.
 *
 * @param n - The number to check
 * @returns `Just<number>` if `n` is not 0, otherwise `Nothing`
 */
function nonZero(n: number): Maybe<number> {
    return n === 0 ? nothing : just(n);
}

/**
 * Calculates the reciprocal of a number (1 / n).
 *
 * @param n - A non-zero number
 * @returns The reciprocal of `n`
 */
function reciprocal(n: number): number {
    return 1 / n;
}

/**
 * Applies a chain of `Maybe`-aware computations to a string:
 * 1. Parses the string to a number
 * 2. Validates that the number is not zero
 * 3. Computes the reciprocal
 *
 * @param input - The input string to transform
 * @returns `Just<number>` if all operations succeed, otherwise `Nothing`
 */
const chainFunctions = (input: string): Maybe<number> =>
    mapMaybe(flatMapMaybe(parseNumber(input), nonZero), reciprocal);

export {
    anObject,
    anotherObject,
    binaryTree,
    binaryTreeExample,
    depthBinaryTree,
    mapBinaryTree,
    naryTree,
    naryTreeExample,
    depthNaryTree,
    mapNaryTree,
    just,
    nothing,
    mapMaybe,
    flatMapMaybe,
    chainFunctions,
};
