/*!
Copyright(c) 2017 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.
*/

import {
  GameSimulatorFactory,
  GameSummary,
  GameSummaryCallback,
  RandomNumberProvider,
  SetupOptions,
  SimulationSummary,
} from "./montehall";

/**
 * Monte Carlo method machine for the Monty Hall problem.
 * @param setupOptions Setup options.
 * @param numGames Number of game simulations.
 * @param gameSimulatorFactory gameSimulator factory.
 * @param rng Random number generator.
 * @param gameSummaryCallback A callback to be passed a simulation's GameSummary object.
 */
export const monteCarloMachine = ((
  setupOptions: SetupOptions,
  numGames: number,
  gameSimulatorFactory: GameSimulatorFactory,
  rng: RandomNumberProvider,
  gameSummaryCallback: GameSummaryCallback
) => {

  /**
   * Runs the Monte Carlo machine.
   * @function run
   * @returns Number of won games.
   */
  const run = async (): Promise<SimulationSummary> => {
    let simulationCount = 0;
    let gameSummary: GameSummary;
    let gamesWonCount = 0;
    let error = false;
    let exception;

    const gameSimulator = gameSimulatorFactory(setupOptions, rng);

    for (let i = 0; i < numGames; i += 1) {
      try {
        gameSummary = await gameSimulator.simulateGame();

        if (gameSummary.winningIndex === gameSummary.confirmedPlayerPickedIndex) {
          gamesWonCount += 1;
        }

        if (gameSummaryCallback) {
          gameSummaryCallback(gameSummary);
        }
      }
      catch (ex: any) {
        error = true;
        exception = ex;
        break;
      }
      finally {
        simulationCount = i + 1;
      }
    }

    return {
      exception,
      gamesWonCount,
      isCompletedSuccessfully: !error,
      simulationCount,
    };
  };

  return {
    run
  };
});
