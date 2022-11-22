/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";
import {
  GameSimulator,
  GameSimulatorFactory,
  GameSummary,
  monteCarloMachine,
  MonteCarloMachine,
  MonteCarloMachineResult,
  SetupOptions,
} from ".";

describe("Monte Carlo machine", () => {
  let mcm: MonteCarloMachine;
  let simulationSummary: MonteCarloMachineResult;
  let gameSummaryCallbackSpy: jasmine.Spy;

  beforeAll(() => {
    return;
  });

  beforeEach(async () => {
    const setupOptions: SetupOptions = {
      isNaivePlayer: false,
      numSlots: 3,
    };

    const numGames = 10;

    const gameSimulatorFactory: GameSimulatorFactory = (): GameSimulator => {
      return {
        simulateGame: (): Promise<GameSummary> =>
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          new Promise((resolve, _reject): void => {
            resolve({
              confirmedPlayerPickedSlot: 1,
              isNaivePlayer: setupOptions.isNaivePlayer,
              playerInitialPickedSlot: 0,
              revealedLosingSlots: 2,
              numSlots: setupOptions.numSlots,
              winningSlot: 0,
            });
          }),
      };
    };

    const gameSummaryCallbackWrapper = {
      gameCompleted: () => {
        return;
      },
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
    expect(simulationSummary.error).toBeUndefined();
  });

  it("should have zero won games count", () => {
    expect(simulationSummary.numWonGames).toEqual(0);
  });

  it("should have completed successfully", () => {
    expect(simulationSummary.isCompletedSuccessfully).toBeTrue();
  });

  it("should have simulation count of ten", () => {
    expect(simulationSummary.numSimulations).toEqual(10);
  });

  it("should call the game summary callback ten times", () => {
    expect(gameSummaryCallbackSpy.calls.count()).toEqual(10);
  });
});
