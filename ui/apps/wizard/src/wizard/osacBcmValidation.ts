export interface FieldValidationError {
  path: string;
  label: string;
  message: string;
}

export function validateOsacBcmFields(
  globalData: Record<string, unknown>,
  showValidation: boolean,
): FieldValidationError[] {
  if (!showValidation) return [];

  const bcmEnabled = globalData.osacBcmEnabled === true;
  if (!bcmEnabled) return [];

  const errors: FieldValidationError[] = [];
  const require = (field: string, label: string, message: string) => {
    const v = globalData[field];
    if (typeof v !== "string" || !v.trim()) {
      errors.push({ path: `global.${field}`, label, message });
    }
  };

  require("osacBcmUrl", "BCM API URL", "BCM API URL is required (https://…)");
  require("osacBcmCert", "BCM client certificate", "BCM client certificate (PEM) is required");
  require("osacBcmKey", "BCM client key", "BCM client private key (PEM) is required");
  require("osacBcmBmhNamespace", "BareMetalHost namespace", "Namespace for BareMetalHost CRs is required");

  const url = (globalData.osacBcmUrl as string) ?? "";
  if (url.trim() && !url.startsWith("https://")) {
    errors.push({
      path: "global.osacBcmUrl",
      label: "BCM API URL",
      message: "BCM API URL must start with https://",
    });
  }

  return errors;
}

export function validateOsacMetal3Fields(
  globalData: Record<string, unknown>,
  showValidation: boolean,
): FieldValidationError[] {
  if (!showValidation) return [];

  const metal3Enabled = globalData.osacMetal3Enabled === true;
  if (!metal3Enabled) return [];

  const errors: FieldValidationError[] = [];
  const ns = (globalData.osacMetal3Namespace as string) ?? "";
  if (!ns.trim()) {
    errors.push({
      path: "global.osacMetal3Namespace",
      label: "BareMetalHost namespace",
      message: "Namespace for BareMetalHost CRs is required",
    });
  }

  return errors;
}
