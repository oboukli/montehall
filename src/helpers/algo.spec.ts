/*!
Copyright (c) Omar Boukli-Hacene. All rights reserved.
Licensed under an MIT-style license.

SPDX-License-Identifier: MIT
*/

import { describe, expect, it } from "@jest/globals";

import { getRevealedSlots } from "./algo.mjs";

describe("getRevealedSlots", () => {
  describe("when total of 3 slots", () => {
    it("should reveal 1 slot when s1 and s2 are not equal", () => {
      const slots = getRevealedSlots(3, 0, 1);

      expect(slots).toStrictEqual([2]);
    });

    it("should reveal 1 slot when s1 is larger than s2", () => {
      const slots = getRevealedSlots(3, 1, 0);

      expect(slots).toStrictEqual([2]);
    });

    it("should reveal two slots when s1 equals s2", () => {
      const slots = getRevealedSlots(3, 0, 0);

      expect(slots).toStrictEqual([1, 2]);
    });
  });

  describe("when total of 5 slots", () => {
    it("should reveal 3 slots when s1 and s2 are not equal", () => {
      const slots = getRevealedSlots(5, 0, 1);

      expect(slots).toStrictEqual([2, 3, 4]);
    });

    it("should reveal 3 slots when s1 is larger than s2", () => {
      const slots = getRevealedSlots(5, 4, 3);

      expect(slots).toStrictEqual([0, 1, 2]);
    });

    it("should reveal 4 slots when s1 equals s2", () => {
      const slots = getRevealedSlots(5, 0, 0);

      expect(slots).toStrictEqual([1, 2, 3, 4]);
    });
  });

  describe("when total of 100 slots", () => {
    it("should not reveal slots s1 and s2", () => {
      const slots = getRevealedSlots(100, 0, 99);

      expect(slots).not.toContain(0);

      expect(slots).not.toContain(99);
    });
  });
});
