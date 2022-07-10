/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  SetupOptions,
  SimulationSummary,
} from "../montehall";

export const simulationSummaryFormatter = ((
  o: SetupOptions,
  numRequestedGames: number,
  summary: SimulationSummary,
  eol = "\n",
): { toString: () => string } => {
  const toString = (): string => {
    const padding = 17;
    const gamesWonPercentage = (summary.gamesWonCount * 100) / summary.simulationCount;

    let s = `${"Game setup size:".padEnd(padding)}${o.size}${eol}`;
    s += `${"Player switches:".padEnd(padding)}${!o.isPlayerStubborn}${eol}`;
    s += `${"Games requested:".padEnd(padding)}${numRequestedGames}${eol}`;
    s += `${"Games simulated:".padEnd(padding)}${summary.simulationCount}${eol}`;
    s += `${"Games won:".padEnd(padding)}${summary.gamesWonCount}${eol}`;
    s += `${"Games won %:".padEnd(padding)}${gamesWonPercentage}`;

    return s;
  };

  return {
    toString
  };
});
