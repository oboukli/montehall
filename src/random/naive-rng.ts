/*!
 * Any copyright is dedicated to the Public Domain. https://creativecommons.org/publicdomain/zero/1.0/
 */

import { RandomNumberProvider } from "../montehall";

export const naiveRng = (): RandomNumberProvider => {
  /**
   * Generates a uniform distribution random integer between two values.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   *
   * @function random
   * @param min Minimum inclusive value (integer).
   * @param max Maximum inclusive value (integer).
   * @returns A random number (integer) between min and max inclusive.
   */
  const random = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return {
    random,
  };
};
