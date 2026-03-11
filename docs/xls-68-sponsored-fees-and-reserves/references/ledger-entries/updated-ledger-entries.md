# Updated Ledger Entries

This page describes changes to existing ledger entry types for Sponsored Fees and Reserves.

## Common Ledger Entry Updates

### Common Ledger Entry Fields

A new `Sponsor` field is added to the [common ledger entry fields](https://xrpl.org/docs/references/protocol/ledger-data/common-fields):

| Field Name | JSON Type | [Internal Type][] | Required? | Description |
| :--------- | :-------- | :---------------- | :-------- | :---------- |
| `Sponsor`  | String    | AccountID         | No        | The sponsor paying the owner reserve for this ledger object. When present, this indicates that the reserve burden for this object has shifted from the owner to the sponsor. |

The `Sponsor` field may appear on the following ledger entry types:

- `AccountRoot`
- `Offer`
- `Escrow`
- `Check`
- `PayChannel`
- `DepositPreauth`
- `Ticket`
- `NFTokenPage`
- `NFTokenOffer`
- `AMM`
- `Bridge`
- `XChainOwnedClaimID`
- `XChainOwnedCreateAccountClaimID`
- `DID`
- Any other ledger entry type that contributes to an account's owner reserve.

## AccountRoot Updates

### Example JSON

```json
{
  "LedgerEntryType": "AccountRoot",
  "Account": "rfkDkFai4jUfCvAJiZ5Vm7XvvWjYvDqeYo",
  "Balance": "100000000", // 100 XRP in drops
  "OwnerCount": 5,
  "Sponsor": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
  "SponsoredOwnerCount": 2,
  "SponsoringOwnerCount": 1,
  "SponsoringAccountCount": 1,
  "PreviousTxnID": "1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
  "PreviousTxnLgrSeq": 12345679
}
```

### AccountRoot Fields

[AccountRoot ledger entries](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot) can include the following new fields:

| Field Name               | JSON Type | [Internal Type][] | Required? | Description |
| :----------------------- | :-------- | :---------------- | :-------- | :---------- |
| `Sponsor`                | String    | AccountID         | No        | The sponsor paying the account reserve for this account. |
| `SponsoredOwnerCount`    | Number    | UInt32            | No        | The number of objects this account owns that are sponsored by another account. |
| `SponsoringOwnerCount`   | Number    | UInt32            | No        | The number of objects this account is sponsoring the reserve for. |
| `SponsoringAccountCount` | Number    | UInt32            | No        | The number of accounts this account is sponsoring the account reserve for. |

## RippleState Updates

### Example JSON

```json
{
  "LedgerEntryType": "RippleState",
  "Balance": {
    "currency": "USD",
    "issuer": "rLowAccountAddressXXXXXXXXXXXXXXX",
    "value": "-10"
  },
  "HighLimit": {
    "currency": "USD",
    "issuer": "rHighAccountAddressXXXXXXXXXXXXXX",
    "value": "100"
  },
  "LowLimit": {
    "currency": "USD",
    "issuer": "rLowAccountAddressXXXXXXXXXXXXXXX",
    "value": "0"
  },
  "HighSponsor": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
  "LowSponsor": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
  "Flags": 262144,
  "HighNode": "0000000000000000",
  "LowNode": "0000000000000000",
  "PreviousTxnID": "ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789",
  "PreviousTxnLgrSeq": 12345680
}
```

### RippleState Fields

[RippleState ledger entries](https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/ripplestate) can include the following new fields:

| Field Name    | JSON Type | [Internal Type][] | Required? | Description |
| :------------ | :-------- | :---------------- | :-------- | :---------- |
| `HighSponsor` | String    | AccountID         | No        | The sponsor paying the reserve on behalf of the _high account_ on the trust line. |
| `LowSponsor`  | String    | AccountID         | No        | The sponsor paying the reserve on behalf of the _low account_ on the trust line. |

The `HighSponsor` and `LowSponsor` fields are necessary because bidirectional trust lines may have the reserve held by two accounts.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
