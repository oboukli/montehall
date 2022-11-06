/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { SetupOptions, SimulationSummary } from "../montehall";
import { b2text } from "./common";

export const simulationSummaryFormatter = (
  o: SetupOptions,
  numRequestedGames: number,
  summary: SimulationSummary,
  eol = "\n"
): string => {
  const padding = 17;

  const playerStrategy = b2text(o.isPlayerStubborn, "stubborn", "prudent");

  let s = `${"Game setup size:".padEnd(padding)}${o.size}${eol}`;
  s += `${"Player strategy:".padEnd(padding)}${playerStrategy}${eol}`;
  s += `${"Games requested:".padEnd(padding)}${numRequestedGames}${eol}`;
  s += `${"Games simulated:".padEnd(padding)}${summary.simulationCount}${eol}`;
  s += `${"Games won:".padEnd(padding)}${summary.gamesWonCount}`;

  if (summary.simulationCount !== 0) {
    const gamesWonPercentage =
      (summary.gamesWonCount * 100) / summary.simulationCount;
    s += `${eol}${"Games won %:".padEnd(padding)}${gamesWonPercentage}`;
  }

  return s;
};
