/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

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
  let gameSummaryCallbackSpy: jasmine.Spy;
  let gameSummaryCallbackWrapper: { gameCompleted: GameSummaryCallback };
  let gameSummaryMockIndex: number;
  let gameSummaryMocks: Array<GameSummary>;

  beforeEach(async () => {
    gameSummaryCallbackWrapper = {
      gameCompleted: () => {
        return;
      },
    };

    gameSummaryCallbackSpy = spyOn(
      gameSummaryCallbackWrapper,
      "gameCompleted"
    ).and.callThrough();
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

      mcm = monteCarloMachine(
        numGames,
        gameSimulator,
        gameSummaryCallbackWrapper.gameCompleted
      );
      simulationSummary = await mcm.run();
    });

    it("should return correct simulation summary", () => {
      expect(simulationSummary).toEqual({
        numWonGames: 2,
        isCompletedSuccessfully: true,
        numSimulations: 4,
        error: undefined,
      });
    });

    it("should call the game summary callback x times", () => {
      expect(gameSummaryCallbackSpy.calls.count()).toEqual(4);
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

      mcm = monteCarloMachine(
        numGames,
        gameSimulator,
        gameSummaryCallbackWrapper.gameCompleted
      );
      simulationSummary = await mcm.run();
    });

    it("should return correct simulation summary that includes error", () => {
      expect(simulationSummary).toEqual({
        numWonGames: 0,
        isCompletedSuccessfully: false,
        numSimulations: 1,
        error: new Error("Dummy error."),
      });
    });

    it("should call the game summary callback x times", () => {
      expect(gameSummaryCallbackSpy.calls.count()).toEqual(0);
    });
  });
});
