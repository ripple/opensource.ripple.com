# ledger_entry

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

The `ledger_entry` method returns a single ledger entry from the XRP Ledger in its raw format. See [ledger entry types][] for information on the different types of entries you can retrieve.

The Credentials amendment makes no changes to the request or response formats for most types of ledger entries.

### Get DepositPreauth Entry

Retrieve a [DepositPreauth entry][], which tracks preauthorization for payments to accounts requiring [Deposit Authorization](https://xrpl.org/docs/concepts/accounts/depositauth/).

| Field                        | Type                 | Required? | Description |
|:-----------------------------|:---------------------|:----------|-------------|
| `deposit_preauth`            | Object or String     | Yes       | Specify the DepositPreauth to retrieve. If a string, must be the [ledger entry ID][] of the DepositPreauth entry, as hexadecimal. If an object, requires `owner` sub-field and either `authorized` or `authorize_credentials` sub-field. |
| `deposit_preauth.owner`      | String - [Address][] | Yes       | The account that provided the preauthorization. |
| `deposit_preauth.authorized` | String - [Address][] | No        | The account that received the preauthorization. |
| `deposit_preauth.authorize_credentials` | Array     | No        | A set of credentials that received the preauthorization. |

Each member of the `deposit_preauth.authorize_credentials` array, if provided, must include the following nested fields:

| Field             | Type                 | Required? | Description |
|:------------------|:---------------------|:----------|:------------|
| `issuer`          | String - [Address][] | Yes       | The address of the account that issued the credential. |
| `credential_type` | String - Hexadecimal | Yes       | The type of the credential, as issued. |


### Get Credential Entry

Retrieve a [Credential entry][], which represents an attestation by one account about another account. 

| Field                        | Type                 | Required? | Description |
|:-----------------------------|:---------------------|:----------|-------------|
| `credential` | Object or String | Yes | Specify the Credential to retrieve. If a string, must be the [ledger entry ID][] of the entry, as hexadecimal. If an object, requires `subject`, `issuer`, and `credential_type` sub-fields. |
| `credential.subject` | String - [Address][] | Yes | The account that is the subject of the credential. |
| `credential.issuer` | String -  [Address][] | Yes | The account that issued the credential. |
| `credential.credential_type` | String - Hexadecimal | Yes | The type of the credential, as issued. |

WebSocket:

```json
{
  "id": "example_get_credential",
  "command": "ledger_entry",
  "credential": {
    "subject": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
    "issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "credential_type": "6D795F63726564656E7469616C"
  },
  "ledger_index": "validated"
}
```

JSON-RPC:

```json
{
  "method": "ledger_entry",
  "params": [{
    "credential": {
      "subject": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
      "issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "credential_type": "6D795F63726564656E7469616C"
    },
    "ledger_index": "validated"
  }]
}
```

Commandline:

```bash
rippled json ledger_entry '{ "credential": {"subject": "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8", "issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX","credential_type": "6D795F63726564656E7469616C"}, "ledger_index": "validated" }'
```

<!-- TODO: create working example in tool
[Try it! >](/resources/dev-tools/websocket-api-tool#ledger_entry-credential)
-->


{% raw-partial file="/docs/_snippets/common-links.md" /%}
