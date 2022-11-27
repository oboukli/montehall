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

  it("should return a string when optional argument is not passed", () => {
    const formattedSimulationSummary = simulationSummaryFormatter(
      {
        numSlots: 3,
        isNaivePlayer: true,
      },
      19,
      {
        numWonGames: 7,
        isCompletedSuccessfully: true,
        numSimulations: 19,
      }
    );

    expect(formattedSimulationSummary).toBeInstanceOf(String);
  });

  it("should return a string of 6 delimited segments when optional argument is not passed", () => {
    const formattedSimulationSummarySegments = simulationSummaryFormatter(
      {
        numSlots: 3,
        isNaivePlayer: true,
      },
      19,
      {
        numWonGames: 7,
        isCompletedSuccessfully: true,
        numSimulations: 19,
      }
    ).split("\n");

    expect(formattedSimulationSummarySegments).toHaveSize(6);
  });

  it("should return a string of 6 delimited segments", () => {
    const delimiter = "DUMMY\r\n";
    const formattedSimulationSummarySegments = simulationSummaryFormatter(
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

    expect(formattedSimulationSummarySegments).toHaveSize(6);
  });

  it("should return a string of 5 delimited segments when simulationCount is 0", () => {
    const delimiter = "DUMMY\r\n";
    const formattedSimulationSummarySegments = simulationSummaryFormatter(
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

    expect(formattedSimulationSummarySegments).toHaveSize(5);
  });
});
