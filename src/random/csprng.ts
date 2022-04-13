/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import * as csprng from "random-number-csprng";
import { RandomNumberProvider } from "../montehall";

/**
 * Exposes a slow but cryptographically secure
 * pseudorandom number generator.
 */
export const csPrng = ((): RandomNumberProvider => {
  /**
   * Generates a uniform distribution random integer between two values.
   * @function random
   * @param min Minimum inclusive value (integer).
   * @param max Maximum inclusive value (integer).
   */
  const random = (min: number, max: number): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      csprng(min, max, (err: Error, num: number) => {
        if (err) {
          reject(err.message);

          return;
        }
        resolve(num);
      });
    });
  };

  return {
    random
  };
});
