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
 *
 * @param setupOptions
 * @param randomNumberProvider Random number generator to use.
 * @returns A game simulator object.
 */
export function generalSimulator(
  setupOptions: SetupOptions,
  randomNumberProvider: RandomNumberProvider
): GameSimulator {
  // eslint complexity: ["error", 5]
  /**
   *
   * @param numSlots Count of numbers to be generated.
   * @param excludedSlots Numbers that are unaccepted as elements of the output array.
   * @returns An array of positive integers that is disjoint with excludedSlots.
   */
  async function pickRandomSlots(
    numSlots: number,
    excludedSlots: number[]
  ): Promise<number[]> {
    let slot: number;

    const slots = new Array<number>(numSlots);
    try {
      for (let i = 0; i < numSlots; i += 1) {
        // The exact number of needed RNG calls is nondeterministic.
        do {
          slot = await randomNumberProvider.random(
            0,
            setupOptions.numSlots - 1
          );
        } while (excludedSlots.includes(slot));
        slots[i] = slot;
      }
    } catch (ex) {
      throw new Error(
        `Cannot generate random number. ${
          ex instanceof Error ? ex.message : ex
        }`
      );
    }

    return slots;
  }

  /**
   * Runs simulation.
   *
   * @returns A new GameSummary.
   * @throws {Error} On simulation failure due to random number provider failure.
   */
  async function simulateGame(): Promise<GameSummary> {
    // Picking winning and player indices are independent events.
    const wiPromise = pickRandomSlots(1, []);
    const piPromise = pickRandomSlots(1, []);
    const [winningSlotArray, playerInitialPickedSlotArray] = await Promise.all([
      wiPromise,
      piPromise,
    ]);

    const [winningSlot] = winningSlotArray;
    const [playerInitialPickedSlot] = playerInitialPickedSlotArray;

    const indexesExcludedFromReveal = Array.from(
      new Set([winningSlot, playerInitialPickedSlot])
    );

    const revealedLosingSlots = await pickRandomSlots(
      setupOptions.numSlots - 2,
      indexesExcludedFromReveal
    );

    let confirmedPlayerPickedSlot;
    if (setupOptions.isNaivePlayer) {
      confirmedPlayerPickedSlot = playerInitialPickedSlot;
    } else {
      const excludedSlots = [playerInitialPickedSlot, ...revealedLosingSlots];
      [confirmedPlayerPickedSlot] = await pickRandomSlots(1, excludedSlots);
    }

    return {
      confirmedPlayerPickedSlot,
      isNaivePlayer: setupOptions.isNaivePlayer,
      playerInitialPickedSlot,
      revealedLosingSlots,
      numSlots: setupOptions.numSlots,
      winningSlot,
    };
  }

  return {
    simulateGame,
  };
}
