/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { GameSummary } from "../montehall";
import { b2text } from "./common";

export const gameSummaryFormatter = (
  gameSummary: GameSummary,
  eol = "\n"
): string => {
  const padding = 27;
  const playerStrategy = b2text(
    gameSummary.isPlayerStubborn,
    "stubborn",
    "prudent"
  );

  let s = `${"Setup size (doors):".padEnd(padding)}${
    gameSummary.setupSize
  }${eol}`;

  s += `${"Player strategy:".padEnd(padding)}${playerStrategy}${eol}`;

  s += `${"Initial picked index(es):".padEnd(
    padding
  )}${gameSummary.playerInitialPickedIndex.toString()}${eol}`;

  s += `${"Revealed losing index(es):".padEnd(
    padding
  )}${gameSummary.revealedLosingIndexes.toString()}${eol}`;

  s += `${"Confirmed index(es):".padEnd(
    padding
  )}${gameSummary.confirmedPlayerPickedIndex.toString()}${eol}`;

  s += `${"Winning index(es):".padEnd(
    padding
  )}${gameSummary.winningIndex.toString()}`;

  return s;
};
