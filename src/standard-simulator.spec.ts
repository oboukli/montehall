/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

import {
  GameSimulator,
  GameSummary,
  RandomNumberGenerator,
  SetupOptions,
  standardSimulator,
} from ".";
import { naiveRng } from "./random/naive-rng";

describe("Standard Monty Hall problem simulator", () => {
  let setupOptions: SetupOptions;
  let rng: RandomNumberGenerator;
  let simulator: GameSimulator;

  function playerIndependentSpecs() {
    let gameSummary: GameSummary;

    describe("Game summary", () => {
      beforeEach(async () => {
        gameSummary = await simulator.simulateGame();
      });

      it("should have valid setup of three slots", () => {
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
        const spyRng = jasmine.createSpy("spyRng", rng).and.callThrough();
        const s = standardSimulator(setupOptions, spyRng);

        await s.simulateGame();

        expect(spyRng.calls.count()).toBeGreaterThanOrEqual(2);
      });

      it("should be called with args 0 and 2", async () => {
        const spyRng = jasmine.createSpy("spyRng", rng).and.callThrough();
        const s = standardSimulator(setupOptions, spyRng);

        await s.simulateGame();

        expect(spyRng).toHaveBeenCalledWith(0, 2);
      });
    });
  }

  beforeAll(() => {
    rng = naiveRng;
  });

  describe("with a player that does not switch (naive)", () => {
    beforeEach(() => {
      setupOptions = {
        isNaivePlayer: true,
        numSlots: 3,
      };

      simulator = standardSimulator(setupOptions, rng);
    });

    it("should reflect in the game summary that the persistent player did not switch", async () => {
      const gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toBeTrue();

      expect(gameSummary.confirmedPlayerPickedSlot).toEqual(
        gameSummary.playerInitialPickedSlot
      );
    });

    describe("Validate player-type-independent specs", playerIndependentSpecs);
  });

  describe("with a player that switches (prudent)", () => {
    let simulator: GameSimulator;

    beforeEach(() => {
      setupOptions = {
        isNaivePlayer: false,
        numSlots: 3,
      };

      simulator = standardSimulator(setupOptions, rng);
    });

    it("should reflect in the game summary that the wise (non-naive) player switched", async () => {
      const gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toBeFalse();

      expect(gameSummary.confirmedPlayerPickedSlot).not.toEqual(
        gameSummary.playerInitialPickedSlot
      );
    });

    describe("Validate player-type-independent specs", playerIndependentSpecs);
  });

  describe("asynchronous exception specs", () => {
    describe("for invalid game slots (slots are not three)", () => {
      it("should asynchronously throw RangeError", async () => {
        const sim = standardSimulator(
          { numSlots: 2, isNaivePlayer: false },
          rng
        );

        await expectAsync(sim.simulateGame()).toBeRejectedWithError(RangeError);
      });
    });

    describe("for RNG exceptions", () => {
      it("should asynchronously throw Error", async () => {
        const sim = standardSimulator(
          {
            isNaivePlayer: false,
            numSlots: 3,
          },
          () => {
            throw Error();
          }
        );

        await expectAsync(sim.simulateGame()).toBeRejectedWithError(Error);
      });
    });
  });
});
