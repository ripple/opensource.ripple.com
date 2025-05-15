---
seo:
    description: The XRPL Lending Protocol enables on-chain, uncollateralized fixed-term loans.
labels:
  - Decentralized Finance
  - Lending Protocol
---
# Lending Protocol

The Lending Protocol is an XRP Ledger DeFi primitive that enables on-chain, fixed-term, uncollateralized loans using pooled funds from a single-asset vault. The implementation relies on off-chain underwriting and risk management to assess the creditworthiness of borrowers, but offers peer-to-peer loans without intermediaries like banks or financial institutions. First-loss capital protection is used to help offset losses from loan defaults.

The current implementation of the lending protocol doesn't include automated on-chain collateral and liquidation management, instead focusing on on-chain credit origination.

To ensure compliance needs are met, asset issuers can claw back funds on the vault associated with the lending protocol. Issuers can also issue freezes on individual accounts or issue a global freeze.

## Protocol Flow

The lifecycle of a loan is as follows:

1. A loan broker creates a vault.
2. Depositors add assets to the vault.
3. (Optional) The loan broker deposits first-loss capital.
4. A loan broker and borrower create a loan, defining the terms of the loan.
5. The borrower draws funds from the loan and makes payments against the principal.
6. If payments are missed, the loan broker can default the loan.
7. The loan is deleted when matured or defaulted.
8. (Optional) The loan broker can withdraw first-loss capital.
9. After all loans are paid, the loan broker can delete the `LoanBroker` ledger entry, and then the corresponding `Vault` ledger entry.

## Accounting

### Risk Management

Risk management involves mechanisms that mitigate the risks associated with lending. To protect investors' assets, a loan broker can deposit assets as first-loss capital. These assets act as a buffer and are partially liquidated in th event of loan defaults. The liquidated capital is placed into the vault to cover some of the losses from missed payments.

The loan broker can also set the maximum amount of debt that can be owed to a single-asset vault. If the amount owed to a vault ever exceeds this value, the loan broker can't issue more loans until the debt is paid down below the specified amount.

### Interest Rates

There are three interest rates associated with a loan:

- **Interest Rate**: The regular interest rate based on the principal amount. It is the cost of borrowing funds.
- **Late Interest Rate**: A higher interest rate charged for a late payment.
- **Full Payment Rate**: An interest rate charged for repaying the total loan early.

### Fees

The lending protocol charges a number of fees that the loan broker can configure. The protocol won't charge these fees if the loan broker hasn't deposited enough first-loss capital.

- **Management Fee**: This is a percentage of interest charged by the loan broker. Vault depositors pay this fee.
- **Loan Origination Fee**: A fee paid to the loan broker, taken from the principal amount loaned out.
- **Loan Service Fee**: A fee charged on top of each loan payment.
- **Late Payment Fee**: A fee paid on top of a late payment.
- **Early Payment Fee**: A fee paid on top of an early payment.
