---
html: transaction-common-fields.html
parent: transaction-formats.html
seo:
    description: These common fields can be provided on any XRP Ledger transaction.
labels:
  - Transaction Sending
---
# Transaction Common Fields

Every transaction has the same set of common fields, plus additional fields based on the [transaction type](https://xrpl.org/docs/references/protocol/transactions/types/). Field names are case-sensitive. The common fields for all transactions are:

| Field                | JSON Type        | [Internal Type](https://xrpl.org/docs/references/protocol/binary-format/) | Description      |
|:---------------------|:-----------------|:------------------|:-----------------|
| `Account`            | String           | AccountID         | _(Required)_ The unique address of the [account](https://xrpl.org/docs/concepts/accounts/) that initiated the transaction. |
| `TransactionType`    | String           | UInt16            | _(Required)_ The type of transaction. Valid [transaction types](https://xrpl.org/docs/references/protocol/transactions/types/) include: `Payment`, `OfferCreate`, `TrustSet`, and many others. |
| `Fee`                | String           | Amount            | _(Required; [auto-fillable](https://xrpl.org/docs/references/protocol/transactions/common-fields#auto-fillable-fields))_ Integer amount of XRP, in drops, to be destroyed as a cost for distributing this transaction to the network. Some transaction types have different minimum requirements. See [Transaction Cost](https://xrpl.org/docs/concepts/transactions/transaction-cost/) for details. |
| `Sequence`           | Number           | UInt32            | _(Required; [auto-fillable](https://xrpl.org/docs/references/protocol/transactions/common-fields#auto-fillable-fields))_ The [sequence number](https://xrpl.org/docs/references/protocol/data-types/basic-data-types/#account-sequence) of the account sending the transaction. A transaction is only valid if the `Sequence` number is exactly 1 greater than the previous transaction from the same account. The special case `0` means the transaction is using a [Ticket](https://xrpl.org/docs/concepts/accounts/tickets/) instead _(Added by the [TicketBatch amendment](https://xrpl.org/resources/known-amendments/#ticketbatch).)_. |
| [`AccountTxnID`](#accounttxnid) | String | Hash256          | _(Optional)_ Hash value identifying another transaction. If provided, this transaction is only valid if the sending account's previously sent transaction matches the provided hash. |
| [`BatchTxn`](#batchtxn)         | object | STObject         | _(Optional)_ The `BatchTxn` inner object must be included in any inner transaction of a `Batch` transaction. |
| [`Flags`](#flags-field) | Number        | UInt32            | _(Optional)_ Set of bit-flags for this transaction. |
| `LastLedgerSequence` | Number           | UInt32            | _(Optional; strongly recommended)_ Highest ledger index this transaction can appear in. Specifying this field places a strict upper limit on how long the transaction can wait to be validated or rejected. See [Reliable Transaction Submission](https://xrpl.org/docs/concepts/transactions/reliable-transaction-submission/) for more details. |
| [`Memos`](#memos-field) | Array of Objects | Array          | _(Optional)_ Additional arbitrary information used to identify this transaction. |
| [`NetworkID`](#networkid-field) | Number | UInt32           | _(Network-specific)_ The network ID of the chain this transaction is intended for. **MUST BE OMITTED** for Mainnet and some test networks. **REQUIRED** on chains whose network ID is 1025 or higher. |
| [`Signers`](#signers-field) | Array     | Array             | _(Optional)_ Array of objects that represent a [multi-signature](https://xrpl.org/docs/concepts/accounts/multi-signing/) which authorizes this transaction. |
| `SourceTag`        | Number             | UInt32            | _(Optional)_ Arbitrary integer used to identify the reason for this payment, or a sender on whose behalf this transaction is made. Conventionally, a refund should specify the initial payment's `SourceTag` as the refund payment's `DestinationTag`. |
| `SigningPubKey`    | String           | Blob              | _(Automatically added when signing)_ Hex representation of the public key that corresponds to the private key used to sign this transaction. If an empty string, indicates a multi-signature is present in the `Signers` field instead. |
| `TicketSequence`   | Number           | UInt32            | _(Optional)_ The sequence number of the [ticket](https://xrpl.org/docs/concepts/accounts/tickets/) to use in place of a `Sequence` number. If this is provided, `Sequence` must be `0`. Cannot be used with `AccountTxnID`. |
| `TxnSignature`     | String           | Blob              | _(Automatically added when signing)_ The signature that verifies this transaction as originating from the account it says it is from. |

[auto-fillable]: #auto-fillable-fields

{% badge href="https://github.com/XRPLF/rippled/releases/tag/0.28.0" %}Removed in: rippled 0.28.0{% /badge %}: The `PreviousTxnID` field of transactions was replaced by the [`AccountTxnID`](#accounttxnid) field. This String / Hash256 field is present in some historical transactions. This is unrelated to the field also named `PreviousTxnID` in some [ledger objects](https://xrpl.org/docs/references/protocol/ledger-data/).


## AccountTxnID

<!-- SPELLING_IGNORE: AccountTxnID -->

The `AccountTxnID` field lets you chain your transactions together, so that a current transaction is not valid unless the previous transaction sent from the same account has a specific [transaction hash][https://xrpl.org/docs/references/protocol/transactions/common-fields#transaction-common-fields:~:text=has%20a%20specific-,transaction%20hash,-.].

Unlike the `PreviousTxnID` field, which tracks the last transaction to _modify_ an account (regardless of sender), the `AccountTxnID` tracks the last transaction _sent by_ an account. To use `AccountTxnID`, you must first enable the [`asfAccountTxnID`](https://xrpl.org/docs/references/protocol/transactions/types/accountset/#accountset-flags) flag, so that the ledger keeps track of the ID for the account's previous transaction. (`PreviousTxnID`, by comparison, is always tracked.)

One situation in which this is useful is if you have a primary system for submitting transactions and a passive backup system. If the passive backup system becomes disconnected from the primary, but the primary is not fully dead, and they both begin operating at the same time, you could potentially have serious problems like some transactions sending twice and others not at all. Chaining your transactions together with `AccountTxnID` ensures that, even if both systems are active, only one of them can submit valid transactions at a time.

The `AccountTxnID` field cannot be used on transactions that use [Tickets](https://xrpl.org/docs/concepts/accounts/tickets/). Transactions that use `AccountTxnID` cannot be placed in the [transaction queue](https://xrpl.org/docs/concepts/transactions/transaction-queue/).

## Auto-fillable Fields

Some fields can be automatically filled in before a transaction is signed, either by a `rippled` server or by a [client library](https://xrpl.org/docs/references/client-libraries/). Auto-filling values requires an active connection to the XRP Ledger to get the latest state, so it cannot be done offline. The details can vary by library, but auto-filling always provides suitable values for at least the following fields:

* `Fee` - Automatically fill in the [Transaction Cost](https://xrpl.org/docs/concepts/transactions/transaction-cost/) based on the network.

    **Note:** When using `rippled`'s [sign command](https://xrpl.org/docs/references/http-websocket-apis/admin-api-methods/signing-methods/sign/), you can limit the maximum possible auto-filled value, using the `fee_mult_max` and `fee_div_max` parameters.)

* `Sequence` - Automatically use the next sequence number for the account sending the transaction.

For a production system, we recommend _not_ leaving these fields to be filled by the server. For example, if transaction costs become high due to a temporary spike in network load, you may want to wait for the cost to decrease before sending some transactions, instead of paying the temporarily-high cost.

The [`Paths` field](https://xrpl.org/docs/references/protocol/transactions/types/payment/#paths) of the [Payment transaction](https://xrpl.org/docs/references/protocol/transactions/types/payment/) type can also be automatically filled in.

## BatchTxn

The `BatchTxn` inner object must be included in any inner transaction of a `Batch` transaction. Its inclusion:

- Prevents hash collisions between identical transactions (since sequence numbers aren't included).
- Ensures that every transaction has a sequence number associated with it, so that created ledger objects that use it in their ID generation can still operate.
- Allows users to more easily organize their transactions in the correct order.

The fields contained in this object are as follows.

| Field                | JSON Type        | [Internal Type][] | Description      |
|:---------------------|:-----------------|:------------------|:-----------------|
| `Account`            | string           | AccountID         | Account that is submitting the outer `Batch` transaction. |
| `OuterSequence`      | number           | UInt32            | This is the sequence number of the outer `Batch` transaction. Its inclusion ensures that there are no hash collisions with other `Batch` transactions. |
| `Sequence`           | number           | UInt32            | _(Optional)_ This is the next available sequence number for the inner transaction's account. This only needs to be included in a multi-account Batch transaction.  |
| `BatchIndex`         | number           | UInt8             | This is the (0-indexed) index of the inner transaction within the existing `Batch` transaction. The first inner transaction will have BatchIndex value 0, the second will be 1, and so on. Its inclusion ensures there are no hash collisions with other inner transactions within the same `Batch` transaction, and that the transactions are all placed in the right order. |

## Flags Field

The `Flags` field can contain various options that affect how a transaction should behave. The options are represented as binary values that can be combined with bitwise-or operations to set multiple flags at once.

To check whether a transaction has a given flag enabled, use the bitwise-and operator on the flag's value and the `Flags` field. A result of zero indicates the flag is disabled, and a result equal to the flag value indicates the flag is enabled. (If you got any other result, you did something wrong.)

Most flags only have meaning for a specific transaction type. The same bitwise value may be reused for flags on different transaction types, so it is important to pay attention to the `TransactionType` field when setting and reading flags.

Bits that are not defined as flags MUST be 0. (The [fix1543 amendment](https://xrpl.org/resources/known-amendments/#fix1543) enforces this rule on some transaction types. Most transaction types enforce this rule by default.)

### Global Flags

The only flag that applies globally to all transactions is as follows:

| Flag Name             | Hex Value  | Decimal Value | Description               |
|:----------------------|:-----------|:--------------|:--------------------------|
| `tfFullyCanonicalSig` | `0x80000000` | 2147483648  | **DEPRECATED** No effect. (If the [RequireFullyCanonicalSig amendment](https://xrpl.org/resources/known-amendments/#requirefullycanonicalsig) is not enabled, this flag enforces a [fully canonical signature](https://xrpl.org/docs/concepts/transactions/finality-of-results/transaction-malleability/#alternate-secp256k1-signatures).) |

When using the [sign method](https://xrpl.org/docs/references/http-websocket-apis/admin-api-methods/signing-methods/sign/) (or [submit method](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/transaction-methods/submit/) in "sign-and-submit" mode), `rippled` adds a `Flags` field with `tfFullyCanonicalSig` enabled unless the `Flags` field is already present. The `tfFullyCanonicalSig` flag is not automatically enabled if `Flags` is explicitly specified. The flag is not automatically enabled when using the [sign_for method](https://xrpl.org/docs/references/http-websocket-apis/admin-api-methods/signing-methods/sign_for/) to add a signature to a multi-signed transaction.

**Note:** The `tfFullyCanonicalSig` flag was used from 2014 until 2020 to protect against [transaction malleability](https://xrpl.org/docs/concepts/transactions/finality-of-results/transaction-malleability/) while maintaining compatibility with legacy signing software. The [RequireFullyCanonicalSig amendment](https://xrpl.org/resources/known-amendments/#requirefullycanonicalsig) ended compatibility with such legacy software and made the protections the default for all transactions. If you are using a [parallel network](https://xrpl.org/docs/concepts/networks-and-servers/parallel-networks/) that does not have RequireFullyCanonicalSig enabled, you should always enable the `tfFullyCanonicalSig` flag to protect against transaction malleability.

### Flag Ranges

A transaction's `Flags` field can contain flags that apply at different levels or contexts. Flags for each context are limited to the following ranges:

| Range Name       | Bit Mask     | Description                                |
|:-----------------|:-------------|:-------------------------------------------|
| Universal Flags  | `0xff000000` | Flags that apply equally to all transaction types. |
| Type-based Flags | `0x00ff0000` | Flags with different meanings depending on the [transaction type](https://xrpl.org/docs/references/protocol/transactions/types/) that uses them. |
| Reserved Flags   | `0x0000ffff` | Flags that are not currently defined. A transaction is only valid if these flags are disabled. |

**Note:** The [AccountSet transaction](https://xrpl.org/docs/references/protocol/transactions/types/accountset/) type has [its own non-bitwise flags](https://xrpl.org/docs/references/protocol/transactions/types/accountset/#accountset-flags), which serve a similar purpose to type-based flags. [Ledger objects](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/) also have a `Flags` field with different bitwise flag definitions.


## Memos Field

The `Memos` field includes arbitrary messaging data with the transaction. It is presented as an array of objects. Each object has only one field, `Memo`, which in turn contains another object with *one or more* of the following fields:

| Field        | Type   | [Internal Type][] | Description                      |
|:-------------|:-------|:------------------|:---------------------------------|
| `MemoData`   | String | Blob              | Arbitrary hex value, conventionally containing the content of the memo. |
| `MemoFormat` | String | Blob              | Hex value representing characters allowed in URLs. Conventionally containing information on how the memo is encoded, for example as a [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml). |
| `MemoType`   | String | Blob              | Hex value representing characters allowed in URLs. Conventionally, a unique relation (according to [RFC 5988](http://tools.ietf.org/html/rfc5988#section-4)) that defines the format of this memo. |

The `MemoType` and `MemoFormat` fields should only consist of the following characters: `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=%`

The `Memos` field is limited to no more than 1 KB in size (when serialized in binary format).

Example of a transaction with a Memos field:

```json
{
    "TransactionType": "Payment",
    "Account": "rMmTCjGFRWPz8S2zAUUoNVSQHxtRQD4eCx",
    "Destination": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
    "Memos": [
        {
            "Memo": {
                "MemoType": "687474703a2f2f6578616d706c652e636f6d2f6d656d6f2f67656e65726963",
                "MemoData": "72656e74"
            }
        }
    ],
    "Amount": "1"
}
```

## NetworkID Field
{% badge href="https://github.com/XRPLF/rippled/releases/tag/1.11.0" %}New in: rippled 1.11.0{% /badge %}

The `NetworkID` field is a protection against "cross-chain" transaction replay attacks, preventing the same transaction from being copied over and executing on a [parallel network](https://xrpl.org/docs/concepts/networks-and-servers/parallel-networks/) that it wasn't intended for. For compatibility with existing chains, the `NetworkID` field must be omitted on any network with a Network ID of 1024 or less, but must be included on any network with a Network ID of 1025 or greater. The following table shows the status and values for various known networks:

| Network       | ID | `NetworkID` Field |
|---------------|----|-------------------|
| Mainnet       | 0  | Disallowed        |
| Testnet       | 1  | Disallowed        |
| Devnet        | 2  | Disallowed        |
| AMM Devnet    | 25 | Disallowed        |
| Sidechains Devnet Locking Chain | 2551 | Disallowed, but will become required after an update |
| Sidechains Devnet Issuing Chain | 2552 | Disallowed, but will become required after an update |
| Hooks V3 Testnet | 21338 | Required    |

Transaction replay attacks are theoretically possible, but require specific conditions on the second network. All of the following must be true:

- The transaction's sender is a funded account on the second network.
- The sender's `Sequence` number on the second network matches the transaction's `Sequence`, or the transaction uses a [Ticket](https://xrpl.org/docs/concepts/accounts/tickets/) that's available on the second network.
- Either the transaction does not have a `LastLedgerSequence` field, or it specifies a value that is higher than the current ledger index on the second ledger.
    - Mainnet generally has a higher ledger index than test networks or sidechains, so it is easier to replay Mainnet transactions on a sidechain or test network than the other way around, when transactions use `LastLedgerSequence` as intended.
- Either the networks both have IDs of 1024 or less, both networks use the same ID, or the second network does not require the `NetworkID` field.


## Signers Field

The `Signers` field contains a [multi-signature](https://xrpl.org/docs/concepts/accounts/multi-signing/), which has signatures from up to 32 key pairs, that together should authorize the transaction. The `Signers` list is an array of objects, each with one field, `Signer`. The `Signer` field has the following nested fields:

| Field           | Type   | [Internal Type][] | Description                     |
|:----------------|:-------|:------------------|:--------------------------------|
| `Account`       | String | AccountID         | The address associated with this signature, as it appears in the signer list. |
| `TxnSignature`  | String | Blob              | A signature for this transaction, verifiable using the `SigningPubKey`. |
| `SigningPubKey` | String | Blob              | The public key used to create this signature. |

The `SigningPubKey` must be a key that is associated with the `Account` address. If the referenced `Account` is a funded account in the ledger, then the `SigningPubKey` can be that account's current Regular Key if one is set. It could also be that account's Master Key, unless the [`lsfDisableMaster`](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot/#accountroot-flags) flag is enabled. If the referenced `Account` address is not a funded account in the ledger, then the `SigningPubKey` must be the master key associated with that address.

Because signature verification is a compute-intensive task, multi-signed transactions cost additional XRP to relay to the network. Each signature included in the multi-signature increases the [transaction cost](https://xrpl.org/docs/concepts/transactions/transaction-cost/) required for the transaction. For example, if the current minimum transaction cost to relay a transaction to the network is `10000` drops, then a multi-signed transaction with 3 entries in the `Signers` array would need a `Fee` value of at least `40000` drops to relay.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
