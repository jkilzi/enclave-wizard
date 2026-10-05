package models

type PluginType string

const (
	PluginTypeFoundation PluginType = "foundation"
	PluginTypeAddon      PluginType = "addon"
)

type Plugin struct {
	Name     string         `json:"name" yaml:"name" doc:"Plugin identifier"`
	Type     PluginType     `json:"type" yaml:"type" doc:"Plugin type" enum:"foundation,addon"`
	Order    int            `json:"order,omitempty" yaml:"order,omitempty" doc:"Deployment order within type"`
	Defaults map[string]any `json:"defaults,omitempty" yaml:"defaults,omitempty" doc:"Plugin default configuration values"`
}

// LVMS plugin configuration

type LVMSThinPoolConfig struct {
	Name               string `json:"name" yaml:"name" doc:"Thin pool name"`
	SizePercent        int    `json:"sizePercent" yaml:"sizePercent" doc:"Pool size as percentage of volume group" minimum:"1" maximum:"100"`
	OverprovisionRatio int    `json:"overprovisionRatio" yaml:"overprovisionRatio" doc:"Thin pool overprovisioning ratio" minimum:"1"`
}

type LVMSConfig struct {
	DeviceClassName     string             `json:"deviceClassName" yaml:"deviceClassName" doc:"LVM volume group device class name"`
	DefaultStorageClass bool               `json:"defaultStorageClass" yaml:"defaultStorageClass" doc:"Set as default StorageClass"`
	ThinPoolConfig      LVMSThinPoolConfig `json:"thinPoolConfig" yaml:"thinPoolConfig" doc:"Thin pool settings"`
}

// ODF plugin configuration

type ODFConfig struct {
	DefaultStorageClass bool `json:"defaultStorageClass" yaml:"defaultStorageClass" doc:"Set as default StorageClass"`
}

// AAP plugin configuration

type AAPConfig struct {
	LicenseFile         string  `json:"aapLicenseFile" yaml:"aapLicenseFile" doc:"Path to AAP license manifest.zip on the Landing Zone" minLength:"1"`
	Name                *string `json:"aap_name,omitempty" yaml:"aap_name,omitempty" doc:"Name of the AAP instance"`
	Namespace           *string `json:"aap_ns,omitempty" yaml:"aap_ns,omitempty" doc:"Namespace for the AAP deployment"`
	LicenseSecret       *string `json:"aap_license_secret,omitempty" yaml:"aap_license_secret,omitempty" doc:"Name of the Kubernetes secret holding the AAP license"`
	ControllerDisabled  *bool   `json:"aap_controller_disabled,omitempty" yaml:"aap_controller_disabled,omitempty" doc:"Disable the Automation Controller component"`
	EDADisabled         *bool   `json:"aap_eda_disabled,omitempty" yaml:"aap_eda_disabled,omitempty" doc:"Disable the Event-Driven Ansible component"`
	HubDisabled         *bool   `json:"aap_hub_disabled,omitempty" yaml:"aap_hub_disabled,omitempty" doc:"Disable the Automation Hub component"`
	ImagePullPolicy     *string `json:"aap_image_pull_policy,omitempty" yaml:"aap_image_pull_policy,omitempty" doc:"Image pull policy for AAP pods" enum:"Always,IfNotPresent,Never"`
	LightspeedDisabled  *bool   `json:"aap_lightspeed_disabled,omitempty" yaml:"aap_lightspeed_disabled,omitempty" doc:"Disable the Ansible Lightspeed component"`
	NoLog               *bool   `json:"aap_no_log,omitempty" yaml:"aap_no_log,omitempty" doc:"Suppress sensitive log output"`
	RedisMode           *string `json:"aap_redis_mode,omitempty" yaml:"aap_redis_mode,omitempty" doc:"Redis deployment mode" enum:"standalone,cluster"`
	RouteTLSTermination *string `json:"aap_route_tls_termination,omitempty" yaml:"aap_route_tls_termination,omitempty" doc:"TLS termination type for AAP routes" enum:"Edge,Passthrough,Reencrypt"`
}

// Trust-manager plugin configuration

type TrustManagerConfig struct {
	CAIssuerDuration    *string `json:"trust_manager_ca_issuer_duration,omitempty" yaml:"trust_manager_ca_issuer_duration,omitempty" doc:"CA certificate lifetime (e.g. 87600h for 10 years)"`
	CAIssuerRenewBefore *string `json:"trust_manager_ca_issuer_renew_before,omitempty" yaml:"trust_manager_ca_issuer_renew_before,omitempty" doc:"How long before expiry to renew the CA (e.g. 8760h for 1 year)"`
}

// VAST CSI plugin configuration

type VASTIPRange struct {
	Start string `json:"start" yaml:"start" doc:"Start IP address of the range"`
	End   string `json:"end" yaml:"end" doc:"End IP address of the range"`
}

type VASTVipPool struct {
	SubnetCIDR int           `json:"subnet_cidr" yaml:"subnet_cidr" doc:"Subnet prefix length" minimum:"1" maximum:"32"`
	IPRanges   []VASTIPRange `json:"ip_ranges" yaml:"ip_ranges" doc:"IP address ranges for VIP allocation" minItems:"1"`
}

type VASTTier struct {
	Name     string `json:"name" yaml:"name" doc:"Storage tier name (becomes StorageClass suffix)"`
	Protocol string `json:"protocol" yaml:"protocol" doc:"Storage protocol" enum:"nfs,block"`
}

type VASTConfig struct {
	InfraTenant  *string    `json:"infraTenant,omitempty" yaml:"infraTenant,omitempty" doc:"Tenant name for infrastructure resources"`
	StoragePath  *string    `json:"storagePath,omitempty" yaml:"storagePath,omitempty" doc:"Root path on VAST cluster"`
	ViewPolicyID *int       `json:"viewPolicyId,omitempty" yaml:"viewPolicyId,omitempty" doc:"VAST view policy ID"`
	QuayPvcSize  *string    `json:"quayPvcSize,omitempty" yaml:"quayPvcSize,omitempty" doc:"PVC size for Quay storage tier (e.g. 1000Gi)"`
	Tiers        []VASTTier `json:"tiers,omitempty" yaml:"tiers,omitempty" doc:"Storage tiers to create on the VAST cluster"`
}

// OSAC networking (Helm global.networking passthrough)

type OsacNetworkingCredentials struct {
	Username       *string `json:"username,omitempty" yaml:"username,omitempty" doc:"Netris API username" minLength:"1"`
	Password       *string `json:"password,omitempty" yaml:"password,omitempty" doc:"Netris API password (inline)" minLength:"1"`
	ExternalSecret *bool   `json:"externalSecret,omitempty" yaml:"externalSecret,omitempty" doc:"Use externally managed netris-credentials Secret instead of inline password"`
}

type OsacNetworkingNetris struct {
	ControllerUrl    *string                    `json:"controllerUrl,omitempty" yaml:"controllerUrl,omitempty" doc:"Netris controller API URL (HTTPS)" minLength:"1" pattern:"^https://"`
	Credentials      *OsacNetworkingCredentials `json:"credentials,omitempty" yaml:"credentials,omitempty" doc:"Netris API credentials"`
	SiteId           *string                    `json:"siteId,omitempty" yaml:"siteId,omitempty" doc:"Netris site ID" minLength:"1"`
	TenantId         *string                    `json:"tenantId,omitempty" yaml:"tenantId,omitempty" doc:"Netris tenant ID" minLength:"1"`
	TenantName       *string                    `json:"tenantName,omitempty" yaml:"tenantName,omitempty" doc:"Netris tenant name" minLength:"1"`
	MgmtVpcId        *string                    `json:"mgmtVpcId,omitempty" yaml:"mgmtVpcId,omitempty" doc:"Management VPC ID in Netris"`
	MgmtVpcName      *string                    `json:"mgmtVpcName,omitempty" yaml:"mgmtVpcName,omitempty" doc:"Management VPC name in Netris"`
	ResourceClassMap *string                    `json:"resourceClassMap,omitempty" yaml:"resourceClassMap,omitempty" doc:"JSON mapping resource classes to Netris server cluster templates"`
}

type OsacNetworkingConfig struct {
	// FabricManager / K8sManager omit omitempty so empty string is preserved
	// (netris requires k8sManager:""; agentless default is fabricManager:"").
	// No enum tags: Huma rejects "" when enum is set; Enclave JSON Schema validates values.
	FabricManager string                `json:"fabricManager" yaml:"fabricManager" doc:"Fabric manager profile: empty string, netris, or reserved cudn_net/vlan"`
	K8sManager    string                `json:"k8sManager" yaml:"k8sManager" doc:"Kubernetes manager profile: empty string or k8s_only"`
	Netris        *OsacNetworkingNetris `json:"netris,omitempty" yaml:"netris,omitempty" doc:"Netris fabric manager configuration"`
}

type ValidationError struct {
	Field   string `json:"field" doc:"JSON path to the invalid field"`
	Message string `json:"message" doc:"Human-readable error description"`
}
