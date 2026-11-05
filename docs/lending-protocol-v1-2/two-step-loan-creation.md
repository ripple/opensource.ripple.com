# Two-Step Loan Creation

The [LendingProtocolV1_2 amendment][] adds a two-step way to create loans.

Before the amendment, a loan broker and borrower had to sign the same [LoanSet transaction][]. One party submitted the transaction and the other provided a `CounterpartySignature`, which meant coordinating signatures off-chain before submitting.

With the amendment, the loan broker owner can _propose_ a loan on-chain, and the borrower accepts it with a separate [LoanAccept transaction](./loanaccept.md). Each party signs only their own transaction. The original single-transaction flow still works.

## How It Works

1. **Propose**: The loan broker owner submits a `LoanSet` transaction with the `Borrower` and `StartDate` fields, and without `Counterparty` or `CounterpartySignature`. This creates a _pending_ `Loan` entry with the `lsfLoanPending` flag.
2. **Accept**: The borrower submits a `LoanAccept` transaction with the pending loan's `LoanID` before the `StartDate`. The loan becomes active and the principal is paid to the borrower.
3. **Cancel (optional)**: Either the loan broker owner or the borrower can delete a pending loan at any time with a `LoanDelete` transaction, before or after it expires.

The `StartDate` serves two purposes: it's the deadline for the borrower to accept the loan, and it's the start of the loan's payment schedule. If the borrower doesn't accept the loan before the `StartDate`, `LoanAccept` fails with `tecEXPIRED`. Expired proposals aren't removed automatically; they stay on the ledger until someone deletes them.

{% admonition type="info" name="Note" %}
Two-step loan creation is only available for [fixed-precision vaults](./fixed-precision-vaults.md). Proposing a loan on any other vault fails with `tecNO_PERMISSION`.
{% /admonition %}

## Reserved Assets

When a loan is proposed, the vault sets aside the loan's principal so it can't be withdrawn or lent out again while the borrower decides:

| Event | Vault Changes | LoanBroker Changes |
| :---- | :------------ | :----------------- |
| Loan proposed | `AssetsAvailable` decreases by the principal. `AssetsDeployed` and `AssetsReserved` increase by the principal. | `DebtTotal` increases by the principal. |
| Loan accepted | `AssetsReserved` decreases by the principal. `YieldUnrealized` increases by the loan's scheduled interest. | No change. |
| Pending loan deleted | `AssetsAvailable` increases by the principal. `AssetsDeployed` and `AssetsReserved` decrease by the principal. | `DebtTotal` decreases by the principal. |

No funds leave the vault until the borrower accepts the loan. `AssetsTotal` doesn't change when a loan is proposed.

## Reserves and Ownership

While a loan is pending, the loan broker owns the `Loan` entry and pays its [reserve requirement][]. When the borrower accepts the loan, ownership transfers to the borrower: the loan broker's reserve count decreases by one and the borrower's increases by one. The borrower must be able to meet the reserve, or `LoanAccept` fails with `tecINSUFFICIENT_RESERVE`.

## Restrictions on Pending Loans

- A pending loan can't be paid with `LoanPay` or managed with `LoanManage`. Both fail with `tecNO_PERMISSION`.
- Only the `Borrower` named in the proposal can accept it.
- Freeze, authorization, and [private loan broker](./private-loan-brokers.md) checks are performed again when the loan is accepted, so a borrower whose status changed after the proposal can't accept the loan.
- A loan can't be accepted once its closed-ended vault enters the _Redemption_ phase.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
