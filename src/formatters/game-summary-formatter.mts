/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { GameSummary } from "../montehall";
import { b2text } from "./common.mjs";

export const gameSummaryFormatter = (
  gameSummary: GameSummary,
  eol = "\n",
): string => {
  const padding = 27;
  const playerStrategy = b2text(gameSummary.isNaivePlayer, "naive", "prudent");

  let s = `${"Setup size (doors):".padEnd(padding)}${
    gameSummary.numSlots
  }${eol}`;

  s += `${"Player strategy:".padEnd(padding)}${playerStrategy}${eol}`;

  s += `${"Initial picked slot(s):".padEnd(
    padding,
  )}${gameSummary.playerInitialPickedSlot.toString()}${eol}`;

  s += `${"Revealed losing slot(s):".padEnd(
    padding,
  )}${gameSummary.revealedLosingSlots.toString()}${eol}`;

  s += `${"Confirmed slot(s):".padEnd(
    padding,
  )}${gameSummary.confirmedPlayerPickedSlot.toString()}${eol}`;

  s += `${"Winning slot(s):".padEnd(
    padding,
  )}${gameSummary.winningSlot.toString()}`;

  return s;
};
