/*!
Copyright(c) 2017 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.
*/

import {
  GameSimulator,
  GameSummary,
  RandomNumberProvider,
  SetupOptions,
} from "./montehall";

/**
 * Simulates one generalized Monty Hall problem game.
 * @param setupOptions Setup options.
 * @param randomNumberProvider Random number provider.
 */
// tslint:disable-next-line:max-func-body-length
export const generalSimulator = ((
  setupOptions: SetupOptions,
  randomNumberProvider: RandomNumberProvider
): GameSimulator => {
  /**
   * Runs simulation.
   * @function simulateGame
   * @returns A new GameSummary.
   * @throws {Error} On simulation failure due to random number provider failure.
   */
  const simulateGame = async (): Promise<GameSummary> => {
    let error = false;

    // Picking winning and player indices are independent events.
    const wiPromise = pickRandomIndexes(1, []);
    const piPromise = pickRandomIndexes(1, []);

    let winningIndex = -1;
    try {
      winningIndex = (await wiPromise)[0];
    }
    catch (ex) {
      error = true;
    }

    let playerInitialPickedIndex = -1;
    try {
      playerInitialPickedIndex = (await piPromise)[0];
    }
    catch (ex) {
      error = true;
    }

    const indexesExcludedFromReveal = Array.from(
      new Set([winningIndex, playerInitialPickedIndex])
    );

    let revealedLosingIndexes: number[] = [];
    try {
      revealedLosingIndexes = await pickRandomIndexes(
        setupOptions.size - 2,
        indexesExcludedFromReveal
      );
    }
    catch (ex) {
      error = true;
    }

    let confirmedPlayerPickedIndex = -1;
    if (setupOptions.isPlayerStubborn) {
      confirmedPlayerPickedIndex = playerInitialPickedIndex;
    } else {
      let excludedIndexes: number[];
      excludedIndexes = Array.from(
        [playerInitialPickedIndex, ...revealedLosingIndexes]
      );

      try {
        confirmedPlayerPickedIndex = (await pickRandomIndexes(
          1,
          excludedIndexes
        ))[0];
      }
      catch (ex) {
        error = true;
      }
    }

    if (error) {
      throw new Error("Simulation failed.");
    }

    return {
      confirmedPlayerPickedIndex,
      isPlayerStubborn: setupOptions.isPlayerStubborn,
      playerInitialPickedIndex,
      revealedLosingIndexes,
      setupSize: setupOptions.size,
      winningIndex,
    };
  };

  const pickRandomIndexes = async (
    numIndexes: number,
    excludedIndexes: number[]): Promise<number[]> => {
    let index: number;

    // tslint:disable-next-line:prefer-array-literal
    const indexes = new Array<number>(numIndexes);
    for (let i = 0; i < numIndexes; i += 1) {
      do {
        // The exact number of needed RNG calls is nondeterministic.
        try {
          index = await randomNumberProvider.random(0, setupOptions.size - 1);
        }
        catch (ex) {
          throw new Error(`Cannot generate random number. ${ex instanceof Error ? ex.message : ex}`);
        }
      } while (excludedIndexes.indexOf(index) !== -1);
      indexes[i] = index;
    }

    return indexes;
  };

  return {
    simulateGame
  };
});
