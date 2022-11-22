/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { SetupOptions, MonteCarloMachineResult } from "../montehall";
import { b2text } from "./common";

export const simulationSummaryFormatter = (
  o: SetupOptions,
  numRequestedGames: number,
  summary: MonteCarloMachineResult,
  eol = "\n"
): string => {
  const padding = 17;

  const playerStrategy = b2text(o.isNaivePlayer, "naive", "prudent");

  let s = `${"Game setup size:".padEnd(padding)}${o.numSlots}${eol}`;
  s += `${"Player strategy:".padEnd(padding)}${playerStrategy}${eol}`;
  s += `${"Games requested:".padEnd(padding)}${numRequestedGames}${eol}`;
  s += `${"Games simulated:".padEnd(padding)}${summary.numSimulations}${eol}`;
  s += `${"Games won:".padEnd(padding)}${summary.numWonGames}`;

  if (summary.numSimulations !== 0) {
    const gamesWonPercentage =
      (summary.numWonGames * 100) / summary.numSimulations;
    s += `${eol}${"Games won %:".padEnd(padding)}${gamesWonPercentage}`;
  }

  return s;
};
