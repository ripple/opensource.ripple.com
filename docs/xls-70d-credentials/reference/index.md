# Credentials Reference

Credentials involve the following changes to the XRP Ledger protocol.

## Ledger entry types

One new type of ledger entry:

- [Credential ledger entry](./credential.md) - Stores a credential in the ledger

Modifications to the existing type of ledger entry:

- [DepositPreauth ledger entry](./depositpreauth-entry.md) - Records authorization for depositing to a specific account; modified to allow for credential-based authorization.

## Transaction Types

Three new transaction types for managing credentials:

- [CredentialCreate transaction](./credentialcreate.md) - Create a credential in the ledger.
- [CredentialAccept transaction](./credentialaccept.md) - Accept a credential issued to you.
- [CredentialDelete transaction](./credentialdelete.md) - Delete a credential from the ledger.

Modifications to an existing transaction type:

- [DepositPreauth transaction](./depositpreauth-transaction.md) - Authorizes deposits to your account. Modified to allow credential-based authorization.

A new field for several existing transaction types:

- [`CredentialIDs` field](./credentialids-field.md) - Credentials to prove authorization to deposit money. Added to Payment, EscrowFinish, PaymentChannelClaim, and AccountDelete transaction types.

## API Methods

Extends the following API methods:

- [deposit_authorized method](./deposit_authorized.md) - The request can specify a set of credentials to use for authorization. (There are no changes to the response format.)
- [ledger_entry method](./ledger_entry.md) - The request can now look up a Credential entry, or look up a DepositPreauth entry by the preauthorized credentials.

## Amendment

This feature requires an amendment to the XRP Ledger.

| Amendment    | Credentials |
|:-------------|:--------|
| Amendment ID | 1CB67D082CF7D9102412D34258CEDB400E659352D3B207348889297A6D90F5EF |
| Status       | In Development |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

Introduces credentials for enabling compliance checks and other approvals. Adds new transactions to create, accept, and delete credentials, and a ledger entry type for storing credentials. Modifies DepositPreauth transactions and DepositPreauth ledger entries to allow deposit authorization by credentials instead of individually authorizing each account specifically.
