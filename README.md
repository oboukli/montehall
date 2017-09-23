# Montehall: A Monte Carlo Machine for the Monty Hall Problem

[![Build Status](https://travis-ci.org/oboukli/montehall.svg?branch=master)](https://travis-ci.org/oboukli/montehall)

An experiment with TypeScript/JavaScript (ECMAScript 2017) aimed at

1. Creating a simulation of the famous counterintuitive [Monty Hall problem](https://en.wikipedia.org/wiki/Monty_Hall_problem)
1. Solving the strategy problem with [Monte Carlo methods](https://en.wikipedia.org/wiki/Monte_Carlo_method#Definitions)—for the joy of it.
1. Producing fairly readable code and a Node.js solution that are suitable for a best practice tutorial.

Inspired by a Numberphile [video](https://www.youtube.com/watch?v=4Lb-6rxZxx0).

[![Monty Hall Problem - Numberphile](https://img.youtube.com/vi/4Lb-6rxZxx0/0.jpg)
](https://www.youtube.com/watch?v=4Lb-6rxZxx0)

## Requirements

Node.js (8.1 or equivalent.)

Note: the source code was developed and tested on Node.js v8.1 (ES2017). However, the TypeScript transpiler can be configured to target older versions of ECMAScript.

## Setup

On Linux, macOS and Windows:

```
git clone https://github.com/oboukli/montehall.git
cd montehall
npm install
```

## Running the CLI App

Running the default simulation with a player that does not switch:

```
npm run montehall
```

The player should win 1/3 of the games, given a large enough number of random games (trials). However, a "wise" player who switches should win 2/3 of the games, which can be simulated using the ```--wise``` option:

```
npm run montehall -- --wise
```

For a full list of available options:

```
npm run montehall -- --help
```

## Number of Game Simulations

The default number of simulated games is 16384. This can be changed using the ```--games``` option, or by changing the value for the ```games``` key in the ```montehall.json``` configuration file.

## High-Quality Results

A randomness source is required to simulate the games. Achieving high-quality simulation results requires a high-quality randomness source.

The default source of randomness used is a pseudo one: The [Math.random()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) function.

### A Higher Quality Randomness Source

For a higher quality, but slower, randomness source, use the ```--random crypto``` option, which employs a cryptographically secure pseudorandom number generator (CSPRNG.)

```
npm run montehall -- --wise --random crypto
```

### Using Pregenerated Random Numbers (Experimental)

Coming soon.

## License

This software is released under an [MIT-style license](LICENSE). Copyright © 2017 Omar Boukli-Hacene.

---

Made for the joy of it 🐻