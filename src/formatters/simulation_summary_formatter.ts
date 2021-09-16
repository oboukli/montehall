/*!
Copyright(c) 2017 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.
*/

import {
  SetupOptions,
  SimulationSummary,
} from "../montehall";

export const simulationSummaryFormater = ((
  o: SetupOptions,
  numRequestedGames: number,
  summary: SimulationSummary,
  eol = "\n",
): { toString: () => string } => {
  const toString = (): string => {
    const padding = 17;
    const gamesWonPercentage = (summary.gamesWonCount * 100) / summary.simulationCount;

    let s: string;
    s = `${"Game setup size:".padEnd(padding)}${o.size}${eol}`;
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
