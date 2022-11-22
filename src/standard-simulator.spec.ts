/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";
import {
  GameSimulator,
  GameSummary,
  RandomNumberProvider,
  SetupOptions,
  standardSimulator,
} from ".";
import { naiveRng } from "./random/naive-rng";

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
        expect(gameSummary.numSlots).toEqual(3);
      });

      it("should not have revealedLosingSlots as an array", () => {
        expect(Array.isArray(gameSummary.revealedLosingSlots)).toBeFalse();
      });

      it("should have revealedLosingSlots as integer", () => {
        expect(Number.isInteger(gameSummary.revealedLosingSlots)).toBeTrue();
      });

      it("should have a valid playerInitialPickedSlot", () => {
        expect(gameSummary.playerInitialPickedSlot).toBeGreaterThanOrEqual(0);

        expect(gameSummary.playerInitialPickedSlot).toBeLessThanOrEqual(2);
      });

      it("should have a valid confirmedPlayerPickedSlot", () => {
        expect(gameSummary.confirmedPlayerPickedSlot).toBeGreaterThanOrEqual(0);

        expect(gameSummary.confirmedPlayerPickedSlot).toBeLessThanOrEqual(2);
      });

      it("should have a valid winningSlot", () => {
        expect(gameSummary.winningSlot).toBeGreaterThanOrEqual(0);

        expect(gameSummary.winningSlot).toBeLessThanOrEqual(2);
      });

      it("should have a valid revealedLosingSlots", () => {
        expect(gameSummary.revealedLosingSlots).toBeGreaterThanOrEqual(0);

        expect(gameSummary.revealedLosingSlots).toBeLessThanOrEqual(2);
      });

      it("should have a non-revealed playerInitialPickedSlot", () => {
        expect(gameSummary.playerInitialPickedSlot).not.toEqual(
          gameSummary.revealedLosingSlots as number
        );
      });

      it("should have a non-revealed confirmedPlayerPickedSlot", () => {
        expect(gameSummary.confirmedPlayerPickedSlot).not.toEqual(
          gameSummary.revealedLosingSlots as number
        );
      });

      it("should have a non-revealed winningSlot", () => {
        expect(gameSummary.winningSlot).not.toEqual(
          gameSummary.revealedLosingSlots as number
        );
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

  describe("with a player that doesn't switch (naive)", () => {
    setupOptions = {
      isNaivePlayer: true,
      numSlots: 3,
    };

    beforeAll(() => {
      rng = naiveRng();
    });

    beforeEach(() => {
      simulator = standardSimulator(setupOptions, rng);
    });

    it("should reflect in the game summary that the persistent player did not switch", async () => {
      gameSummary = await simulator.simulateGame();
      expect(gameSummary.isNaivePlayer).toBeTrue();

      expect(gameSummary.confirmedPlayerPickedSlot).toEqual(
        gameSummary.playerInitialPickedSlot
      );
    });

    describe(
      "Validate player-type-independent specs",
      validatePlayerIndependentSpecs
    );
  });

  describe("with a player that switches (non-naive)", () => {
    beforeAll(() => {
      setupOptions = {
        isNaivePlayer: false,
        numSlots: 3,
      };
    });

    beforeEach(() => {
      simulator = standardSimulator(setupOptions, rng);
    });

    it("should reflect in the game summary that the wise (non-naive) player switched", async () => {
      gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toBeFalse();

      expect(gameSummary.confirmedPlayerPickedSlot).not.toEqual(
        gameSummary.playerInitialPickedSlot
      );
    });

    describe(
      "Validate player-type-independent specs",
      validatePlayerIndependentSpecs
    );
  });

  describe("asynchronous exception specs", () => {
    describe("for invalid game size (size not three)", () => {
      it("should asynchronously throw RangeError", async () => {
        let exception: unknown;
        const sim = standardSimulator(
          { numSlots: 2, isNaivePlayer: false },
          rng
        );

        try {
          await sim.simulateGame();
        } catch (ex: unknown) {
          exception = ex;
        }

        expect(exception instanceof RangeError).toBeTrue();
      });
    });

    describe("for RNG exceptions", () => {
      it("should asynchronously throw Error", async () => {
        let exception: unknown;
        const sim = standardSimulator(
          {
            isNaivePlayer: false,
            numSlots: 3,
          },
          {
            random: () => {
              throw Error();
            },
          }
        );

        try {
          await sim.simulateGame();
        } catch (ex: unknown) {
          exception = ex;
        }

        expect(exception instanceof Error).toBeTrue();
      });
    });
  });
});
