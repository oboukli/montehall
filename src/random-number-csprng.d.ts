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
