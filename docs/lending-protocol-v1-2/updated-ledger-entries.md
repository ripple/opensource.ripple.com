# Updated Ledger Entries

The [LendingProtocolV1_2 amendment][] updates the following ledger entries:

## Vault

### New Fields

<!-- Update vault_info method page with these new/changed fields. -->

| Name               | JSON Type | [Internal Type][] | Required? | Description |
| :----------------- | :-------- | :---------------- | :-------- | :---------- |
| `AssetsDeployed`   | String    | Number            | No        | _(Fixed-precision vaults only)_ The total principal currently deployed in loans, including principal reserved for pending loans. Omitted if `0`. |
| `AssetsReserved`   | String    | Number            | No        | _(Fixed-precision vaults only)_ The principal set aside for [pending loans](./two-step-loan-creation.md) that haven't been accepted yet. This amount is included in `AssetsDeployed`. Omitted if `0`. |
| `YieldUnrealized`  | String    | Number            | No        | _(Fixed-precision vaults only)_ The scheduled interest on active loans that hasn't been paid yet. This amount isn't included in `AssetsTotal`. Omitted if `0`. |
| `EarlyExitFeeRate` | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The [early-exit fee](./early-exit-fees.md) charged on withdrawals during the Investment phase, in units of 1/10th basis points. Valid values are `0` to `100000`. If omitted, withdrawals during the investment phase are blocked. |

{% admonition type="info" name="Note" %}
`EarlyExitFeeRate` is set using the [VaultCreate transaction][] and can't be changed afterwards. `AssetsDeployed`, `AssetsReserved`, and `YieldUnrealized` are updated automatically by lending transactions.
{% /admonition %}

### Changed Fields

| Name              | JSON Type | [Internal Type][] | Required? | Description |
| :---------------- | :-------- | :---------------- | :-------- | :---------- |
| `AssetsAvailable` | String    | Number            | Yes       | The amount of assets in the vault that can be withdrawn or lent out. For fixed-precision vaults, this excludes principal reserved for [pending loans](./two-step-loan-creation.md), even though those funds haven't left the vault yet. |
| `AssetsTotal`     | String    | Number            | Yes       | The total value of the vault. For fixed-precision vaults, this is always `AssetsAvailable` + `AssetsDeployed`. |
| `LEVersion`       | Number    | UInt8             | No        | Indicates what type of accounting the vault uses. `1` indicates cash-basis accounting. `2` indicates fixed-precision accounting, which also uses cash-basis interest recognition. If omitted, the vault uses whole-life accounting. |
| `Scale`           | Number    | UInt8             | No        | For vaults holding trust line tokens, the number of decimal places of precision the vault uses. Fixed-precision vaults can have a maximum `Scale` of `10`; other vaults can have a maximum of `18`. |

### New Flags

| Flag Name                      | Hex Value    | Decimal Value | Description |
| :----------------------------- | :----------- | :------------ | :---------- |
| `lsfVaultDepositBlocked`       | `0x00020000` | 131072        | Deposits into the vault are [blocked](./vault-donations-and-deposit-blocking.md#deposit-blocking). Only the vault owner can change this flag, using the [VaultSet transaction][]. |
| `lsfVaultOwnerCanBlockDeposit` | `0x00040000` | 262144        | The vault owner can block and unblock deposits. This flag is set at creation and can't be changed. |

### Example Fixed-Precision Vault JSON

```json
{
  "LedgerEntryType": "Vault",
  "Account": "rwCNM7SeUHTajEBQDiNqxDG8p1Mreizw85",
  "Asset": {
      "currency": "USD",
      "issuer": "rXJSJiZMxaLuH3kQBUV5DLipnYtrE6iVb"
  },
  "AssetsAvailable": "700000",
  "AssetsDeployed": "300000",
  "AssetsMaximum": "1000000",
  "AssetsReserved": "50000",
  "AssetsTotal": "1000000",
  "Data": "5661756C74206D65746164617461",
  "EarlyExitFeeRate": 2000,
  "Flags": 262144,
  "LEVersion": 2,
  "LossUnrealized": "0",
  "Owner": "rNGHoQwNG753zyfDrib4qDvvswbrtmV8Es",
  "OwnerNode": "0",
  "RedemptionDate": 883008000,
  "Scale": 6,
  "Sequence": 200370,
  "ShareMPTID": "0000000169F415C9F1AB6796AB9224CE635818AFD74F8175",
  "SubscriptionDate": 851472000,
  "VaultKind": 1,
  "WithdrawalPolicy": 1,
  "YieldUnrealized": "12500"
}
```

## LoanBroker

### New Fields

| Name       | JSON Type            | [Internal Type][] | Required? | Description |
| :--------- | :------------------- | :---------------- | :-------- | :---------- |
| `DomainID` | String               | Hash256           | No        | _(Private loan brokers only)_ The ledger entry ID of the permissioned domain whose credentials borrowers must hold. |

### Changed Fields

| Name        | JSON Type | [Internal Type][] | Required? | Description |
| :---------- | :-------- | :---------------- | :-------- | :---------- |
| `DebtTotal` | String    | Number            | No        | The total amount the loan broker owes the vault. This includes the principal of [pending loans](./two-step-loan-creation.md), which is counted when the loan is proposed rather than when it's accepted. |

### New Flags

| Flag Name              | Hex Value    | Decimal Value | Description |
| :--------------------- | :----------- | :------------ | :---------- |
| `lsfLoanBrokerPrivate` | `0x00010000` | 65536         | The loan broker is private, and only originates loans to borrowers with credentials accepted by its `DomainID`. This flag is set at creation and can't be changed. |

## Loan

### Changed Fields

| Name        | JSON Type | [Internal Type][] | Required? | Description |
| :---------- | :-------- | :---------------- | :-------- | :---------- |
| `LoanScale` | Number    | Int32             | No        | The power of ten that loan amounts are rounded to. For loans from [fixed-precision vaults](./fixed-precision-vaults.md), this always matches the vault's precision: for trust line tokens it's the negative of the vault's `Scale` (for example, `-6` for `Scale` 6), and `0` for XRP and MPTs. For other vaults, it's still based on the loan's total value when the loan is created. |
| `OwnerNode` | String    | UInt64            | No        | A hint indicating which page of the borrower's owner directory links to this entry. Omitted while the loan is pending, since a pending loan isn't in the borrower's owner directory yet. |
| `StartDate` | Number    | UInt32            | Yes       | The time, in [seconds since the Ripple Epoch][], when the loan's payment schedule starts. For a pending loan, this is also the deadline for the borrower to accept it. |

### New Flags

| Flag Name        | Hex Value    | Decimal Value | Description |
| :--------------- | :----------- | :------------ | :---------- |
| `lsfLoanPending` | `0x00080000` | 524288        | The loan was [proposed](./two-step-loan-creation.md) by the loan broker owner and is waiting for the borrower to accept it with a [LoanAccept transaction](./loanaccept.md). |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
