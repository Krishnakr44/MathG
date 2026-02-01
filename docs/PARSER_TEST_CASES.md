# MathG — Expression Parser Test Cases

## Valid Input

| Input | Expected | Notes |
|-------|----------|-------|
| `y = x + 2` | evaluate(0)=2, evaluate(1)=3 | Simple linear |
| `y = sin(x)` | evaluate(0)=0, evaluate(π/2)≈1 | Trig |
| `sinx` | evaluate(0)=0 | Teacher-style, no parens |
| `sin x + 1` | evaluate(0)=1 | Space before x |
| `y = 2x` | evaluate(3)=6 | Implicit mult |
| `x^2 + 2*x + 1` | evaluate(0)=1, evaluate(1)=4 | Power |
| `y = tan(x)` | domainInfo.isDefined=false | Asymptotes |
| `y = cosec(x)` | evaluate(0)=undefined | Undefined at 0 |
| `y = sqrt(x)` | evaluate(4)=2 | Square root |
| `y = pi` | evaluate(0)≈π | Constant |
| `y = e` | evaluate(0)≈e | Euler constant |
| `sin2x` | evaluate(π/4)≈sin(π/2) | Teacher shorthand |
| `y = a*sin(x) + b` | evaluate(0, {a:2,b:1})=1 | Parameters |

## Invalid Input

| Input | Expected | Notes |
|-------|----------|-------|
| `` | errors | Empty |
| `y = x + z` | errors | Multiple variables |
| `y = diff(x^2)` | errors | Calculus |
| `eval("1+1")` | errors | Forbidden |
| `sin(x` | errors | Unbalanced parens |
| `y = unknown(x)` | errors | Unsupported function |

## Safe Evaluation

| Expression | x | Expected |
|------------|---|----------|
| `y = 1/x` | 0 | undefined |
| `y = sqrt(x)` | -1 | undefined |
| `y = sin(x)` | NaN | undefined (no throw) |
| `y = sin(x)` | Infinity | undefined (no throw) |

## Domain Info

| Expression | domainInfo.isDefined | domainInfo.reason |
|------------|----------------------|-------------------|
| `y = sin(x)` | true | — |
| `y = tan(x)` | false | asymptotes |
| `y = cosec(x)` | false | asymptotes |
| `y = sqrt(x)` | false | sqrt for x < 0 |
