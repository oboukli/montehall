/*!
Any copyright is dedicated to the Public Domain.
License: https://creativecommons.org/publicdomain/zero/1.0/

SPDX-License-Identifier: CC0-1.0
 */

/**
 * Generates a uniform distribution random integer between two values.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 *
 * @param min Minimum inclusive value (integer).
 * @param max Maximum inclusive value (integer).
 * @returns A random number (integer) between min and max inclusive.
 */
export function naiveRng(min: number, max: number): Promise<number> {
  const _min = Math.ceil(min);

  return Promise.resolve(
    Math.floor(Math.random() * (Math.floor(max) - _min + 1)) + _min,
  );
}
