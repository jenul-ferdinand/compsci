# FIT2102

Programming paradigms. The languages (JavaScript and TypeScript in the first half) are tools for exploring paradigms, and the unit assesses the paradigms rather than language features. MDN and the TypeScript docs cover the language side.

Course notes: <https://tgdwyer.github.io/> (source: [tgdwyer/tgdwyer.github.io](https://github.com/tgdwyer/tgdwyer.github.io)).

## Assessment

- 2 assignments, 30% each. A1 releases Week 3 and is due end of Week 6. A2 releases Week 9 and is due end of Week 12.
- 4 quizzes, 5% each. Scheduled for weeks 3, 5, 9, and 12, paper based, at the start of the workshop in those weeks. Not a hurdle.
- Applied classes, 20% total: 11 classes, best 10 count at 2% each, so one week can be missed for free.

## Applied classes

- Group work is encouraged, but marking and interviews are individual. Understand everything you submit.
- Exercises are due just before the next week's class. Interviews start Week 2 and cover the previous week's submission; they exist to check you understand your own code. Submitting nothing beats submitting code you can't explain.
- Full marks need a genuine attempt at each question, not passing test cases. Don't sink hours into failing tests.
- No short extensions for applied exercises or quizzes. The best-10 rule is the buffer.

## Submission

One zip per week to Moodle. Delete `node_modules/` before zipping (the submission gets rejected as too large otherwise; `npm install` brings it back). Keep `package.json` and `package-lock.json`. The work itself lives in `src/main.js`.

## Workshops

Interactive exercises supporting the weekly exercises and assignments. They assume the lecture videos and readings are done beforehand.

## Syllabus

1. Introduction to Functional Programming in JavaScript
2. TypeScript and Functional Programming Techniques
3. Functional Reactive Programming in JavaScript
4. Building Interactive Programs with Functional Reactive Programming
5. Exploring Lambda Calculus and Combinators
6. Introduction to Haskell
7. Exploring Haskell: Typeclasses and Data Types
8. Functors and Applicatives in Haskell
9. Exploring Folds and Traversables in Haskell
10. Effectful Programming with Monads and IO in Haskell
11. Parser Combinators in Haskell
12. Emerging Paradigms and Constraint Programming with MiniZinc

The first half is JavaScript and TypeScript, the second half Haskell. Week 12 moves to MiniZinc, which the course notes do not cover.

## Layout

- `wkXX/`: one folder per week with `OVERVIEW.md` (learning objectives and course notes readings) and `tuteXX/` (applied exercise project).
