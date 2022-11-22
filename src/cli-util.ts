/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  GameSimulatorFactory,
  RandomNumberProvider,
  standardSimulator,
} from ".";

import { naiveRng } from "./random/naive-rng";
import { csPrng } from "./random/csprng";
import { tableRng } from "./random/table-rng";

export type RandomNumberProviderType = "basic" | "advanced" | "table";

/**
 * Creates a random number provider.
 *
 * @function rngFactory
 * @param rngType
 * @param numbersFilePath
 * @param isDecimalTable
 * @returns RandomNumberProvider
 */
export const rngFactory = (
  rngType: RandomNumberProviderType,
  numbersFilePath: string,
  isDecimalTable: boolean
): RandomNumberProvider => {
  switch (rngType) {
    case "advanced":
      return csPrng();
    case "table":
      return tableRng(numbersFilePath, isDecimalTable);
    default:
      return naiveRng();
  }
};

/**
 *
 * @param setupOptions
 * @param rng
 */
export const gameSimulatorFactory: GameSimulatorFactory = (
  setupOptions,
  rng
) => {
  return standardSimulator(setupOptions, rng);
};
