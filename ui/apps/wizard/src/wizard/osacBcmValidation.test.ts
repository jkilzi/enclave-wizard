import { describe, expect, it } from "vitest";
import {
  validateOsacBcmFields,
  validateOsacMetal3Fields,
} from "./osacBcmValidation.ts";

describe("validateOsacBcmFields", () => {
  it("returns no errors when BCM is disabled", () => {
    expect(validateOsacBcmFields({ osacBcmEnabled: false }, true)).toEqual([]);
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

describe("validateOsacMetal3Fields", () => {
  it("returns no errors when Metal3 is disabled", () => {
    expect(
      validateOsacMetal3Fields({ osacMetal3Enabled: false }, true),
    ).toEqual([]);
  });

  it("requires namespace when enabled", () => {
    const errors = validateOsacMetal3Fields({ osacMetal3Enabled: true }, true);
    expect(errors.map((e) => e.path)).toEqual(["global.osacMetal3Namespace"]);
  });
});
