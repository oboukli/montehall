/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import * as fs from "fs";
import * as util from "util";

import {
  RandomNumberGenerator,
  RandomNumberProvider,
} from "../montehall";

/**
 * Provides numbers from pre-prepared, and ideally random, number table text file.
 * The quality of the randomness, or lack of it, depends on the random number table.
 */
export const tableRng = ((
  numTableFileName: string,
  isGeneral = false,
): RandomNumberProvider => {
  /**
   * Provides an integer from a preloaded number table.
   * @function random
   * @param min Minimum inclusive value (integer).
   * @param max Maximum inclusive value (integer).
   */
  let random: RandomNumberGenerator;

  let hits = 0;
  let index = 0;

  let randomNumberTableSize: number;
  let randomNumberTable: number[];

  /**
   * Provides a value from a preloaded list (number table) of values.
   * @function getRaw
   * @returns A random number (integer) between min and max inclusive.
   * @throws {Error}
   */
  const getRaw = async (): Promise<number> => {
    hits += 1;

    if (!randomNumberTable) {
      await loadNumbers();
    }

    if (hits > randomNumberTableSize) {
      throw new RangeError(`Out of random table numbers. Hits: ${hits}`);
    }

    const i = index;
    index += 1;

    return randomNumberTable[i];
  };

  /**
   * Provides an integer from a preloaded number table.
   * @function getInt
   * @param min Minimum inclusive value (integer).
   * @param max Maximum inclusive value (integer).
   */
  const getInt = async (min: number, max: number): Promise<number> => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor((await getRaw()) * (max - min + 1)) + min;
  };

  const loadNumbers = async (): Promise<void> => {
    // TODO: Verify file, check for empty ln
    const readFile = util.promisify(fs.readFile);

    let dataBuffer: string;
    try {
      dataBuffer = await readFile(numTableFileName, "utf8");
    }
    catch (ex) {
      throw new Error(`Cannot read number table. ${ex instanceof Error ? ex.message : ex}`);
    }

    randomNumberTable = dataBuffer
      .split(/\r\n|\r|\n/g)
      .map(Number);
    randomNumberTableSize = randomNumberTable.length;
  };

  if (isGeneral) {
    random = getInt;
  }
  else {
    random = getRaw;
  }

  return {
    random,
  };
});
