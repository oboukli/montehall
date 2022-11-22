/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

// TODO:

import "jasmine";
import {
  GameSimulator,
  generalSimulator,
  RandomNumberProvider,
  SetupOptions,
} from ".";
import { naiveRng } from "./random/naive-rng";

describe("GeneralSimulator", () => {
  let simulator: GameSimulator;
  let setupOptions: SetupOptions;
  let rng: RandomNumberProvider;

  describe("Standard three-door Monty Hall problem with a naive player", () => {
    beforeAll(() => {
      return;
    });

    beforeEach(() => {
      setupOptions = {
        isNaivePlayer: true,
        numSlots: 3,
      };

      rng = naiveRng();

      simulator = generalSimulator(setupOptions, rng);
    });

    it("should return a valid game summary", async () => {
      const gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toBeTrue();
      expect(Array.isArray(gameSummary.revealedLosingSlots)).toBeTrue();
      expect((gameSummary.revealedLosingSlots as number[]).length).toEqual(1);
      expect(gameSummary.numSlots).toEqual(3);

      expect(gameSummary.confirmedPlayerPickedSlot).toEqual(
        gameSummary.playerInitialPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.playerInitialPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.confirmedPlayerPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.winningSlot
      );
    });

    it("should call the RNG a minimum of three times for the naive player", async () => {
      const rngSpy = spyOn(rng, "random").and.callThrough();

      const s = generalSimulator(setupOptions, rng);
      await s.simulateGame();

      expect(rngSpy.calls.count()).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Standard three-door Monty Hall problem with a wise player", () => {
    beforeAll(() => {
      return;
    });

    beforeEach(() => {
      setupOptions = {
        isNaivePlayer: false,
        numSlots: 3,
      };

      simulator = generalSimulator(setupOptions, rng);
    });

    it("should return a valid game summary", async () => {
      const gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toBeFalse();
      expect(Array.isArray(gameSummary.revealedLosingSlots)).toBeTrue();
      expect((gameSummary.revealedLosingSlots as number[]).length).toEqual(1);
      expect(gameSummary.numSlots).toEqual(3);

      expect(gameSummary.confirmedPlayerPickedSlot).not.toEqual(
        gameSummary.playerInitialPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.playerInitialPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.confirmedPlayerPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.winningSlot
      );
    });

    it("should call the RNG a minimum of four times for the wise player", async () => {
      const rngSpy = spyOn(rng, "random").and.callThrough();

      const s = generalSimulator(setupOptions, rng);
      await s.simulateGame();

      expect(rngSpy.calls.count()).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Five doors, one winning, pick one, reveal three, don't change pick", () => {
    it("should return a valid game summary", async () => {
      setupOptions = {
        isNaivePlayer: true,
        numSlots: 5,
      };
      simulator = generalSimulator(setupOptions, rng);

      const gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toBeTrue();
      expect(Array.isArray(gameSummary.revealedLosingSlots)).toBeTrue();
      expect((gameSummary.revealedLosingSlots as number[]).length).toEqual(3);
      expect(gameSummary.numSlots).toEqual(5);

      expect(gameSummary.confirmedPlayerPickedSlot).toEqual(
        gameSummary.playerInitialPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.playerInitialPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.confirmedPlayerPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.winningSlot
      );
    });
  });

  describe("Five doors, one winning, pick one, change pick, reveal three", () => {
    it("should return a valid game summary", async () => {
      setupOptions = {
        isNaivePlayer: false,
        numSlots: 5,
      };
      simulator = generalSimulator(setupOptions, rng);

      const gameSummary = await simulator.simulateGame();

      expect(gameSummary.isNaivePlayer).toBeFalse();
      expect(Array.isArray(gameSummary.revealedLosingSlots)).toBeTrue();
      expect((gameSummary.revealedLosingSlots as number[]).length).toEqual(3);
      expect(gameSummary.numSlots).toEqual(5);

      expect(gameSummary.confirmedPlayerPickedSlot).not.toEqual(
        gameSummary.playerInitialPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.playerInitialPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.confirmedPlayerPickedSlot
      );

      expect(gameSummary.revealedLosingSlots).not.toContain(
        gameSummary.winningSlot
      );
    });
  });
});
