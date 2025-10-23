---
seo:
    description: Make a payment on an active loan.
labels:
  - Transactions
  - Lending Protocol
---
# LoanPay
[[Source]](https://github.com/XRPLF/rippled/blob/ximinez/lending-XLS-66/src/xrpld/app/tx/detail/LoanPay.cpp "Source")

Makes a payment on an active loan. Only the borrower on the loan can make payments, and payments must meet the minimum amount required for that period.

_(Requires the [Lending Protocol amendment][] {% not-enabled /%})_

A loan payment has four types, depending on the amount and timing of the payment:

- **Regular Payment**: A payment made on time, where the payment size and schedule are calculated with a standard [amortization formula](https://en.wikipedia.org/wiki/Amortization_calculator).
- **Late Payment**: A payment made after the `NextPaymentDueDate` in the `Loan` ledger entry. Late payments include a `LatePaymentFee` and `LateInterestRate`.
- **Early Full Payment**: A payment that covers the outstanding principal of the loan. A `CloseInterestRate` is charged on the outstanding principal.
- **Overpayment**: A payment that exceeds the required minimum payment amount.

To see how loan payments are calculated, see: [Loan Payment Psuedo-code](#loan-payment-pseudo-code).


## Example {% $frontmatter.seo.title %} JSON

```json
{
  "TransactionType": "LoanPay",
  "Account": "rBORROWER9AbCdEfGhIjKlMnOpQrStUvWxYz",
  "Fee": "12",
  "Flags": 0,
  "LoanID": "ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
  "Amount": 1000,
  "Sequence": 10,
  "LastLedgerSequence": 7108701
}
```


## {% $frontmatter.seo.title %} Fields

In addition to the [common fields][], {% code-page-name /%} transactions use the following fields:

| Field Name      | JSON Type | Internal Type | Required? | Description |
|:--------------- |:----------|:-------------|:----------|:------------|
| `LoanID`        | String    | Hash256      | Yes       | The ID of the `Loan` ledger entry to repay. |
| `Amount`        | Number    | Amount       | Yes       | The amount to pay toward the loan. |


## {% $frontmatter.seo.title %} Flags

Transactions of the {% code-page-name /%} type support additional values in the [`flags` field], as follows:

| Flag Name | Hex Value | Decimal Value | Description |
|:----------|:----------|:--------------|:------------|
| `tfLoanOverpayment` | `0x00010000` | 65536 | Indicates that the remaining payment amount should be treated as an overpayment. |


## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes][]:

| Error Code | Description |
|:-----------|:------------|
| `temINVALID` | The `LoanID` field is missing or set to zero. |
| `temBAD_AMOUNT` | The `Amount` field must specify a positive value. |
| `tecNO_ENTRY` | The loan specified by `LoanID` doesn't exist. |
| `tecNO_PERMISSION` | The account submitting the transaction isn't the borrower on the loan. |
| `tecTOO_SOON` | The loan hasn't started yet. |
| `tecKILLED` | The loan is already fully paid. |
| `tecWRONG_ASSET` | The asset specified by `Amount` doesn't match the asset of the loan. |
| `tecFROZEN` | The borrower's account is frozen for the specified asset, or the loan broker's pseudo-account is deep-frozen and can't receive funds. |


## Loan Payment Pseudo-code

The following is pseudo-code for handling a loan payment transaction.

```
function compute_periodic_payment(principalOutstanding) -> (periodicPayment):
    let periodicRate = (loan.interestRate * loan.paymentInterval) / (365 * 24 * 60 * 60)
    let raisedRate = (1 + periodicRate)^loan.paymentsRemaining
    
    return principalOutstanding * (periodicRate * raisedRate) / (raisedRate - 1)

function compute_late_payment_interest(currentTime) -> (lateInterest, managementFee):
    let secondsOverdue = lastLedgerCloseTime() - loan.nextPaymentDueDate
    let latePeriodicRate = (loan.lateInterestRate * secondsOverdue) / (365 * 24 * 60 * 60)
    let latePaymentInterest = loan.principalOutstanding * latePeriodicRate
    
    let fee = (latePaymentInterest * loan.loanbroker.managementFeeRate).round(asset_scale, DOWN)
    
    return (latePaymentInterest - fee, fee)

function compute_full_payment(currentTime) -> (principal, interest, fee):
    let rawPrincipalOutstanding = principal_outstanding_from_periodic()
    let periodicRate = (loan.interestRate * loan.paymentInterval) / (365 * 24 * 60 * 60)
    let secondsSinceLastPayment = lastLedgerCloseTime() - max(loan.previousPaymentDate, loan.startDate)
    
    let accruedInterest = rawPrincipalOutstanding * periodicRate * (secondsSinceLastPayment / loan.paymentInterval)
    let prepaymentPenalty = rawPrincipalOutstanding * loan.closeInterestRate
    let interest = (accruedInterest + prepaymentPenalty).round(asset_scale, DOWN)
    
    let managementFee = (interest * loan.loanbroker.managementFeeRate).round(asset_scale, DOWN)
    interest = interest - managementFee
    
    if managementFee <= loan.managementFeeOutstanding:
        return (loan.principalOutstanding, interest, managementFee)
    
    return (loan.principalOutstanding, accruedInterest + prepaymentPenalty, managementFee)

function principal_outstanding_from_periodic() -> (principalOutstanding):
    # Given the outstanding principal we can calculate the periodic payment
    # Equally, given the periodic payment we can calculate the principal outstanding at the current time
    let periodicRate = (loan.interestRate * loan.paymentInterval) / (365 * 24 * 60 * 60)
    
    # If the loan is zero-interest, the outstanding principal is simply periodicPayment * paymentsRemaining
    if periodicRate == 0:
        return loan.periodicPayment * loan.paymentsRemaining
    
    let raisedRate = (1 + periodicRate)^loan.paymentsRemaining
    let factor = (periodicRate * raisedRate) / (raisedRate - 1)
    
    return loan.periodicPayment / factor

# This function calculates what the loan state should be given the periodic payment and remaining payments
function calculate_true_loan_state() -> (principalOutstanding, interestOutstanding, managementFeeOutstanding):
    let rawPrincipalOutstanding = principal_outstanding_from_periodic()
    let rawInterestOutstanding = (loan.periodicPayment * loan.paymentsRemaining) - rawPrincipalOutstanding
    let rawManagementFeeOutstanding = (rawInterestOutstanding * loan.loanbroker.managementFeeRate)
    
    # Exclude the management fee from the interest rate
    rawInterestOutstanding = rawInterestOutstanding - rawManagementFeeOutstanding
    
    return (rawPrincipalOutstanding, rawInterestOutstanding, rawManagementFeeOutstanding)

function calculate_payment_breakdown(principalOutstanding) -> (principal, interest):
    let periodicRate = (loan.interestRate * loan.paymentInterval) / (365 * 24 * 60 * 60)
    
    if periodicRate == 0:
        return (principalOutstanding / loan.paymentsRemaining, 0)
    
    let interest = principalOutstanding * periodicRate
    let principal = loan.periodicPayment - interest
    
    return (principal, interest)

function calculate_rounded_principal_payment(unroundedPrincipalOutstanding, unroundedPrincipalPayment) -> (principal):
    # The diff captures by how much we deviated from the true principal value
    # If the diff is negative, we need to slow down repayment as we overpaid principalOutstanding
    # If the diff is positive, we need to speed up the repayment as we underpaid the principalOutstanding
    let diff = (loan.principalOutstanding - unroundedPrincipalOutstanding).round(asset_scale, DOWN)
    let roundedPrincipalPayment = (unroundedPrincipalPayment + diff).round(asset_scale, DOWN)
    
    # Ensure we do not have a negative principal payment
    roundedPrincipalPayment = max(0, roundedPrincipalPayment)
    
    return min(roundedPrincipalPayment, loan.principalOutstanding)

function calculate_rounded_interest_breakdown(roundedPrincipalPayment, unroundedInterestOutstanding, unroundedManagementFeeOutstanding, amount) -> (interest, fee):
    if loan.interestRate == 0:
        return (0, 0)
    
    let loanInterestOutstanding = loan.totalValueOutstanding - loan.principalOutstanding - loan.managementFeeOutstanding
    
    # If diffInterest is negative, we are overpaying the interest portion of the loan, we need to slow down
    # If the diffInterest is positive, we are underpaying the interest portion, we need to speed up
    let diffInterest = (loanInterestOutstanding - unroundedInterestOutstanding).round(asset_scale, DOWN)
    let roundedInterestPayment = amount - roundedPrincipalPayment
    
    roundedInterestPayment = roundedInterestPayment + diffInterest
    
    # Ensure that we do not overpay the periodic payment amount
    roundedInterestPayment = min(amount - roundedPrincipalPayment, roundedInterestPayment)
    
    # Since in the previous step we perform a subtraction, we need to ensure that we don't end up with a negative interest payment
    roundedInterestPayment = max(0, roundedInterestPayment)
    
    # We have calculated the interest payment, we can now calculate the management fee portion
    
    # If diffManagementFee is negative, we are overpaying the fee portion, slow down
    # If the diffManagementFee is positive, we are underpaying the fee portion, speed up
    let diffManagementFee = (loan.managementFeeOutstanding - unroundedManagementFeeOutstanding).round(asset_scale, DOWN)
    let roundedManagementFee = (roundedInterestPayment * loan.loanbroker.managementFeeRate).round(asset_scale, DOWN)
    
    roundedManagementFee = roundedManagementFee + diffManagementFee
    
    # Since the diffManagementFee can be negative, managementFee may end up negative, ensure that does not happen
    roundedManagementFee = max(0, roundedManagementFee)
    
    # Finally, ensure that the management fee does not exceed the outstanding management fee
    roundedManagementFee = min(roundedManagementFee, loan.managementFeeOutstanding)
    
    # Subtract the fee from interest, ensuring the interest portion is not negative
    roundedInterestPayment = max(0, roundedInterestPayment - roundedManagementFee)
    
    # Finally, ensure the interest payment does not exceed the outstanding interest
    roundedInterestPayment = min(loanInterestOutstanding, roundedInterestPayment)
    
    let excess = (amount - roundedPrincipalPayment - roundedInterestPayment - roundedManagementFee)
    
    # If we exceed the payment amount, take as much excess as possible from the interest
    if excess < 0:
        let part = min(roundedInterestPayment, abs(excess))
        roundedInterestPayment = roundedInterestPayment - part
        excess = excess + part
    
    # If there is any left, take as much as possible from the fee
    if excess < 0:
        let part = min(roundedManagementFee, abs(excess))
        roundedManagementFee = roundedManagementFee - part
        excess = excess + part
    
    return (roundedInterestPayment, roundedManagementFee)

function compute_payment_due(amount) -> (principal, interest, managementFee):
    # If this is the final payment, simply settle any outstanding amounts
    if loan.paymentsRemaining == 1:
        let outstandingInterest = loan.totalValueOutstanding - loan.principalOutstanding - loan.managementFeeOutstanding
        return (loan.principalOutstanding, outstandingInterest, loan.managementFeeOutstanding)
    
    # Determine the true, unrounded state of the loan
    let (unroundedPrincipalOutstanding, unroundedInterestOutstanding, unroundedManagementFeeOutstanding) = calculate_true_loan_state()
    
    # We do not need to know the interest portion
    let (unroundedPrincipalPayment, _) = calculate_payment_breakdown(unroundedPrincipalOutstanding)
    
    # Given the true state we can calculate the rounded principal that accounts for deviation from the true state
    let roundedPrincipalPayment = calculate_rounded_principal_payment(unroundedPrincipalOutstanding, unroundedPrincipalPayment)
    
    let (roundedInterestPayment, roundedManagementFee) = calculate_rounded_interest_breakdown(
        roundedPrincipalPayment,
        unroundedInterestOutstanding,
        unroundedManagementFeeOutstanding,
        amount
    )
    
    return (roundedPrincipalPayment, roundedInterestPayment, roundedManagementFee)

function do_overpayment(amount) -> (valueChange):
    # Calculate true principal and interest outstanding
    let (truePrincipalOutstanding, trueInterestOutstanding, trueManagementFeeOutstanding) = calculate_true_loan_state()
    
    # For an accurate overpayment we need to preserve rounding errors
    # diffTotal incorporates rounding errors from principal and interest fee, note there is no interest rounding error as this value is derived
    let diffTotal = loan.totalValueOutstanding - (truePrincipalOutstanding + trueInterestOutstanding + trueManagementFeeOutstanding)
    let diffPrincipal = loan.principalOutstanding - truePrincipalOutstanding
    let diffManagementFee = loan.managementFeeOutstanding - trueManagementFeeOutstanding
    
    let newPrincipalOutstanding = truePrincipalOutstanding - amount
    let newPeriodicPayment = compute_periodic_payment(newPrincipalOutstanding)
    
    # From the given periodic payment, calculate the new total value outstanding
    let newTotalValueOutstanding = (newPeriodicPayment * loan.paymentsRemaining).round(asset_scale, HALF_EVEN)
    
    # From the new total value, calculate the new interest outstanding and management fee outstanding
    let newInterestOutstanding = newTotalValueOutstanding - newPrincipalOutstanding
    let newManagementFeeOutstanding = (newInterestOutstanding * loan.loanbroker.managementFeeRate).round(asset_scale, HALF_EVEN)
    
    newInterestOutstanding = newInterestOutstanding - newManagementFeeOutstanding
    
    let roundedValueChange = newTotalValueOutstanding + diffTotal - (loan.totalValueOutstanding - amount)
    
    # Update loan state
    loan.totalValueOutstanding = newTotalValueOutstanding + diffTotal
    loan.principalOutstanding = (newPrincipalOutstanding + diffPrincipal).round(asset_scale, DOWN)
    loan.managementFeeOutstanding = (newManagementFeeOutstanding + diffManagementFee).round(asset_scale, DOWN)
    
    return roundedValueChange

function make_payment(amount, currentTime) -> (principalPaid, interestPaid, valueChange, feePaid):
    if loan.paymentsRemaining == 0 || loan.principalOutstanding == 0:
        return "loan complete" error
    
    # The payment is late
    if loan.nextPaymentDueDate < currentTime:
        let (principal, interest, managementFee) = compute_payment_due(amount)
        let (lateInterest, lateManagementFee) = compute_late_payment_interest(currentTime)
        
        let totalManagementFee = managementFee + lateManagementFee
        let totalDue = principal + interest + lateInterest + totalManagementFee + loan.serviceFee + loan.latePaymentFee
        
        # Insufficient funds
        if amount < totalDue:
            return "insufficient amount paid" error
        
        loan.paymentsRemaining = loan.paymentsRemaining - 1
        loan.previousPaymentDate = loan.nextPaymentDueDate
        loan.nextPaymentDueDate = loan.nextPaymentDueDate + loan.paymentInterval
        loan.principalOutstanding = loan.principalOutstanding - principal
        loan.managementFeeOutstanding = loan.managementFeeOutstanding - managementFee
        
        return (
            principal,                                                    # A late payment does not affect the principal portion due
            interest + lateInterest,                                      # A late payment incorporates both periodic interest and the late interest
            lateInterest,                                                 # The value of the loan increases by the lateInterest amount
            totalManagementFee + loan.serviceFee + loan.latePaymentFee   # The total fee paid for a loan payment
        )
    
    let (fullPrincipal, fullInterest, fullManagementFee) = compute_full_payment(currentTime)
    let fullPaymentAmount = fullPrincipal + fullInterest + fullManagementFee + loan.closePaymentFee
    
    # If the payment is equal or higher than full payment amount and there is more than one payment remaining, make a full payment
    if amount >= fullPaymentAmount && loan.paymentsRemaining > 1:
        let totalInterestOutstanding = loan.totalValueOutstanding - loan.principalOutstanding - loan.managementFeeOutstanding
        let loanValueChange = fullInterest - totalInterestOutstanding
        
        loan.paymentsRemaining = 0
        loan.principalOutstanding = 0
        loan.managementFeeOutstanding = 0
        loan.totalValueOutstanding = 0
        
        return (
            fullPrincipal,                      # Full payment repays the entire outstanding principal
            fullInterest,                       # Full payment repays any accrued interest since the last payment and additional full payment interest
            loanValueChange,                    # A full payment changes the total value of the loan
            fullManagementFee + loan.closePaymentFee   # An early payment pays a specific closePaymentFee
        )
    
    # Handle regular payments and overpayments
    let totalPaid = 0
    let (totalPrincipalPaid, totalInterestPaid, totalFeePaid) = (0, 0, 0)
    
    # Process regular periodic payments
    while totalPaid < amount && loan.paymentsRemaining > 0:
        let (principal, interest, managementFee) = compute_payment_due(loan.periodicPayment.round(asset_scale, UP))
        let paymentAmount = principal + interest + managementFee + loan.serviceFee
        
        # Check if we have enough funds for this payment
        if totalPaid + paymentAmount > amount:
            break
        
        # Apply the payment
        loan.totalValueOutstanding = loan.totalValueOutstanding - (principal + interest + managementFee)
        loan.principalOutstanding = loan.principalOutstanding - principal
        loan.managementFeeOutstanding = loan.managementFeeOutstanding - managementFee
        loan.paymentsRemaining = loan.paymentsRemaining - 1
        
        loan.nextPaymentDueDate = loan.nextPaymentDueDate + loan.paymentInterval
        loan.previousPaymentDate = loan.nextPaymentDueDate - loan.paymentInterval
        
        totalPaid = totalPaid + paymentAmount
        totalPrincipalPaid = totalPrincipalPaid + principal
        totalInterestPaid = totalInterestPaid + interest
        totalFeePaid = totalFeePaid + managementFee + loan.serviceFee
    
    let loanValueChange = 0
    # Handle overpayment if there are remaining payments, the loan supports overpayments, and there are funds remaining
    if loan.paymentsRemaining > 0 && is_set(loan.lsfLoanOverpayment) && is_set(tfLoanOverpayment) && totalPaid < amount:
        let overpaymentAmount = min(loan.principalOutstanding, amount - totalPaid)
        
        let overpaymentInterest = overpaymentAmount * loan.overpaymentInterestRate
        let overpaymentManagementFee = overpaymentInterest * loan.loanbroker.managementFeeRate
        let overpaymentFee = overpaymentAmount * loan.overpaymentFee
        
        overpaymentInterest = overpaymentInterest - overpaymentManagementFee
        loanValueChange = loanValueChange + overpaymentInterest
        
        let overpaymentPrincipal = overpaymentAmount - overpaymentInterest - overpaymentManagementFee - overpaymentFee
        
        if overpaymentPrincipal > 0:
            let valueChange = do_overpayment(overpaymentPrincipal)
            loanValueChange = loanValueChange + valueChange
            
            totalPaid = totalPaid + overpaymentAmount
            totalPrincipalPaid = totalPrincipalPaid + overpaymentPrincipal
            totalInterestPaid = totalInterestPaid + overpaymentInterest
            totalFeePaid = totalFeePaid + overpaymentManagementFee + overpaymentFee
    
    return (
        totalPrincipalPaid,     # This will include the periodicPayment principal and any overpayment
        totalInterestPaid,      # This will include the periodicPayment interest and any overpayment
        loanValueChange,        # Value change in loan total value by overpayment
        totalFeePaid            # The total fee
    )
```

{% raw-partial file="/docs/_snippets/common-links.md" /%}
