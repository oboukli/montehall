/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { readFile } from "node:fs/promises";

import { RandomNumberGenerator } from "../montehall.mjs";

/**
 * Provides experimental numbers from pre-prepared,
 * and ideally random, number table text file.
 * The quality of the randomness, or lack of it,
 * depends on that of the random number table.
 *
 * @param numbersFilePath
 * @param isGeneral
 */
export function tableRng(numbersFilePath: string): RandomNumberGenerator {
  let hits = 0;
  let index = 0;

  let randomNumberTableSize: number;
  let randomNumberTable: number[];

  /**
   * Provides a value from a preloaded list (number table) of values.
   *
   * @function getNumber
   * @returns A number loaded and parsed from a text file, as is.
   * @throws {RangeError} When cannot return due to depletion.
   */
  const getNumber = async (): Promise<number> => {
    hits += 1;

    if (hits > randomNumberTableSize) {
      throw new RangeError(`Out of random table numbers. Hits: ${hits}`);
    }

    if (!randomNumberTable) {
      await loadNumbers();
    }

    const i = index;
    index += 1;

    return randomNumberTable[i];
  };

  const loadNumbers = async (): Promise<void> => {
    const dataBuffer = await readFile(numbersFilePath, "utf8");

    randomNumberTable = dataBuffer.split(/\r?\n/).flatMap((line) => {
      const s = line.trim();
      const n = Number(s);
      if (s === "" || Number.isNaN(n)) {
        return [];
      }

      return [n];
    });
    randomNumberTableSize = randomNumberTable.length;
  };

  return getNumber;
}
