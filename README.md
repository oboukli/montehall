# Montehall: a Monte Carlo machine for the Monty Hall problem

[![Azure Pipelines build status](https://dev.azure.com/omarboukli/montehall/_apis/build/status/oboukli.montehall?branchName=main)](https://dev.azure.com/omarboukli/montehall/_build/latest?definitionId=1&branchName=main)
[![Known vulnerabilities](https://snyk.io/test/github/oboukli/montehall/badge.svg)](https://snyk.io/test/github/oboukli/montehall)
[![CodeQL](https://github.com/oboukli/montehall/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/oboukli/montehall/actions/workflows/codeql-analysis.yml?query=branch%3Amain)

[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

An over-engineered experiment with TypeScript/JavaScript (ECMAScript 2017+)
aimed at:

1. Creating a simulation of the famous counterintuitive [Monty Hall problem](https://en.wikipedia.org/wiki/Monty_Hall_problem)
2. Solving the strategy problem with [Monte Carlo methods](https://en.wikipedia.org/wiki/Monte_Carlo_method#Definitions)
3. Producing a fairly readable code and Node.js solution suitable
   for a best practice tutorial.

Inspired by a Numberphile [video](https://www.youtube.com/watch?v=4Lb-6rxZxx0).

[![Monty Hall Problem - Numberphile](https://img.youtube.com/vi/4Lb-6rxZxx0/0.jpg)
](https://www.youtube.com/watch?v=4Lb-6rxZxx0)

## Requirements

Node.js (recommended 16.x, or higher.)

## Setup

On Linux, macOS and Windows:

```shell
git clone https://github.com/oboukli/montehall.git
cd montehall
npm install
```

## Running the CLI app

Running the default simulation with a player that does not switch:

```shell
npm run montehall
```

The player should win 1/3 of the games, given a large enough number
of random games (trials). However, a "wise" player who switches should
win 2/3 of the games, which can be simulated using the `--wise` option:

```shell
npm run montehall -- --wise
```

For a full list of available options:

```shell
npm run montehall -- --help
```

## Number of game simulations

The default number of simulated games is 16384.
This can be changed using the `--games` option, or by changing the value for
the `games` key in the `montehall.json` configuration file.

## High-quality results

A randomness source is required to simulate the games. Achieving high-quality
simulation results requires a high-quality randomness source.

The default source of randomness used is a pseudo one: the
[Math.random()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function.

### A higher quality randomness source

For a higher quality, but slower, randomness source,use the `--random advanced`
option, which employs a cryptographically secure pseudorandom number
generator (CSPRNG.)

```shell
npm run montehall -- --wise --random advanced
```

### Using pre-generated random numbers (experimental)

Coming soon.

## License

This software is released under an [MIT-style license](LICENSE).
Copyright © 2017-2022 Omar Boukli-Hacene.

---

Made for the joy of it 🐻
