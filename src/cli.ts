/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import * as program from "commander";
import * as os from "os";

import {
  GameSummaryCallback,
  gameSummaryFormatter,
  monteCarloMachine,
  SetupOptions,
  simulationSummaryFormater,
} from ".";

import {
  gameSimulatorFactory,
  rngFactory,
} from "./cli_util";

// tslint:disable-next-line:no-require-imports no-var-requires
const pkgInfo = require("../package.json");
const config = require("../montehall.json");

const VERSION: string = pkgInfo.version;
const DEFAULT_NUM_GAMES = Number(config.games || 0);
let numGames = DEFAULT_NUM_GAMES;
let isWisePlayer = false;

program
  .name(pkgInfo.name)
  .version(VERSION, "-V, --version", "Output version information")
  .helpOption("-h, --help", "Output usage information")
  .option(
    "-g, --games <n>",
    `Number of games (default: ${DEFAULT_NUM_GAMES})`, Number
  )
  .option(
    "-r, --random [type]",
    "Random number generator type (basic, crypto or table)", /^(basic|crypto)$/i, "basic"
  )
  .option(
    "-v, --verbose",
    "Show summary for each game"
  )
  .option("-w, --wise",
    "Wise player"
  )
  .parse(process.argv);

if (program.games > 0) {
  numGames = program.games;
}

if (program.wise) {
  isWisePlayer = true;
}

let isDecimalTable = false;
const numTableFileName: string = program.tableFile || config.numTableFileName || "";
if (program.random === "table") {
  if (!numTableFileName) {
    process.stdout.write("Random number table file not specified.");
    process.exit(1);
  }
  isDecimalTable = program.decimalTable || config.isDecimalNumTable;
}

const rng = rngFactory(program.random, numTableFileName, isDecimalTable);

let gameSummaryCallback: GameSummaryCallback;
if (program.verbose) {
  gameSummaryCallback = (gameSummary) => {
    const formatter = gameSummaryFormatter(gameSummary, os.EOL);
    process.stdout.write(`${formatter.toString()}${os.EOL}${os.EOL}`);
  };
}
else {
  gameSummaryCallback = () => { };
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
  gameSummaryCallback,
);

mcm.run()
.then((simulationSummary) => {
  const formatter = simulationSummaryFormater(
    setupOptions,
    numGames,
    simulationSummary,
    os.EOL
  );
  process.stdout.write(`${formatter.toString()}${os.EOL}`);
})
.catch((reason) => { process.stdout.write(reason); });
