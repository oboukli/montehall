/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { GameSummary } from "../montehall";

export const gameSummaryFormatter = (
  gameSummary: GameSummary,
  eol = "\n"
): { toString: () => string } => {
  const toString = (): string => {
    const padding = 27;

    let s = `${"Setup size:".padEnd(padding)}${gameSummary.setupSize}${eol}`;
    s += `${"Winning index(es):".padEnd(
      padding
    )}${gameSummary.winningIndex.toString()}${eol}`;
    s += `${"Player switches:".padEnd(
      padding
    )}${!gameSummary.isPlayerStubborn}${eol}`;
    s += `${"Initial picked index(es):".padEnd(
      padding
    )}${gameSummary.playerInitialPickedIndex.toString()}${eol}`;
    s += `${"Confirmed index(es):".padEnd(
      padding
    )}${gameSummary.confirmedPlayerPickedIndex.toString()}${eol}`;
    s += `${"Revealed losing index(es):".padEnd(
      padding
    )}${gameSummary.revealedLosingIndexes.toString()}`;

    return s;
  };

  return {
    toString,
  };
};
