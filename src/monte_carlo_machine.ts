/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  GameSimulatorFactory,
  GameSummary,
  GameSummaryCallback,
  RandomNumberProvider,
  SetupOptions,
  MonteCarloMachineResult,
} from "./montehall";

/**
 * Monte Carlo method machine for the Monty Hall problem.
 *
 * @function monteCarloMachine
 * @param setupOptions
 * @param numGames Number of game simulations.
 * @param gameSimulatorFactory
 * @param rng Random number generator.
 * @param gameSummaryCallback A callback to be passed a simulation's GameSummary object.
 * @returns A simulator to simulate a numGames number of games.
 */
export const monteCarloMachine = (
  setupOptions: SetupOptions,
  numGames: number,
  gameSimulatorFactory: GameSimulatorFactory,
  rng: RandomNumberProvider,
  gameSummaryCallback: GameSummaryCallback
): { run: () => Promise<MonteCarloMachineResult> } => {
  /**
   * Runs the Monte Carlo machine.
   *
   * @function run
   * @returns Number of won games.
   */
  const run = async (): Promise<MonteCarloMachineResult> => {
    let simulationCount = 0;
    let gameSummary: GameSummary;
    let gamesWonCount = 0;
    let error = false;
    let exception;

    const gameSimulator = gameSimulatorFactory(setupOptions, rng);

    for (let i = 0; i < numGames; i += 1) {
      try {
        gameSummary = await gameSimulator.simulateGame();

        if (gameSummary.winningSlot === gameSummary.confirmedPlayerPickedSlot) {
          gamesWonCount += 1;
        }

        gameSummaryCallback(gameSummary);
      } catch (ex) {
        error = true;
        exception = ex;
        break;
      } finally {
        simulationCount = i + 1;
      }
    }

    return {
      error: exception,
      numWonGames: gamesWonCount,
      isCompletedSuccessfully: !error,
      numSimulations: simulationCount,
    };
  };

  return {
    run,
  };
};
