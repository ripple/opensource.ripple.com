---
seo:
    title: Updated Transactions
    description: The Lending Protocol V1.1 amendment adds closed-ended vault fields to VaultCreate and adds phase restrictions to VaultDeposit, VaultWithdraw, and LoanSet.
labels:
    - Transactions
    - Single Asset Vault
    - Lending Protocol
status: not_enabled
---

# Updated Transactions

The [LendingProtocolV1_1 amendment][] updates four existing transactions to support [closed-ended vaults](./closed-ended-vaults.md).

_(Requires the [LendingProtocolV1_1 amendment][] {% not-enabled /%})_

## VaultCreate

### New Fields

The [VaultCreate transaction][] accepts three new fields:

| Field Name         | JSON Type | [Internal Type][] | Required? | Description |
| :----------------- | :-------- | :---------------- | :-------- | :---------- |
| `VaultKind`        | Number    | UInt8             | No        | The kind of vault to create. `0` (the default) creates an open-ended vault; `1` creates a closed-ended vault. |
| `SubscriptionDate` | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The time, in [seconds since the Ripple Epoch][], when the vault's subscription window closes and its investment period begins. Required when `VaultKind` is `1`. |
| `RedemptionDate`   | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The time, in [seconds since the Ripple Epoch][], when the vault's investment period ends. Required when `VaultKind` is `1`. |

The three fields are subject to the following rules:

- When `VaultKind` is omitted or `0`, neither date may be provided.
- When `VaultKind` is `1`, both dates must be provided.
- `RedemptionDate` - `SubscriptionDate` must be at least `60` seconds and less than `946708560` seconds (30 Gregorian years).
- Both dates must be in the future relative to the parent ledger's close time.

All three fields are immutable once the vault exists.

### New Error Cases

| Error Code     | Description |
| :------------- | :---------- |
| `temMALFORMED` | `VaultKind` is present with a value other than `0` or `1`; or `SubscriptionDate` or `RedemptionDate` is present on a vault that isn't closed-ended; or `VaultKind` is `1` and either date is missing; or `RedemptionDate` - `SubscriptionDate` is less than `60` seconds or is `946708560` seconds or more. |
| `tecEXPIRED`   | `SubscriptionDate` or `RedemptionDate` is at or before the parent ledger's close time. |
| `temDISABLED`  | `VaultKind`, `SubscriptionDate`, or `RedemptionDate` is present and the [LendingProtocolV1_1 amendment][] isn't enabled. |

## VaultDeposit

Deposits into a closed-ended vault are only accepted during its **Subscription** phase. Once the vault's `SubscriptionDate` passes, its capital base is fixed for the term.

Deposits into an open-ended vault are unaffected.

### New Error Cases

| Error Code   | Description |
| :----------- | :---------- |
| `tecEXPIRED` | The vault is closed-ended and is in its Investment or Redemption phase. |

## VaultWithdraw

Withdrawals from a closed-ended vault are blocked during the **Investment** phase, when capital is locked and deployed. They're allowed during Subscription — so a depositor can still change their mind before the term begins — and during Redemption.

Withdrawals from an open-ended vault are unaffected.

### New Error Cases

| Error Code     | Description |
| :------------- | :---------- |
| `tecTOO_SOON`  | The vault is closed-ended and is in its Investment phase. |

## LoanSet

A loan can only be originated against a closed-ended vault during its **Investment** phase, and only if the loan matures before the vault does. Specifically, the loan's final scheduled payment must fall strictly before the vault's `RedemptionDate`:

```text
StartDate + (PaymentInterval × PaymentTotal) < RedemptionDate
```

This means the maximum term of a new loan shrinks as the vault approaches its `RedemptionDate`. A vault with three months left in its Investment phase can't originate a twelve-month loan.

Loans against an open-ended vault are unaffected.

### New Error Cases

| Error Code         | Description |
| :----------------- | :---------- |
| `tecTOO_SOON`      | The vault is closed-ended and is still in its Subscription phase. |
| `tecEXPIRED`       | The vault is closed-ended and has entered its Redemption phase. |
| `tecNO_PERMISSION` | The vault is closed-ended and the loan's final scheduled payment falls on or after the vault's `RedemptionDate`. |

## See Also

- [Closed-Ended Vaults](./closed-ended-vaults.md)
- [Cash-Basis Accounting](./cash-basis-accounting.md)
- [Updated Ledger Entries](./updated-ledger-entries.md)
- [VaultCreate transaction][]
- [VaultDeposit transaction][]
- [VaultWithdraw transaction][]
- [LoanSet transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
