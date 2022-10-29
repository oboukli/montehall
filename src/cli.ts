/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { readFile } from "node:fs/promises";
import { EOL } from "node:os";

import { Command, Option } from "commander";
import { IPackageJson } from "package-json-type";

import {
  AppConfig,
  GameSummaryCallback,
  gameSummaryFormatter,
  monteCarloMachine,
  SetupOptions,
  simulationSummaryFormatter,
} from ".";

import { gameSimulatorFactory, rngFactory } from "./cli_util";

const pkgFileName = "./package.json";
const configFileName = "./montehall.json";

/*eslint complexity: ["error", 13]*/
/**
 * CLI app entry point.
 */
async function main() {
  let pkgInfo: IPackageJson;
  let config: AppConfig;

  try {
    const pkgInfoFilePromise = await readFile(pkgFileName, {
      encoding: "utf8",
    });

    const configFilePromise = await readFile(configFileName, {
      encoding: "utf8",
    });

    const [pkgInfoFile, configFile] = await Promise.all([
      pkgInfoFilePromise,
      configFilePromise,
    ]);

    pkgInfo = JSON.parse(pkgInfoFile) as IPackageJson;
    config = JSON.parse(configFile) as AppConfig;
  } catch {
    process.stderr.write(
      `Could not read configuration. Check the "${pkgFileName}" and the "${configFileName}" files.${EOL}`
    );

    return 1;
  }

  const DEFAULT_NUM_GAMES = Number(config.games || 0);
  let numGames = DEFAULT_NUM_GAMES;
  let isWisePlayer = false;

  const program = new Command();
  program
    .name(pkgInfo.name || "")
    .description("A Monte Carlo Machine for the Monty Hall Problem")
    .version(
      pkgInfo.version || "",
      "-V, --version",
      "Output version information"
    )
    .helpOption("-h, --help", "Output usage information")
    .option(
      "-g, --games <n>",
      `Number of games (default: ${DEFAULT_NUM_GAMES})`,
      Number
    )
    .addOption(
      new Option("-r, --random [type]", "Random number generator type").choices(
        ["basic", "advanced", "table"]
      )
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
      process.stdout.write(`Random number table file not specified.${EOL}`);

      return 1;
    }
    isDecimalTable = options.decimalTable || config.isDecimalNumTable;
  }

  const rng = rngFactory(options.random, numTableFileName, isDecimalTable);

  let gameSummaryCallback: GameSummaryCallback;
  if (options.verbose) {
    gameSummaryCallback = (gameSummary) => {
      const formatter = gameSummaryFormatter(gameSummary, EOL);
      process.stdout.write(`${formatter.toString()}${EOL}${EOL}`);
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
        EOL
      );
      process.stdout.write(`${formatter.toString()}${EOL}`);
    })
    .catch((reason) => {
      process.stdout.write(`${reason}${EOL}`);
    });

  return 0;
}

main()
  .then((x) => {
    process.exitCode = x;
  })
  .catch((e) => {
    process.stderr.write(`${e}${EOL}`);
    process.exitCode = 1;
  });
