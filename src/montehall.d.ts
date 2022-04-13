/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
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
   * @returns Number of won games.
   */
  run(): Promise<SimulationSummary>;
}

export interface SetupOptions {
  /** Total number of doors. */
  readonly size: number;

  /** Player that does not switch their choice is "stubborn." */
  readonly isPlayerStubborn: boolean;
}

export interface GameSummary {
  /** Total number of doors. */
  readonly setupSize: number;

  /** Winning doors. */
  readonly winningIndex: number;

  /** Player that does not switch their choice is "stubborn." */
  readonly isPlayerStubborn: boolean;

  /** Initial pick by player. */
  readonly playerInitialPickedIndex: number;

  /** Confirmed pick by player. */
  readonly confirmedPlayerPickedIndex: number;

  /**
   * Opened (eliminated) after first player pick
   * and before the second player confirmation or pick switch.
   */
  readonly revealedLosingIndexes: number | number[];
}

export type RandomNumberGenerator = (min: number, max: number) => number | Promise<number>;

export type GameSimulatorFactory = (
  setupOptions: SetupOptions,
  rng: RandomNumberProvider,
) => GameSimulator;

export type GameSummaryCallback = (gameSummary: GameSummary) => void;

export interface RandomNumberProvider {
  random: RandomNumberGenerator;
}

export interface SimulationSummary {
  readonly exception?: unknown;
  readonly gamesWonCount: number;
  readonly isCompletedSuccessfully: boolean;
  readonly simulationCount: number;
}
