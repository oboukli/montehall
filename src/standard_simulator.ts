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
 * Simulates one standard Monty Hall problem game.
 *
 * @param setupOptions
 * @param randomNumberProvider Random number generator to use.
 * @returns A game simulator object.
 */
export function standardSimulator(
  setupOptions: SetupOptions,
  randomNumberProvider: RandomNumberProvider
): GameSimulator {
  /**
   *
   * @param excludedIndex Number that must not be returned as an output.
   * @returns A positive integer [0, 2] that does not equal excludedIndex.
   */
  async function pickRandomIndexes(excludedIndex = -1): Promise<number> {
    try {
      const index = await randomNumberProvider.random(0, 2);
      if (excludedIndex !== index) {
        return index;
      }
    } catch (ex) {
      throw new Error(
        `Cannot generate random number. ${
          ex instanceof Error ? ex.message : ex
        }`
      );
    }

    return pickRandomIndexes(excludedIndex);
  }

  /**
   * Runs simulation.
   *
   * @returns A new GameSummary.
   * @throws {RangeError} On encountering a setupOption.size value other than 3.
   * @throws {Error} On simulation failure due to random number provider failure.
   */
  async function simulateGame(): Promise<GameSummary> {
    let revealedLosingIndex;
    let confirmedPlayerPickedIndex;

    if (setupOptions.size !== 3) {
      throw new RangeError("Unsupported non-standard size.");
    }

    // Picking winning and player indices are independent events.
    const wiPromise = pickRandomIndexes();
    const piPromise = pickRandomIndexes();
    const [winningIndex, playerInitialPickedIndex] = await Promise.all([
      wiPromise,
      piPromise,
    ]);

    if (winningIndex === playerInitialPickedIndex) {
      revealedLosingIndex = await pickRandomIndexes(winningIndex);
    } else {
      revealedLosingIndex = 3 - winningIndex - playerInitialPickedIndex;
    }

    if (setupOptions.isPlayerStubborn) {
      confirmedPlayerPickedIndex = playerInitialPickedIndex;
    } else {
      confirmedPlayerPickedIndex =
        3 - revealedLosingIndex - playerInitialPickedIndex;
    }

    return {
      confirmedPlayerPickedIndex,
      isPlayerStubborn: setupOptions.isPlayerStubborn,
      playerInitialPickedIndex,
      revealedLosingIndexes: revealedLosingIndex,
      setupSize: setupOptions.size,
      winningIndex,
    };
  }

  return {
    simulateGame,
  };
}
