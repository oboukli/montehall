/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

import { generalSimulator, RandomNumberGenerator, SetupOptions } from ".";

describe("Simulator of Generalized Monty Hall problem", () => {
  describe("simulating standard three-door problem", () => {
    function* fakeRngGen(): Generator<number, number, number> {
      yield 0;
      yield 1;
      yield 2;

      return 0;
    }

    describe("with a player who does not switch (naive)", () => {
      let setupOptions: SetupOptions;
      let spyRng: jasmine.Spy<RandomNumberGenerator>;

      beforeEach(() => {
        const fakeRng = fakeRngGen();
        spyRng = jasmine
          .createSpy("spyRng")
          .and.callFake(
            (): Promise<number> => Promise.resolve(fakeRng.next().value)
          );

        setupOptions = {
          isNaivePlayer: true,
          numSlots: 3,
        };
      });

      it("should return a valid game summary", async () => {
        const simulator = generalSimulator(setupOptions, spyRng);

        const gameSummary = await simulator.simulateGame();

        expect(gameSummary).toEqual({
          winningSlot: 0,
          revealedLosingSlots: [2],
          isNaivePlayer: true,
          numSlots: 3,
          playerInitialPickedSlot: 1,
          confirmedPlayerPickedSlot: 1,
        });
      });

      it("should not return an invalid game summary", async () => {
        const simulator = generalSimulator(setupOptions, spyRng);

        const gameSummary = await simulator.simulateGame();

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

      it("should call the RNG a minimum of times for the naive player", async () => {
        const s = generalSimulator(setupOptions, spyRng);

        await s.simulateGame();

        expect(spyRng.calls.count()).toBeGreaterThanOrEqual(2);
      });

      it("should call the RNG with args 0 and 2", async () => {
        const s = generalSimulator(setupOptions, spyRng);

        await s.simulateGame();

        expect(spyRng).toHaveBeenCalledWith(0, 2);
      });
    });

    describe("with a player who switches (prudent)", () => {
      let setupOptions: SetupOptions;
      let spyRng: jasmine.Spy<RandomNumberGenerator>;

      beforeEach(() => {
        const fakeRng = fakeRngGen();
        spyRng = jasmine
          .createSpy("spyRng")
          .and.callFake(
            (): Promise<number> => Promise.resolve(fakeRng.next().value)
          );

        setupOptions = {
          isNaivePlayer: false,
          numSlots: 3,
        };
      });

      it("should return a valid game summary", async () => {
        const simulator = generalSimulator(setupOptions, spyRng);

        const gameSummary = await simulator.simulateGame();

        expect(gameSummary).toEqual({
          winningSlot: 0,
          revealedLosingSlots: [2],
          isNaivePlayer: false,
          numSlots: 3,
          playerInitialPickedSlot: 1,
          confirmedPlayerPickedSlot: 0,
        });
      });

      it("should not return an invalid game summary", async () => {
        const simulator = generalSimulator(setupOptions, spyRng);

        const gameSummary = await simulator.simulateGame();

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

      it("should call the RNG a minimum of times for the prudent player", async () => {
        const s = generalSimulator(setupOptions, spyRng);

        await s.simulateGame();

        expect(spyRng.calls.count()).toBeGreaterThanOrEqual(3);
      });

      it("should call the RNG with args 0 and 2", async () => {
        const s = generalSimulator(setupOptions, spyRng);

        await s.simulateGame();

        expect(spyRng).toHaveBeenCalledWith(0, 2);
      });
    });
  });

  describe("simulating five-door problem, with one winning door", () => {
    function* fakeRngGen(): Generator<number, number, number> {
      yield 4;
      yield 0;
      yield 1;
      yield 2;
      yield 3;

      return 4;
    }

    describe("with a player who does not change pick", () => {
      describe("pick one, reveal three, do not change pick", () => {
        let setupOptions: SetupOptions;
        let spyRng: jasmine.Spy<RandomNumberGenerator>;

        beforeEach(() => {
          const fakeRng = fakeRngGen();
          spyRng = jasmine
            .createSpy("spyRng")
            .and.callFake(
              (): Promise<number> => Promise.resolve(fakeRng.next().value)
            );

          setupOptions = {
            isNaivePlayer: true,
            numSlots: 5,
          };
        });

        it("should return a valid game summary", async () => {
          const simulator = generalSimulator(setupOptions, spyRng);

          const gameSummary = await simulator.simulateGame();

          expect(gameSummary).toEqual({
            winningSlot: 4,
            revealedLosingSlots: [1, 2, 3],
            isNaivePlayer: true,
            numSlots: 5,
            playerInitialPickedSlot: 0,
            confirmedPlayerPickedSlot: 0,
          });
        });

        it("should not return an invalid game summary", async () => {
          const simulator = generalSimulator(setupOptions, spyRng);

          const gameSummary = await simulator.simulateGame();

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

        it("should call the RNG a minimum of times for the naive player", async () => {
          const s = generalSimulator(setupOptions, spyRng);

          await s.simulateGame();

          expect(spyRng.calls.count()).toBeGreaterThanOrEqual(2);
        });

        it("should call the RNG with args 0 and 4", async () => {
          const s = generalSimulator(setupOptions, spyRng);

          await s.simulateGame();

          expect(spyRng).toHaveBeenCalledWith(0, 4);
        });
      });
    });

    describe("with a player who changes pick", () => {
      describe("pick one, reveal three, change pick", () => {
        let setupOptions: SetupOptions;
        let spyRng: jasmine.Spy<RandomNumberGenerator>;

        beforeEach(() => {
          const fakeRng = fakeRngGen();
          spyRng = jasmine
            .createSpy("spyRng")
            .and.callFake(
              (): Promise<number> => Promise.resolve(fakeRng.next().value)
            );

          setupOptions = {
            isNaivePlayer: false,
            numSlots: 5,
          };
        });

        it("should return a valid game summary", async () => {
          const simulator = generalSimulator(setupOptions, spyRng);

          const gameSummary = await simulator.simulateGame();

          expect(gameSummary).toEqual({
            winningSlot: 4,
            revealedLosingSlots: [1, 2, 3],
            isNaivePlayer: false,
            numSlots: 5,
            playerInitialPickedSlot: 0,
            confirmedPlayerPickedSlot: 4,
          });
        });

        it("should not return an invalid game summary", async () => {
          const simulator = generalSimulator(setupOptions, spyRng);

          const gameSummary = await simulator.simulateGame();

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

        it("should call the RNG a minimum of times for the prudent player", async () => {
          const s = generalSimulator(setupOptions, spyRng);

          await s.simulateGame();

          expect(spyRng.calls.count()).toBeGreaterThanOrEqual(6);
        });

        it("should call the RNG with args 0 and 4", async () => {
          const s = generalSimulator(setupOptions, spyRng);

          await s.simulateGame();

          expect(spyRng).toHaveBeenCalledWith(0, 4);
        });
      });
    });
  });
});
