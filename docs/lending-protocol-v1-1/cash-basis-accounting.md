# Cash-Basis Accounting

The `LendingProtocolV1_1` amendment changes how a vault recognizes interest income from the loans it funds.

Before the amendment, the Lending Protocol used a _whole-life_ (accrual) model: the moment a loan was originated, the full interest the borrower was scheduled to pay over the life of the loan was recognized as vault income. The vault's accounting reflected money it hadn't received yet, and that recognition had to be unwound if the borrower stopped paying.

With the amendment, new vaults use _cash-basis_ accounting instead and interest is accounted for only when a payment actually delivers it. To see which fields are affected by this change, see:

- [Updated Ledger Entries](./updated-ledger-entries.md)
- [Updated Transactions](./updated-transactions.md)

## Which Model a Vault Uses

You can't choose which accounting model to use when creating a vault. The status of the `LendingProtocolV1_1` amendment determines the model:

- If not enabled, vaults use whole-life accounting.
- If enabled, vaults use cash-basis accounting.

{% admonition type="info" name="Note" %}
Vaults created with whole-life accounting remain so permanently, even after the amendment activates.
{% /admonition %}

## Additional Accounting Changes

- Vault share prices are tracked against realized income from interest actually paid. A vault's `AssetsTotal` no longer rises at the moment a loan is written, so a vault's shares aren't marked up on scheduled income.
- Losses show as smaller values, since it only accounts for outstanding principal amount. Whole-life accounting included lost income from interest added to the principal loss amount.
- Loan brokers can potentially issue more loans, since their `DebtTotal` and `DebtMaximum` values only account for realized amounts, not including all scheduled income from interest.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
