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
};

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

/**
 * Exercise 1 — Create a stream of random numbers in [-1, 1]
 */
export function createRngStreamFromSource<T>(source$: Observable<T>) {
    return function createRngStream(seed: number = 0): Observable<number> {
        const randomNumberStream = source$.pipe(
            scan(acc => RNG.hash(acc), seed),
            map(RNG.scale),
        );

        return randomNumberStream;
    };
}

const main = () => {
    /**
     * Game state: vertical position (y), velocity (vy), grounded flag
     */
    type State = Readonly<{
        y: number;
        vy: number;
        grounded: boolean;
        numBounces: number;
    }>;

    const initialState: State = {
        y: Constants.GROUND,
        vy: 0,
        grounded: true,
        numBounces: 0,
    };

    /**
     * Exercise 2 — Create the jump stream
     *
     * Pressing space emits a fixed jump velocity (later replaced with RNG).
     * Only emits if currently grounded.
     */
    const keydown$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
        filter(e => e.code === "Space"),
    );

    const rng$ = createRngStreamFromSource(keydown$)(Constants.SEED);

    const jump$: Observable<(s: State) => State> = rng$.pipe(
        map(rand => (state: State): State => {
            if (!state.grounded) return state;

            const jumpStrength = -9 + 3 * rand;

            return {
                ...state,
                vy: jumpStrength,
                grounded: false,
            };
        }),
    );

    /**
     * Exercise 3 — Tick stream applies gravity and updates position
     */
    const tick$: Observable<(s: State) => State> = interval(20).pipe(
        map(() => (state: State): State => {
            const vy = state.vy + Constants.GRAVITY;
            const y = state.y + vy;
            const clampedY = Math.min(y, Constants.GROUND);
            const grounded = clampedY === Constants.GROUND;
            const becameGrounded = !state.grounded && grounded;

            const nextVy = grounded ? 0 : vy;

            return {
                ...state,
                y: clampedY,
                vy: nextVy,
                grounded,
                numBounces: state.numBounces + (becameGrounded ? 1 : 0),
            };
        }),
    );

    /**
     * Exercise 4 — Merge both streams and apply reducers to state
     */
    const state$: Observable<State> = merge(jump$, tick$).pipe(
        scan((state, reducerFn) => reducerFn(state), initialState),
    );

    const restart$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
        filter(e => e.code === "KeyR"),
    );

    const gameLoop$ = restart$.pipe(
        startWith(null), // trigger once on initial load
        switchMap(() => state$),
    );

    /**
     * Exercise 5 — Render to the DOM
     */
    const dot = document.getElementById("dot") as HTMLElement;
    const bounceCounter = document.getElementById("numBounces") as HTMLElement;

    gameLoop$.subscribe(state => {
        dot.style.top = `${state.y}px`;
        bounceCounter.textContent = `${state.numBounces}`;
    });

    /**
     * Exercise 6 — Random jump velocity (already applied above)
     * - Jump stream now uses `rng$` to pull randomness
     * - Scales to range [-12, -6]
     */

    /**
     * Exercise 7 — Full game restart using `switchMap`
     *
     * Use `switchMap` to reset the entire game logic whenever the "R" key is pressed.
     *
     *
     * Tips:
     * - Create a `restart$` stream from "keydown" events filtered for "KeyR"
     * - Use `startWith(null)` to trigger the game loop on first load
     *
     */
};

if (typeof window !== "undefined") {
    window.addEventListener("load", main);
}
