---
html: ledger_entry.html
parent: ledger-methods.html
blurb: Get one element from a ledger version.
labels:
  - Blockchain
  - Data Retention
---
# ledger_entry
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/LedgerEntry.cpp "Source")

<embed src="/snippets/_mpts-disclaimer.md" />

The `ledger_entry` method returns a single ledger entry from the XRP Ledger in its raw format. See [ledger format](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/) for information on the different types of entries you can retrieve.

## Request Format

This method can retrieve several different types of data. You can select which type of item to retrieve by passing the appropriate parameters, comprised of the general and type-specific fields listed below, and following the standard [request formatting](https://xrpl.org/docs/references/http-websocket-apis/api-conventions/request-formatting/). (For example, a WebSocket request always has the `command` field and optionally an `id` field, and a JSON-RPC request uses the `method` and `params` fields.)
<!-- 
{% include '_snippets/no-cli-syntax.md' %} -->

### General Fields

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `binary`                | Boolean                    | _(Optional)_ If `true`, return the requested ledger entry's contents as a hex string in the XRP Ledger's [binary format](https://xrpl.org/docs/references/protocol/binary-format/). Otherwise, return data in JSON format. The default is `false`. [Updated in: rippled 1.2.0](https://github.com/XRPLF/rippled/releases/tag/1.2.0) |
| `ledger_hash`           | String                     | _(Optional)_ A 20-byte hex string for the ledger version to use. (See [Specifying Ledgers](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#specifying-ledgers)) |
| `ledger_index`          | String or Unsigned Integer | _(Optional)_ The [ledger index](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#ledger-index) of the ledger to use, or a shortcut string (e.g. "validated" or "closed" or "current") to choose a ledger automatically. (See [Specifying Ledgers](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#specifying-ledgers)) |

The `generator` and `ledger` parameters are deprecated and may be removed without further notice.

In addition to the general fields above, you must specify *exactly 1* of the following fields to indicate what type of entry to retrieve, along with its sub-fields as appropriate. The valid fields are:

- [`index`](#get-ledger-object-by-id)
- [`account_root`](#get-accountroot-object)
- [`amm`](#get-amm-object) :not_enabled:
- [`directory`](#get-directorynode-object)
- [`offer`](#get-offer-object)
- [`ripple_state`](#get-ripplestate-object)
- [`check`](#get-check-object)
- [`escrow`](#get-escrow-object)
- [`payment_channel`](#get-paychannel-object)
- [`deposit_preauth`](#get-depositpreauth-object)
- [`ticket`](#get-ticket-object)
- [`nft_page`](#get-nft-page)
- [`mpt_issuance`](#get-mpt-issuance-object)
- [`mptoken`](#get-mptoken-object)

**Caution:** If you specify more than 1 of these type-specific fields in a request, the server retrieves results for only 1 of them. It is not defined which one the server chooses, so you should avoid doing this.


### Get Ledger Object by ID

Retrieve any type of ledger object by its unique ID.

| Field   | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `index` | String | The [ledger entry ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of a single entry to retrieve from the ledger, as a 64-character (256-bit) hexadecimal string. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "command": "ledger_entry",
  "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4",
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "index": "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4", "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-by-object-id)

> **Tip:** You can use this type of request to get any singleton ledger entry, if it exists in the ledger data, because its ID is always the same. For example:
>
> - [`Amendments`](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/amendments/) - `7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4`
> - [`FeeSettings`](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/feesettings/) - `4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651`
> - [Recent History `LedgerHashes`](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/ledgerhashes/) - `B4979A36CDC7F3D3D5C31A4EAE2AC7D7209DDA877588B9AFC66799692AB0D66B`
> - [`NegativeUNL`](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/negativeunl/) - `2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244`

### Get AccountRoot Object

Retrieve an [AccountRoot entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot/) by its address. This is roughly equivalent to the [account_info method](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/account-methods/account_info/).

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `account_root`          | String - [Address](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#addresses)       | The classic address of the [AccountRoot entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot/) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_accountroot",
  "command": "ledger_entry",
  "account_root": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "account_root": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "account_root": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59", "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs.devnet.rippletest.net%3A51233%2F#ledger_entry-amm)



### Get AMM Object


Retrieve an Automated Market-Maker (AMM) object from the ledger. This is similar to [amm_info method](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/amm_info/), but the `ledger_entry` version returns only the ledger entry as stored.

| Field        | Type             | Description           |
|:-------------|:-----------------|:----------------------|
| `amm`        | Object or String | The [AMM](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/amm/) to retrieve. If you specify a string, it must be the [object ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of the AMM, as hexadecimal. If you specify an object, it must contain `asset` and `asset2` sub-fields. |
| `amm.asset`  | Object           | One of the two assets in this AMM's pool, as a [currency object without an amount](https://xrpl.org/docs/references/protocol/data-types/currency-formats/#specifying-without-amounts). |
| `amm.asset2` | Object           | The other of the two assets in this AMM's pool, as a [currency object without an amount](https://xrpl.org/docs/references/protocol/data-types/currency-formats/#specifying-without-amounts). |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
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

*JSON-RPC*

```json
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

*Commandline*

```sh
rippled json ledger_entry '{ "amm": { "asset": { "currency": "XRP" }, "asset2": { "currency" : "TST", "issuer" : "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd" } }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fs.devnet.rippletest.net%3A51233%2F#ledger_entry-amm)



### Get DirectoryNode Object

Retrieve a [DirectoryNode](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/directorynode/), which contains a list of other ledger objects. Can be provided as string (object ID of the Directory) or as an object.

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `directory`             | Object or String           | The [DirectoryNode](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/directorynode/) to retrieve. If a string, must be the [object ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of the directory, as hexadecimal. If an object, requires either `dir_root` or `owner` as a sub-field, plus optionally a `sub_index` sub-field. |
| `directory.sub_index`   | Unsigned Integer           | _(Optional)_ If provided, jumps to a later "page" of the [DirectoryNode](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/directorynode/). |
| `directory.dir_root`    | String                     | _(Optional)_ Unique index identifying the directory to retrieve, as a hex string. |
| `directory.owner`       | String                     | _(Optional)_ Unique address of the account associated with this directory. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": 3,
  "command": "ledger_entry",
  "directory": {
    "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "sub_index": 0
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
    "method": "ledger_entry",
    "params": [
        {
            "directory": {
              "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
              "sub_index": 0
            },
            "ledger_index": "validated"
        }
    ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "directory": { "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "sub_index": 0 }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-directorynode)



### Get Offer Object

Retrieve an [Offer entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/offer/), which defines an offer to exchange currency. Can be provided as string (unique index of the Offer) or as an object.

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `offer`                 | Object or String           | If a string, interpret as [ledger entry ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of the Offer to retrieve. If an object, requires the sub-fields `account` and `seq` to uniquely identify the offer. |
| `offer.account`         | String - [Address](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#addresses)       | _(Required if `offer` is specified as an object)_ The account that placed the offer. |
| `offer.seq`             | Unsigned Integer           | _(Required if `offer` is specified as an object)_ The [Sequence Number](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#account-sequence) of the transaction that created the Offer entry. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_offer",
  "command": "ledger_entry",
  "offer": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "seq": 359
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [
    {
      "offer": {
        "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "seq": 359
      },
      "ledger_index": "validated"
    }
  ]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "offer": { "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "seq": 359}, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-offer)



### Get RippleState Object

Retrieve a [RippleState entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/ripplestate/), which tracks a (non-XRP) currency balance between two accounts.

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `ripple_state`          | Object                     | Object specifying the RippleState (trust line) object to retrieve. The `accounts` and `currency` sub-fields are required to uniquely specify the RippleState entry to retrieve. |
| `ripple_state.accounts` | Array                      | _(Required if `ripple_state` is specified)_ 2-length array of account [Address](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#addresses))es, defining the two accounts linked by this RippleState entry. |
| `ripple_state.currency` | String                     | _(Required if `ripple_state` is specified)_ [Currency Code](https://xrpl.org/docs/references/protocol/data-types/currency-formats/#currency-codes) of the RippleState entry to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_ripplestate",
  "command": "ledger_entry",
  "ripple_state": {
    "accounts": [
      "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
    ],
    "currency": "USD"
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "ripple_state": {
      "accounts": [
        "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"
      ],
      "currency": "USD"
    },
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "ripple_state": { "accounts": ["rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"], "currency": "USD"}, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-ripplestate)



### Get Check Object

Retrieve a [Check entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/check/), which is a potential payment that can be cashed by its recipient. [New in: rippled 1.0.0](https://github.com/XRPLF/rippled/releases/tag/1.0.0)

| Field   | Type   | Description                                               |
|:--------|:-------|:----------------------------------------------------------|
| `check` | String | The [object ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of a [Check entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/check/) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_check",
  "command": "ledger_entry",
  "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB",
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "check": "C4A46CCD8F096E994C4B0DEAB6CE98E722FC17D7944C28B95127C2659C47CBEB", "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-check)



### Get Escrow Object

Retrieve an [Escrow entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/escrow/), which holds XRP until a specific time or condition is met. Can be provided as string (object ID of the Escrow) or as an object. [New in: rippled 1.0.0](https://github.com/XRPLF/rippled/releases/tag/1.0.0)

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `escrow`                | Object or String           | The Escrow to retrieve. If a string, must be the [object ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of the Escrow, as hexadecimal. If an object, requires `owner` and `seq` sub-fields. |
| `escrow.owner`          | String - [Address](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#addresses)       | _(Required if `escrow` is specified as an object)_ The owner (sender) of the Escrow object. |
| `escrow.seq`            | Unsigned Integer           | _(Required if `escrow` is specified as an object)_ The [Sequence Number](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#account-sequence) of the transaction that created the Escrow object. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_escrow",
  "command": "ledger_entry",
  "escrow": {
    "owner": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK",
    "seq": 126
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "escrow": {
      "owner": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK",
      "seq": 126
    },
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "escrow": { "owner": "rL4fPHi2FWGwRGRQSH7gBcxkuo2b9NTjKK", "seq": 126 }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-escrow)



### Get PayChannel Object

Retrieve a [PayChannel entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/paychannel/), which holds XRP for asynchronous payments. [New in: rippled 1.0.0](https://github.com/XRPLF/rippled/releases/tag/1.0.0)

| Field             | Type   | Description                                     |
|:------------------|:-------|:------------------------------------------------|
| `payment_channel` | String | The [object ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of the PayChannel to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_paychannel",
  "command": "ledger_entry",
  "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "payment_channel": "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7", "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-paychannel)


### Get DepositPreauth Object

Retrieve a [DepositPreauth entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/depositpreauth/), which tracks preauthorization for payments to accounts requiring [Deposit Authorization](https://xrpl.org/docs/concepts/accounts/depositauth/). [New in: rippled 1.0.0](https://github.com/XRPLF/rippled/releases/tag/1.0.0)

| Field                        | Type                 | Description            |
|:-----------------------------|:---------------------|:-----------------------|
| `deposit_preauth`            | Object or String     | Specify the DepositPreauth to retrieve. If a string, must be the [ledger entry ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of the DepositPreauth entry, as hexadecimal. If an object, requires `owner` and `authorized` sub-fields. |
| `deposit_preauth.owner`      | String - [Address](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#addresses) | _(Required if `deposit_preauth` is specified as an object)_ The account that provided the preauthorization. |
| `deposit_preauth.authorized` | String - [Address](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#addresses) | _(Required if `deposit_preauth` is specified as an object)_ The account that received the preauthorization. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_deposit_preauth",
  "command": "ledger_entry",
  "deposit_preauth": {
    "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "deposit_preauth": {
      "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
    },
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "deposit_preauth": { "owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "authorized": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX" }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-depositpreauth)


### Get Ticket Object

Retrieve a [Ticket entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/ticket/), which represents a [sequence number](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#account-sequence) set aside for future use. _(Added by the [TicketBatch amendment](https://xrpl.org/resources/known-amendments/#ticketbatch))_

| Field               | Type                 | Description           |
|:--------------------|:---------------------|:----------------------|
| `ticket`            | Object or String     | The Ticket to retrieve. If a string, must be the [ledger entry ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of the Ticket, as hexadecimal. If an object, the `account` and `ticket_seq` sub-fields are required to uniquely specify the Ticket entry. |
| `ticket.account`    | String - [Address](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#addresses) | _(Required if `ticket` is specified as an object)_ The owner of the Ticket. |
| `ticket.ticket_seq` | Number               | _(Required if `ticket` is specified as an object)_ The Ticket Sequence number of the Ticket to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_ticket",
  "command": "ledger_entry",
  "ticket": {
    "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "ticket_seq": 389
  },
  "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "ticket": {
      "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "ticket_seq": 389
    },
    "ledger_index": "validated"
  }]
}
```

*Commandline*

```sh
rippled json ledger_entry '{ "ticket": { "account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn", "ticket_seq: 389 }, "ledger_index": "validated" }'
```

<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-ticket)


### Get NFT Page

Return an NFT Page in its raw ledger format.

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `nft_page`              | String | The [ledger entry ID](https://xrpl.org/docs/references/protocol/ledger-data/common-fields/) of an [NFT Page](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/nftokenpage/) to retrieve. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "id": "example_get_nft_page",
    "command": "ledger_entry",
    "nft_page": "255DD86DDF59D778081A06D02701E9B2C9F4F01DFFFFFFFFFFFFFFFFFFFFFFFF",
    "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "nft_page": "255DD86DDF59D778081A06D02701E9B2C9F4F01DFFFFFFFFFFFFFFFFFFFFFFFF",
    "ledger_index": "validated"
  }]
}
```

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool#ledger_entry-nft-page)

### Get MPT Issuance Object 

Return an `MPTokenIssuance` object.

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `mpt_issuance`              | String | The 192-bit `MPTokenIssuanceID` that's associated with the MPTokenIssuance. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "id": "example_get_mpt_issuance",
    "command": "ledger_entry",
    "mpt_issuance": "000004C463C52827307480341125DA0577DEFC38405B0E3E",
    "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "mpt_issuance": "000004C463C52827307480341125DA0577DEFC38405B0E3E",
    "ledger_index": "validated"
  }]
}
```
*Commandline*

```sh
rippled json ledger_entry '{ "mpt_issuance": "000004C463C52827307480341125DA0577DEFC38405B0E3E", "ledger_index": "validated" }'
```
### Get MPToken Object 

Return an `MPToken` object.

| Field                   | Type                       | Description           |
|:------------------------|:---------------------------|:----------------------|
| `mptoken`               | ️Object or String          | If a string, interpret as ledger entry ID of the MPToken to retrieve. If an object, requires the sub-fields account and mpt_issuance_id to unique identify the MPToken. |
| mptoken.mpt_issuance_id |	️String                      |	(Required if the `MPToken` is specified as an object) The 192-bit MPTokenIssuanceID that's associated with the MPTokenIssuance. |
| mptoken.account	️         | String	                    | (Required if the `MPToken` is specified as an object) The account that owns the MPToken. |

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
    "id": "example_get_mpt_issuance",
    "command": "ledger_entry",
    "mpt_issuance": "000004C463C52827307480341125DA0577DEFC38405B0E3E",
    "ledger_index": "validated"
}
```

*JSON-RPC*

```json
{
  "method": "ledger_entry",
  "params": [{
    "mpt_issuance": "000004C463C52827307480341125DA0577DEFC38405B0E3E",
    "ledger_index": "validated"
  }]
}
```
*Commandline*

```sh
rippled json ledger_entry '{ "mpt_issuance": "000004C463C52827307480341125DA0577DEFC38405B0E3E", "ledger_index": "validated" }'
```
<!-- MULTICODE_BLOCK_END -->

[Try it! >](https://xrpl.org/resources/dev-tools/websocket-api-tool.html#ledger_entry-mpt_issuance)

## Response Format

The response follows the [standard format](https://xrpl.org/docs/references/http-websocket-apis/api-conventions/response-formatting/), with a successful result containing the following fields:

| Field          | Type             | Description                              |
|:---------------|:-----------------|:-----------------------------------------|
| `index`        | String           | The unique ID of this [ledger entry](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/). |
| `ledger_index` | Unsigned Integer | The [ledger index](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#ledger-index) of the ledger that was used when retrieving this data. |
| `node`         | Object           | _(Omitted if `"binary": true` specified.)_ Object containing the data of this ledger entry, according to the [ledger format](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/). |
| `node_binary`  | String           | _(Omitted unless `"binary":true` specified)_ The [binary representation](https://xrpl.org/docs/references/protocol/binary-format/) of the ledger object, as hexadecimal. |

An example of a successful response:

<!-- MULTICODE_BLOCK_START -->

*WebSocket*

```json
{
  "id": "example_get_accountroot",
  "result": {
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "31850E8E48E76D1064651DF39DF4E9542E8C90A9A9B629F4DE339EB3FA74F726",
    "ledger_index": 61966146,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "validated": true
  },
  "status": "success",
  "type": "response"
}
```

*JSON-RPC*

```json
200 OK

{
  "result": {
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "395946243EA36C5092AE58AF729D2875F659812409810A63096AC006C73E656E",
    "ledger_index": 61966165,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "status": "success",
    "validated": true
  }
}
```

*Commandline*

```json
{
  "result": {
    "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8",
    "ledger_hash": "395946243EA36C5092AE58AF729D2875F659812409810A63096AC006C73E656E",
    "ledger_index": 61966165,
    "node": {
      "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
      "AccountTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "Balance": "424021949",
      "Domain": "6D64756F31332E636F6D",
      "EmailHash": "98B4375E1D753E5B91627516F6D70977",
      "Flags": 9568256,
      "LedgerEntryType": "AccountRoot",
      "MessageKey": "0000000000000000000000070000000300",
      "OwnerCount": 12,
      "PreviousTxnID": "4E0AA11CBDD1760DE95B68DF2ABBE75C9698CEB548BEA9789053FCB3EBD444FB",
      "PreviousTxnLgrSeq": 61965653,
      "RegularKey": "rD9iJmieYHn8jTtPjwwkW2Wm9sVDvPXLoJ",
      "Sequence": 385,
      "TransferRate": 4294967295,
      "index": "13F1A95D7AAB7108D5CE7EEAF504B2894B8C674E6D68499076441C4837282BF8"
    },
    "status": "success",
    "validated": true
  }
}
```

<!-- MULTICODE_BLOCK_END -->


## Possible Errors

* Any of the [universal error types](https://xrpl.org/docs/references/http-websocket-apis/api-conventions/error-formatting/#universal-errors).
* `deprecatedFeature` - The request specified a removed field, such as `generator`.
* `entryNotFound` - The requested ledger entry does not exist in the ledger.
* `invalidParams` - One or more fields are specified incorrectly, or one or more required fields are missing.
* `lgrNotFound` - The ledger specified by the `ledger_hash` or `ledger_index` does not exist, or it does exist but the server does not have it.
* `malformedAddress` - The request improperly specified an [Address](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#addresses) field.
* `malformedCurrency` - The request improperly specified a [Currency Code](https://xrpl.org/docs/references/protocol/data-types/currency-formats/#currency-codes) field.
* `malformedOwner` - The request improperly specified the `escrow.owner` sub-field.
* `malformedRequest` - The request provided an invalid combination of fields, or provided the wrong type for one or more fields.
* `unknownOption` - The fields provided in the request did not match any of the expected request formats.



<!--{# common link defs #}-->
<!-- Uncomment for xrpl.org
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %} -->
