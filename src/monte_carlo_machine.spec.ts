/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  GameSimulator,
  GameSimulatorFactory,
  GameSummary,
  MonteCarloMachine,
  monteCarloMachine,
  SimulationSummary,
} from ".";

describe("Monte Carlo machine", () => {
  let mcm: MonteCarloMachine;
  let simulationSummary: SimulationSummary;
  let gameSummaryCallbackSpy: jasmine.Spy;

  beforeAll(() => {
    return;
  });

  beforeEach(async () => {
    const setupOptions = {
      isPlayerStubborn: false,
      size: 3,
    };

    const numGames = 10;

    const gameSimulatorFactory: GameSimulatorFactory = (
    ): GameSimulator => {
      return {
        simulateGame: async (): Promise<GameSummary> => {
          return {
            confirmedPlayerPickedIndex: 1,
            isPlayerStubborn: setupOptions.isPlayerStubborn,
            playerInitialPickedIndex: 0,
            revealedLosingIndexes: 2,
            setupSize: setupOptions.size,
            winningIndex: 0
          };
        }
      };
    };

    const gameSummaryCallbackWrapper = {
      gameCompleted: () => {
        return;
      }
    };

    gameSummaryCallbackSpy = spyOn(
      gameSummaryCallbackWrapper,
      "gameCompleted"
    ).and.callThrough();

    mcm = monteCarloMachine(
      setupOptions,
      numGames,
      gameSimulatorFactory,
      { random: () => -1 },
      gameSummaryCallbackWrapper.gameCompleted
    );
    simulationSummary = await mcm.run();
  });

  it("should not have an exception", () => {
    expect(simulationSummary.exception).toBeUndefined();
  });

  it("should have zero won games count", () => {
    expect(simulationSummary.gamesWonCount).toEqual(0);
  });

  it("should have completed successfully", () => {
    expect(simulationSummary.isCompletedSuccessfully).toBeTruthy();
  });

  it("should have simulation count of ten", () => {
    expect(simulationSummary.simulationCount).toEqual(10);
  });

  it("should call the game summary callback ten times", async () => {
    expect(gameSummaryCallbackSpy.calls.count()).toEqual(10);
  });
});
