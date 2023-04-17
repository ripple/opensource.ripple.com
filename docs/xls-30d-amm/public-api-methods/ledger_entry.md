# ledger_entry

XLS-30d extends the existing [ledger_entry method](https://xrpl.org/ledger_entry.html) so that it can be used to retrieve an AMM object.

### Get AMM Object

Retrieve an Automated Market-Maker (AMM) object from the ledger. This is similar to [amm_info method](amm_info.md), but the `ledger_entry` version returns only the ledger entry as stored.

| Field        | Type             | Description           |
|:-------------|:-----------------|:----------------------|
| `amm`        | Object or String | The [AMM](amm.html) to retrieve. If you specify a string, it must be the [object ID](https://xrpl.org/ledger-object-ids.html) of the AMM, as hexadecimal. If you specify an object, it must contain `asset` and `asset2` sub-fields. |
| `amm.asset`  | Object           | One of the two assets in this AMM's pool, as a [currency object without an amount](https://xrpl.org/
](currency-formats.htcurrency-formats.html#specifying-without-amounts). |
| `amm.asset2` | Object           | The other of the two assets in this AMM's pool, as a [currency object without an amount](https://xrpl.org/
](currency-formats.htcurrency-formats.html#specifying-without-amounts). |


```json WebSocket
{
  "id": 30,
  "command": "ledger_entry",
  "amm": {
    "asset": {
      "currency": "XRP"
    },
    "asset2": {
      "currency" : "TST",
      "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
    }
  }
  "ledger_index": "validated"
}
```

```json JSON-RPC
{
    "method": "ledger_entry",
    "params": [
        {
          "amm": {
            "asset": {
              "currency": "XRP"
            },
            "asset2": {
              "currency" : "TST",
              "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
            }
          },
          "ledger_index": "validated"
        }
    ]
}
```

```sh Commandline
rippled json ledger_entry '{ "amm": { "asset": { "currency": "XRP" }, "asset2": { "currency" : "TST", "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd" } }, "ledger_index": "validated" }'
```

