/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import * as os from "os";

import { Command, Option } from "commander";

import {
  GameSummaryCallback,
  gameSummaryFormatter,
  monteCarloMachine,
  SetupOptions,
  simulationSummaryFormatter,
} from ".";

import { gameSimulatorFactory, rngFactory } from "./cli_util";

const pkgInfo = require("../package.json");
const config = require("../montehall.json");

const VERSION: string = pkgInfo.version;
const DEFAULT_NUM_GAMES = Number(config.games || 0);
let numGames = DEFAULT_NUM_GAMES;
let isWisePlayer = false;

const program = new Command();
program
  .name(pkgInfo.name)
  .description("A Monte Carlo Machine for the Monty Hall Problem")
  .version(VERSION, "-V, --version", "Output version information")
  .helpOption("-h, --help", "Output usage information")
  .option(
    "-g, --games <n>",
    `Number of games (default: ${DEFAULT_NUM_GAMES})`,
    Number
  )
  .addOption(
    new Option("-r, --random [type]", "Random number generator type").choices([
      "basic",
      "advanced",
      "table",
    ])
  )
  .option("-v, --verbose", "Show summary for each game")
  .option("-w, --wise", "Wise player")
  .parse();

const options = program.opts();

if (options.games > 0) {
  numGames = options.games;
}

if (options.wise) {
  isWisePlayer = true;
}

let isDecimalTable = false;
const numTableFileName: string =
  options.tableFile || config.numTableFileName || "";
if (options.random === "table") {
  if (!numTableFileName) {
    process.stdout.write("Random number table file not specified.");
    process.exit(1);
  }
  isDecimalTable = options.decimalTable || config.isDecimalNumTable;
}

const rng = rngFactory(options.random, numTableFileName, isDecimalTable);

let gameSummaryCallback: GameSummaryCallback;
if (options.verbose) {
  gameSummaryCallback = (gameSummary) => {
    const formatter = gameSummaryFormatter(gameSummary, os.EOL);
    process.stdout.write(`${formatter.toString()}${os.EOL}${os.EOL}`);
  };
} else {
  gameSummaryCallback = () => {};
}

const setupOptions: SetupOptions = {
  isPlayerStubborn: !isWisePlayer,
  size: 3,
};

const mcm = monteCarloMachine(
  setupOptions,
  numGames,
  gameSimulatorFactory,
  rng,
  gameSummaryCallback
);

mcm
  .run()
  .then((simulationSummary) => {
    const formatter = simulationSummaryFormatter(
      setupOptions,
      numGames,
      simulationSummary,
      os.EOL
    );
    process.stdout.write(`${formatter.toString()}${os.EOL}`);
  })
  .catch((reason) => {
    process.stdout.write(reason);
  });
