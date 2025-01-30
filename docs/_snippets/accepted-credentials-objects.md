### AcceptedCredentials Objects

Each member of `AcceptedCredentials` array is an inner object with the following fields:

| Field            | JSON Type            | [Internal Type][] | Required? | Description  |
|:-----------------|:---------------------|:------------------|:----------|--------------|
| `Issuer`         | String - [Address][] | AccountID         | Yes       | The issuer of the Credential. |
| `CredentialType` | String               | Blob              | Yes       | The type of Credential, as hexadecimal. This is an arbitrary value from 1 to 64 bytes that the issuer sets when they issue a Credential. |

{% admonition type="info" name="Note" %}
In the usual JSON format, inner objects are wrapped in an object that defines the inner object type. For example:

```json
"AcceptedCredentials": [
    {
        "AcceptedCredential": {
            "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            "CredentialType": "6D795F63726564656E7469616C"
        }
    },
    // ... additional AcceptedCredential entries ...
]
```
{% /admonition %}
