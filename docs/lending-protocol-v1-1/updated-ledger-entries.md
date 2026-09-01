---
seo:
    title: Updated Ledger Entries
    description: The Lending Protocol V1.1 amendment adds three fields to the Vault ledger entry to support closed-ended vaults.
labels:
    - Single Asset Vault
    - Lending Protocol
status: not_enabled
---

# Updated Ledger Entries

The [LendingProtocolV1_1 amendment][] adds three fields to the [Vault entry][] to support [closed-ended vaults](./closed-ended-vaults.md).

_(Requires the [LendingProtocolV1_1 amendment][] {% not-enabled /%})_

## Vault

### New Fields

| Name                | JSON Type | [Internal Type][] | Required? | Description |
| :------------------ | :-------- | :---------------- | :-------- | :---------- |
| `VaultKind`         | Number    | UInt8             | No        | The kind of vault. `0` (the default) is an open-ended vault; `1` is a closed-ended vault. **Omitted from API responses when the value is `0`** — treat an absent `VaultKind` as open-ended. Immutable. |
| `SubscriptionDate`  | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The time, in [seconds since the Ripple Epoch][], when the vault's subscription window closes and its investment period begins. Required when `VaultKind` is `1`, and never present otherwise. Immutable. |
| `RedemptionDate`    | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The time, in [seconds since the Ripple Epoch][], when the vault's investment period ends and depositors can redeem their shares. Required when `VaultKind` is `1`, and never present otherwise. Immutable. |

All three fields are set by the [VaultCreate transaction][] and can't be changed afterwards. The [VaultSet transaction][] doesn't accept them, and a ledger-level invariant rejects any transaction that modifies them.

For closed-ended vaults, `RedemptionDate` - `SubscriptionDate` is always at least `60` seconds and less than `946708560` seconds (30 Gregorian years).

### Example Closed-Ended Vault JSON

```json
{
  "LedgerEntryType": "Vault",
  "Account": "rwCNM7SeUHTajEBQDiNqxDG8p1Mreizw85",
  "Asset": {
      "currency": "USD",
      "issuer": "rXJSJiZMxaLuH3kQBUV5DLipnYtrE6iVb"
  },
  "AssetsAvailable": "0",
  "AssetsMaximum": "1000000",
  "AssetsTotal": "0",
  "Data": "5661756C74206D65746164617461",
  "Flags": 0,
  "LossUnrealized": "0",
  "Owner": "rNGHoQwNG753zyfDrib4qDvvswbrtmV8Es",
  "OwnerNode": "0",
  "RedemptionDate": 883008000,
  "Scale": 6,
  "Sequence": 200370,
  "ShareMPTID": "0000000169F415C9F1AB6796AB9224CE635818AFD74F8175",
  "SubscriptionDate": 851472000,
  "VaultKind": 1,
  "WithdrawalPolicy": 1
}
```

An open-ended vault created with the amendment enabled looks exactly like one created before it: none of the three fields appear.

## See Also

- [Closed-Ended Vaults](./closed-ended-vaults.md)
- [Vault entry][]
- [VaultCreate transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
