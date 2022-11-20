/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

declare module "random-number-csprng" {
  function secureRandomNumber(
    minimum: number,
    maximum: number,
    cb?: (err: Error, result: number) => void
  ): Promise<number>;

  namespace secureRandomNumber {
    interface RandomGenerationError extends Error {
      code: "RandomGenerationError";
    }
  }

  export = secureRandomNumber;
}
