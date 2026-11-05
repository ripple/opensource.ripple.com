# Fixed-Precision Vaults

The [LendingProtocolV1_2 amendment][] changes how new vaults round amounts.

Before the amendment, a vault's precision depended on the size of its `AssetsTotal`. Every time `AssetsTotal` crossed a power of ten, the vault's rounding _scale_ became coarser. This meant the same deposit, withdrawal, or loan payment could round differently depending on how much was in the vault at the time, and transactions involving one loan broker could change rounding for other loan brokers on the same vault.

With the amendment, new vaults use _fixed-precision_ accounting instead. Each vault has a single unit of precision that's set when the vault is created and never changes. The vault, its loan brokers, and its loans all track amounts in that same unit. To see which fields and transactions are affected by this change, see:

- [Updated Ledger Entries](./updated-ledger-entries.md)
- [Updated Transactions](./updated-transactions.md)

## Which Model a Vault Uses

You can't choose the accounting model when creating a vault. The amendments enabled at the time the vault is created determine the model, and the vault keeps that model permanently:

| Vault Model     | `LEVersion` | Enabled When |
| :-------------- | :---------- | :----------- |
| Whole-life      | _(Omitted)_ | `LendingProtocolV1_1` isn't enabled. |
| Cash-basis      | `1`         | `LendingProtocolV1_1` is enabled. |
| Fixed-precision | `2`         | `LendingProtocolV1_1`, `LendingProtocolV1_2`, and `fixCleanup3_4_0` are all enabled. |

While fixed-precision vaults change rounding calculations, they use the same [cash-basis accounting](../lending-protocol-v1-1/cash-basis-accounting.md) as `LEVersion` 1 vaults to determine when interest is recognized.

## Precision

A fixed-precision vault tracks amounts in the following unit:

- **Trust line tokens**: `10^-Scale`, where `Scale` is the value you set in the `VaultCreate` transaction. For example, a vault with the default `Scale` of `6` tracks amounts to `0.000001`.
- **XRP and MPTs**: `1` drop or `1` MPT unit.

Since `Scale` can't be changed after the vault is created, neither can the vault's precision. When you create a fixed-precision vault that holds trust line tokens, `Scale` can be at most `10`, down from `18`. A `VaultCreate` transaction with a higher `Scale` fails with `temMALFORMED`.

Limits you set, such as a vault's `AssetsMaximum` or a loan broker's `DebtMaximum`, must be exact multiples of this unit. For example, at `Scale` 6, an `AssetsMaximum` of `1000.0000005` fails with `tecPRECISION_LOSS`. Amounts that move funds, such as deposits, withdrawals, and cover changes, are rounded to this unit in the vault's favor. If the rounded amount is zero, the transaction fails with `tecPRECISION_LOSS`.

## Size Limit

Since amounts are stored with 16 significant digits, a vault can only keep its full precision while its value fits within those digits. This limit is `9 × 10^(15 - Scale)` for trust line tokens (for example, `9,000,000,000` at `Scale` 6), or `9 × 10^15` for XRP and MPTs.

Transactions that would push a vault past this limit fail with `tecLIMIT_EXCEEDED`. This includes:

- A `VaultDeposit` that would make `AssetsTotal` plus scheduled interest (`YieldUnrealized`) exceed the limit.
- A `LoanSet` whose scheduled interest would make the vault exceed the limit.
- A `LoanBrokerCoverDeposit` that would push the loan broker's `CoverAvailable` past the limit.

{% admonition type="info" name="Note" %}
Late interest can still push a vault past the limit. When this happens, the vault can no longer track amounts at its full precision, and it can't originate new loans or accept new deposits until its value drops back below the limit.
{% /admonition %}

## Additional Accounting Changes

- Vaults track loaned principal in a new `AssetsDeployed` field and scheduled, unpaid interest in a new `YieldUnrealized` field. `AssetsTotal` is always `AssetsAvailable` + `AssetsDeployed`.
- Every loan uses the vault's base scale, so `LoanScale` is always `-Scale` for trust line tokens.
- Depositors can't withdraw, and the issuer can't claw back, the last outstanding shares while the vault still has assets deployed in loans. These transactions fail with `tecHAS_OBLIGATIONS`.
- A loan's final payment can succeed even if the amount credited to the vault rounds to zero. Any remaining dust is forgiven and the loan closes.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
