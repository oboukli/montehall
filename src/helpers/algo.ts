/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

export function getRevealedSlots(
  len: number,
  s1: number,
  s2: number
): Array<number> {
  const [min, max] = s1 < s2 ? [s1, s2] : [s2, s1];
  const a = Array<number>(len - 2);
  let i = 0;
  let j = 0;

  for (; i < min; ++i) {
    a[j++] = i;
  }

  for (i = min + 1; i < max; ++i) {
    a[j++] = i;
  }

  for (i = max + 1; i < len; ++i) {
    a[j++] = i;
  }

  return a;
}
