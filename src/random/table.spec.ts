/*!
Copyright (c) 2017-2023 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { beforeAll, describe, expect, it } from "@jest/globals";

import { tableRng } from "./table.mjs";

describe("tableRng", () => {
  let tempFilePath: string;

  beforeAll(async () => {
    const tempDirFilePath = await mkdtemp(path.join(os.tmpdir(), "montehall-"));

    tempFilePath = path.join(tempDirFilePath, "rnd.txt");

    const data = new Uint8Array(Buffer.from("7\n11\n"));

    await writeFile(tempFilePath, data);
  });

  it("should return expected numbers", async () => {
    const rng = tableRng(tempFilePath);
    const n1 = await rng(0, 0);
    const n2 = await rng(0, 0);

    expect(n1).toBe(7);

    expect(n2).toBe(11);
  });

  it("should throw RangeError", async () => {
    const rng = tableRng(tempFilePath);
    const n1 = await rng(0, 0);
    const n2 = await rng(0, 0);

    expect.assertions(3);

    expect(n1).toBe(7);

    expect(n2).toBe(11);

    await expect(rng(0, 0)).rejects.toBeInstanceOf(RangeError);
  });
});
