/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { EOL } from "node:os";
import process from "node:process";

import { Command, InvalidArgumentError, Option } from "commander";
import { IPackageJson } from "package-json-type";

import {
  AppConfig,
  GameSummaryCallback,
  gameSummaryFormatter,
  monteCarloMachine,
  SetupOptions,
  simulationSummaryFormatter,
} from ".";

import {
  gameSimulatorFactory,
  getConfig,
  RandomNumberProviderType,
  rngFactory,
} from "./cli-util";

const pkgFileName = "./package.json";
const configFileName = "./montehall.json";

function buildCliCommand(
  pkgInfo: IPackageJson,
  defaultNumGames: number
): Command {
  const program = new Command();

  return program
    .name(pkgInfo.name || "")
    .description("Montehall: A Monte Carlo Machine for the Monty Hall Problem")
    .version(
      pkgInfo.version || "",
      "-V, --version",
      "Output version information"
    )
    .helpOption("-h, --help", "Output usage information")
    .option(
      "-g, --games <number>",
      `Number of games to simulate`,
      (x) => {
        const n = Number(x);
        if (typeof n !== "number" || !Number.isSafeInteger(n) || n < 0) {
          throw new InvalidArgumentError("Not a valid number of simulations.");
        }

        return n;
      },
      defaultNumGames
    )
    .addOption(
      new Option("-r, --random [type]", "Random number generator type")
        .default("basic")
        .preset("advanced")
        .choices(["basic", "advanced", "table"])
    )
    .addOption(
      new Option("-t, --table-file", "Pre-generated random numbers file path")
        .implies({ random: "table" })
        .hideHelp(true)
    )
    .addOption(
      new Option(
        "-m, --decimal-table",
        "Assume pre-generated random numbers are decimals, not integers"
      )
        .default(false)
        .hideHelp(true)
    )
    .option("-v, --verbose", "Show a summary for each game", false)
    .option("-w, --wise", "Wise player", false)
    .parse();
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
      `Could not read configuration. Check the "${pkgFileName}" and the "${configFileName}" files.${EOL}`
    );

    return 1;
  }

  const defaultNumGames = Number(appConfig.numGamesToSimulate || 0);

  const options = buildCliCommand(pkgInfo, defaultNumGames).opts();

  const numGames = options.games as number;
  const isPrudentPlayer = options.wise as boolean;

  const isDecimalTable =
    (options.decimalTable as boolean) || appConfig.isDecimalNumTable;
  const numbersFilePath: string =
    (options.tableFile as string) || appConfig.numbersFilePath || "";
  if (options.random === "table") {
    if (numbersFilePath === "") {
      process.stdout.write(`Random number table file not specified.${EOL}`);

      return 1;
    }
  }

  const rng = rngFactory(
    options.random as RandomNumberProviderType,
    numbersFilePath,
    isDecimalTable
  );

  let gameSummaryCallback: GameSummaryCallback;
  if (options.verbose) {
    gameSummaryCallback = (gameSummary) => {
      const formattedGameSummary = gameSummaryFormatter(gameSummary, EOL);
      process.stdout.write(`${formattedGameSummary}${EOL}${EOL}`);
    };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    gameSummaryCallback = () => {};
  }

  const setupOptions: SetupOptions = {
    isNaivePlayer: !isPrudentPlayer,
    numSlots: 3,
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
      const formattedSimulationSummary = simulationSummaryFormatter(
        setupOptions,
        numGames,
        simulationSummary,
        EOL
      );
      process.stdout.write(`${formattedSimulationSummary}${EOL}`);
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
