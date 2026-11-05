# Updated Transactions

The [LendingProtocolV1_2 amendment][] adds the [LoanAccept transaction](./loanaccept.md) and updates the following transactions.

## VaultCreate

### New Fields

| Field Name         | JSON Type | [Internal Type][] | Required? | Description |
| :----------------- | :-------- | :---------------- | :-------- | :---------- |
| `EarlyExitFeeRate` | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The [early-exit fee](./early-exit-fees.md) charged on withdrawals during the Investment phase, in units of 1/10th basis points. Valid values are `0` to `100000`. If omitted, withdrawals during the Investment phase are blocked. Immutable after the vault is created. |

### Changed Fields

| Field Name | JSON Type | [Internal Type][] | Required? | Description |
| :--------- | :-------- | :---------------- | :-------- | :---------- |
| `Scale`    | Number    | UInt8             | No        | For vaults holding trust line tokens, the number of decimal places of precision the vault uses. The default is `6`. [Fixed-precision vaults](./fixed-precision-vaults.md) can have a maximum `Scale` of `10`; other vaults can have a maximum of `18`. Not valid for vaults holding XRP or MPTs. |

### New Flags

| Flag Name                     | Hex Value    | Decimal Value | Description |
| :---------------------------- | :----------- | :------------ | :---------- |
| `tfVaultOwnerCanBlockDeposit` | `0x00040000` | 262144        | Allow the vault owner to [block and unblock deposits](./vault-donations-and-deposit-blocking.md#deposit-blocking). Can only be set when the vault is created. |

### New Error Cases

| Error Code          | Description |
| :------------------ | :---------- |
| `temDISABLED`       | `EarlyExitFeeRate` is present and the `LendingProtocolV1_2` amendment isn't enabled. |
| `temINVALID_FLAG`   | `tfVaultOwnerCanBlockDeposit` is set and the `LendingProtocolV1_2` amendment isn't enabled. |
| `temMALFORMED`      | <li>`EarlyExitFeeRate` is present, but `VaultKind` isn't `1` (closed-ended).</li><li>`EarlyExitFeeRate` is greater than `100000`.</li><li>_(Fixed-precision only)_ `Scale` is greater than `10`.</li> |
| `tecPRECISION_LOSS` | _(Fixed-precision only)_ `AssetsMaximum` has more precision than the vault tracks. |

## VaultSet

### New Flags

| Flag Name               | Hex Value    | Decimal Value | Description |
| :---------------------- | :----------- | :------------ | :---------- |
| `tfVaultDepositBlock`   | `0x00010000` | 65536         | Block deposits into the vault. |
| `tfVaultDepositUnblock` | `0x00020000` | 131072        | Unblock deposits into the vault. |

A `VaultSet` transaction that only sets one of these flags is valid, even if it doesn't change any other fields.

### New Error Cases

| Error Code          | Description |
| :------------------ | :---------- |
| `temINVALID_FLAG`   | <li>`tfVaultDepositBlock` or `tfVaultDepositUnblock` is set and the `LendingProtocolV1_2` amendment isn't enabled.</li><li>Both `tfVaultDepositBlock` and `tfVaultDepositUnblock` are set.</li> |
| `tecNO_PERMISSION`  | `tfVaultDepositBlock` or `tfVaultDepositUnblock` is set, but the vault doesn't have the `lsfVaultOwnerCanBlockDeposit` flag. |
| `tecPRECISION_LOSS` | `AssetsMaximum` has more precision than the vault can represent. For fixed-precision vaults, this is the precision set at creation; for other vaults, this is the vault's current scale. This applies to all vaults once `LendingProtocolV1_2` is enabled. |

## VaultDeposit

### New Flags

| Flag Name       | Hex Value    | Decimal Value | Description |
| :-------------- | :----------- | :------------ | :---------- |
| `tfVaultDonate` | `0x00010000` | 65536         | [Donate](./vault-donations-and-deposit-blocking.md#donations) the `Amount` to the vault without receiving any shares. Only the vault owner can donate. |

Donations aren't subject to the closed-ended vault phase restrictions, so a donation can be made during the investment and redemption phases.

### New Error Cases

| Error Code          | Description |
| :------------------ | :---------- |
| `temDISABLED`       | `tfVaultDonate` is set and the `LendingProtocolV1_2` amendment isn't enabled. |
| `tecNO_PERMISSION`  | `tfVaultDonate` is set and either the sender isn't the vault owner, or the vault has no outstanding shares. |
| `tecLOCKED`         | <li>The vault has the `lsfVaultDepositBlocked` flag. This applies to all deposits, including donations from the vault owner.</li><li>The vault is insolvent (`AssetsTotal` is `0` while shares are outstanding) and the deposit isn't a donation.</li> |
| `tecLIMIT_EXCEEDED` | _(Fixed-precision only)_ The deposit would push the vault past its [size limit](./fixed-precision-vaults.md#size-limit). |

## VaultWithdraw

Closed-ended vaults with an `EarlyExitFeeRate` allow withdrawals during the _investment_ phase instead of failing with `tecTOO_SOON`. The [early-exit fee](./early-exit-fees.md) is deducted from the amount paid out.

### New Error Cases

| Error Code           | Description |
| :------------------- | :---------- |
| `tecHAS_OBLIGATIONS` | _(Fixed-precision only)_ The withdrawal would redeem all of the vault's outstanding shares while the vault still has assets deployed in loans. |
| `tecPRECISION_LOSS`  | The amount paid out, after any early-exit fee, rounds to zero at the vault's precision. |

## VaultClawback

`VaultClawback` is never charged an early-exit fee.

### New Error Cases

| Error Code           | Description |
| :------------------- | :---------- |
| `tecHAS_OBLIGATIONS` | _(Fixed-precision only)_ The clawback would burn all of the vault's outstanding shares while the vault still has assets deployed in loans. |
| `tecPRECISION_LOSS`  | _(Fixed-precision only)_ The amount clawed back rounds to zero at the vault's precision. |

## LoanBrokerSet

### New Fields

| Field Name | JSON Type         | [Internal Type][] | Required? | Description |
| :--------- | :---------------- | :---------------- | :-------- | :---------- |
| `DomainID` | String            | Hash256           | No        | The ledger entry ID of the permissioned domain whose credentials borrowers must hold. Only valid for [private loan brokers](./private-loan-brokers.md). When modifying a loan broker, set this to all zeros to remove the domain. |

### Changed Fields

| Field Name | JSON Type         | [Internal Type][] | Required? | Description |
| :--------- | :---------------- | :---------------- | :-------- | :---------- |
| `VaultID`  | String            | Hash256           | No        | The ID of the vault that the loan broker uses. Required when creating a loan broker, and must be omitted when modifying one. |

### New Flags

| Flag Name             | Hex Value    | Decimal Value | Description |
| :-------------------- | :----------- | :------------ | :---------- |
| `tfLoanBrokerPrivate` | `0x00010000` | 65536         | Create a [private loan broker](./private-loan-brokers.md). Can only be set when the loan broker is created. |

### New Error Cases

| Error Code            | Description |
| :-------------------- | :---------- |
| `temDISABLED`         | `DomainID` is present and the `LendingProtocolV1_2` amendment isn't enabled. |
| `temINVALID_FLAG`     | `tfLoanBrokerPrivate` is set and the `LendingProtocolV1_2` amendment isn't enabled. |
| `temMALFORMED`        | The transaction creates a loan broker and `DomainID` is all zeros. |
| `temINVALID`          | <li>The transaction creates a loan broker and is missing `VaultID`, or `VaultID` is all zeros.</li><li>The transaction modifies a loan broker and includes `VaultID`.</li><li>The transaction creates a loan broker with a `DomainID`, but doesn't set `tfLoanBrokerPrivate`.</li><li>The transaction modifies a loan broker and sets `tfLoanBrokerPrivate`.</li> |
| `tecNO_PERMISSION`    | The transaction modifies a public loan broker and includes `DomainID`. |
| `tecOBJECT_NOT_FOUND` | The permissioned domain specified by `DomainID` doesn't exist. |
| `tecPRECISION_LOSS`   | _(Fixed-precision only)_ `DebtMaximum` has more precision than the vault tracks. |

## LoanBrokerCoverDeposit

### New Error Cases

| Error Code          | Description |
| :------------------ | :---------- |
| `tecLIMIT_EXCEEDED` | _(Fixed-precision only)_ The deposit would push the loan broker's `CoverAvailable` past the vault's [size limit](./fixed-precision-vaults.md#size-limit). |
| `tecPRECISION_LOSS` | _(Fixed-precision only)_ The amount credited to `CoverAvailable` rounds to zero. |

## LoanBrokerCoverWithdraw

### New Error Cases

| Error Code          | Description |
| :------------------ | :---------- |
| `tecPRECISION_LOSS` | _(Fixed-precision only)_ The amount withdrawn rounds to zero. |

## LoanBrokerCoverClawback

### New Error Cases

| Error Code          | Description |
| :------------------ | :---------- |
| `tecPRECISION_LOSS` | _(Fixed-precision only)_ The amount clawed back rounds to zero. |

## LoanSet

The loan broker owner can propose a loan for the borrower to accept later by including `Borrower` and `StartDate`, and omitting `Counterparty` and `CounterpartySignature`. A proposal doesn't need a `CounterpartySignature`. For more information, see [Two-Step Loan Creation](./two-step-loan-creation.md).

If the loan broker is [private](./private-loan-brokers.md), the borrower must hold a credential accepted by the loan broker's domain. In the two-step flow, this check happens in `LoanAccept` instead.

### New Fields

| Field Name  | JSON Type            | [Internal Type][] | Required? | Description |
| :---------- | :------------------- | :---------------- | :-------- | :---------- |
| `Borrower`  | String - [Address][] | AccountID         | No        | The account the loan is offered to. Required with `StartDate` to propose a loan. |
| `StartDate` | Number               | UInt32            | No        | The time, in [seconds since the Ripple Epoch][], when the loan's payment schedule starts. The borrower must accept the loan before this time. Required with `Borrower` to propose a loan. |

### Changed Fields

| Field Name              | JSON Type            | [Internal Type][] | Required? | Description |
| :---------------------- | :------------------- | :---------------- | :-------- | :---------- |
| `Counterparty`          | String - [Address][] | AccountID         | No        | The address of the counterparty of the loan. Must be omitted when proposing a loan. Required when `LoanSet` is an inner transaction of a [Batch transaction](#batch). |
| `CounterpartySignature` | Object               | STObject          | No        | The signature of the counterparty over the transaction. Required for the single-transaction flow, except when `LoanSet` is an inner transaction of a [Batch transaction](#batch), where the counterparty signs the outer transaction instead. Must be omitted when proposing a loan. |

### New Error Cases

| Error Code                | Description |
| :------------------------ | :---------- |
| `temDISABLED`             | `Borrower` or `StartDate` is present, and the `LendingProtocolV1_1`, `LendingProtocolV1_2`, or `fixCleanup3_4_0` amendment isn't enabled. |
| `temINVALID`              | <li>`Borrower` is present with `Counterparty` or `CounterpartySignature`.</li><li>`Borrower` is present without `StartDate`.</li><li>`StartDate` is present with `CounterpartySignature`.</li><li>`Borrower` is the same as the sender.</li> |
| `temBAD_SIGNER`           | `StartDate` is present without `Borrower` or `CounterpartySignature`. |
| `tecNO_PERMISSION`        | <li>The transaction proposes a loan, but the sender isn't the loan broker owner.</li><li>The `Borrower` is a pseudo-account.</li><li>The transaction proposes a loan, but the vault isn't a fixed-precision vault.</li> |
| `tecNO_DST`               | The `Borrower` account doesn't exist. |
| `tecEXPIRED`              | <li>The `StartDate` isn't ahead of the parent ledger's close time.</li><li>The loan broker is private and the borrower's only matching credentials have expired.</li> |
| `tecNO_AUTH`              | The loan broker is private and either has no `DomainID`, or the borrower doesn't hold an accepted credential for its domain. |
| `tecOBJECT_NOT_FOUND`     | The loan broker is private and its permissioned domain no longer exists. |
| `tecINSUFFICIENT_RESERVE` | The transaction proposes a loan, and the loan broker owner doesn't have enough XRP to meet the reserve for the pending `Loan` entry. |
| `tecLIMIT_EXCEEDED`       | _(Fixed-precision only)_ The vault is already over its size limit, or the loan's scheduled interest would push the vault past its [size limit](./fixed-precision-vaults.md#size-limit). |

## LoanDelete

Either the loan broker owner or the borrower can delete a pending loan, whether or not it has expired. Deleting a pending loan returns its reserved principal to the vault's `AssetsAvailable`.

## LoanPay

A pending loan can't be paid until the borrower accepts it.

For fixed-precision vaults, a loan's final payment succeeds even if the amount credited to the vault rounds to zero. The remaining dust is forgiven and the loan closes. Non-final payments that round to zero still fail with `tecPRECISION_LOSS`.

### New Error Cases

| Error Code         | Description |
| :----------------- | :---------- |
| `tecNO_PERMISSION` | The loan is pending. |

## LoanManage

### New Error Cases

| Error Code         | Description |
| :----------------- | :---------- |
| `tecNO_PERMISSION` | The loan is pending. |

## Batch

The following transactions can now be included as inner transactions of a [Batch transaction](../xls-56-batch-transactions/index.page.tsx):

- `VaultCreate`, `VaultSet`, `VaultDelete`, `VaultDeposit`, `VaultWithdraw`, `VaultClawback`
- `LoanBrokerSet`, `LoanBrokerDelete`, `LoanBrokerCoverDeposit`, `LoanBrokerCoverWithdraw`, `LoanBrokerCoverClawback`
- `LoanSet`, `LoanDelete`, `LoanManage`, `LoanPay`

An inner `LoanSet` transaction must include the `Counterparty` field and doesn't need a `CounterpartySignature`. Instead, both the loan broker and borrower must sign the outer `Batch` transaction. The account sending the `Batch` transaction signs it normally, and the other party signs it as one of its `BatchSigners`.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
