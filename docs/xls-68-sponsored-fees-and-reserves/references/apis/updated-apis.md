# Updated APIs

This page describes updates to existing RPC methods introduced by XLS-68: Sponsored Fees and Reserves.

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## account_objects

The [account_objects method](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_objects) adds a new optional filter parameter to query sponsored objects.

| Field       | Type    | Required? | Description |
|:------------|:--------|:----------|:------------|
| `sponsored` | Boolean | No        | If `true`, returns only sponsored objects (objects with a `Sponsor`, `HighSponsor`, or `LowSponsor` field). If `false`, returns only non-sponsored objects. If omitted, returns all objects (existing behavior). |

### Request Format

An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "command": "account_objects",
  "account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
  "sponsored": true,
  "ledger_index": "validated",
  "type": "state"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
  "method": "account_objects",
  "params": [
    {
      "account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
      "sponsored": true,
      "ledger_index": "validated",
      "type": "state"
    }
  ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
rippled account_objects rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf sponsored=true ledger_index=validated type=state
```
{% /tab %}

{% /tabs %}

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": 1,
  "result": {
    "account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
    "account_objects": [
      {
        "Balance": {
          "currency": "USD",
          "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
          "value": "100"
        },
        "Flags": 65536,
        "HighLimit": {
          "currency": "USD",
          "issuer": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
          "value": "1000"
        },
        "HighNode": "0000000000000000",
        "HighSponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "LedgerEntryType": "RippleState",
        "LowLimit": {
          "currency": "USD",
          "issuer": "rfkDkFai4jUfCvAJiZ5Vm7XvvWjYvDqeYo",
          "value": "0"
        },
        "LowNode": "0000000000000000",
        "PreviousTxnID": "1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
        "PreviousTxnLgrSeq": 12345678,
        "index": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890"
      }
    ],
    "ledger_hash": "FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321",
    "ledger_index": 56789012,
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
    "account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
    "account_objects": [
      {
        "Balance": {
          "currency": "USD",
          "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
          "value": "100"
        },
        "Flags": 65536,
        "HighLimit": {
          "currency": "USD",
          "issuer": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
          "value": "1000"
        },
        "HighNode": "0000000000000000",
        "HighSponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "LedgerEntryType": "RippleState",
        "LowLimit": {
          "currency": "USD",
          "issuer": "rfkDkFai4jUfCvAJiZ5Vm7XvvWjYvDqeYo",
          "value": "0"
        },
        "LowNode": "0000000000000000",
        "PreviousTxnID": "1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
        "PreviousTxnLgrSeq": 12345678,
        "index": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890"
      }
    ],
    "ledger_hash": "FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321",
    "ledger_index": 56789012,
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
    "account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
    "account_objects": [
      {
        "Balance": {
          "currency": "USD",
          "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
          "value": "100"
        },
        "Flags": 65536,
        "HighLimit": {
          "currency": "USD",
          "issuer": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
          "value": "1000"
        },
        "HighNode": "0000000000000000",
        "HighSponsor": "rSponsor1VktvzBz8JF2oJC6qaww6RZ7Lw",
        "LedgerEntryType": "RippleState",
        "LowLimit": {
          "currency": "USD",
          "issuer": "rfkDkFai4jUfCvAJiZ5Vm7XvvWjYvDqeYo",
          "value": "0"
        },
        "LowNode": "0000000000000000",
        "PreviousTxnID": "1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
        "PreviousTxnLgrSeq": 12345678,
        "index": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890"
      }
    ],
    "ledger_hash": "FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321",
    "ledger_index": 56789012,
    "validated": true,
    "status": "success"
  }
}
```
{% /tab %}

{% /tabs %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
