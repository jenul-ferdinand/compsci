import "./style.css";

import {
    filter,
    fromEvent,
    interval,
    map,
    merge,
    scan,
    startWith,
    switchMap,
    type Observable,
} from "rxjs";

/**
 * Constants defining game physics and RNG seed
 */
const Constants = {
    GRAVITY: 1,
    GROUND: 378.5,
    SEED: 1234,
    DAMPING: 0.7,
    // JUMP_VELOCITY: -10,
    JUMP_MAX: -6,
    JUMP_MIN: -12,
};

// Stub value to indicate an implementation
const IMPLEMENT_THIS: any = []; // this is an array so that merge(IMPLEMENT_THIS) doesn't make the test cases look weird on firefox
type IMPLEMENT_THIS = any;

/**
 * A random number generator which provides two pure functions
 * `hash` and `scale`. Call `hash` repeatedly to generate the
 * sequence of hashes.
 */
abstract class RNG {
    private static m = 0x80000000; // 2^31
    private static a = 1103515245;
    private static c = 12345;

    public static hash = (seed: number): number =>
        (RNG.a * seed + RNG.c) % RNG.m;

    public static scale = (hash: number): number =>
        (2 * hash) / (RNG.m - 1) - 1; // in [-1, 1]
}

/*****************************************************************
 * Exercise 1
 *
 * Create rng helper functions using the functions in RNG. We at least want a function that
 * creates an observable stream that represents a stream of random
 * numbers. The numbers in the range [-1, 1].
 *
 * /Hint/: An RNG stream will need to accumulate state to produce a stream of random values.
 *
 * /Hint 2/: VXNlIHNjYW4=
 *
 * /Challenge/: Implement this using a lazy sequence of random numbers.
 * It is interesting and more generally useful than just a stream.
 * Ask your tutor if you're not sure where to start.
 */

/**
 * Converts values in a stream to random numbers in the range [-1, 1]
 *
 * This usually would be implemented as an RxJS operator, but that is currently
 * beyond the scope of this course.
 *
 * @param source$ The source Observable, elements of this are replaced with random numbers
 * @param seed The seed for the random number generator
 */
export function createRngStreamFromSource<T>(source$: Observable<T>) {
    return function createRngStream(seed: number = 0): Observable<number> {
        const randomNumberStream = source$.pipe(
            scan((seedAccumulation, _) => RNG.hash(seedAccumulation), seed),
            map((hashedSeed, _) => RNG.scale(hashedSeed)),
        );

        return randomNumberStream;
    };
}

const main = () => {
    // The state of the game should include at least:
    // - vertical position of dot
    // - vertical velocity of dot
    // - number of bounces
    type State = Readonly<{
        ypos: number;
        yvel: number;
        bounces: number;
    }>;

    const initialState: State = {
        ypos: 0,
        yvel: 0,
        bounces: 0,
    };

    /*****************************************************************
     * Exercise 2 — Create the jump stream
     *
     * Use `fromEvent(document, 'keydown')` to listen for Space key presses.
     * Filter the stream so only the Space key triggers jumps.
     *
     * For now, each jump should emit a **fixed** velocity upward (e.g. -10),
     *
     * This should produce a stream of (state) => newState functions.
     *****************************************************************/
    // const jump$: Observable<(s: State) => State> = fromEvent<KeyboardEvent>(
    //     document,
    //     "keydown",
    // ).pipe(
    //     filter(e => e.code === "Space"),
    //     map(_ => s => ({ ...s, yvel: Constants.JUMP_VELOCITY })),
    // );

    /*****************************************************************
     * Exercise 3 — Create the tick stream
     *
     * Use `interval(20)` to simulate time passing (50fps).
     * On each tick:
     * - Add gravity to vertical velocity
     * - Update vertical position, ensuring the dot does not fall below the ground.
     * - Update the counter for number of bounces
     *
     * Output should be a function: (state) => newState
     *****************************************************************/
    const tick$: Observable<(s: State) => State> = interval(20).pipe(
        map(_ => (s: State) => {
            const newVelocity = s.yvel + Constants.GRAVITY;
            const impactVelocity = -newVelocity * Constants.DAMPING;
            const rawPosition = s.ypos + newVelocity;
            const hasLanded = rawPosition >= Constants.GROUND;

            return {
                ...s,
                yvel: hasLanded ? impactVelocity : newVelocity,
                ypos: Math.min(rawPosition, Constants.GROUND),
                bounces: hasLanded && s.yvel > 6 ? s.bounces + 1 : s.bounces,
            };
        }),
    );

    /*****************************************************************
     * Exercise 6 — Add Random Jump Strength
     *
     * Replace the fixed jump velocity with a random one using a stream of
     * random numbers generated each time the dot jumps.
     *
     * Tips:
     * - Convert the number in [-1, 1] to a jump strength (e.g. in [-12, -6])
     * - Edits should be done throughout the code.
     *****************************************************************/

    const spacePress$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
        filter(e => e.code === "Space"),
    );

    const toJumpVelocity = (r: number): number =>
        // scale between jump min and jump max using the random number
        ((Constants.JUMP_MAX - Constants.JUMP_MIN) * r +
            (Constants.JUMP_MAX + Constants.JUMP_MIN)) /
        2;

    const jump$: Observable<(s: State) => State> = createRngStreamFromSource(
        spacePress$,
    )(Constants.SEED).pipe(
        map(randomNumber => (s: State) => ({
            ...s,
            yvel: toJumpVelocity(randomNumber),
        })),
    );

    /*****************************************************************
     * Exercise 7 — Full game restart using `switchMap`
     *
     * Use `switchMap` to reset the entire game logic whenever the "R" key is pressed.
     *
     *
     * Tips:
     * - Create a `restart$` stream from "keydown" events filtered for "KeyR"
     * - Make sure you restart the bounce counter!
     * - Use `startWith(null)` to trigger the game loop on first load
     * - Edits should be done throughout the code.
     *****************************************************************/

    const restart$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
        filter(e => e.key === "r" || e.key === "R"),
        startWith(null), // starts stream again
    );

    /*****************************************************************
     * Exercise 4 — Create the game state stream
     *
     * Combine the `jump$` and `tick$` streams using `merge`.
     * Use `scan` to apply each state transformer function to the state.
     * Start from `initialState`.
     *
     * This stream will represent the full evolution of game state over time.
     *****************************************************************/
    const state$: Observable<State> = restart$.pipe(
        switchMap(() => // flatten into one stream
            merge(tick$, jump$).pipe(
                scan((state, reducerFn) => reducerFn(state), initialState),
                // note: reducerFn is a changing function, taking a fixed operation.
            ),
        ),
    );

    /*****************************************************************
     * Exercise 5 — Render to the DOM
     *
     * On each new state
     *    - update the dot's `style.top` to match the y position of the dot
     *    - update the bounce counter
     * This is the only part of your code that should perform side effects.
     *****************************************************************/
    const dot = document.getElementById("dot") as HTMLElement;
    const bounceCounter = document.getElementById("numBounces") as HTMLElement;

    state$.subscribe(state => {
        // the place of impurity
        dot.style.top = `${state.ypos}px`;
        bounceCounter.textContent = `${state.bounces}`;
    });
};
if (typeof window !== "undefined") {
    window.addEventListener("load", main);
}
