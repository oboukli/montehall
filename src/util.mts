/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { PathLike } from "node:fs";
import { FileHandle, readFile } from "node:fs/promises";

import {
  GameSimulator,
  RandomNumberGenerator,
  SetupOptions,
} from "./montehall";
import { generalSimulator, standardSimulator } from "./montehall.mjs";
import { naiveRng } from "./random/naive.mjs";
import { csPrng } from "./random/csprng.mjs";
import { tableRng } from "./random/table.mjs";

export type RandomNumberProviderType = "basic" | "advanced" | "table";

/**
 * Deserialize configuration JSON UTF-8 file.
 *
 * @param filename Path name of JSON file to deserialize
 * @returns Configuration object
 */
export async function getConfig<T>(
  filename: PathLike | FileHandle,
): Promise<T> {
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
  numbersFilePath = "",
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
  rng: RandomNumberGenerator,
): GameSimulator {
  if (setupOptions.numSlots === 3) {
    return standardSimulator(setupOptions, rng);
  }

  return generalSimulator(setupOptions, rng);
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
