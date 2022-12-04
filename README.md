# Montehall: a Monte Carlo machine for the Monty Hall problem

[![Build and test](https://github.com/oboukli/montehall/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/oboukli/montehall/actions/workflows/build-and-test.yml)
[![Azure Pipelines build status](https://dev.azure.com/omarboukli/montehall/_apis/build/status/oboukli.montehall?branchName=main)](https://dev.azure.com/omarboukli/montehall/_build/latest?definitionId=1&branchName=main)
[![CodeQL](https://github.com/oboukli/montehall/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/oboukli/montehall/actions/workflows/codeql-analysis.yml?query=branch%3Amain)
[![Known vulnerabilities](https://snyk.io/test/github/oboukli/montehall/badge.svg)](https://snyk.io/test/github/oboukli/montehall)

[![Code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

An over-engineered CLI app, and an experiment with TypeScript/JavaScript (ECMAScript)
aimed at:

1. Creating a simulation of the famous counterintuitive [Monty Hall problem](https://en.wikipedia.org/wiki/Monty_Hall_problem)
2. Solving the strategy problem with [Monte Carlo methods](https://en.wikipedia.org/wiki/Monte_Carlo_method)
3. Producing fairly readable code and Node.js solution suitable
   for a best practice tutorial.

Inspired by a Numberphile [video](https://www.youtube.com/watch?v=4Lb-6rxZxx0).

[![Monty Hall Problem - Numberphile](https://img.youtube.com/vi/4Lb-6rxZxx0/0.jpg)
](https://www.youtube.com/watch?v=4Lb-6rxZxx0)

## Setup

Node.js (version v16.x, or higher) and NPM are required to run the app.

```shell
npm install
```

Or, with Docker and Bash

```bash
docker pull node
docker run --rm -v $(pwd):/src --workdir="/src" node npm install
```

## Running the CLI app

Running the default simulation with a player that does not switch:

```shell
npm run montehall
```

or, with Docker and Bash

```bash
docker run --rm -v $(pwd):/src --workdir="/src" node npm run montehall
```

The player should win 1/3 of the games, given a sufficiently large number
of random game attempts. However, a prudent, or "wise," player who switches should
win 2/3 of the games, which can be simulated using the `--wise` option:

```shell
npm run montehall -- --wise
```

A list of available options is accessible from the CLI:

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
[`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function.

### A higher quality randomness source

For a higher quality, but slower, randomness source,use the `--random advanced`
option, which employs a cryptographically secure pseudorandom number
generator (CSPRNG.)

```shell
npm run montehall -- --wise --random advanced
```

### Using pre-generated random numbers (experimental)

A file of (random) numbers can be loaded to run a deterministic simulation.
See source code for details.

## Technical showcases

In alphabetical order:

- Asynchronous programming
- Behavior-driven development (BDD)
- Code test coverage
- Coding without `null`
- Coding without classes
- Command line interface (CLI)
- Conventional Commits
- ESLint
- Functional programming
- GitHub Actions
- Markdown
- Node.js
- NPM
- Prettier
- TypeScript

## License

This software is released under an [MIT-style license](LICENSE).
Copyright © 2017-2022 Omar Boukli-Hacene.

---

Made for the joy of it 🐻
