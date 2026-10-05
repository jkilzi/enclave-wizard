import { expect, test } from "@playwright/test";
import { WizardPage } from "../helpers/wizard-page";

const hub = {
  baseDomain: "osac-net.lab.local",
  clusterName: "edge-net",
  machineNetwork: "10.10.50.0/24",
  apiVIP: "10.10.50.200",
  ingressVIP: "10.10.50.201",
  rendezvousIP: "10.10.50.10",
  defaultDNS: "10.10.50.1",
  defaultGateway: "10.10.50.1",
  defaultPrefix: 24,
  pullSecret: '{"auths":{}}',
  sshPubKey: "ssh-rsa AAAA-test-key",
  hosts: [
    {
      name: "ctrl-01",
      macAddress: "00:00:00:00:01:01",
      ipAddress: "10.10.50.11",
      redfish: "10.10.50.1",
      redfishUser: "admin",
      redfishPassword: "password",
      rootDisk: "/dev/sda",
    },
    {
      name: "ctrl-02",
      macAddress: "00:00:00:00:01:02",
      ipAddress: "10.10.50.12",
      redfish: "10.10.50.1",
      redfishUser: "admin",
      redfishPassword: "password",
      rootDisk: "/dev/sda",
    },
    {
      name: "ctrl-03",
      macAddress: "00:00:00:00:01:03",
      ipAddress: "10.10.50.13",
      redfish: "10.10.50.1",
      redfishUser: "admin",
      redfishPassword: "password",
      rootDisk: "/dev/sda",
    },
  ],
};

test.describe("OSAC networking default seed", () => {
  test("writes k8s_only osacNetworking without clicking the radio", async ({
    page,
  }) => {
    const wizard = new WizardPage(page);
    await wizard.goto();
    await wizard.clickGetStarted();
    await wizard.selectFlavor("CaaS");
    await wizard.clickNext();

    await wizard.fillLandingZone({
      disconnected: false,
      lzBmcIP: "10.10.50.1",
    });
    await wizard.clickNext();

    await wizard.fillStorage({
      quayUser: "admin",
      quayPassword: "quaypass",
    });
    await wizard.clickNext();

    await wizard.fillHubCluster(hub);
    await wizard.clickNext();

    await expect(page.locator("#osac-fabric-none")).toBeChecked();
    await expect(page.locator("#osac-fabric-netris")).not.toBeChecked();

    await wizard.fillOsac({});
    await wizard.clickNext();

    await wizard.fillCaas({ dnsZone: "osac-net.lab.local" });
    await wizard.clickNext();

    const osacYaml = await wizard.getYamlContent("plugins/osac.yaml");
    expect(osacYaml).toContain("k8s_only");
    expect(osacYaml).toMatch(/fabricManager:\s*[""]{2}|fabricManager:\s*''/);
  });
});
