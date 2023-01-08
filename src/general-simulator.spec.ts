/*!
Copyright (c) 2017-2023 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

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
      let rngMock: jest.Mock<RandomNumberGenerator>;

      beforeEach(() => {
        const fakeRng = fakeRngGen();
        rngMock = jest.fn(
          (): Promise<number> => Promise.resolve(fakeRng.next().value)
        );

        setupOptions = {
          isNaivePlayer: true,
          numSlots: 3,
        };
      });

      it("should return a valid game summary (case 001)", async () => {
        const simulator = generalSimulator(setupOptions, rngMock);

        const gameSummary = await simulator.simulateGame();

        expect(gameSummary).toStrictEqual({
          winningSlot: 0,
          revealedLosingSlots: [2],
          isNaivePlayer: true,
          numSlots: 3,
          playerInitialPickedSlot: 1,
          confirmedPlayerPickedSlot: 1,
        });
      });

      it("should not return an invalid game summary (case 001)", async () => {
        const simulator = generalSimulator(setupOptions, rngMock);

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

      it("should call the RNG a minimum of times for the naive player (case 001)", async () => {
        const s = generalSimulator(setupOptions, rngMock);

        await s.simulateGame();

        expect(rngMock.mock.calls).toHaveLength(2);
      });

      it("should call the RNG with args 0 and 2 (case 001)", async () => {
        const s = generalSimulator(setupOptions, rngMock);

        await s.simulateGame();

        expect(rngMock).toHaveBeenCalledWith(0, 2);
      });
    });

    describe("with a player who switches (prudent)", () => {
      let setupOptions: SetupOptions;
      let rngMock: jest.Mock<RandomNumberGenerator>;

      beforeEach(() => {
        const fakeRng = fakeRngGen();
        rngMock = jest.fn(
          (): Promise<number> => Promise.resolve(fakeRng.next().value)
        );

        setupOptions = {
          isNaivePlayer: false,
          numSlots: 3,
        };
      });

      it("should return a valid game summary (case 002)", async () => {
        const simulator = generalSimulator(setupOptions, rngMock);

        const gameSummary = await simulator.simulateGame();

        expect(gameSummary).toStrictEqual({
          winningSlot: 0,
          revealedLosingSlots: [2],
          isNaivePlayer: false,
          numSlots: 3,
          playerInitialPickedSlot: 1,
          confirmedPlayerPickedSlot: 0,
        });
      });

      it("should not return an invalid game summary (case 002)", async () => {
        const simulator = generalSimulator(setupOptions, rngMock);

        const gameSummary = await simulator.simulateGame();

        expect(gameSummary.confirmedPlayerPickedSlot).not.toStrictEqual(
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

      it("should call the RNG a minimum of times for the prudent player (case 002)", async () => {
        const s = generalSimulator(setupOptions, rngMock);

        await s.simulateGame();

        expect(rngMock.mock.calls).toHaveLength(4);
      });

      it("should call the RNG with args 0 and 2 (case 002)", async () => {
        const s = generalSimulator(setupOptions, rngMock);

        await s.simulateGame();

        expect(rngMock).toHaveBeenCalledWith(0, 2);
      });
    });
  });

  describe("simulating five-door problem, with one winning door", () => {
    function* naiveFriendlyRngGen(): Generator<number, number, number> {
      yield 4;
      yield 0;
      yield 1;
      yield 2;
      yield 3;

      return 4;
    }

    function* prudentFriendlyRngGen(): Generator<number, number, number> {
      yield 4;
      yield 4;

      return 1;
    }

    describe("with a player who does not change pick", () => {
      describe("pick one, reveal three, do not change pick, player wins", () => {
        let setupOptions: SetupOptions;
        let rngMock: jest.Mock<RandomNumberGenerator>;

        beforeEach(() => {
          const fakeRng = prudentFriendlyRngGen();
          rngMock = jest.fn(
            (): Promise<number> => Promise.resolve(fakeRng.next().value)
          );

          setupOptions = {
            isNaivePlayer: true,
            numSlots: 5,
          };
        });

        it("should return a valid game summary where player wins (case 003)", async () => {
          const simulator = generalSimulator(setupOptions, rngMock);

          const gameSummary = await simulator.simulateGame();

          expect(gameSummary).toStrictEqual({
            winningSlot: 4,
            revealedLosingSlots: [0, 2, 3],
            isNaivePlayer: true,
            numSlots: 5,
            playerInitialPickedSlot: 4,
            confirmedPlayerPickedSlot: 4,
          });
        });

        it("should not return an invalid game summary (case 003)", async () => {
          const simulator = generalSimulator(setupOptions, rngMock);

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

        it("should call the RNG a minimum of times for the naive player (case 003)", async () => {
          const s = generalSimulator(setupOptions, rngMock);

          await s.simulateGame();

          expect(rngMock.mock.calls).toHaveLength(3);
        });

        it("should call the RNG with args 0 and 4 (case 003)", async () => {
          const s = generalSimulator(setupOptions, rngMock);

          await s.simulateGame();

          expect(rngMock).toHaveBeenCalledWith(0, 4);
        });
      });

      describe("pick one, reveal three, do not change pick, player loses", () => {
        let setupOptions: SetupOptions;
        let rngMock: jest.Mock<RandomNumberGenerator>;

        beforeEach(() => {
          const fakeRng = naiveFriendlyRngGen();
          rngMock = jest.fn(
            (): Promise<number> => Promise.resolve(fakeRng.next().value)
          );

          setupOptions = {
            isNaivePlayer: true,
            numSlots: 5,
          };
        });

        it("should return a valid game summary where player loses (case 003)", async () => {
          const simulator = generalSimulator(setupOptions, rngMock);

          const gameSummary = await simulator.simulateGame();

          expect(gameSummary).toStrictEqual({
            winningSlot: 4,
            revealedLosingSlots: [1, 2, 3],
            isNaivePlayer: true,
            numSlots: 5,
            playerInitialPickedSlot: 0,
            confirmedPlayerPickedSlot: 0,
          });
        });
      });
    });

    describe("with a player who changes pick", () => {
      describe("pick one, reveal three, change pick", () => {
        let setupOptions: SetupOptions;
        let rngMock: jest.Mock<RandomNumberGenerator>;

        beforeEach(() => {
          const fakeRng = naiveFriendlyRngGen();
          rngMock = jest.fn(
            (): Promise<number> => Promise.resolve(fakeRng.next().value)
          );

          setupOptions = {
            isNaivePlayer: false,
            numSlots: 5,
          };
        });

        it("should return a valid game summary (case 004)", async () => {
          const simulator = generalSimulator(setupOptions, rngMock);

          const gameSummary = await simulator.simulateGame();

          expect(gameSummary).toStrictEqual({
            winningSlot: 4,
            revealedLosingSlots: [1, 2, 3],
            isNaivePlayer: false,
            numSlots: 5,
            playerInitialPickedSlot: 0,
            confirmedPlayerPickedSlot: 4,
          });
        });

        it("should not return an invalid game summary (case 004)", async () => {
          const simulator = generalSimulator(setupOptions, rngMock);

          const gameSummary = await simulator.simulateGame();

          expect(gameSummary.confirmedPlayerPickedSlot).not.toStrictEqual(
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

        it("should call the RNG a minimum of times for the prudent player (case 004)", async () => {
          const s = generalSimulator(setupOptions, rngMock);

          await s.simulateGame();

          expect(rngMock.mock.calls).toHaveLength(6);
        });

        it("should call the RNG with args 0 and 4 (case 004)", async () => {
          const s = generalSimulator(setupOptions, rngMock);

          await s.simulateGame();

          expect(rngMock).toHaveBeenCalledWith(0, 4);
        });
      });
    });
  });

  describe("revealed slots in", () => {
    function* fakeRngGen(): Generator<number, number, number> {
      yield 4;
      return 3;
    }

    describe("pick one, reveal three, do not change pick", () => {
      let setupOptions: SetupOptions;
      let rngMock: jest.Mock<RandomNumberGenerator>;

      beforeEach(() => {
        const fakeRng = fakeRngGen();
        rngMock = jest.fn(
          (): Promise<number> => Promise.resolve(fakeRng.next().value)
        );

        setupOptions = {
          isNaivePlayer: true,
          numSlots: 5,
        };
      });

      it("should be correct (case 005)", async () => {
        const simulator = generalSimulator(setupOptions, rngMock);

        const gameSummary = await simulator.simulateGame();

        expect(gameSummary.revealedLosingSlots).toStrictEqual([0, 1, 2]);
      });

      it("should call the RNG a minimum of times for the naive player (case 005)", async () => {
        const s = generalSimulator(setupOptions, rngMock);

        await s.simulateGame();

        expect(rngMock.mock.calls).toHaveLength(2);
      });

      it("should call the RNG with args 0 and 4 (case 005)", async () => {
        const s = generalSimulator(setupOptions, rngMock);

        await s.simulateGame();

        expect(rngMock).toHaveBeenCalledWith(0, 4);
      });
    });
  });
});
