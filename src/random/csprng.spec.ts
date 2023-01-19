/*!
Copyright (c) 2017-2023 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { describe, expect, it } from "@jest/globals";

import { csPrng } from "./csprng.mjs";

describe("csPrng", () => {
  it("should return a promise that resolves when awaited", async () => {
    expect.assertions(1);

    await expect(csPrng(1, 2)).resolves.toBeGreaterThanOrEqual(1);
  });

  it("should generate a number within the specified range", async () => {
    const n = await csPrng(1, 2);

    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(2);
  });

  it("should throw an error when min equals max", async () => {
    const n = await csPrng(1, 1);

    expect(n).toStrictEqual(1);
  });
});
