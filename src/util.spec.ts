/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

import { toErrString } from "./util";

describe("Function toErrString", () => {
  it("should convert base Error message to string", () => {
    const err = toErrString(new Error("Dummy 001"));

    expect(err).toEqual("Dummy 001");
  });

  it("should convert extended Error message to string", () => {
    const err = toErrString(new RangeError("Dummy 002"));

    expect(err).toEqual("Dummy 002");
  });

  it("should return string as is", () => {
    const err = toErrString("Dummy 003");

    expect(err).toEqual("Dummy 003");
  });

  it("should convert Number.NaN to string", () => {
    const err = toErrString(Number.NaN);

    expect(err).toEqual("NaN");
  });

  it("should convert null to string", () => {
    const err = toErrString(null);

    expect(err).toEqual("null");
  });

  it("should convert undefined to string", () => {
    const err = toErrString(undefined);

    expect(err).toEqual("undefined");
  });
});
