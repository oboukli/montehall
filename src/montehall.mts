/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

export interface GameSimulator {
  /** Run simulation. */
  simulateGame(): Promise<GameSummary>;
}

export interface MonteCarloMachine {
  /**
   * Runs the Monte Carlo machine.
   *
   * @returns Number of won games.
   */
  run(): Promise<MonteCarloMachineResult>;
}

export interface SetupOptions {
  /** Total number of slots (doors.) */
  readonly numSlots: number;

  /** Player that does not switch their choice is "naive." */
  readonly isNaivePlayer: boolean;
}

export interface GameSummary {
  /** Number of slots (doors.) */
  readonly numSlots: number;

  /** Winning slot (door.) */
  readonly winningSlot: number;

  /** Player that does not switch their choice is "naive." */
  readonly isNaivePlayer: boolean;

  /** Initial pick by player. */
  readonly playerInitialPickedSlot: number;

  /** Confirmed pick by player. */
  readonly confirmedPlayerPickedSlot: number;

  /**
   * Opened (eliminated) after first player pick
   * and before the second player confirmation or pick switch.
   */
  readonly revealedLosingSlots: number | number[];
}

/**
 * Generates a uniform distribution random integer between two values.
 *
 * @param min Minimum inclusive value (integer).
 * @param max Maximum inclusive value (integer).
 * @returns A random number (integer) between min and max inclusive.
 */
export type RandomNumberGenerator = (
  min: number,
  max: number,
) => Promise<number>;

export type GameSimulatorFactory = (
  setupOptions: SetupOptions,
  rng: RandomNumberGenerator,
) => GameSimulator;

export type GameSummaryCallback = (gameSummary: GameSummary) => void;

export interface MonteCarloMachineResult {
  readonly error?: unknown;

  readonly numWonGames: number;

  readonly isCompletedSuccessfully: boolean;

  readonly numSimulations: number;
}

export { generalSimulator } from "./general-simulator.mjs";

export { monteCarloMachine } from "./monte-carlo-machine.mjs";

export { standardSimulator } from "./standard-simulator.mjs";
