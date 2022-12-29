/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { readFile } from "node:fs/promises";

import {
  GameSimulator,
  RandomNumberGenerator,
  SetupOptions,
  standardSimulator,
} from ".";

import { naiveRng } from "./random/naive";
import { csPrng } from "./random/csprng";
import { tableRng } from "./random/table";

export type RandomNumberProviderType = "basic" | "advanced" | "table";

/**
 * Deserialize configuration JSON UTF-8 file.
 *
 * @param filename Path name of JSON file to deserialize
 * @returns Configuration object
 */
export async function getConfig<T>(filename: string): Promise<T> {
  const content = await readFile(filename, {
    encoding: "utf8",
  });

  return JSON.parse(content) as T;
}

/**
 * Create a random number provider.
 *
 * @param rngType
 * @param numbersFilePath
 * @param isDecimalTable
 * @returns Random number generator
 */
export function rngFactory(
  rngType: RandomNumberProviderType,
  numbersFilePath = ""
): RandomNumberGenerator {
  switch (rngType) {
    case "advanced":
      return csPrng;
    case "table":
      return tableRng(numbersFilePath);
    default:
      return naiveRng;
  }
}

/**
 * Create game simulator instance.
 *
 * @param setupOptions
 * @param rng
 * @return Game simulator
 */
export function gameSimulatorFactory(
  setupOptions: SetupOptions,
  rng: RandomNumberGenerator
): GameSimulator {
  return standardSimulator(setupOptions, rng);
}

/**
 * Exception to error message helper.
 *
 * @param e Exception
 * @returns Error message
 */
export function toErrString(e: unknown): string {
  let err: string;

  if (e instanceof Error) {
    err = e.message;
  } else if (typeof e === "string") {
    err = e;
  } else {
    err = String(e);
  }

  return err;
}
