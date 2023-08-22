/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { describe, expect, it } from "@jest/globals";

import { AppConfig } from "./montehall.mjs";

import {
  gameSimulatorFactory,
  getConfig,
  rngFactory,
  toErrString,
} from "./util.mjs";

describe("Function toErrString", () => {
  it("should convert base Error message to string", () => {
    const err = toErrString(new Error("Dummy 001"));

    expect(err).toStrictEqual("Dummy 001");
  });

  it("should convert extended Error message to string", () => {
    const err = toErrString(new RangeError("Dummy 002"));

    expect(err).toStrictEqual("Dummy 002");
  });

  it("should return string as is", () => {
    const err = toErrString("Dummy 003");

    expect(err).toStrictEqual("Dummy 003");
  });

  it("should convert Number.NaN to string", () => {
    const err = toErrString(Number.NaN);

    expect(err).toStrictEqual("NaN");
  });

  it("should convert null to string", () => {
    const err = toErrString(null);

    expect(err).toStrictEqual("null");
  });

  it("should convert undefined to string", () => {
    const err = toErrString(undefined);

    expect(err).toStrictEqual("undefined");
  });
});

describe("Function getConfig", () => {
  it("should return valid object", async () => {
    const appConfig = await getConfig<AppConfig>("config.json");

    expect(appConfig).toStrictEqual({
      numGamesToSimulate: 16384,
      numbersFilePath: "./data/numbers.txt",
    });
  });
});

describe("Function rngFactory", () => {
  it("when rngType is advanced should return a function", () => {
    const rng = rngFactory("advanced");

    expect(rng).toBeInstanceOf(Function);
  });

  it("when rngType is table should return a function", () => {
    const rng = rngFactory("table", "dummy path");

    expect(rng).toBeInstanceOf(Function);
  });

  it("when rngType is basic should return a function", () => {
    const rng = rngFactory("basic");

    expect(rng).toBeInstanceOf(Function);
  });
});

describe("Function gameSimulatorFactory", () => {
  it("when 3 slots should return valid object", () => {
    const gameSimulator = gameSimulatorFactory(
      {
        isNaivePlayer: true,
        numSlots: 3,
      },
      rngFactory("basic"),
    );

    expect(gameSimulator).toBeInstanceOf(Object);

    expect(gameSimulator.simulateGame.bind(gameSimulator)).toBeInstanceOf(
      Function,
    );

    expect(gameSimulator.simulateGame()).toBeInstanceOf(Object);
  });

  it("when 5 slots should return valid object", () => {
    const gameSimulator = gameSimulatorFactory(
      {
        isNaivePlayer: true,
        numSlots: 5,
      },
      rngFactory("basic"),
    );

    expect(gameSimulator).toBeInstanceOf(Object);

    expect(gameSimulator.simulateGame.bind(gameSimulator)).toBeInstanceOf(
      Function,
    );

    expect(gameSimulator.simulateGame()).toBeInstanceOf(Object);
  });
});
