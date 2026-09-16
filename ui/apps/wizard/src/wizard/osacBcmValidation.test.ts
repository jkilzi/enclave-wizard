import { describe, expect, it } from "vitest";
import { validateOsacBcmFields } from "./osacBcmValidation.ts";

describe("validateOsacBcmFields", () => {
  it("returns no errors when BCM is disabled", () => {
    expect(
      validateOsacBcmFields({ osacBcmEnabled: false }, true),
    ).toEqual([]);
  });

  it("requires BCM connection fields when enabled", () => {
    const errors = validateOsacBcmFields({ osacBcmEnabled: true }, true);
    expect(errors.map((e) => e.path)).toEqual([
      "global.osacBcmUrl",
      "global.osacBcmCert",
      "global.osacBcmKey",
      "global.osacBcmBmhNamespace",
    ]);
  });

  it("validates https URL prefix", () => {
    const errors = validateOsacBcmFields(
      {
        osacBcmEnabled: true,
        osacBcmUrl: "http://bcm:8081",
        osacBcmCert: "cert",
        osacBcmKey: "key",
        osacBcmBmhNamespace: "openshift-machine-api",
      },
      true,
    );
    expect(errors.some((e) => e.path === "global.osacBcmUrl")).toBe(true);
  });
});
