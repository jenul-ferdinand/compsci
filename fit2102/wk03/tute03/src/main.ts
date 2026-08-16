/**
 * Please have a look at the README file before attempting these exercises.
 *
 * You must make all the tests pass, indicated by a green ✓, and
 * follow all the instructions given in the code file for each exercise.
 *
 * The code must compile with no TypeScript warnings or errors.
 *
 * * Must use Observables and Observable operators. Using `addEventListener`
 * * or similar will result in 0 marks unless explicitly required.
 *
 * Marks are only awarded for correct understanding of the question
 * and demonstration of concepts.
 *
 * Completing the tasks with correctly compiling code does not guarantee
 * full marks.
 *
 * Make sure yo u understand the question and your solution.
 *
 * Ask a tutor if in doubt!
 *
 * **There are hints throughout these exercises encoded in base64.**
 * You can use online tools such as https://www.base64decode.org/
 * to decode them.
 *
 * **Reminders**
 *
 * You must **not** use for-loops, while-loops, or similar imperative
 * techniques in these exercises unless explicitly approved, required,
 * or provided.
 *
 * * All code outside of the `subscribe` callback must be pure and
 * * values immutable.
 *
 * This means declaring variables with `const`, using `Readonly` and
 * `... as const` to ensure immutable types, and avoiding using mutating
 * methods such as `Array.prototype.push()`.
 *
 * * Code inside the `subscribe` may have side effects (e.g. updating DOM), but
 * * **must not** mutate values.
 */

import "./style.css";

import { fromFetch } from "rxjs/fetch";

import {
    concat,
    concatMap,
    delay,
    filter,
    fromEvent,
    interval,
    map,
    merge,
    mergeMap,
    of,
    scan,
    switchMap,
    takeUntil,
    timer,
    zip,
    partition,
    type Observable,
} from "rxjs";

// Stub value to indicate an implementation
const IMPLEMENT_THIS: any = undefined;
type IMPLEMENT_THIS = any;

type RectProps = Readonly<{
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
}>;

/**
 * Where a rectangle sits, used as the accumulated state in Exercises 3 and 4.
 *
 * Readonly makes TypeScript reject `pos.x = 5`, so the scan callbacks have to
 * build a new object instead of editing the one they were handed.
 */
type Position = Readonly<{
    x: number;
    y: number;
}>;

const SVG_WIDTH = 600;
const SVG_HEIGHT = 600;

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
 * Display the mouse cursor position.
 *
 * Iff the x value is > 400, attach the "highlight" class.
 *
 * Parts of the implementation have been filled in for you.
 *
 * see: https://tgdwyer.github.io/functionalreactiveprogramming/#a-user-interface-example
 */

/**
 * An example of traditional event driven programming style - this is what we are
 * replacing with observable.
 * The following adds a listener for the mouse event handler,
 * sets p and adds or removes a highlight depending on x position
 */
function mousePosEvents() {
    const pos = document.getElementById("pos_event")!;

    document.addEventListener("mousemove", ({ clientX, clientY }) => {
        const p = clientX + ", " + clientY;
        pos.textContent = p;
        if (clientX > 400) {
            pos.classList.add("highlight");
        } else {
            pos.classList.remove("highlight");
        }
    });
}

/**
 * Reimplement mousePosEvents using observables.
 */
function mousePosObservable() {
    // The ! tells TypeScript this is a non-null value
    const elem = document.getElementById("pos_obs")!;

    /** Write your code after here */

    // fromEvent wraps the same DOM event the version above listens to, but
    // hands back a stream of MouseEvents instead of taking a callback. Nothing
    // runs until someone subscribes: the observable is a description of the
    // events, not the events themselves.
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
    const source$ = fromEvent<MouseEvent>(document, "mousemove");

    source$
        // Everything in the pipe stays pure. map turns a MouseEvent into a
        // plain object saying what the page should show, and reads no DOM and
        // writes no DOM. I can test this half by feeding it fake events.
        .pipe(
            map(({ clientX, clientY }) => ({
                text: `${clientX}, ${clientY}`,
                highlight: clientX > 400,
            })),
        )
        // subscribe is the only place allowed to touch the outside world. The
        // if/else in mousePosEvents lives here as one toggle call, because the
        // decision (clientX > 400) already happened upstream in map.
        .subscribe(({ text, highlight }) => {
            elem.textContent = text;
            // Passing a boolean second argument makes toggle add the class when
            // true and remove it when false, so no branch is needed.
            elem.classList.toggle("highlight", highlight);
        });
}

/*****************************************************************
 * Exercise 2
 *
 * Demonstrates the interval method.
 *
 * Animate a rectangle that moves in the x direction and stops.
 *
 * We want to choose an interval so the rectangle animates smoothly
 * and terminates after 1 second (1000 milliseconds).
 *
 * Do NOT use Element.getAttribute as that is using the DOM to store
 * state. Impure accumulation of state will result in 0 marks.
 *
 * Parts of the implementation have been filled in for you.
 *
 * /Hint/: Have a look through the operators we covered in the
 *  readings.
 *
 * see: https://tgdwyer.github.io/functionalreactiveprogramming/#observable-cheatsheet
 */

function animatedRect() {
    const rect = initialiseRect(startProps, "animatedRect");

    /** Write your code after here */

    // interval(10) emits 0, 1, 2, ... every 10ms, giving 100 frames a second.
    // The emitted number counts ticks and says nothing about position, so the
    // pipe below converts ticks into x values.
    const source$ = interval(10);

    const move$ = source$
        .pipe(
            // takeUntil watches a second observable and completes this one as
            // soon as that observable emits. timer(1000) emits once at 1s, so
            // the animation stops after 100 ticks. The deadline counts from
            // when I subscribe, not from the last tick.
            takeUntil(timer(1000)),

            // scan is reduce for streams: it holds an accumulator across
            // emissions and emits the new accumulator each time. Here the
            // accumulator is x, seeded at startProps.x, and each tick adds 1.
            // Storing x here is what keeps the function pure. Reading it back
            // with getAttribute would make the DOM the source of truth and
            // make the same tick produce different results.
            scan((x: number) => x + 1, startProps.x),
        )
        // Rendering is the only side effect, and it happens after the state
        // has already been decided upstream.
        .subscribe((newX: number) => rect.setAttribute("x", String(newX)));
}

/*****************************************************************
 * Exercise 3
 *
 * Keeping track of multi-value state.
 *
 * Animate the rectangle so that it moves diagonally down-right
 * for 1.41s.
 *
 * Do NOT use Element.getAttribute as that is using the DOM to store
 * state. Impure accumulation of state will result in 0 marks.
 *
 * /Hint/: How did we keep track of the x value in Exercise 2?
 *
 * /Hint 2/: What can we use to store more than 1 value?
 *
 * see: https://tgdwyer.github.io/functionalreactiveprogramming/#observable-streams
 */
function animatedRect2() {
    const rect = initialiseRect(startProps, "animatedRect2");

    /** Write your code after here */

    const moveDownRight$ = interval(10)
        .pipe(
            // Stop taking values after some amount of time. 1.41s at 10ms per
            // tick gives 141 ticks, so the rectangle travels 141px on each
            // axis. That diagonal measures 141 * sqrt(2) = 200px, which is the
            // distance Exercise 2 covered along x alone.
            takeUntil(timer(1410)),

            // Exercise 2 accumulated a single number. Two coordinates need to
            // move together, so the accumulator becomes one Position object
            // holding both. scan still runs once per tick, and the callback
            // builds a new object rather than editing the old one, which keeps
            // every emitted Position immutable.
            scan(({ x, y }: Position) => ({ x: x + 1, y: y + 1 }), {
                x: startProps.x,
                y: startProps.y,
            }),
        )
        // Both attributes come from the same Position, so x and y can never
        // drift out of sync.
        .subscribe(({ x, y }: Position) => {
            rect.setAttribute("x", String(x));
            rect.setAttribute("y", String(y));
        });
}

/*****************************************************************
 * Exercise 4
 *
 * Create and control a rectangle using the keyboard!
 *
 *
 * /Challenge/: Try to make the rectangle move smoothly! This may
 *  require some research and changing the way we implement movement.
 */
/** How far one keypress moves the rectangle, in pixels */
const STEP = 10;

/**
 * A keypress described as a change to one axis of the position.
 *
 * The four keys differ only in which axis they touch and by how much, so one
 * type covers all of them and the scan below stays a single expression. Typing
 * axis as `keyof Position` rather than `string` means TypeScript rejects a
 * typo like `{ axis: "z" }` at compile time.
 */
type Move = Readonly<{
    axis: keyof Position;
    amount: number;
}>;

function keyboardControl() {
    const rect = initialiseRect(startProps, "moveableRect");

    /** Write your code after here */

    const key$ = fromEvent<KeyboardEvent>(document, "keydown");

    /**
     * Create an observable for a particular keypress.
     *
     * Reference for KeyBoard events https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
     *
     * One keydown stream feeds all four keys. filter drops the events for other
     * keys, then map replaces the KeyboardEvent with the Move it stands for.
     * After that map, nothing downstream knows or cares that a keyboard was
     * involved, which is why the same scan would work for buttons or a gamepad.
     *
     * @param keyCode value of KeyboardEvent.code, e.g. "KeyA"
     * @param move the change in state this key represents
     * @returns Observable stream that indicates changes in state for
     *  the particular keypress
     */
    const fromKey = (keyCode: string, move: Move): Observable<Move> =>
        key$.pipe(
            filter(({ code }) => code === keyCode),
            map(() => move),
        );

    /**
     * /Hint/: QW4gb2JqZWN0IGxpa2UgeyBheGlzOiAneCcgfCAneScsIGFtb3VudDogbnVtYmVyIH0gY2FuIGJlIHVzZWQgdG8gcmVwcmVzZW50IGEgcGFydGljdWxhciBrZXlwcmVzcywgZS5nLiBQcmVzc2luZyBLZXlBIG1pZ2h0IHByb2R1Y2UgeyBheGlzOiAneCcsIGFtb3VudDogLTEwIH0=
     */

    /** Decrease x */
    const left$ = fromKey("KeyA", { axis: "x", amount: -STEP });
    /** Decrease y */
    const up$ = fromKey("KeyW", { axis: "y", amount: -STEP });
    /** Increase x */
    const right$ = fromKey("KeyD", { axis: "x", amount: STEP });
    /** Increase y */
    const down$ = fromKey("KeyS", { axis: "y", amount: STEP });

    /**
     * /Hint/: What operator can we use to merge observables?
     *         Have a look through the operators we covered in the
     *         readings.
     *
     * /Hint 2/: This should make use of the scan function
     */

    // merge subscribes to all four streams and forwards whatever any of them
    // emits, in the order the keys were pressed. That collapses four
    // sources into one stream of Moves, so a single scan can own the position.
    merge(left$, down$, up$, right$)
        .pipe(
            // Same scan as Exercises 2 and 3, except the ticks now come from
            // the user instead of a timer. The computed key [axis] picks which
            // field to change, and the spread copies the other one, so each
            // emission is a fresh Position and the previous one survives
            // untouched.
            scan(
                (pos: Position, { axis, amount }: Move): Position => ({
                    ...pos,
                    [axis]: pos[axis] + amount,
                }),
                { x: startProps.x, y: startProps.y },
            ),
        )
        .subscribe(({ x, y }: Position) => {
            rect.setAttribute("x", String(x));
            rect.setAttribute("y", String(y));
        });
}

/*****************************************************************
 * Exercise 5
 *
 * Add some code which looks at the data.csv file
 * This code shall console.log a string (second column)
 * after a specified delay (first column)
 *
 * You must use observables for this, and do not use setTimeout.
 *
 * The expected order of the output in the developer console would be:
 * apple (after 1 second)
 * cherry (after another second, two in total)
 * banana (after another second, three in total)
 * another banana (after seven more seconds, 10 in total)
 *
 * This does not match up with the order from the csv, as the delays
 * are absolute from starting the stream
 *
 * WARNING: This question is a step up in difficulty compared to previous,
 * and is heavily related to your assignment in idea.
 *
 * This question will likely be a challenge, and may require reading some
 * documentation for possible ideas.
 *
 * The teaching team will not provide too many tips, apart from clarifying the
 * question. Try to explore ideas on how you could approach this.
 *
 * If you cannot complete the question, leave a comment explaining what you
 * tried, and you will get full marks.
 */

function printWithDelay() {
    // This fetches the csv from your computer and converts it to a string
    const { protocol, hostname, port } = new URL(import.meta.url);
    const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}`;

    const csvText$ = fromFetch(`${baseUrl}/src/data.csv`).pipe(
        switchMap(response => {
            if (!response.ok) throw new Error("Failed to fetch CSV");
            return response.text();
        }),
    );

    /** Write your code after here */

    // csvText$ emits one value, the whole file as a string, then completes. The
    // work is turning that single string into four values spread across ten
    // seconds, which is the same shape as the assignment: parse a file into
    // events, then place those events on a timeline.
    csvText$
        .pipe(
            // Parse only. "1,apple\n3,banana\n..." becomes
            // [{delayMs: 1000, fruit: "apple"}, {delayMs: 3000, ...}, ...].
            // trim drops the missing trailing newline, and \r?\n covers a file
            // saved on Windows. No timing decisions happen here.
            map(text =>
                text
                    .trim()
                    .split(/\r?\n/)
                    .map(line => {
                        const [seconds, fruit] = line.split(",");
                        return {
                            delayMs: Number(seconds) * 1000,
                            fruit,
                        } as const;
                    }),
            ),

            // This is the part worth explaining. Each row turns into its own
            // observable: of(fruit) emits once, and delay holds that emission
            // back by the row's own time. merge subscribes to all four at the
            // same moment, so all four clocks start together and each fires at
            // its own absolute offset. The stream sorts itself by time, which
            // is why cherry (2s, row 3) arrives before banana (3s, row 2).
            //
            // concat or concatMap would wait for each observable to complete
            // before starting the next, adding the delays up to 1 + 3 + 2 + 10
            // = 16s and keeping the file's order. That is the wrong reading of
            // the question. mergeMap flattens the array of observables into
            // the outer stream without imposing any order.
            mergeMap(rows =>
                merge(
                    ...rows.map(({ delayMs, fruit }) =>
                        of(fruit).pipe(delay(delayMs)),
                    ),
                ),
            ),
        )
        // Logging is the side effect, and the pipe above decided both what to
        // print and when.
        .subscribe(fruit => console.log(fruit));
}
/**
 * Do Not Modify
 */
document.addEventListener("DOMContentLoaded", () => {
    mousePosEvents();
    mousePosObservable();

    animatedRect();
    animatedRect2();

    keyboardControl();
    printWithDelay();
});
