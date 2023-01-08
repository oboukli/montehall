/*!
Copyright (c) 2017-2023 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { describe, expect, it } from "@jest/globals";

import { gameSummaryFormatter } from "./game-summary-formatter";

describe("gameSummaryFormatter", () => {
  it("should return a string", () => {
    const summary = gameSummaryFormatter({
      numSlots: 3,
      playerInitialPickedSlot: 1,
      confirmedPlayerPickedSlot: 1,
      isNaivePlayer: true,
      revealedLosingSlots: 2,
      winningSlot: 0,
    });

    expect(typeof summary).toBe("string");
  });

  it("should return a string of 6 delimited segments", () => {
    const delimiter = "DUMMY\r\n";
    const summary = gameSummaryFormatter(
      {
        numSlots: 3,
        playerInitialPickedSlot: 1,
        confirmedPlayerPickedSlot: 1,
        isNaivePlayer: true,
        revealedLosingSlots: 2,
        winningSlot: 0,
      },
      delimiter
    ).split(delimiter);

    expect(summary).toHaveLength(6);
  });
});
