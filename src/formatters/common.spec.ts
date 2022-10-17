/*!
Copyright(c) 2017-2022 Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import "jasmine";

import { b2text } from "./common";

describe("Function b2text", () => {
  it("should return the second argument when the first argument is true", () => {
    expect(b2text(true, "yes", "no")).toEqual("yes");
  });

  it("should return the third argument when the first argument is false", () => {
    expect(b2text(false, "yes", "no")).toEqual("no");
  });
});
