
# OsacNetworkingNetris


## Properties

Name | Type
------------ | -------------
`controllerUrl` | string
`credentials` | [OsacNetworkingCredentials](OsacNetworkingCredentials.md)
`mgmtVpcId` | string
`mgmtVpcName` | string
`resourceClassMap` | string
`siteId` | string
`tenantId` | string
`tenantName` | string

## Example

```typescript
import type { OsacNetworkingNetris } from '@enclave-wizard-ui/api-client'

// TODO: Update the object below with actual values
const example = {
  "controllerUrl": null,
  "credentials": null,
  "mgmtVpcId": null,
  "mgmtVpcName": null,
  "resourceClassMap": null,
  "siteId": null,
  "tenantId": null,
  "tenantName": null,
} satisfies OsacNetworkingNetris

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OsacNetworkingNetris
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


