/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import secureRandomNumber from "random-number-csprng";
import { RandomNumberProvider } from "../montehall";

/**
 * Exposes a slow but cryptographically secure
 * pseudorandom number generator.
 *
 * @function csPrng
 * @returns number generator.
 */
export const csPrng = (): RandomNumberProvider => {
  const random = async (min: number, max: number): Promise<number> => {
    return await secureRandomNumber(min, max);
  };

  return {
    random,
  };
};
