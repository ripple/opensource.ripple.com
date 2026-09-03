# Updated Ledger Entries

The [LendingProtocolV1_1 amendment][] updates the following ledger entries:

## Vault

### New Fields

| Name                | JSON Type | [Internal Type][] | Required? | Description |
| :------------------ | :-------- | :---------------- | :-------- | :---------- |
| `LEVersion`         | Number    | UInt8             | No        | Indicates what type of accounting the vault uses. `1` indicates the vault uses cash-basis accounting. If this field is ommitted, the vault uses whole-life accounting. |
| `VaultKind`         | Number    | UInt8             | No        | Indicates the kind of vault. `0` is an open-ended vault; `1` is a closed-ended vault. |
| `SubscriptionDate`  | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The time, in [seconds since the Ripple Epoch][], when the vault's subscription window closes and its investment period begins. |
| `RedemptionDate`    | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The time, in [seconds since the Ripple Epoch][], when the vault's investment period ends and depositors can redeem their shares. |

{% admonition type="info" name="Note" %}
`VaultKind`, `SubscriptionDate`, and `RedemptionDate` are set using the [VaultCreate transaction][] and can't be changed afterwards. `LEVersion` is also set by `VaultCreate`, but the value is determined by if the `LendingProtocolV1_1` amendment is enabled.
{% /admonition %}

### Changed Fields

| Name                | JSON Type | [Internal Type][] | Required? | Description |
| :------------------ | :-------- | :---------------- | :-------- | :---------- |
| `AssetsTotal`       | Number    | Number            |       Yes | The total value of the vault. It doesn't include potential earnings from unpaid loans. |
| `LossUnrealized`    | Number    | Number            | Yes       | The potential loss amount that is not yet realized, expressed as the vault's asset. Only a protocol connected to the vault can modify this attribute. Unrealized losses from interest aren't included in this value. |

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
  "LEVersion": 1,
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

## LoanBroker

### Changed Fields

| Name        | JSON Type | [Internal Type][] | Required? | Description |
| :---------- | :-------- | :---------------- | :-------- | :---------- |
| `DebtTotal` | String    | Number            | Yes       | The principal asset amount the protocol owes the vault. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
