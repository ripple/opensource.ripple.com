---
seo:
    title: Updated API Methods
    description: The Lending Protocol V1.1 amendment adds three closed-ended vault fields to vault_info and ledger_entry responses.
labels:
    - Single Asset Vault
    - Lending Protocol
status: not_enabled
---

# Updated API Methods

The [LendingProtocolV1_1 amendment][] adds three fields to the `Vault` ledger entry. They're returned by any method that serializes a `Vault`, including the [vault_info method][] and the [ledger_entry method][].

No request parameters change.

_(Requires the [LendingProtocolV1_1 amendment][] {% not-enabled /%})_

## New Response Fields

These fields are added to the **Vault Description Object** returned by [vault_info][vault_info method], and to the `Vault` object returned by [ledger_entry][ledger_entry method]:

| Field              | Type   | Description |
| :----------------- | :----- | :---------- |
| `VaultKind`        | Number | The kind of vault. `1` indicates a closed-ended vault. _(Omitted when the vault is open-ended.)_ |
| `SubscriptionDate` | Number | _(Omitted unless the vault is closed-ended)_ The time, in [seconds since the Ripple Epoch][], when the vault's subscription window closes and its investment period begins. |
| `RedemptionDate`   | Number | _(Omitted unless the vault is closed-ended)_ The time, in [seconds since the Ripple Epoch][], when the vault's investment period ends and depositors can redeem their shares. |

{% admonition type="warning" name="Handling omitted fields" %}
`VaultKind` is omitted whenever its value is `0`, which is the case for every open-ended vault and for every vault created before the [LendingProtocolV1_1 amendment][]. Clients must treat an absent `VaultKind` as open-ended rather than as missing data.
{% /admonition %}

## Example Response

The `vault` object for a closed-ended vault, with the new fields shown:

```json
{
  "result": {
    "ledger_current_index": 3280200,
    "validated": false,
    "vault": {
      "Account": "rQhUcbJoDfvgXr1EkMwarLP5QT3XinEBDg",
      "Asset": {
        "currency": "USD",
        "issuer": "rXJSJiZMxaLuH3kQBUV5DLipnYtrE6iVb"
      },
      "AssetsAvailable": "0",
      "AssetsMaximum": "1000000",
      "AssetsTotal": "0",
      "Data": "50726976617465207661756C7420666F72207475746F7269616C73",
      "Flags": 0,
      "LedgerEntryType": "Vault",
      "LossUnrealized": "0",
      "Owner": "rJdYtgaiEgzL7xD2QdPKg5xoHkWc7CZjvm",
      "OwnerNode": "0",
      "PreviousTxnID": "F73B073028D7EF14C5DD907591E579EBFEDBA891F4AE0B951439C240C42AE0D4",
      "PreviousTxnLgrSeq": 3113735,
      "RedemptionDate": 883008000,
      "Scale": 6,
      "Sequence": 3113728,
      "ShareMPTID": "00000001FCE5D5E313303F3D0C700789108CC6BE7D711493",
      "SubscriptionDate": 851472000,
      "VaultKind": 1,
      "WithdrawalPolicy": 1,
      "index": "9E48171960CD9F62C3A7B6559315A510AE544C3F51E02947B5D4DAC8AA66C3BA"
    }
  },
  "status": "success",
  "type": "response"
}
```

The `shares` object is unchanged and is omitted here for brevity.

## Deriving the Vault Phase

The API doesn't return the vault's current phase. Derive it by comparing the close time of the ledger you're reading against the two dates:

| Phase        | Condition |
| :----------- | :-------- |
| Subscription | `close_time <= SubscriptionDate` |
| Investment   | `SubscriptionDate < close_time < RedemptionDate` |
| Redemption   | `close_time >= RedemptionDate` |

Transactions are validated against the **parent** ledger's close time, so a vault can appear to be in one phase when you read it and be treated as being in the next phase by the time your transaction is applied. Leave a margin when submitting near a boundary.

## See Also

- [Closed-Ended Vaults](./closed-ended-vaults.md)
- [Updated Ledger Entries](./updated-ledger-entries.md)
- [vault_info method][]
- [ledger_entry method][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
