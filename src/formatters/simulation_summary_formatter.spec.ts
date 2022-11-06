/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

import { simulationSummaryFormatter } from "./simulation_summary_formatter";

describe("simulationSummaryFormatter", () => {
  it("should return a string", () => {
    const summary = simulationSummaryFormatter(
      {
        size: 3,
        isPlayerStubborn: true,
      },
      17,
      {
        gamesWonCount: 5,
        isCompletedSuccessfully: true,
        simulationCount: 17,
      },
      "\n"
    ).toString();

    expect(summary).toBeInstanceOf(String);
  });

  it("should return a string of 6 delimited segments", () => {
    const delimiter = "DUMMY\r\n";
    const summary = simulationSummaryFormatter(
      {
        size: 3,
        isPlayerStubborn: true,
      },
      17,
      {
        gamesWonCount: 5,
        isCompletedSuccessfully: true,
        simulationCount: 17,
      },
      delimiter
    )
      .toString()
      .split(delimiter);

    expect(summary).toHaveSize(6);
  });

  it("should return a string of 5 delimited segments when simulationCount is 0", () => {
    const delimiter = "DUMMY\r\n";
    const summary = simulationSummaryFormatter(
      {
        size: 3,
        isPlayerStubborn: true,
      },
      17,
      {
        gamesWonCount: 5,
        isCompletedSuccessfully: true,
        simulationCount: 0,
      },
      delimiter
    )
      .toString()
      .split(delimiter);

    expect(summary).toHaveSize(5);
  });
});
