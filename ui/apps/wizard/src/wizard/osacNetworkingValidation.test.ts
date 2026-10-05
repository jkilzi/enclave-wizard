import { describe, expect, it } from "vitest";
import {
  isOsacNetworkingUnset,
  isValidNetrisControllerUrl,
  validateOsacNetworking,
  validateOsacNetworkingFields,
} from "./osacNetworkingValidation.ts";

describe("isOsacNetworkingUnset", () => {
  it("treats missing osacNetworking as unset (UI default not yet in state)", () => {
    expect(isOsacNetworkingUnset({})).toBe(true);
    expect(isOsacNetworkingUnset({ osacNetworking: undefined })).toBe(true);
    expect(isOsacNetworkingUnset({ osacNetworking: {} })).toBe(true);
  });

  it("treats agentless and netris profiles as set", () => {
    expect(
      isOsacNetworkingUnset({
        osacNetworking: { fabricManager: "", k8sManager: "k8s_only" },
      }),
    ).toBe(false);
    expect(
      isOsacNetworkingUnset({
        osacNetworking: { fabricManager: "netris", k8sManager: "" },
      }),
    ).toBe(false);
  });
});

describe("isValidNetrisControllerUrl", () => {
  it("accepts https URLs", () => {
    expect(isValidNetrisControllerUrl("https://ctl.netris.example.com")).toBe(
      true,
    );
    expect(isValidNetrisControllerUrl("https://ctl.example.com:8443/api")).toBe(
      true,
    );
  });

  it("rejects non-https or empty", () => {
    expect(isValidNetrisControllerUrl("")).toBe(false);
    expect(isValidNetrisControllerUrl("http://ctl.example.com")).toBe(false);
    expect(isValidNetrisControllerUrl("not-a-url")).toBe(false);
  });
});

describe("validateOsacNetworkingFields", () => {
  it("returns no errors when showValidation is false", () => {
    expect(
      validateOsacNetworkingFields(
        { osacNetworking: { fabricManager: "netris" } },
        false,
      ),
    ).toEqual([]);
  });

  it("returns no errors for agentless (k8s_only) profile", () => {
    expect(
      validateOsacNetworkingFields(
        {
          osacNetworking: { fabricManager: "", k8sManager: "k8s_only" },
        },
        true,
      ),
    ).toEqual([]);
  });

  it("requires netris connection fields when fabricManager is netris", () => {
    const errors = validateOsacNetworking({
      osacNetworking: { fabricManager: "netris", k8sManager: "" },
    });
    expect(errors.map((e) => e.path)).toEqual(
      expect.arrayContaining([
        "global.osacNetworking.netris.controllerUrl",
        "global.osacNetworking.netris.credentials.username",
        "global.osacNetworking.netris.credentials.password",
        "global.osacNetworking.netris.siteId",
        "global.osacNetworking.netris.tenantId",
        "global.osacNetworking.netris.tenantName",
      ]),
    );
  });

  it("accepts a complete netris config", () => {
    const errors = validateOsacNetworking({
      osacNetworking: {
        fabricManager: "netris",
        k8sManager: "",
        netris: {
          controllerUrl: "https://ctl.netris.example.com",
          credentials: { username: "admin", password: "secret" },
          siteId: "1",
          tenantId: "2",
          tenantName: "osac",
        },
      },
    });
    expect(errors).toEqual([]);
  });

  it("rejects http controller URL", () => {
    const errors = validateOsacNetworking({
      osacNetworking: {
        fabricManager: "netris",
        k8sManager: "",
        netris: {
          controllerUrl: "http://ctl.example.com",
          credentials: { username: "admin", password: "secret" },
          siteId: "1",
          tenantId: "2",
          tenantName: "osac",
        },
      },
    });
    expect(errors.some((e) => e.path.includes("controllerUrl"))).toBe(true);
  });
});
