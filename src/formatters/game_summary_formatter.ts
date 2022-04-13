/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import {
  GameSummary,
} from "../montehall";

export const gameSummaryFormatter = ((gameSummary: GameSummary, eol = "\n"): { toString: () => string } => {
  const toString = (): string => {
    const padding = 27;
    const g = gameSummary;

    let s = `${"Setup size:".padEnd(padding)}${g.setupSize}${eol}`;
    s += `${"Winning index(es):".padEnd(padding)}${g.winningIndex.toString()}${eol}`;
    s += `${"Player switches:".padEnd(padding)}${!g.isPlayerStubborn}${eol}`;
    s += `${"Initial picked index(es):".padEnd(padding)}${g.playerInitialPickedIndex.toString()}${eol}`;
    s += `${"Confirmed index(es):".padEnd(padding)}${g.confirmedPlayerPickedIndex.toString()}${eol}`;
    s += `${"Revealed losing index(es):".padEnd(padding)}${g.revealedLosingIndexes.toString()}`;

    return s;
  };

  return {
    toString
  };
});
