# Private Loan Brokers

The [LendingProtocolV1_2 amendment][] lets loan brokers restrict who can borrow from them.

A _private_ loan broker only originates loans to borrowers who hold [credentials][] accepted by a [permissioned domain](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains). This lets lenders meet compliance requirements, such as KYC checks, on-chain.

## Creating a Private Loan Broker

To create a private loan broker, set the `tfLoanBrokerPrivate` flag when you create it with a `LoanBrokerSet` transaction, and specify the permissioned domain in the `DomainID` field.

- The private flag can only be set when the loan broker is created and can't be added or removed afterwards.
- The `DomainID` can be changed or removed later with another `LoanBrokerSet` transaction. Set `DomainID` to all zeros to remove it.
- A public loan broker can't have a `DomainID`.

{% admonition type="warning" name="Caution" %}
A private loan broker without a `DomainID` can't originate any loans. Every `LoanSet` fails with `tecNO_AUTH` until a domain is set.
{% /admonition %}

## How Borrowers Are Checked

When a private loan broker originates a loan, the borrower must hold an accepted, unexpired credential that matches one of the domain's `AcceptedCredentials`. The check happens when the borrower receives the loan:

- In the single-transaction flow, `LoanSet` performs the check.
- In the [two-step flow](./two-step-loan-creation.md), `LoanAccept` performs the check.

If the check fails, the transaction fails with one of these codes:

| Error Code            | Description |
| :-------------------- | :---------- |
| `tecNO_AUTH`          | The loan broker has no `DomainID`, or the borrower doesn't hold an accepted credential that matches the domain's `AcceptedCredentials`. |
| `tecEXPIRED`          | The borrower's only matching credentials are expired. The expired credentials are deleted, so retrying the transaction returns `tecNO_AUTH`. |
| `tecOBJECT_NOT_FOUND` | The loan broker's permissioned domain no longer exists. |

Neither the domain owner nor the loan broker is exempt from this check. They must hold a matching credential like any other borrower.

Credentials are only checked when a loan is originated. If a borrower's credential expires or is revoked later, the borrower can still make payments on existing loans.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
