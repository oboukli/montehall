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
3. Creating a simulation of a general Montehall Problem with $n$ number of doors
4. Producing fairly readable code and Node.js solution suitable
   for a pretty good practice tutorial.

Inspired by a [Numberphile video](https://www.youtube.com/watch?v=4Lb-6rxZxx0).

[![Monty Hall Problem - Numberphile](https://img.youtube.com/vi/4Lb-6rxZxx0/0.jpg)
](https://www.youtube.com/watch?v=4Lb-6rxZxx0)

## Setup

Node.js (latest v16.x, or higher) and NPM (v9.x) are required to run the app:

```shell
npm install
npm run build
```

Or, using Docker and Bash (recommended)

```bash
docker pull node
docker run --rm --volume=$(pwd):/src --workdir="/src" node npm install
docker run --rm --volume=$(pwd):/src --workdir="/src" node npm run build
```

## Running the CLI app

Running the default simulation with a player that does not switch:

```shell
npx montehall
```

or, with Docker and Bash

```bash
docker run --rm --volume="$(pwd):/src" --workdir="/src" node npx montehall
```

A player who does not switches their door pick should statistically win 1/3
of the games, given a sufficiently large number of random game attempts.
However, a prudent, or "wise," player who switches pick should win 2/3
of the games, which can be simulated using the `--wise` option:

```shell
npx montehall --wise
```

A list of available options is accessible from the CLI:

```shell
npx montehall --help
```

## Number of game simulations

The default number of simulated games is 16384.
This can be changed using the `--games` option, or by changing the value for
the `games` key in the `config.json` configuration file.

## General Monte Hall problem

A standard (default) game has three doors. A general game has $n$ doors.

The CLI option `--doors <number>` can be used to specify the number of doors.

Examples:

```shell
npx montehall --doors 100
npx montehall --doors 181 --games 1000 --wise
```

## High-quality results

A randomness source is required to simulate the games. Achieving high-quality
simulation results requires a high-quality randomness source.

The default source of randomness used is a fast pseudo one: the
[`Math.random()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
function.

### A higher quality randomness source

For a higher quality, but slower, randomness source,
use the `--random advanced` option, which employs a cryptographically
secure pseudorandom number generator (CSPRNG.)

```shell
npx montehall --wise --random advanced
```

### Using pre-generated random numbers (experimental)

A text file of numbers (random positive integers) can be loaded to run
a deterministic simulation.

The file path can be passed as a CLI option:

```shell
npx montehall --games 100 --table-file vendor/numbers.txt
```

Or, alternatively, the file path can be configured in `config.json`.

Example:

```json
{
  "numbersFilePath": "./data/numbers.txt"
}
```

```shell
npx montehall --games 100 --random table
```

The file must have one number per text line. Example:

```text
1
1
0
1
2
1
0
```

See `vendor/numbers.txt` for a sample file.

## Technical showcases

Partial list of showcases, in alphabetical order:

- Asynchronous programming
- Azure Pipelines
- Behavior-driven development (BDD)
- Coding without `null`
- Coding without classes
- Command line interface (CLI)
- Commander.js
- Conventional Commits
- Distribution package clean of development dependencies
- ECMAScript Modules
- ESLint
- Functional programming
- GitHub Actions
- High code test coverage
- Markdown
- Node.js
- NPM
- Prettier
- SonarScanner
- Strict static rules and type safety
- Symantec versioning
- TypeScript
- Unbiased pseudo-randomness
- Unit testing with Jest (and Jasmine)

## License

This software is released under an [MIT-style license](LICENSE).
Copyright © 2017-2023 Omar Boukli-Hacene.

---

Made for the joy of it 🐻
