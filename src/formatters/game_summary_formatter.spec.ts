/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

import { gameSummaryFormatter } from "./game_summary_formatter";

describe("gameSummaryFormatter", () => {
  it("should return a string", () => {
    const summary = gameSummaryFormatter({
      setupSize: 3,
      playerInitialPickedIndex: 1,
      confirmedPlayerPickedIndex: 1,
      isPlayerStubborn: true,
      revealedLosingIndexes: 2,
      winningIndex: 0,
    });

    expect(summary).toBeInstanceOf(String);
  });

  it("should return a string of 6 delimited segments", () => {
    const delimiter = "DUMMY\r\n";
    const summary = gameSummaryFormatter(
      {
        setupSize: 3,
        playerInitialPickedIndex: 1,
        confirmedPlayerPickedIndex: 1,
        isPlayerStubborn: true,
        revealedLosingIndexes: 2,
        winningIndex: 0,
      },
      delimiter
    ).split(delimiter);

    expect(summary).toHaveSize(6);
  });
});
