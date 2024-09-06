---
blurb: Introduction to XRPL MPTs.
labels:
  - Multi-purpose Tokens, MPTs, Tokens
---
# MPTokenIssuance

<embed src="/snippets/_mpts-disclaimer.md" />

The `MPTokenIssuance` object represents a single MPT issuance and holds data associated with the issuance itself. Token issuances are created using the `MPTokenIssuanceCreate` transaction and can be destroyed by the `MPTokenIssuanceDestroy` transaction.

<!-- _(Added by the [MPTokenV1_1 amendment][].)_ -->

## Example MPTokenIssuance JSON

```json
{
    "LedgerEntryType": "MPTokenIssuance",
    "Flags": 131072,
    "Issuer": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "AssetScale": "2",
    "MaximumAmount": "100000000",
    "OutstandingAmount": "3e8",
    "TransferFee": 50000,     
    "MPTokenMetadata": "",
    "OwnerNode": "74"
}
```

## MPTokenIssuanceID


The key of an `MPTokenIssuance` object is the result of SHA512-Half of the following values, concatenated in order:

- The `MPTokenIssuance` space key (0x007E).
- The transaction sequence number.
- The `AccountID` of the issuer.

The `MPTokenIssuanceID` is a 192-bit integer, concatenated in order:

- The transaction sequence number.
- The AccountID of the issuer.


## MPTokenIssuance Fields

`MPTokenIssuance` objects have the following fields.

| Field Name        | JSON Type | Internal Type | Description |
|:------------------|:----------|:--------------|:------------|
| LedgerEntryType   | number    | UInt16        | The value 0x007E, mapped to the string MPTokenIssuance, indicates that this object describes a Multi-Purpose Token (MPT). |
| `Flags`             | number    | UInt32        | See [MPTokenIssuance Flags](#mptokenissuance-flags) |
| `Issuer`           | string    | AccountID     | The address of the account that controls both the issuance amounts and characteristics of a particular fungible token. |
| `AssetScale` | number    | UInt8       | An asset scale is the difference, in orders of magnitude, between a standard unit and a corresponding fractional unit. More formally, the asset scale is a non-negative integer (0, 1, 2, …) such that one standard unit equals 10^(-scale) of a corresponding fractional unit. If the fractional unit equals the standard unit, then the asset scale is 0. |
| `MaximumAmount`         | string    | UInt64        | This value is an unsigned number that specifies the maximum number of MPTs that can be distributed to non-issuing accounts (i.e., minted). For issuances that do not have a maximum limit, this value should be set to 0xFFFFFFFFFFFFFFFF. |
| `OutstandingAmount` | string    | UInt64        | Specifies the sum of all token amounts that have been minted to all token holders. This value can be stored on ledger as a default type so that when its value is 0 it takes up less space on ledger. This value is increased whenever an issuer pays MPTs to a non-issuer account, and decreased whenever a non-issuer pays MPTs into the issuing account. |
| `LockedAmount`      | string    | UInt64        | A positive amount of tokens that are currently held in a token holder's account, but are unavailable to be used by the token holder. Locked tokens might, for example, represent value currently being held in escrow, or value that is otherwise inaccessible to the token holder. This value is stored as a default value such that its initial value is 0, in order to save space on the ledger for an empty MPT holding. |
| `TransferFee`       | number    | UInt16        | This value specifies the fee, in tenths of a basis point, charged by the issuer for secondary sales of the token, if such sales are allowed at all. Valid values for this field are between 0 and 50,000 inclusive. A value of 1 is equivalent to 1/10 of a basis point or 0.001%, allowing transfer rates between 0% and 50%. A `TransferFee` of 50,000 corresponds to 50%. The default value for this field is 0. Any decimals in the transfer fee are rounded down. The fee can be rounded down to zero if the payment is small. Issuers should make sure that their MPT's `AssetScale` is large enough. |
| `MPTokenMetadata`   | string    | Blob          | Arbitrary metadata about this issuance, in hex format. The limit for this field is 1024 bytes. |
| `PreviousTxnID`     | string    | Hash256       | Transaction ID of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeq` | number    | UInt32        | The sequence of the ledger that contains the transaction that most recently modified this object. |
| `OwnerNode`         | number    | UInt64        | The page in the owner's directory where this item is referenced. |
| `Sequence`          | number    | UInt32        | A 32-bit unsigned integer that is used to ensure issuances from a given sender can only ever exist once, even if an issuance is later deleted. Whenever a new issuance is created, this value must match the account's current `Sequence` number. `Tickets` make some exceptions from these rules so that it is possible to send transactions out of the normal order. `Tickets` represent sequence numbers reserved for later use; a transaction can use a `Ticket` instead of a normal account Sequence number. Whenever a transaction to create an MPT is included in a ledger, it uses up a sequence number (or Ticket), regardless of whether the transaction executed successfully or failed with a tec-class error code. Other transaction failures don't get included in ledgers, so they don't change the sender's sequence number (or have any other effects). It is possible for multiple unconfirmed MPT-creation transactions to have the same Issuer and sequence number. Such transactions are mutually exclusive, and at most one of them can be included in a validated ledger. (Any others ultimately have no effect.) |

### MPTokenIssuance Flags

Flags are properties or other options associated with the `MPToken` object. Except for `lsfMPTLocked`, which can be mutated via  `MPTokenIssuanceSet` transactions, these flags are immutable: they can only be set during the `MPTokenIssuanceCreate` transaction and cannot be changed later.


| Flag Name           | Flag Value | Description                                     |
|:--------------------|:-----------|:------------------------------------------------|
| `lsfMPTLocked`      | `0x0001`   | If set, indicates that all balances are locked. |
| `lsfMPTCanLock`     | `0x0002`   | If set, indicates that the issuer can lock an individual balance or all balances of this MPT. If not set, the MPT cannot be locked in any way. |
| `lsfMPTRequireAuth` | `0x0004`   | If set, indicates that individual holders must be authorized. This enables issuers to limit who can hold their assets. |
| `lsfMPTCanEscrow`   | `0x0008`   | If set, indicates that individual holders can place their balances into an escrow. |
| `lsfMPTCanTrade`    | `0x0010`   | If set, indicates that individual holders can trade their balances using the XRP Ledger DEX or AMM. |
| `lsfMPTCanTransfer` | `0x0020`   | If set, indicates that tokens held by non-issuers can be transferred to other accounts. If not set, indicates that tokens held by non-issuers cannot be transferred except back to the issuer; this enables use cases such as store credit. |
| `lsfMPTCanClawback` | `0x0040`   | If set, indicates that the issuer may use the `Clawback` transaction to claw back value from individual holders. |


<!--{# common link defs #}-->
<!-- uncomment for xrpl.org
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %} -->
