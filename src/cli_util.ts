import {
    csPrng as csPrngT,
    GameSimulatorFactory,
    naiveRng as naiveRngT,
    RandomNumberProvider,
    standardSimulator,
    tableRng as tableRngT,
} from ".";

const naiveRngModule = "./random/naive_rng";
const csprngModule = "./random/csprng";
const tableRngModule = "./random/table_rng";

export type RandomNumberProviderType = "basic" | "crypto" | "table";

/**
 * Creates a random number provider.
 * @param rngType
 * @returns RandomNumberProvider
 */
export const rngFactory = (
    rngType: RandomNumberProviderType,
    numTableFileName: string,
    isDecimalTable: boolean
): RandomNumberProvider => {
    let r: RandomNumberProvider;
    switch (rngType) {
        case "crypto":
            // tslint:disable-next-line:no-require-imports no-var-requires non-literal-require
            const csPrng: typeof csPrngT = require(csprngModule).csPrng;
            r = csPrng();
            break;
        case "table":
            // tslint:disable-next-line:no-require-imports no-var-requires non-literal-require
            const tableRng: typeof tableRngT = require(tableRngModule).tableRng;
            r = tableRng(numTableFileName, isDecimalTable);
            break;
        default:
            // tslint:disable-next-line:no-require-imports no-var-requires non-literal-require
            const naiveRng: typeof naiveRngT = require(naiveRngModule).naiveRng;
            r = naiveRng();
            break;
    }

    return r;
};

/**
 *
 * @param setupOptions
 * @param rng
 */
export const gameSimulatorFactory: GameSimulatorFactory = (setupOptions, rng) => {
    return standardSimulator(setupOptions, rng);
};