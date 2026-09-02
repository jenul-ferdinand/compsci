# Week 5 - Lambda Calculus

Notation: `λxy.x` is shorthand for `λx.λy.x`.

## Exercise 1: I-Combinator

What is it, why use it, and `x => x` in lambda calculus:

x => x ≡ λx.x is the identity for composition. 

In JS
```js
const compose = f => g => x => f(g(x));
```
And we know it's the identity because
```
compose(f, I) = x => f(I(x)) = x => f(x) = f
compose(I, f) = x => I(f(x)) = x => f(x) = f
```
The identity when applied to anything just disappears, because when we substitute an argument for x in the body x, it's just the argument.

The reason it's a combinator is because there are no free variables, x is bound by it's own λ.

## Exercise 2: Alpha equivalence

Alpha equivalence means consistently renaming a *bound* variable throughout its own scope. Free variables can't be touched, and a rename that turns a free variable into a bound one (capture) is not allowed.

1. Alpha equivalent to `λx.x`:
   - a. `λx.y`
   - b. `λa.a`
   - c. `λz.x`

   Answer: b

2. Alpha equivalent to `λxy.yx`:
   - a. `λaz.az`
   - b. `λa.(λb.ba)`
   - c. `λaz.ba`

   Answer: b, λxy.yx = λx.λy.yx = λx.(λy.yx)
                                = λa.(λb.ba)

3. Alpha equivalent to `λxy.xz`:
   - a. `λxz.xz`
   - b. `λmn.mz`
   - c. `λz.(λx.xz)`

   Answer: b, λxy.xz
              λmn.mz, where x-m y-n, z-z

## Exercise 3: Beta normal form or divergence?

1. `(λx.x)y`

- binder: x, body: x, argument: y
- y is a plain variable so nothing to do
- taking the body x
- swap with argument y
- so you get x -> y

This is normal form.

2. `λx.xx` beta normal form, no redex.

3. `(λz.zz)(λy.yy)`

- binder: z, body: zz, argument: (λy.yy)
- swap every z in the body for (λy.yy)
- (λy.yy)(λy.yy)
- that's a redex again: binder y, body yy, argument (λy.yy)
- (λy.yy)(λy.yy)

We're back to exactly where we started, so this never settles. This diverges (it's Ω, the classic looping term).

4. `(λx.xx)y`

- binder: x, body: xx, argument: y
- swap every x in the body for y
- yy

y is a free variable, not a lambda, so `yy` has no redex to reduce.

This is normal form.

## Exercise 4: Beta reduction

1. `(λy.zy)a`

- binder: y, body: zy, argument: a
- swap y for a
- za

2. `(λx.x)(λx.x)`

- alpha rename the argument first so the two x's don't get confused: (λx.x)(λa.a)
- binder: x, body: x, argument: (λa.a)
- swap x for (λa.a)
- λa.a

Applying I to I just gives you I back, which is what you'd expect from identity.

3. `(λx.xy)(λx.xx)`

- binder: x, body: xy, argument: (λx.xx)
- swap x for (λx.xx)
- (λx.xx)y
- redex again: binder x, body xx, argument y
- yy

4. `(λz.z)(λa.aa)(λz.zb)`

Application is left-associative, so this is ((λz.z)(λa.aa))(λz.zb).

- (λz.z)(λa.aa) → λa.aa
- now (λa.aa)(λz.zb): swap a for (λz.zb) → (λz.zb)(λz.zb)
- alpha rename the argument: (λz.zb)(λw.wb)
- swap z for (λw.wb) in zb → (λw.wb)b
- swap w for b in wb → bb

## Exercise 5: Eta conversion

Eta says λx.f x ≡ f, as long as x isn't free in f. The lambda is just passing its argument straight through, so it's doing nothing.

1. `λx.zx`

The body is z applied to x, and x isn't free in z, so the wrapper is pointless.

→ `z`

2. `λx.xz`

Can't eta reduce. x is in the function position, not the argument position, so it doesn't match the λx.f x shape.

Already as simple as it gets.

3. `(λx.bx)(λy.ay)`

Eta reduce both sides:
- λx.bx → b
- λy.ay → a

→ `ba`

## Exercise 6: Which are combinators?

A combinator is a lambda expression with no free variables, every variable in the body is bound by some λ.

1. `λx.xxx`: yes. x is bound by its own λ.
2. `λxy.zx`: no. z is free, nothing binds it.
3. `λxyz.xy(zx)`: yes. x, y, z are all bound by the three λs.
4. `λxyz.xy(zxy)`: yes. Same three binders, still nothing free.

## Exercise 7: Y-Combinator application

`Y = λf.(λx.f(xx))(λx.f(xx))`, reduce `Y g`:

- binder: f, body: (λx.f(xx))(λx.f(xx)), argument: g
- swap every f for g
- (λx.g(xx))(λx.g(xx))
- that's a redex: binder x, body g(xx), argument (λx.g(xx))
- swap every x in g(xx) for (λx.g(xx))
- g((λx.g(xx))(λx.g(xx)))

But `(λx.g(xx))(λx.g(xx))` is exactly what `Y g` reduced to in step 3, so:

```
Y g = g(Y g)
    = g(g(Y g))
    = g(g(g(Y g)))
    = ...
```

It never reaches normal form, it keeps peeling off another g forever. That's the point: g gets handed a copy of itself as an argument, which is how an anonymous function gets to recurse without ever having a name to call.

## Exercise 8: Church encoding

```
TRUE  = λxy. x
FALSE = λxy. y
IF    = λbtf. b t f
AND   = λxy. IF x y FALSE
OR    = λxy. IF x TRUE y
NOT   = λx.  IF x FALSE TRUE
```

The trick is that TRUE and FALSE are the selectors themselves. TRUE picks its first argument, FALSE picks its second, so IF doesn't need to inspect anything, it just applies the boolean to the two branches.

1. `NOT FALSE` (should be TRUE)

```
NOT FALSE = (λx. IF x FALSE TRUE) FALSE
          = IF FALSE FALSE TRUE
          = (λbtf. b t f) FALSE FALSE TRUE
          = FALSE FALSE TRUE
          = (λxy. y) FALSE TRUE
          = TRUE
```

2. `OR TRUE FALSE` (should be TRUE)

```
OR TRUE FALSE = (λxy. IF x TRUE y) TRUE FALSE
              = IF TRUE TRUE FALSE
              = (λbtf. b t f) TRUE TRUE FALSE
              = TRUE TRUE FALSE
              = (λxy. x) TRUE FALSE
              = TRUE
```

OR short circuits: once x is TRUE it hands back TRUE without ever looking at y.

3. `AND TRUE TRUE` (should be TRUE)

```
AND TRUE TRUE = (λxy. IF x y FALSE) TRUE TRUE
              = IF TRUE TRUE FALSE
              = (λbtf. b t f) TRUE TRUE FALSE
              = TRUE TRUE FALSE
              = (λxy. x) TRUE FALSE
              = TRUE
```

## Exercise 9: Lambda expressions to JS arrow functions

Each λ is one arrow, one argument, so `λxy.x` is `λx.λy.x` is two nested arrows.

1. `λxy.x`

```js
const K = x => y => x;
```

This is the K-combinator, same thing as TRUE above.

2. `λfx.f(f x)`

```js
const twice = f => x => f(f(x));
```

Church numeral 2, applies f to x twice.

3. `λf.λg.λx.f(g x)`

```js
const compose = f => g => x => f(g(x));
```

Function composition, the same `compose` from Exercise 1.
