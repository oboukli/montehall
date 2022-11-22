/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

import { simulationSummaryFormatter } from "./simulation-summary-formatter";

describe("simulationSummaryFormatter", () => {
  it("should return a string", () => {
    const formattedSimulationSummary = simulationSummaryFormatter(
      {
        numSlots: 3,
        isNaivePlayer: true,
      },
      17,
      {
        numWonGames: 5,
        isCompletedSuccessfully: true,
        numSimulations: 17,
      },
      "\n"
    );

    expect(formattedSimulationSummary).toBeInstanceOf(String);
  });

  it("should return a string of 6 delimited segments", () => {
    const delimiter = "DUMMY\r\n";
    const formattedSimulationSummary = simulationSummaryFormatter(
      {
        numSlots: 3,
        isNaivePlayer: true,
      },
      17,
      {
        numWonGames: 5,
        isCompletedSuccessfully: true,
        numSimulations: 17,
      },
      delimiter
    ).split(delimiter);

    expect(formattedSimulationSummary).toHaveSize(6);
  });

  it("should return a string of 5 delimited segments when simulationCount is 0", () => {
    const delimiter = "DUMMY\r\n";
    const formattedSimulationSummary = simulationSummaryFormatter(
      {
        numSlots: 3,
        isNaivePlayer: true,
      },
      17,
      {
        numWonGames: 5,
        isCompletedSuccessfully: true,
        numSimulations: 0,
      },
      delimiter
    ).split(delimiter);

    expect(formattedSimulationSummary).toHaveSize(5);
  });
});
