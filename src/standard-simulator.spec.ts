/*!
Copyright (c) 2017-2023 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

import {
  GameSimulator,
  GameSummary,
  RandomNumberGenerator,
  SetupOptions,
} from "./montehall";
import { standardSimulator } from "./montehall.mjs";
import { naiveRng } from "./random/naive.mjs";

describe("Standard Monty Hall problem simulator", () => {
  let rng: RandomNumberGenerator;
  let setupOptions: SetupOptions;

  beforeAll(() => {
    rng = naiveRng;
  });

  describe("with a player that does not switch (naive)", () => {
    beforeEach(() => {
      setupOptions = {
        isNaivePlayer: true,
        numSlots: 3,
      };
    });

    it("should reflect in the game summary that the persistent player did not switch", async () => {
      const simulator = standardSimulator(setupOptions, rng);

      const gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toStrictEqual(true);

      expect(gameSummary.confirmedPlayerPickedSlot).toStrictEqual(
        gameSummary.playerInitialPickedSlot
      );
    });

    describe("validate naive player player-type-independent specs", () => {
      let simulator: GameSimulator;
      let gameSummary: GameSummary;

      describe("Game summary", () => {
        beforeEach(async () => {
          simulator = standardSimulator(setupOptions, rng);
          gameSummary = await simulator.simulateGame();
        });

        it("should have valid setup of three slots", () => {
          expect(gameSummary.numSlots).toStrictEqual(3);
        });

        it("should not have revealedLosingSlots as an array", () => {
          expect(Array.isArray(gameSummary.revealedLosingSlots)).toBe(false);
        });

        it("should have revealedLosingSlots as integer", () => {
          expect(Number.isInteger(gameSummary.revealedLosingSlots)).toBe(true);
        });

        it("should have a valid playerInitialPickedSlot", () => {
          expect(gameSummary.playerInitialPickedSlot).toBeGreaterThanOrEqual(0);
          expect(gameSummary.playerInitialPickedSlot).toBeLessThanOrEqual(2);
        });

        it("should have a valid confirmedPlayerPickedSlot", () => {
          expect(gameSummary.confirmedPlayerPickedSlot).toBeGreaterThanOrEqual(
            0
          );
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
          expect(gameSummary.playerInitialPickedSlot).not.toStrictEqual(
            gameSummary.revealedLosingSlots as number
          );
        });

        it("should have a non-revealed confirmedPlayerPickedSlot", () => {
          expect(gameSummary.confirmedPlayerPickedSlot).not.toStrictEqual(
            gameSummary.revealedLosingSlots as number
          );
        });

        it("should have a non-revealed winningSlot", () => {
          expect(gameSummary.winningSlot).not.toStrictEqual(
            gameSummary.revealedLosingSlots as number
          );
        });
      });

      describe("the random number generator", () => {
        it("should be called a minimum of times", async () => {
          const rngMock = jest.fn<RandomNumberGenerator>((x, y) => rng(x, y));
          const s = standardSimulator(setupOptions, rngMock);

          await s.simulateGame();

          expect(rngMock.mock.calls.length).toBeGreaterThanOrEqual(2);
        });

        it("should be called with args 0 and 2", async () => {
          const rngMock = jest.fn<RandomNumberGenerator>((x, y) => rng(x, y));
          const s = standardSimulator(setupOptions, rngMock);

          await s.simulateGame();

          expect(rngMock).toHaveBeenCalledWith(0, 2);
        });
      });
    });
  });

  describe("with a player that switches (prudent)", () => {
    beforeEach(() => {
      setupOptions = {
        isNaivePlayer: false,
        numSlots: 3,
      };
    });

    it("should reflect in the game summary that the prudent player switched", async () => {
      const simulator = standardSimulator(setupOptions, rng);

      const gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toStrictEqual(false);

      expect(gameSummary.confirmedPlayerPickedSlot).not.toStrictEqual(
        gameSummary.playerInitialPickedSlot
      );
    });

    describe("validate prudent player player-type-independent specs", () => {
      let simulator: GameSimulator;
      let gameSummary: GameSummary;

      describe("Game summary", () => {
        beforeEach(async () => {
          simulator = standardSimulator(setupOptions, rng);
          gameSummary = await simulator.simulateGame();
        });

        it("should have valid setup of three slots", () => {
          expect(gameSummary.numSlots).toStrictEqual(3);
        });

        it("should not have revealedLosingSlots as an array", () => {
          expect(Array.isArray(gameSummary.revealedLosingSlots)).toBe(false);
        });

        it("should have revealedLosingSlots as integer", () => {
          expect(Number.isInteger(gameSummary.revealedLosingSlots)).toBe(true);
        });

        it("should have a valid playerInitialPickedSlot", () => {
          expect(gameSummary.playerInitialPickedSlot).toBeGreaterThanOrEqual(0);
          expect(gameSummary.playerInitialPickedSlot).toBeLessThanOrEqual(2);
        });

        it("should have a valid confirmedPlayerPickedSlot", () => {
          expect(gameSummary.confirmedPlayerPickedSlot).toBeGreaterThanOrEqual(
            0
          );
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
          expect(gameSummary.playerInitialPickedSlot).not.toStrictEqual(
            gameSummary.revealedLosingSlots as number
          );
        });

        it("should have a non-revealed confirmedPlayerPickedSlot", () => {
          expect(gameSummary.confirmedPlayerPickedSlot).not.toStrictEqual(
            gameSummary.revealedLosingSlots as number
          );
        });

        it("should have a non-revealed winningSlot", () => {
          expect(gameSummary.winningSlot).not.toStrictEqual(
            gameSummary.revealedLosingSlots as number
          );
        });
      });

      describe("the random number generator", () => {
        it("should be called a minimum of times", async () => {
          const rngMock = jest.fn<RandomNumberGenerator>((x, y) => rng(x, y));
          const s = standardSimulator(setupOptions, rngMock);

          await s.simulateGame();

          expect(rngMock.mock.calls.length).toBeGreaterThanOrEqual(2);
        });

        it("should be called with args 0 and 2", async () => {
          const rngMock = jest.fn<RandomNumberGenerator>((x, y) => rng(x, y));
          const s = standardSimulator(setupOptions, rngMock);

          await s.simulateGame();

          expect(rngMock).toHaveBeenCalledWith(0, 2);
        });
      });
    });
  });

  describe("asynchronous exception specs", () => {
    describe("for invalid game slots (slots are not three)", () => {
      it("should asynchronously throw RangeError", async () => {
        const sim = standardSimulator(
          { numSlots: 2, isNaivePlayer: false },
          rng
        );

        expect.assertions(1);
        await expect(sim.simulateGame()).rejects.toBeInstanceOf(RangeError);
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

        expect.assertions(1);
        await expect(sim.simulateGame()).rejects.toBeInstanceOf(Error);
      });
    });
  });
});
