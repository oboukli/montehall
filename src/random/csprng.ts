/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import secureRandomNumber from "random-number-csprng";

/**
 * Slow but high-quality (cryptographically secure)
 * pseudorandom number generator.
 *
 * @param min Minimum inclusive value (integer).
 * @param max Maximum inclusive value (integer).
 * @returns A random number (integer) between min and max inclusive.
 */
export async function csPrng(min: number, max: number): Promise<number> {
  return await secureRandomNumber(min, max);
}
