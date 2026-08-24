/**
 * Building up a Complex Observable program
 *
 * Please have a look at the README file before attempting these exercises.
 *
 * This week we will be creating a more complex program that involves
 * user input and updating state. This will serve as an introduction of
 * the core ideas used in the assignment to implement the main game loop.
 *
 * Please follow the instructions carefully and complete the exercises
 * in the order that they appear. These exercises are a little bit
 * different to prior weeks as the intention is to highlight a *process*
 * rather than specific techniques. As the exercises build upon each other,
 * you may need to copy and paste your solution down to the next exercise.
 *
 * We will be building a controllable screen saver similar to the DVD logo
 * screen saver (https://www.youtube.com/watch?v=5mGuCdlCcNM). The rectangle
 * will bounce around the screen and change direction based on user input.
 *
 * For example, if the rectangle is heading south-east and the user presses
 * the "A" key, the rectangle will head south-west.
 *
 * Refer to the example video on Moodle to see what the final result should look like.
 *
 * see: https://tgdwyer.github.io/functionalreactiveprogramming/
 * see: https://tgdwyer.github.io/asteroids/
 */

import "./style.css";

import {
    concat,
    concatMap,
    filter,
    fromEvent,
    interval,
    map,
    merge,
    scan,
    takeUntil,
    timer,
    zip,
} from "rxjs";

// Stub value to indicate an implementation
const IMPLEMENT_THIS: any = undefined;
type IMPLEMENT_THIS = any;

/**
 * Some types and helper functions used for rendering.
 *
 * Feel free to have a look but they are not necessary for the exercises.
 */

const SVG_WIDTH = 600;
const SVG_HEIGHT = 600;

type RectProps = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
}>;

const startProps = {
    x: 100,
    y: 70,
    width: 120,
    height: 80,
    fill: "#95B3D7",
} as RectProps;

const initialiseRect = (props: RectProps, id: string) => {
    // get the svg canvas element
    const svg = document.getElementById(id)!;
    svg.setAttribute("height", String(SVG_HEIGHT));
    svg.setAttribute("width", String(SVG_WIDTH));
    const rect = document.createElementNS(svg.namespaceURI, "rect");
    Object.entries(props).forEach(([key, val]) =>
        rect.setAttribute(key, String(val)),
    );
    svg.appendChild(rect);

    return rect;
};

/*****************************************************************
 * Exercise 1
 *
 * Create a moving rectangle that continues indefinitely.
 *
 * You may reuse the code from previous weeks.
 */
function controllableScreenSaver1() {
    const rect = initialiseRect(startProps, "screensaver1");

    /** Write your code after here */

    interval(10)
        .pipe(
            scan(({ x, y }, _) => ({ x: x + 2, y: y + 2 }), {
                x: startProps.x,
                y: startProps.y,
            }),
        )
        .subscribe(({ x, y }) => {
            rect.setAttribute("x", String(x));
            rect.setAttribute("y", String(y));
        });
}

/*****************************************************************
 * Exercise 2
 *
 * Copy down your code from the previous exercise.
 *
 * Make helper functions to prevent the rectangle from leaving the
 * svg bounds.
 *
 * Remember to check both x and y coordinates!
 *
 * /Hint/: The (x,y) coordinates of the rectangle is the top
 *  left corner of the rectangle. We know the rectangle's
 *  dimensions from startProps.
 */
function controllableScreenSaver2() {
    const rect = initialiseRect(startProps, "screensaver2");

    /** Write your code after here */

    const boundX = (x: number) =>
        Math.max(0, Math.min(SVG_WIDTH - startProps.width, x));

    const boundY = (y: number) =>
        Math.max(0, Math.min(SVG_HEIGHT - startProps.height, y));

    interval(10)
        .pipe(
            scan(({ x, y }, _) => ({ x: boundX(x + 2), y: boundY(y + 2) }), {
                x: startProps.x,
                y: startProps.y,
            }),
        )
        .subscribe(({ x, y }) => {
            rect.setAttribute("x", String(x));
            rect.setAttribute("y", String(y));
        });
}

/*****************************************************************
 * Exercise 3
 *
 * Copy down your code from the previous exercise.
 *
 * Instead of having the rectangle just be bounded by the edges,
 * we now also want it to bounce. That is, if the rectangle hits
 * the edge, it should be reflected in the opposite direction.
 *
 * Some additional types have been provided for you to use.
 *
 * /Hint/: Bouncing off the edge is the same as reversing the
 *  direction.
 *
 * /Hint 2/: The direction of the rectangle is now dynamic. What
 *  happens if we also store it in the state?
 *
 * /Hint 3/: State object ICB0eXBlIFN0YXRlID0gUmVhZG9ubHk8ewogICAgeDogbnVtYmVyOyAvLyBzdmcgeCBjb29yZAogICAgeTogbnVtYmVyOyAvLyBzdmcgeSBjb29yZAogICAgZHg6IG51bWJlcjsgLy8gY2hhbmdlIGluIHggcGVyIHRpbWUgc3RlcAogICAgZHk6IG51bWJlcjsgLy8gY2hhbmdlIGluIHkgcGVyIHRpbWUgc3RlcAogIH0+Ow==
 */
function controllableScreenSaver3() {
    const rect = initialiseRect(startProps, "screensaver3");

    /** Write your code after here */

    /** Parameters of the rectangle we want to keep track of */
    type State = Readonly<{
        x: number; // svg x coord
        y: number; // svg y coord
        dx: number; // change in x per time step
        dy: number; // change in y per time step
    }>;

    /** Observables for tick rate (used to animate the rectangle) */

    const source$ = interval(10);

    /** Create helper functions for our scan accumulator */

    /**
     * Update the state to move the rectangle.
     */
    const tick = ({ x, y, dx, dy }: State): State => ({
        x: x + dx,
        y: y + dy,
        dx,
        dy,
    });

    /**
     * Updates the state to ensure the rectangle stays within
     * the x-axis bounds. Will reflect the rectangle in the x-axis if
     * it was out of bounds.
     */
    const boundX = (state: State): State => {
        const { x, dx, ...rest } = state;

        if (x < 0) {
            return { x: 0, dx: -dx, ...rest };
        }
        if (x + startProps.width > SVG_WIDTH) {
            return { x: SVG_WIDTH - startProps.width, dx: -dx, ...rest };
        }

        return state;
    };

    /**
     * Updates the state to ensure the rectangle stays within
     * the y-axis bounds. Will reflect the rectangle in the y-axis if
     * it was out of bounds.
     */
    const boundY = (state: State): State => {
        const { y, dy, ...rest } = state;

        if (y < 0) {
            return { y: 0, dy: -dy, ...rest };
        }
        if (y + startProps.height > SVG_HEIGHT) {
            return { y: SVG_HEIGHT - startProps.height, dy: -dy, ...rest };
        }

        return state;
    };

    const startState: State = {
        x: startProps.x,
        y: startProps.y,
        dx: 2,
        dy: 2,
    };

    source$
        .pipe(
            scan((state, _) => {
                const newState = tick(state);
                return boundX(boundY(newState));
            }, startState),
        )
        .subscribe(({ x, y }) => {
            rect.setAttribute("x", String(x));
            rect.setAttribute("y", String(y));
        });
}

/*****************************************************************
 * Exercise 4
 *
 * Now with user input. Put it all together!
 *
 * Create a controllable screen saver:
 * - Rectangle moves diagonally across the screen
 * - If it hits an edge, it is reflected
 * - Use the keyboard to change the direction
 *
 *
 *
 * The purpose of this exercise is to demonstrate one particular
 * way to think about this problem and create a solution. Feel free
 * to modify the code as you see fit.
 *
 * Previously, we have built the pipeline "bottom-up", starting
 * with smaller functions and combining them together.
 *
 * This time, we will build the pipeline "top-down", which can be
 * useful when we know what we want to achieve, but the details are
 * not particularly clear.
 *
 * The idea will be implement our high level functions and delegate
 * as much as possible to smaller functions that we will implement
 * later (this is only possible if we specify our types correctly!)
 *
 *
 *
 * It is recommended to follow the outline in this order:
 *
 *  1. Look at and understand the custom types
 *    - Consider why these types may be useful
 *
 *  2. Implement the Observables we will use, and map them to the
 *  corresponding types
 *    2a. Keyboard inputs
 *    2b. Ticker
 *
 *  3. Look at the main Observable pipeline
 *    - Identify where we do pure stream processing, and where side
 *      effects should be contained
 *    - Ensure we understand what the pipeline suggests
 *    - If you are not sure, ask your tutor!
 *
 *  4. Implement the `checkBounds` function
 *
 *    - You can test it works by setting the start position
 *      of the rectangle outside the bounds
 *
 *    - What could be some useful helper functions to implement this?
 *      Have we seen similar functions before?
 *
 *  5. Implement the `processEvent` function
 *
 *    - Remember we only want our functions to do one thing, and
 *      delegate everything else to another function
 *
 *    - `processEvent` is responsible for matching event to behaviour
 *
 *    - Can we delegate processing particular types of data to
 *      different functions?
 */
function controllableScreenSaverFinal() {
    const rect = initialiseRect(startProps, "screensaverfinal");

    /** Custom types */

    /** Possible input directions */
    type Direction = "left" | "up" | "right" | "down";

    /** Event that represents an input */
    class InputEvent {
        constructor(public readonly direction: Direction) {}
    }

    /** Event that represents a tick to update the rectangle position */
    class TickEvent {
        constructor() {}
    }

    /** Parameters of the rectangle we want to keep track of */
    type State = Readonly<{
        x: number; // svg x coord
        y: number; // svg y coord
        dx: number; // change in x per time step
        dy: number; // change in y per time step
    }>;

    /** Write your code after here */

    /** Observables for handling keyboard input */

    const key$ = fromEvent<KeyboardEvent>(document, "keydown");

    /**
     * /Hint/: We want a clean, well abstracted way of identifying
     *  that the values from this stream represent user input, AND
     *  the input data.
     *
     * /Hint 2/: Suggested type VHJ5IHVzaW5nIGEgY2xhc3Mh
     */
    const fromKey = (keyCode: string, direction: Direction) =>
        key$.pipe(
            filter(({ code }) => code === keyCode),
            map(() => new InputEvent(direction)),
        );

    const left$ = fromKey("KeyA", "left");
    const up$ = fromKey("KeyW", "up");
    const right$ = fromKey("KeyD", "right");
    const down$ = fromKey("KeyS", "down");
    const input$ = merge(left$, up$, right$, down$);

    /** Observables for tick rate (used to animate the rectangle) */

    const tick$ = interval(10).pipe(map(() => new TickEvent()));

    /** Source Observable that contains all the data we need to operate on */

    const source$ = merge(input$, tick$);

    /** Main pipeline */

    const startState: State = {
        x: startProps.x,
        y: startProps.y,
        dx: 2,
        dy: 2,
    };

    source$
        .pipe(
            scan((state, event) => {
                const newState = processEvent(event, state);
                return checkBounds(newState);
            }, startState),
        )
        .subscribe(({ x, y }) => {
            rect.setAttribute("x", String(x));
            rect.setAttribute("y", String(y));
        });

    /** Processing state */

    /**
     * Update state based on the event that comes in.
     */
    const processEvent = (
        event: InputEvent | TickEvent,
        state: State,
    ): State => {
        if (event instanceof TickEvent) return tick(state);
        if (event instanceof InputEvent)
            return changeDirection(state, event.direction);

        return state;
    };

    /**
     * Update the state to move the rectangle.
     */
    const tick = ({ x, y, dx, dy }: State): State => ({
        x: x + dx,
        y: y + dy,
        dx,
        dy,
    });

    /**
     * Update the state to change the direction the rectangle
     * is going in.
     */
    const changeDirection = (state: State, direction: Direction): State => {
        switch (direction) {
            case "left":
                return { ...state, dx: -Math.abs(state.dx) };
            case "up":
                return { ...state, dy: -Math.abs(state.dy) };
            case "right":
                return { ...state, dx: Math.abs(state.dx) };
            case "down":
                return { ...state, dy: Math.abs(state.dy) };
        }
    };

    /**
     * Ensure the rectangle is within bounds.
     */
    const checkBounds = (state: State): State => {
        const boundedX = boundX(state);
        const boundedXY = boundY(boundedX);
        return boundedXY;
    };

    /**
     * Updates the state to ensure the rectangle stays within
     * the x-axis bounds. Will reflect the rectangle in the x-axis if
     * it was out of bounds.
     */
    const boundX = (state: State): State => {
        const { x, dx, ...rest } = state;

        if (x < 0) {
            return { x: 0, dx: -dx, ...rest };
        }
        if (x + startProps.width > SVG_WIDTH) {
            return { x: SVG_WIDTH - startProps.width, dx: -dx, ...rest };
        }

        return state;
    };

    /**
     * Updates the state to ensure the rectangle stays within
     * the y-axis bounds. Will reflect the rectangle in the y-axis if
     * it was out of bounds.
     */
    const boundY = (state: State): State => {
        const { y, dy, ...rest } = state;

        if (y < 0) {
            return { y: 0, dy: -dy, ...rest };
        }
        if (y + startProps.height > SVG_HEIGHT) {
            return { y: SVG_HEIGHT - startProps.height, dy: -dy, ...rest };
        }

        return state;
    };
}

/**
 * Do Not Modify
 */
document.addEventListener("DOMContentLoaded", () => {
    controllableScreenSaver1();
    controllableScreenSaver2();
    controllableScreenSaver3();
    // controllableScreenSaver4();

    controllableScreenSaverFinal();
});
