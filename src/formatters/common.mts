/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

/**
 * Maps boolean value to string.
 *
 * @param b Boolean value to convert.
 * @param t String substitute value for true.
 * @param f String substitute value for false.
 * @returns Mapped string.
 */
export function b2text(b: boolean, t: string, f: string): string {
  return b ? t : f;
}
