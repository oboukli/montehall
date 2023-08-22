/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  GameSummary,
  GameSummaryCallback,
  MonteCarloMachineResult,
  GameSimulator,
} from "./montehall.mjs";

/**
 * Monte Carlo method machine for the Monty Hall problem.
 *
 * @param numGames Number of game simulations.
 * @param gameSimulator
 * @param gameSummaryCallback A callback to be passed a simulation's GameSummary object.
 * @returns A simulator to simulate a numGames number of games.
 */
export function monteCarloMachine(
  numGames: number,
  gameSimulator: GameSimulator,
  gameSummaryCallback: GameSummaryCallback,
): { run: () => Promise<MonteCarloMachineResult> } {
  /**
   * Runs the Monte Carlo machine.
   *
   * @returns Number of won games.
   */
  async function run(): Promise<MonteCarloMachineResult> {
    let simulationCount = 0;
    let gameSummary: GameSummary;
    let gamesWonCount = 0;
    let error = false;
    let exception;

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
  }

  return {
    run,
  };
}
