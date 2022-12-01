/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  GameSimulator,
  GameSummary,
  RandomNumberGenerator,
  SetupOptions,
} from "./montehall";

/**
 * Simulates one generalized Monty Hall problem game.
 *
 * @param setupOptions
 * @param rng Random number generator to use.
 * @returns A game simulator object.
 */
export function generalSimulator(
  setupOptions: SetupOptions,
  rng: RandomNumberGenerator
): GameSimulator {
  function getRevealedSlots(
    len: number,
    s1: number,
    s2: number
  ): Array<number> {
    const [min, max] = s1 < s2 ? [s1, s2] : [s2, s1];
    const a = Array<number>(len - 2);
    let i = 0;
    let j = 0;

    for (; i < min; ++i) {
      a[j++] = i;
    }

    for (i = min + 1; i < max; ++i) {
      a[j++] = i;
    }

    for (i = max + 1; i < len; ++i) {
      a[j++] = i;
    }

    return a;
  }

  /**
   *
   * @param excludedSlots Numbers that are invalid for output.
   * @returns A positive integer that is disjoint with excludedSlot.
   */
  async function pickRandomSlot(excludedSlots: number[]): Promise<number> {
    const slot = await rng(0, setupOptions.numSlots - 1);

    if (!excludedSlots.includes(slot)) {
      return slot;
    }

    return pickRandomSlot(excludedSlots);
  }

  /**
   * Runs simulation.
   *
   * @returns A new GameSummary.
   * @throws {Error} On simulation failure due to random number provider failure.
   */
  async function simulateGame(): Promise<GameSummary> {
    // Picking winning and player indices are independent events.
    const winningSlotPromise = pickRandomSlot([]);
    const playerInitialPickedSlotPromise = pickRandomSlot([]);
    const [winningSlot, playerInitialPickedSlot] = await Promise.all([
      winningSlotPromise,
      playerInitialPickedSlotPromise,
    ]);
    const revealedLosingSlots = getRevealedSlots(
      setupOptions.numSlots,
      winningSlot,
      playerInitialPickedSlot
    );

    let confirmedPlayerPickedSlot;
    if (setupOptions.isNaivePlayer) {
      confirmedPlayerPickedSlot = playerInitialPickedSlot;
    } else {
      const excludedSlots = [playerInitialPickedSlot, ...revealedLosingSlots];
      confirmedPlayerPickedSlot = await pickRandomSlot(excludedSlots);
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
