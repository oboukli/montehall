/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

import { csPrng } from "./csprng";

describe("csPrng", () => {
  it("should return a promise that resolves when awaited", async () => {
    await expectAsync(csPrng(1, 2)).toBeResolved();
  });

  it("should generate a number within the specified range", async () => {
    const n = await csPrng(1, 2);

    expect(n).toBeGreaterThanOrEqual(1);
    expect(n).toBeLessThanOrEqual(2);
  });

  it("should throw an error when min equals max", async () => {
    await expectAsync(csPrng(1, 1)).toBeRejected();
  });
});
