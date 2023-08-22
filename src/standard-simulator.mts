/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  GameSimulator,
  GameSummary,
  RandomNumberGenerator,
  SetupOptions,
} from "./montehall.mjs";

/**
 * Simulates one standard Monty Hall problem game.
 *
 * @param setupOptions
 * @param rng Random number generator to use.
 * @returns A game simulator object.
 */
export function standardSimulator(
  setupOptions: SetupOptions,
  rng: RandomNumberGenerator,
): GameSimulator {
  /**
   *
   * @param excludedSlot Number that must not be returned as an output.
   * @returns A positive integer [0, 2] that does not equal excludedSlot.
   */
  async function pickRandomSlot(excludedSlot = -1): Promise<number> {
    const slot = await rng(0, 2);
    if (excludedSlot !== slot) {
      return slot;
    }

    return pickRandomSlot(excludedSlot);
  }

  /**
   * Runs simulation.
   *
   * @returns A new GameSummary.
   * @throws {RangeError} On encountering a setupOption.size value other than 3.
   */
  async function simulateGame(): Promise<GameSummary> {
    let revealedLosingSlot;
    let confirmedPlayerPickedSlot;

    if (setupOptions.numSlots !== 3) {
      throw new RangeError("Unsupported non-standard size.");
    }

    // Picking winning and player indices are independent events.
    const winningSlotPromise = pickRandomSlot();
    const playerInitialPickedSlotPromise = pickRandomSlot();
    const [winningSlot, playerInitialPickedSlot] = await Promise.all([
      winningSlotPromise,
      playerInitialPickedSlotPromise,
    ]);

    if (winningSlot === playerInitialPickedSlot) {
      revealedLosingSlot = await pickRandomSlot(winningSlot);
    } else {
      revealedLosingSlot = 3 - winningSlot - playerInitialPickedSlot;
    }

    if (setupOptions.isNaivePlayer) {
      confirmedPlayerPickedSlot = playerInitialPickedSlot;
    } else {
      confirmedPlayerPickedSlot =
        3 - revealedLosingSlot - playerInitialPickedSlot;
    }

    return {
      confirmedPlayerPickedSlot,
      isNaivePlayer: setupOptions.isNaivePlayer,
      playerInitialPickedSlot,
      revealedLosingSlots: revealedLosingSlot,
      numSlots: setupOptions.numSlots,
      winningSlot,
    };
  }

  return {
    simulateGame,
  };
}
