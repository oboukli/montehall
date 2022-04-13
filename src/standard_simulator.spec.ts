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
  standardSimulator,
} from ".";
import { naiveRng } from "./random/naive_rng";

describe("Standard Monty Hall problem simulator", () => {
  let setupOptions: SetupOptions;
  let rng: RandomNumberProvider;
  let gameSummary: GameSummary;
  let simulator: GameSimulator;

  const validatePlayerIndependentSpecs = () => {
    describe("Game summary", () => {
      beforeEach(async () => {
        gameSummary = await simulator.simulateGame();
      });

      it("should have valid setup size of three", () => {
        expect(gameSummary.setupSize)
          .toEqual(3);
      });

      it("should not have revealedLosingIndexes as an array", () => {
        expect(Array.isArray(gameSummary.revealedLosingIndexes))
          .toBeFalsy();
      });

      it("should have revealedLosingIndexes as integer", () => {
        expect(Number.isInteger(gameSummary.revealedLosingIndexes as number))
          .toBeTruthy();
      });

      it("should have a valid playerInitialPickedIndex", () => {
        expect(gameSummary.playerInitialPickedIndex)
          .toBeGreaterThanOrEqual(0);

        expect(gameSummary.playerInitialPickedIndex)
          .toBeLessThanOrEqual(2);
      });

      it("should have a valid confirmedPlayerPickedIndex", () => {
        expect(gameSummary.confirmedPlayerPickedIndex)
          .toBeGreaterThanOrEqual(0);

        expect(gameSummary.confirmedPlayerPickedIndex)
          .toBeLessThanOrEqual(2);
      });

      it("should have a valid winningIndex", () => {
        expect(gameSummary.winningIndex)
          .toBeGreaterThanOrEqual(0);

        expect(gameSummary.winningIndex)
          .toBeLessThanOrEqual(2);
      });

      it("should have a valid revealedLosingIndexes", () => {
        expect(gameSummary.revealedLosingIndexes)
          .toBeGreaterThanOrEqual(0);

        expect(gameSummary.revealedLosingIndexes)
          .toBeLessThanOrEqual(2);
      });

      it("should have a non-revealed playerInitialPickedIndex", () => {
        expect(gameSummary.playerInitialPickedIndex)
          .not.toEqual(gameSummary.revealedLosingIndexes as number);
      });

      it("should have a non-revealed confirmedPlayerPickedIndex", () => {
        expect(gameSummary.confirmedPlayerPickedIndex)
          .not.toEqual(gameSummary.revealedLosingIndexes as number);
      });

      it("should have a non-revealed winningIndex", () => {
        expect(gameSummary.winningIndex)
          .not.toEqual(gameSummary.revealedLosingIndexes as number);
      });
    });

    describe("The random number generator", () => {
      it("should be called a minimum of times", async () => {
        const rngSpy = spyOn(rng, "random").and.callThrough();

        const s = standardSimulator(setupOptions, rng);
        await s.simulateGame();

        expect(rngSpy.calls.count()).toBeGreaterThanOrEqual(2);
      });
    });
  };

  describe("with a player that doesn't switch (stubborn)", () => {
    setupOptions = {
      isPlayerStubborn: true,
      size: 3,
    };

    beforeAll(() => {
      rng = naiveRng();
    });

    beforeEach(() => {
      simulator = standardSimulator(setupOptions, rng);
    });

    it("should reflect in the game summary that the stubborn player didn't switch", async () => {
      gameSummary = await simulator.simulateGame();
      expect(gameSummary.isPlayerStubborn)
        .toBeTruthy();

      expect(gameSummary.confirmedPlayerPickedIndex)
        .toEqual(gameSummary.playerInitialPickedIndex);
    });

    describe("Validate player-type-independent specs", validatePlayerIndependentSpecs);
  });

  describe("with a player that switches (non-stubborn)", () => {
    beforeAll(async () => {
      setupOptions = {
        isPlayerStubborn: false,
        size: 3,
      };
    });

    beforeEach(async () => {
      simulator = standardSimulator(setupOptions, rng);
    });

    it("should reflect in the game summary that the wise (non-stubborn) player switched", async () => {
      gameSummary = await simulator.simulateGame();

      expect(gameSummary.isPlayerStubborn)
        .toBeFalsy();

      expect(gameSummary.confirmedPlayerPickedIndex)
        .not.toEqual(gameSummary.playerInitialPickedIndex);
    });

    describe("Validate player-type-independent specs", validatePlayerIndependentSpecs);
  });

  describe("asynchronous exception specs", () => {
    describe("for invalid game size (size not three)", () => {
      it("should asynchronously throw RangeError", async () => {
        let exception: unknown;
        const sim = standardSimulator({ size: 2, isPlayerStubborn: false }, rng);

        try {
          await sim.simulateGame();
        }
        catch (ex: unknown) {
          exception = ex;
        }

        expect(exception instanceof RangeError).toBeTruthy();
      });
    });

    describe("for RNG exceptions", () => {
      it("should asynchronously throw Error", async () => {
        let exception: unknown;
        const sim = standardSimulator(
          {
            isPlayerStubborn: false,
            size: 3,
          },
          {
            random: async () => {
              throw Error();
            }
          }
        );

        try {
          await sim.simulateGame();
        }
        catch (ex: unknown) {
          exception = ex;
        }

        expect(exception instanceof Error).toBeTruthy();
      });
    });
  });
});
