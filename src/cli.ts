#!/usr/bin/env node

/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { EOL } from "node:os";
import process from "node:process";
import { URL } from "node:url";

import { Command, InvalidArgumentError, Option } from "commander";
import { IPackageJson } from "package-json-type";

import { AppConfig, GameSummaryCallback, SetupOptions } from "./montehall";
import { monteCarloMachine } from "./montehall.mjs";
import {
  gameSimulatorFactory,
  getConfig,
  RandomNumberProviderType,
  rngFactory,
  toErrString,
} from "./util.mjs";
import { gameSummaryFormatter } from "./formatters/game-summary-formatter.mjs";
import { simulationSummaryFormatter } from "./formatters/simulation-summary-formatter.mjs";

const pkgFileName = new URL("../package.json", import.meta.url);
const configFileName = new URL("../config.json", import.meta.url);

function buildCliCommand(
  pkgInfo: IPackageJson,
  defaultNumGames: number
): Command {
  const program = new Command();

  return program
    .name(pkgInfo.name ?? "")
    .description("Montehall: A Monte Carlo Machine for the Monty Hall Problem")
    .version(
      pkgInfo.version ?? "",
      "-V, --version",
      "Output version information"
    )
    .helpOption("-h, --help", "Output usage information")
    .option(
      "-g, --games <number>",
      `Number of games to simulate`,
      argToN("Not a valid number of simulations."),
      defaultNumGames
    )
    .option(
      "-s, --doors <number>",
      `Number of doors to simulate`,
      argToN("Not a valid number of doors."),
      3
    )
    .addOption(
      new Option("-r, --random [type]", "Random number generator type")
        .default("basic")
        .preset("advanced")
        .choices(["basic", "advanced", "table"])
    )
    .addOption(
      new Option(
        "-t, --table-file <file path>",
        "Pre-generated random numbers file path"
      ).implies({ random: "table" })
    )
    .option("-v, --verbose", "Show a summary for each game", false)
    .option("-w, --wise", "Wise player", false)
    .parse();

  function argToN(
    validationErrMsg: string
  ): (value: string, previous: number) => number {
    return (x) => {
      const n = Number(x);
      if (typeof n !== "number" || !Number.isSafeInteger(n) || n < 0) {
        throw new InvalidArgumentError(validationErrMsg);
      }

      return n;
    };
  }
}

/**
 * CLI app entry point.
 */
async function main() {
  let pkgInfo: IPackageJson;
  let appConfig: AppConfig;

  try {
    const pkgInfoPromise = getConfig<IPackageJson>(pkgFileName);
    const appConfigPromise = getConfig<AppConfig>(configFileName);

    [pkgInfo, appConfig] = await Promise.all([
      pkgInfoPromise,
      appConfigPromise,
    ]);
  } catch {
    process.stderr.write(
      `Could not read configuration. Check the "${pkgFileName.toString()}" and the "${configFileName.toString()}" files.${EOL}`
    );

    return 1;
  }

  const defaultNumGames = Number(appConfig.numGamesToSimulate ?? 0);

  const options = buildCliCommand(pkgInfo, defaultNumGames).opts();

  const numGames = options.games as number;
  const isPrudentPlayer = options.wise as boolean;

  const numbersFilePath: string =
    (options.tableFile as string) ?? appConfig.numbersFilePath ?? "";
  if (options.random === "table") {
    if (numbersFilePath === "") {
      process.stdout.write(`Random number table file not specified.${EOL}`);

      return 1;
    }
  }

  const rng = rngFactory(
    options.random as RandomNumberProviderType,
    numbersFilePath
  );

  let gameSummaryCallback: GameSummaryCallback;
  if (options.verbose) {
    gameSummaryCallback = (gameSummary) => {
      const formattedGameSummary = gameSummaryFormatter(gameSummary, EOL);
      process.stdout.write(`${formattedGameSummary}${EOL}${EOL}`);
    };
  } else {
    gameSummaryCallback = () => {
      return;
    };
  }

  const setupOptions: SetupOptions = {
    isNaivePlayer: !isPrudentPlayer,
    numSlots: options.doors as number,
  };

  const mcm = monteCarloMachine(
    numGames,
    gameSimulatorFactory(setupOptions, rng),
    gameSummaryCallback
  );

  mcm
    .run()
    .then((simulationSummary) => {
      const formattedSimulationSummary = simulationSummaryFormatter(
        setupOptions,
        numGames,
        simulationSummary,
        EOL
      );
      process.stdout.write(`${formattedSimulationSummary}${EOL}`);

      if (simulationSummary.error) {
        process.stderr.write(`${toErrString(simulationSummary.error)}${EOL}`);
      }
    })
    .catch((e) => {
      process.stderr.write(`${toErrString(e)}${EOL}`);
    });

  return 0;
}

main()
  .then((x) => {
    process.exitCode = x;
  })
  .catch((e) => {
    process.stderr.write(`${toErrString(e)}${EOL}`);
    process.exitCode = 1;
  });
