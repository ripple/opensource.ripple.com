---
seo:
    description: Retrieve all objects an account is currently sponsoring using the Clio server.
labels:
  - Fees
  - Accounts
  - Sponsorship
status: not_enable
---
# account_sponsoring

<!-- TODO: Update when this is implemented in Clio -->
[[Source]](https://github.com/XRPLF/clio "Source")

The `account_sponsoring` method returns all objects an account is currently sponsoring, where the queried account is the `Sponsor`, or for trust lines, the `HighSponsor` or `LowSponsor`. It has a very similar API to [account_objects](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects).

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

{% admonition type="info" name="Note" %}
This API method is available in **Clio only**, not in `rippled`. This is because this API would require an additional database to track sponsorship relationships, which would be too expensive to maintain in `rippled`.
{% /admonition %}

## Request Format

An example of a request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "account_sponsoring",
  "account": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
  "ledger_index": "validated",
  "limit": 10
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "account_sponsoring",
  "params": [
    {
      "account": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
      "ledger_index": "validated",
      "limit": 10
    }
  ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
rippled account_sponsoring rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw ledger_index=validated limit=10
```
{% /tab %}

{% /tabs %}

The request includes the following parameters:

| Field                    | Type                       | Required? | Description |
|:-------------------------|:---------------------------|:----------|:------------|
| `account`                | String                     | Yes       | The sponsor account to query. |
| `deletion_blockers_only` | Boolean                    | No        | If `true`, the response only includes objects that would block this account from being deleted. The default is `false`. |
| `ledger_hash`            | String                     | No        | A 20-byte hex string for the ledger version to use. See [Specifying Ledgers][]. |
| `ledger_index`           | String or Unsigned Integer | No        | The [ledger index][] of the ledger to use, or a shortcut string to choose a ledger automatically. See [Specifying Ledgers][]. |
| `limit`                  | Number                     | No        | The maximum number of objects to include in the results. |
| `marker`                 | Marker                     | No        | Value from a previous paginated response. Resume retrieving data where that response left off. |
| `type`                   | String                     | No        | Filter results by a ledger entry type. Some examples are `offer` and `escrow`. |

## Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "account": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
    "sponsored_objects": [
      {
        "Balance": {
          "currency": "USD",
          "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
          "value": "100"
        },
        "Flags": 65536,
        "HighLimit": {
          "currency": "USD",
          "issuer": "rSponsee1ABC123XYZ456DEF789GHI",
          "value": "1000"
        },
        "HighNode": "0000000000000000",
        "HighSponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "LedgerEntryType": "RippleState",
        "LowLimit": {
          "currency": "USD",
          "issuer": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
          "value": "0"
        },
        "LowNode": "0000000000000000",
        "PreviousTxnID": "E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879",
        "PreviousTxnLgrSeq": 14090896,
        "index": "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
      },
      {
        "Account": "rSponsee2XYZ789ABC123DEF456GHI",
        "Balance": "1000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 3,
        "PreviousTxnID": "0D5FB50FA65C9FE1538FD7E398FFFE9D1908DFA4576D8D7A020040686F93C77D",
        "PreviousTxnLgrSeq": 14091574,
        "Sequence": 1,
        "Sponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
      }
    ],
    "ledger_hash": "4C99E5F63C0D0B1C2283D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3",
    "ledger_index": 14091625,
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "result": {
    "account": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
    "sponsored_objects": [
      {
        "Balance": {
          "currency": "USD",
          "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
          "value": "100"
        },
        "Flags": 65536,
        "HighLimit": {
          "currency": "USD",
          "issuer": "rSponsee1ABC123XYZ456DEF789GHI",
          "value": "1000"
        },
        "HighNode": "0000000000000000",
        "HighSponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "LedgerEntryType": "RippleState",
        "LowLimit": {
          "currency": "USD",
          "issuer": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
          "value": "0"
        },
        "LowNode": "0000000000000000",
        "PreviousTxnID": "E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879",
        "PreviousTxnLgrSeq": 14090896,
        "index": "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
      },
      {
        "Account": "rSponsee2XYZ789ABC123DEF456GHI",
        "Balance": "1000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 3,
        "PreviousTxnID": "0D5FB50FA65C9FE1538FD7E398FFFE9D1908DFA4576D8D7A020040686F93C77D",
        "PreviousTxnLgrSeq": 14091574,
        "Sequence": 1,
        "Sponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
      }
    ],
    "ledger_hash": "4C99E5F63C0D0B1C2283D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3",
    "ledger_index": 14091625,
    "validated": true,
    "status": "success"
  }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
{
  "result": {
    "account": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
    "sponsored_objects": [
      {
        "Balance": {
          "currency": "USD",
          "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
          "value": "100"
        },
        "Flags": 65536,
        "HighLimit": {
          "currency": "USD",
          "issuer": "rSponsee1ABC123XYZ456DEF789GHI",
          "value": "1000"
        },
        "HighNode": "0000000000000000",
        "HighSponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "LedgerEntryType": "RippleState",
        "LowLimit": {
          "currency": "USD",
          "issuer": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
          "value": "0"
        },
        "LowNode": "0000000000000000",
        "PreviousTxnID": "E3FE6EA3D48F0C2B639448020EA4F03D4F4F8FFDB243A852A0F59177921B4879",
        "PreviousTxnLgrSeq": 14090896,
        "index": "9ED4406351B7A511A012A9B5E7FE4059FA2F7650621379C0013492C315E25B97"
      },
      {
        "Account": "rSponsee2XYZ789ABC123DEF456GHI",
        "Balance": "1000000",
        "Flags": 0,
        "LedgerEntryType": "AccountRoot",
        "OwnerCount": 3,
        "PreviousTxnID": "0D5FB50FA65C9FE1538FD7E398FFFE9D1908DFA4576D8D7A020040686F93C77D",
        "PreviousTxnLgrSeq": 14091574,
        "Sequence": 1,
        "Sponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
      }
    ],
    "ledger_hash": "4C99E5F63C0D0B1C2283D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3D3",
    "ledger_index": 14091625,
    "validated": true,
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| Field                  | Type    | Description |
|:-----------------------|:--------|:------------|
| `account`              | String  | The account this request corresponds to. |
| `sponsored_objects`    | Array   | Array of ledger entries that this account is sponsoring. Includes objects owned by this account and objects owned by others, such as escrows where this account is the destination. Each member is a ledger entry in its raw ledger format. This may contain fewer entries than the maximum specified in the `limit` field. |
| `ledger_hash`          | String  | _(May be omitted)_ The identifying hash of the ledger that was used to generate this response. |
| `ledger_index`         | Number  | _(May be omitted)_ The ledger index of the ledger that was used to generate this response. |
| `ledger_current_index` | Number  | _(May be omitted)_ The ledger index of the current in-progress ledger, which was used when retrieving this data. |
| `limit`                | Number  | _(May be omitted)_ The limit that was used in this request, if any. |
| `marker`               | Marker  | _(May be omitted)_ Server-defined value indicating the response is paginated. Pass this to the next call to resume where this call left off. |
| `validated`            | Boolean | _(May be omitted)_ If `true`, the information in this response comes from a validated ledger version. Otherwise, the information is subject to change. |

## Possible Errors

- Any of the [universal error types][].
- `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
- `actNotFound` - The address specified in the `account` field of the request does not correspond to an account in the ledger.
- `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
