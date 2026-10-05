import type { FieldValidationError } from "./osacBcmValidation.ts";

export type OsacNetworkingData = {
  fabricManager?: string;
  k8sManager?: string;
  netris?: {
    controllerUrl?: string;
    credentials?: {
      username?: string;
      password?: string;
    };
    siteId?: string;
    tenantId?: string;
    tenantName?: string;
  };
};

export function getOsacNetworking(
  globalData: Record<string, unknown>,
): OsacNetworkingData {
  const raw = globalData.osacNetworking;
  if (!raw || typeof raw !== "object") return {};
  return raw as OsacNetworkingData;
}

export function isNetrisFabricManager(
  networking: OsacNetworkingData,
): boolean {
  return networking.fabricManager === "netris";
}

/** HTTPS URL matching Enclave netris controllerUrl pattern (non-empty). */
export function isValidNetrisControllerUrl(url: string): boolean {
  return /^https:\/\/[^/\s:]+(:[0-9]+)?(\/[^\s]*)?$/.test(url.trim());
}

export function validateOsacNetworkingFields(
  globalData: Record<string, unknown>,
  showValidation: boolean,
): FieldValidationError[] {
  if (!showValidation) return [];

  const networking = getOsacNetworking(globalData);
  if (!isNetrisFabricManager(networking)) return [];

  const errors: FieldValidationError[] = [];
  const netris = networking.netris ?? {};
  const credentials = netris.credentials ?? {};

  const requireStr = (
    value: string | undefined,
    path: string,
    label: string,
    message: string,
  ) => {
    if (typeof value !== "string" || !value.trim()) {
      errors.push({ path, label, message });
    }
  };

  const url = netris.controllerUrl ?? "";
  if (!url.trim()) {
    errors.push({
      path: "global.osacNetworking.netris.controllerUrl",
      label: "Netris controller URL",
      message: "Netris controller URL is required (https://…)",
    });
  } else if (!isValidNetrisControllerUrl(url)) {
    errors.push({
      path: "global.osacNetworking.netris.controllerUrl",
      label: "Netris controller URL",
      message: "Netris controller URL must be a valid https:// URL",
    });
  }

  requireStr(
    credentials.username,
    "global.osacNetworking.netris.credentials.username",
    "Netris username",
    "Netris username is required",
  );
  requireStr(
    credentials.password,
    "global.osacNetworking.netris.credentials.password",
    "Netris password",
    "Netris password is required",
  );
  requireStr(
    netris.siteId,
    "global.osacNetworking.netris.siteId",
    "Netris site ID",
    "Netris site ID is required",
  );
  requireStr(
    netris.tenantId,
    "global.osacNetworking.netris.tenantId",
    "Netris tenant ID",
    "Netris tenant ID is required",
  );
  requireStr(
    netris.tenantName,
    "global.osacNetworking.netris.tenantName",
    "Netris tenant name",
    "Netris tenant name is required",
  );

  return errors;
}

/** OSAC networking checks for wizard navigation (Continue). Not gated on UI showValidation. */
export function validateOsacNetworking(
  globalData: Record<string, unknown>,
): FieldValidationError[] {
  return validateOsacNetworkingFields(globalData, true);
}
