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
 * Simulates one standard Monty Hall problem game.
 * @param setupOptions Setup options.
 * @param randomNumberProvider Random number generator.
 */
// tslint:disable-next-line:max-func-body-length
export const standardSimulator = ((
  setupOptions: SetupOptions,
  randomNumberProvider: RandomNumberProvider
): GameSimulator => {
  /**
   * Runs simulation.
   * @function simulateGame
   * @returns A new GameSummary.
   * @throws {RangeError} On encountering a setupOption.size value other than 3.
   * @throws {Error} On simulation failure due to random number provider failure.
   */
  const simulateGame = async (): Promise<GameSummary> => {
    let winningIndex;
    let playerInitialPickedIndex;
    let revealedLosingIndex;
    let confirmedPlayerPickedIndex;
    let error = false;

    if (setupOptions.size !== 3) {
      throw new RangeError("Unsupported non-standard size.");
    }

    // Picking winning and player indices are independent events.
    const wiPromise = pickRandomIndexes();
    const piPromise = pickRandomIndexes();

    try {
      winningIndex = await wiPromise;
    }
    catch (ex) {
      error = true;
      winningIndex = -1;
    }

    try {
      playerInitialPickedIndex = await piPromise;
    }
    catch (ex) {
      error = true;
      playerInitialPickedIndex = -1;
    }

    if (winningIndex === playerInitialPickedIndex) {
      try {
        revealedLosingIndex = await pickRandomIndexes(winningIndex);
      }
      catch (ex) {
        error = true;
        revealedLosingIndex = -1;
      }
    }
    else {
      revealedLosingIndex = (3 - winningIndex) - playerInitialPickedIndex;
    }

    if (setupOptions.isPlayerStubborn) {
      confirmedPlayerPickedIndex = playerInitialPickedIndex;
    }
    else {
      try {
        confirmedPlayerPickedIndex = (3 - revealedLosingIndex) - playerInitialPickedIndex;
      }
      catch (ex) {
        error = true;
        confirmedPlayerPickedIndex = -1;
      }
    }

    if (error) {
      throw new Error("Simulation failed.");
    }

    return {
      confirmedPlayerPickedIndex,
      isPlayerStubborn: setupOptions.isPlayerStubborn,
      playerInitialPickedIndex,
      revealedLosingIndexes: revealedLosingIndex,
      setupSize: setupOptions.size,
      winningIndex
    };
  };

  const pickRandomIndexes = async (excludedIndex = -1): Promise<number> => {
    try {
      const index = await randomNumberProvider.random(0, 2);
      if (excludedIndex !== index) {
        return index;
      }
    }
    catch (ex) {
      throw new Error(`Cannot generate random number. ${ex.message}`);
    }

    return pickRandomIndexes(excludedIndex);
  };

  return {
    simulateGame
  };
});
