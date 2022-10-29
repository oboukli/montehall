import {
  GameSimulatorFactory,
  RandomNumberProvider,
  standardSimulator,
} from ".";

const naiveRngModule = "./random/naive_rng";
const csprngModule = "./random/csprng";
const tableRngModule = "./random/table_rng";

export type RandomNumberProviderType = "basic" | "advanced" | "table";

/**
 * Creates a random number provider.
 *
 * @function rngFactory
 * @param rngType
 * @param numTableFileName
 * @param isDecimalTable
 * @returns RandomNumberProvider
 */
export const rngFactory = (
  rngType: RandomNumberProviderType,
  numTableFileName: string,
  isDecimalTable: boolean
): RandomNumberProvider => {
  switch (rngType) {
    case "advanced":
      return require(csprngModule).csPrng();
    case "table":
      return require(tableRngModule).tableRng(numTableFileName, isDecimalTable);
    default:
      return require(naiveRngModule).naiveRng();
  }
};

/**
 *
 * @param setupOptions
 * @param rng
 */
export const gameSimulatorFactory: GameSimulatorFactory = (
  setupOptions,
  rng
) => {
  return standardSimulator(setupOptions, rng);
};
