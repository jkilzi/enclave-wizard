import {
  Button,
  Content,
  ExpandableSection,
  FileUpload,
  Flex,
  FlexItem,
  FormGroup,
  HelperText,
  HelperTextItem,
  NumberInput,
  Popover,
  Radio,
  Switch,
  TextInput,
  Title,
} from "@patternfly/react-core";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import type React from "react";
import { useCallback, useState } from "react";
import { useFileUpload } from "../../api/useFileUpload.ts";
import { CertificateField } from "../components/CertificateField.tsx";
import { useWizard } from "../WizardContext.tsx";
import { stepStyles } from "./stepStyles.ts";

const BCM_PRODUCT_DOC =
  "https://docs.nvidia.com/base-command-manager/base-command-manager-user-guide/latest/overview.html";

export const OsacStep: React.FC = () => {
  const { state, dispatch } = useWizard();
  const globalData = ((state.configData as Record<string, unknown>).global ??
    {}) as Record<string, unknown>;
  const showBcm = state.selectedFlavors.has("bmaas");

  const aapLicenseFile = (globalData.osacAapLicenseFile as string) ?? "";
  const byoDatabase = (globalData.osacBYODatabase as boolean) ?? false;
  const databaseUrl = (globalData.osacDatabaseUrl as string) ?? "";

  // RHBK settings
  const rhbkInstances = (globalData.rhbk_instances as number) ?? 1;
  const rhbkDeployDatabase =
    (globalData.rhbk_deploy_database as boolean) ?? true;
  const rhbkDbSize = (globalData.rhbk_db_size as string) ?? "5Gi";

  const bcmEnabled = (globalData.osacBcmEnabled as boolean) ?? false;
  const bcmUrl = (globalData.osacBcmUrl as string) ?? "";
  const bcmCert = (globalData.osacBcmCert as string) ?? "";
  const bcmKey = (globalData.osacBcmKey as string) ?? "";
  const bcmCaCert = (globalData.osacBcmCaCert as string) ?? "";
  const bcmInsecure =
    (globalData.osacBcmInsecureSkipVerify as boolean) ?? false;
  const bcmHostClass = (globalData.osacBcmHostClass as string) ?? "";
  const bcmBmhNamespace = (globalData.osacBcmBmhNamespace as string) ?? "";

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [uploadFilename, setUploadFilename] = useState("");
  const { upload, uploading, error: uploadError } = useFileUpload();

  const setField = useCallback(
    (field: string, value: unknown) =>
      dispatch({ type: "SET_FIELD", path: `global.${field}`, value }),
    [dispatch],
  );

  const handleFileUpload = useCallback(
    async (_e: unknown, file: File) => {
      setUploadFilename(file.name);
      try {
        const { path } = await upload(file, "plugins");
        setField("osacAapLicenseFile", path);
      } catch {
        // error is tracked by useFileUpload
      }
    },
    [upload, setField],
  );

  const handleFileClear = useCallback(() => {
    setUploadFilename("");
    setField("osacAapLicenseFile", "");
  }, [setField]);

  const setBcmEnabled = useCallback(
    (_e: unknown, checked: boolean) => {
      setField("osacBcmEnabled", checked);
      if (checked) {
        setField("osacMetal3Enabled", false);
      }
    },
    [setField],
  );

  const bcmUrlError =
    state.showValidation &&
    bcmEnabled &&
    (!bcmUrl.trim() || !bcmUrl.startsWith("https://"));
  const bcmCertError =
    state.showValidation && bcmEnabled && !bcmCert.trim();
  const bcmKeyError = state.showValidation && bcmEnabled && !bcmKey.trim();
  const bcmNsError =
    state.showValidation && bcmEnabled && !bcmBmhNamespace.trim();

  return (
    <Flex direction={{ default: "column" }} gap={{ default: "gapLg" }}>
      <FlexItem>
        <Title headingLevel="h3" size="lg">
          OSAC Platform
        </Title>
        <Content component="p" className={stepStyles.subtitle}>
          Configure the Open Sovereign AI Cloud platform.
        </Content>
      </FlexItem>

      {/* AAP License */}
      <FlexItem>
        <FormGroup
          label={
            <span>
              AAP subscription manifest{" "}
              <Popover bodyContent="The OSAC platform uses Ansible Automation Platform (AAP) as its automation engine. AAP requires a Red Hat subscription manifest (manifest.zip) to operate. Download it from access.redhat.com under Subscription Allocations.">
                <OutlinedQuestionCircleIcon
                  style={{ cursor: "pointer", color: "#6a6e73" }}
                />
              </Popover>
            </span>
          }
          isRequired
          fieldId="aap-license"
        >
          <FileUpload
            id="aap-license-upload"
            type="dataURL"
            filename={
              uploadFilename ||
              (aapLicenseFile ? aapLicenseFile.split("/").pop() : "")
            }
            filenamePlaceholder="Upload your AAP license manifest.zip"
            onFileInputChange={(_e, file) => handleFileUpload(_e, file)}
            onClearClick={handleFileClear}
            isLoading={uploading}
            browseButtonText="Upload"
            validated={
              state.showValidation && !aapLicenseFile.trim()
                ? "error"
                : uploadError
                  ? "error"
                  : "default"
            }
          />
          {uploadError && (
            <HelperText>
              <HelperTextItem variant="error">{uploadError}</HelperTextItem>
            </HelperText>
          )}
          {aapLicenseFile && !uploadError && (
            <HelperText>
              <HelperTextItem variant="success">
                Saved to: {aapLicenseFile}
              </HelperTextItem>
            </HelperText>
          )}
          {!aapLicenseFile && !uploadError && (
            <HelperText>
              <HelperTextItem>
                Download manifest.zip from Red Hat Subscription Allocations
                (access.redhat.com)
              </HelperTextItem>
            </HelperText>
          )}
        </FormGroup>
      </FlexItem>

      {showBcm && (
        <FlexItem>
          <Flex direction={{ default: "column" }} gap={{ default: "gapLg" }}>
            <FlexItem>
              <Title headingLevel="h4" size="md">
                Bare-metal provisioning
              </Title>
              <Content component="p" className={stepStyles.subtitle}>
                Choose which system holds your physical server inventory.{" "}
                <Popover
                  headerContent="Bare metal inventory"
                  bodyContent={
                    <>
                      <Content component="p">
                        Connect an external inventory source so bare metal as a
                        service can discover servers and provision them. Only one
                        source can be enabled at a time.
                      </Content>
                      <Button
                        variant="link"
                        isInline
                        component="a"
                        href={BCM_PRODUCT_DOC}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        NVIDIA Base Command Manager documentation
                      </Button>
                    </>
                  }
                >
                  <Button variant="link" isInline component="span">
                    Learn more
                  </Button>
                </Popover>
              </Content>
            </FlexItem>
            <FlexItem>
              <FormGroup
                label="Inventory backend"
                fieldId="osac-inventory-sources"
              >
                <Switch
                  id="osac-bcm-enabled"
                  label="NVIDIA Base Command Manager (BCM)"
                  isChecked={bcmEnabled}
                  onChange={setBcmEnabled}
                />
              </FormGroup>
            </FlexItem>

            {bcmEnabled && (
              <>
                <FlexItem>
                  <FormGroup
                    label="BCM API URL"
                    isRequired
                    fieldId="osac-bcm-url"
                  >
                    <TextInput
                      id="osac-bcm-url"
                      value={bcmUrl}
                      onChange={(_e, val) => setField("osacBcmUrl", val)}
                      placeholder="https://bcm-head:8081"
                      validated={bcmUrlError ? "error" : "default"}
                    />
                    <HelperText>
                      <HelperTextItem>
                        Head node JSON API endpoint (HTTPS, mTLS)
                      </HelperTextItem>
                    </HelperText>
                  </FormGroup>
                </FlexItem>

                <FlexItem>
                  <CertificateField
                    label="BCM client certificate"
                    description="PEM client certificate for mTLS"
                    value={bcmCert}
                    onChange={(v) => setField("osacBcmCert", v)}
                  />
                  {bcmCertError && (
                    <HelperText>
                      <HelperTextItem variant="error">
                        Client certificate is required
                      </HelperTextItem>
                    </HelperText>
                  )}
                </FlexItem>

                <FlexItem>
                  <CertificateField
                    label="BCM client private key"
                    value={bcmKey}
                    onChange={(v) => setField("osacBcmKey", v)}
                  />
                  {bcmKeyError && (
                    <HelperText>
                      <HelperTextItem variant="error">
                        Client private key is required
                      </HelperTextItem>
                    </HelperText>
                  )}
                </FlexItem>

                <FlexItem>
                  <CertificateField
                    label="BCM CA certificate (optional)"
                    description="Trust anchor for the BCM server certificate"
                    value={bcmCaCert}
                    onChange={(v) => setField("osacBcmCaCert", v)}
                  />
                </FlexItem>

                <FlexItem>
                  <FormGroup
                    label="BareMetalHost namespace"
                    isRequired
                    fieldId="osac-bcm-bmh-namespace"
                  >
                    <TextInput
                      id="osac-bcm-bmh-namespace"
                      value={bcmBmhNamespace}
                      onChange={(_e, val) =>
                        setField("osacBcmBmhNamespace", val)
                      }
                      placeholder="openshift-machine-api"
                      validated={bcmNsError ? "error" : "default"}
                    />
                  </FormGroup>
                </FlexItem>

                <FlexItem>
                  <FormGroup label="Host class" fieldId="osac-bcm-host-class">
                    <TextInput
                      id="osac-bcm-host-class"
                      value={bcmHostClass}
                      onChange={(_e, val) =>
                        setField("osacBcmHostClass", val)
                      }
                      placeholder="bcm"
                    />
                  </FormGroup>
                </FlexItem>

                <FlexItem>
                  <FormGroup fieldId="osac-bcm-insecure">
                    <Switch
                      id="osac-bcm-insecure"
                      label="Skip TLS verification (test environments only)"
                      isChecked={bcmInsecure}
                      onChange={(_e, checked) =>
                        setField("osacBcmInsecureSkipVerify", checked)
                      }
                    />
                  </FormGroup>
                </FlexItem>
              </>
            )}
          </Flex>
        </FlexItem>
      )}

      <FlexItem>
        <ExpandableSection
          toggleText={advancedOpen ? "Hide advanced settings" : "Advanced settings"}
          isExpanded={advancedOpen}
          onToggle={(_e, expanded) => setAdvancedOpen(expanded)}
        >
          <Flex direction={{ default: "column" }} gap={{ default: "gapLg" }}>
            {/* Fulfillment Database */}
            <FlexItem>
              <Title headingLevel="h4" size="md">
                Fulfillment Database
              </Title>
              <FormGroup label="Database backend" fieldId="byo-database">
                <Flex direction={{ default: "column" }} gap={{ default: "gapSm" }}>
                  <Radio
                    id="db-builtin"
                    name="byo-database"
                    label="Built-in PostgreSQL"
                    description="Deploy a managed PostgreSQL instance (recommended for dev/test)"
                    isChecked={!byoDatabase}
                    onChange={() => setField("osacBYODatabase", false)}
                  />
                  <Radio
                    id="db-external"
                    name="byo-database"
                    label="Bring your own database"
                    description="Connect to an existing PostgreSQL instance"
                    isChecked={byoDatabase}
                    onChange={() => setField("osacBYODatabase", true)}
                  />
                </Flex>
              </FormGroup>
            </FlexItem>

            {byoDatabase && (
              <FlexItem>
                <FormGroup label="Database URL" isRequired fieldId="database-url">
                  <TextInput
                    id="database-url"
                    value={databaseUrl}
                    onChange={(_e, val) => setField("osacDatabaseUrl", val)}
                    placeholder="postgres://user@host:5432/dbname?sslmode=require"
                    validated={
                      state.showValidation && byoDatabase && !databaseUrl.trim()
                        ? "error"
                        : "default"
                    }
                  />
                </FormGroup>
              </FlexItem>
            )}

            {/* Identity Provider (RHBK/Keycloak) */}
            <FlexItem>
              <Title headingLevel="h4" size="md">
                Identity Provider (Keycloak)
              </Title>
            </FlexItem>

            <FlexItem>
              <FormGroup label="Keycloak replicas" fieldId="rhbk-instances">
                <NumberInput
                  id="rhbk-instances"
                  value={rhbkInstances}
                  min={1}
                  max={5}
                  onMinus={() =>
                    setField("rhbk_instances", Math.max(1, rhbkInstances - 1))
                  }
                  onPlus={() =>
                    setField("rhbk_instances", Math.min(5, rhbkInstances + 1))
                  }
                  onChange={(e) => {
                    const v = Number.parseInt(
                      (e.target as HTMLInputElement).value,
                      10,
                    );
                    if (v >= 1 && v <= 5) setField("rhbk_instances", v);
                  }}
                />
                <HelperText>
                  <HelperTextItem>
                    Use 3+ for production high availability
                  </HelperTextItem>
                </HelperText>
              </FormGroup>
            </FlexItem>

            <FlexItem>
              <FormGroup label="Keycloak database" fieldId="rhbk-deploy-database">
                <Switch
                  id="rhbk-deploy-database"
                  label="Deploy built-in PostgreSQL for Keycloak"
                  labelOff="Use external database for Keycloak"
                  isChecked={rhbkDeployDatabase}
                  onChange={(_e, checked) =>
                    setField("rhbk_deploy_database", checked)
                  }
                />
              </FormGroup>
            </FlexItem>

            {rhbkDeployDatabase && (
              <FlexItem>
                <FormGroup label="Keycloak database size" fieldId="rhbk-db-size">
                  <TextInput
                    id="rhbk-db-size"
                    value={rhbkDbSize}
                    onChange={(_e, val) => setField("rhbk_db_size", val)}
                    placeholder="5Gi"
                  />
                  <HelperText>
                    <HelperTextItem>
                      PVC size for the Keycloak PostgreSQL volume
                    </HelperTextItem>
                  </HelperText>
                </FormGroup>
              </FlexItem>
            )}
          </Flex>
        </ExpandableSection>
      </FlexItem>
    </Flex>
  );
};
