/*!
Copyright(c) 2017 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.
*/
 // TODO:
import {
    GameSimulator,
    generalSimulator,
    RandomNumberProvider,
    SetupOptions,
} from ".";
import { naiveRng } from "./random/naive_rng";

describe("GeneralSimulator", () => {
    let simulator: GameSimulator;
    let setupOptions: SetupOptions;
    let rng: RandomNumberProvider;

    describe("Standard three-door Monty Hall problem with a stubborn player", () => {
        beforeAll(async () => {
            return;
        });

        beforeEach(async () => {
            setupOptions = {
                isPlayerStubborn: true,
                size: 3,
            };

            rng = naiveRng();

            simulator = generalSimulator(setupOptions, rng);
        });

        it("should return a valid game summary", async () => {
            const gameSummary = await simulator.simulateGame();

            expect(gameSummary.isPlayerStubborn).toBeTruthy();
            expect(Array.isArray(gameSummary.revealedLosingIndexes)).toBeTruthy();
            expect((gameSummary.revealedLosingIndexes as number[]).length).toEqual(1);
            expect(gameSummary.setupSize).toEqual(3);

            expect(gameSummary.confirmedPlayerPickedIndex)
                .toEqual(gameSummary.playerInitialPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.playerInitialPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.confirmedPlayerPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.winningIndex);
        });

        it("should call the RNG a minimum of three times for the stubborn player", async () => {
            const rngSpy = spyOn(rng, "random").and.callThrough();

            const s = generalSimulator(setupOptions, rng);
            await s.simulateGame();

            expect(rngSpy.calls.count()).toBeGreaterThanOrEqual(3);
        });
    });

    describe("Standard three-door Monty Hall problem with a wise player", () => {
        beforeAll(async () => {
            return;
        });

        beforeEach(async () => {
            setupOptions = {
                isPlayerStubborn: false,
                size: 3,
            };

            simulator = generalSimulator(setupOptions, rng);
        });

        it("should return a valid game summary", async () => {
            const gameSummary = await simulator.simulateGame();

            expect(gameSummary.isPlayerStubborn).toBeFalsy();
            expect(Array.isArray(gameSummary.revealedLosingIndexes)).toBeTruthy();
            expect((gameSummary.revealedLosingIndexes as number[]).length).toEqual(1);
            expect(gameSummary.setupSize).toEqual(3);

            expect(gameSummary.confirmedPlayerPickedIndex)
                .not.toEqual(gameSummary.playerInitialPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.playerInitialPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.confirmedPlayerPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.winningIndex);
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
                isPlayerStubborn: true,
                size: 5,
            };
            simulator = generalSimulator(setupOptions, rng);

            const gameSummary = await simulator.simulateGame();

            expect(gameSummary.isPlayerStubborn).toBeTruthy();
            expect(Array.isArray(gameSummary.revealedLosingIndexes)).toBeTruthy();
            expect((gameSummary.revealedLosingIndexes as number[]).length).toEqual(3);
            expect(gameSummary.setupSize).toEqual(5);

            expect(gameSummary.confirmedPlayerPickedIndex)
                .toEqual(gameSummary.playerInitialPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.playerInitialPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.confirmedPlayerPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.winningIndex);
        });
    });

    describe("Five doors, one winning, pick one, change pick, reveal three", () => {
        it("should return a valid game summary", async () => {
            setupOptions = {
                isPlayerStubborn: false,
                size: 5,
            };
            simulator = generalSimulator(setupOptions, rng);

            const gameSummary = await simulator.simulateGame();

            expect(gameSummary.isPlayerStubborn).toBeFalsy();
            expect(Array.isArray(gameSummary.revealedLosingIndexes)).toBeTruthy();
            expect((gameSummary.revealedLosingIndexes as number[]).length).toEqual(3);
            expect(gameSummary.setupSize).toEqual(5);

            expect(gameSummary.confirmedPlayerPickedIndex)
                .not.toEqual(gameSummary.playerInitialPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.playerInitialPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.confirmedPlayerPickedIndex);

            expect(gameSummary.revealedLosingIndexes).not.toContain(gameSummary.winningIndex);
        });
    });
});