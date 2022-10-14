/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
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
export function generalSimulator(
  setupOptions: SetupOptions,
  randomNumberProvider: RandomNumberProvider
): GameSimulator {
  /*eslint complexity: ["error", 5]*/
  async function pickRandomIndexes(
    numIndexes: number,
    excludedIndexes: number[]
  ): Promise<number[]> {
    let index: number;

    const indexes = new Array<number>(numIndexes);
    try {
      for (let i = 0; i < numIndexes; i += 1) {
        // The exact number of needed RNG calls is nondeterministic.
        do {
          index = await randomNumberProvider.random(0, setupOptions.size - 1);
        } while (excludedIndexes.indexOf(index) !== -1);
        indexes[i] = index;
      }
    } catch (ex) {
      throw new Error(
        `Cannot generate random number. ${
          ex instanceof Error ? ex.message : ex
        }`
      );
    }

    return indexes;
  }

  /**
   * Runs simulation.
   * @function simulateGame
   * @returns A new GameSummary.
   * @throws {Error} On simulation failure due to random number provider failure.
   */
  async function simulateGame(): Promise<GameSummary> {
    // Picking winning and player indices are independent events.
    const wiPromise = pickRandomIndexes(1, []);
    const piPromise = pickRandomIndexes(1, []);
    const [winningIndexArray, playerInitialPickedIndexArray] =
      await Promise.all([wiPromise, piPromise]);

    const [winningIndex] = winningIndexArray;
    const [playerInitialPickedIndex] = playerInitialPickedIndexArray;

    const indexesExcludedFromReveal = Array.from(
      new Set([winningIndex, playerInitialPickedIndex])
    );

    let revealedLosingIndexes: number[] = await pickRandomIndexes(
      setupOptions.size - 2,
      indexesExcludedFromReveal
    );

    let confirmedPlayerPickedIndex;
    if (setupOptions.isPlayerStubborn) {
      confirmedPlayerPickedIndex = playerInitialPickedIndex;
    } else {
      const excludedIndexes = [
        playerInitialPickedIndex,
        ...revealedLosingIndexes,
      ];
      [confirmedPlayerPickedIndex] = await pickRandomIndexes(
        1,
        excludedIndexes
      );
    }

    return {
      confirmedPlayerPickedIndex,
      isPlayerStubborn: setupOptions.isPlayerStubborn,
      playerInitialPickedIndex,
      revealedLosingIndexes,
      setupSize: setupOptions.size,
      winningIndex,
    };
  }

  return {
    simulateGame,
  };
}
