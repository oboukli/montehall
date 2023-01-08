/*!
Copyright (c) 2017-2023 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  GameSimulator,
  GameSummary,
  GameSummaryCallback,
  monteCarloMachine,
  MonteCarloMachine,
  MonteCarloMachineResult,
  SetupOptions,
} from ".";

describe("Monte Carlo machine", () => {
  let mcm: MonteCarloMachine;
  let simulationSummary: MonteCarloMachineResult;
  let gameSummaryCallbackMock: jest.Mock<GameSummaryCallback>;
  let gameSummaryMockIndex: number;
  let gameSummaryMocks: Array<GameSummary>;

  beforeEach(() => {
    gameSummaryCallbackMock = jest.fn(() => {
      return;
    });
  });

  describe("when machine is run with a reliable game simulator", () => {
    beforeEach(async () => {
      const setupOptions: SetupOptions = {
        isNaivePlayer: true,
        numSlots: 3,
      };

      const numGames = 4;
      gameSummaryMockIndex = 0;
      gameSummaryMocks = [
        {
          confirmedPlayerPickedSlot: 0,
          isNaivePlayer: setupOptions.isNaivePlayer,
          playerInitialPickedSlot: 0,
          revealedLosingSlots: 2,
          numSlots: setupOptions.numSlots,
          winningSlot: 0,
        },
        {
          confirmedPlayerPickedSlot: 0,
          isNaivePlayer: setupOptions.isNaivePlayer,
          playerInitialPickedSlot: 0,
          revealedLosingSlots: 2,
          numSlots: setupOptions.numSlots,
          winningSlot: 1,
        },
        {
          confirmedPlayerPickedSlot: 1,
          isNaivePlayer: setupOptions.isNaivePlayer,
          playerInitialPickedSlot: 1,
          revealedLosingSlots: 2,
          numSlots: setupOptions.numSlots,
          winningSlot: 1,
        },
        {
          confirmedPlayerPickedSlot: 2,
          isNaivePlayer: setupOptions.isNaivePlayer,
          playerInitialPickedSlot: 2,
          revealedLosingSlots: 0,
          numSlots: setupOptions.numSlots,
          winningSlot: 1,
        },
      ];

      const gameSimulator: GameSimulator = {
        simulateGame: function (): Promise<GameSummary> {
          return Promise.resolve(gameSummaryMocks[gameSummaryMockIndex++]);
        },
      };

      mcm = monteCarloMachine(numGames, gameSimulator, gameSummaryCallbackMock);
      simulationSummary = await mcm.run();
    });

    it("should return correct simulation summary", () => {
      expect(simulationSummary).toStrictEqual({
        numWonGames: 2,
        isCompletedSuccessfully: true,
        numSimulations: 4,
        error: undefined,
      });
    });

    it("should call the game summary callback x times", () => {
      expect(gameSummaryCallbackMock).toHaveBeenCalledTimes(4);
    });
  });

  describe("when machine is run with a error-throwing game simulator", () => {
    beforeEach(async () => {
      const numGames = 7;

      const gameSimulator: GameSimulator = {
        simulateGame: function (): Promise<GameSummary> {
          throw new Error("Dummy error.");
        },
      };

      mcm = monteCarloMachine(numGames, gameSimulator, gameSummaryCallbackMock);
      simulationSummary = await mcm.run();
    });

    it("should return correct simulation summary that includes error", () => {
      expect(simulationSummary).toStrictEqual({
        numWonGames: 0,
        isCompletedSuccessfully: false,
        numSimulations: 1,
        error: new Error("Dummy error."),
      });
    });

    it("should not call the game summary callback", () => {
      expect(gameSummaryCallbackMock).not.toHaveBeenCalled();
    });
  });
});
