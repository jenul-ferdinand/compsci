import { describe, expect, it } from "vitest";
import { fromThree, getNth, goldenRatioApproximations, map, scan } from "../src/sequence";

describe("Lazy sequences", () => {
    it("map lazily applies a function over every element of a sequence", () => {
        const doubled = map(x => 2 * x, fromThree);
        expect(getNth(1, doubled)).toBe(6);
        expect(getNth(3, doubled)).toBe(10);
    });

    it("goldenRatioApproximations converges to the golden ratio (~1.618034)", () => {
        expect(getNth(100, goldenRatioApproximations)).toBeCloseTo(
            1.618033988749895,
            10,
        );
    });

});

describe("Scan", () => {
    it("scan exposes every intermediate result", () => {
      const runningProduct = scan((total, n) => total * n, fromThree, 1);
      expect(getNth(1, runningProduct)).toBe(3);
      expect(getNth(2, runningProduct)).toBe(12);
      expect(getNth(4, runningProduct)).toBe(360);
    });
});
