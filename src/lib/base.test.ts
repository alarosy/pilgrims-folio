import { describe, expect, it } from "vitest";
import { normalizeBase } from "./base";

describe("normalizeBase", () => {
  it("is the root when nothing is set", () => {
    for (const x of [undefined, "", "/", "//", "  "]) expect(normalizeBase(x)).toBe("/");
  });

  it("accepts a repository folder however it is written", () => {
    for (const x of ["pilgrims-folio", "/pilgrims-folio", "/pilgrims-folio/", "pilgrims-folio/"]) {
      expect(normalizeBase(x)).toBe("/pilgrims-folio/");
    }
  });
});
