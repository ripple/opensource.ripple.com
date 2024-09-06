---
html: mptokenauthorize.html
parent: transaction-types.html
blurb: Allow an account to hold an amount of a particular MPT.
labels:
 - Multi-purpose Tokens, MPTs
---

# MPTokenAuthorize

<embed src="/snippets/_mpts-disclaimer.md" />

This transaction enables an account to hold an amount of a particular MPT issuance. When applied successfully, it creates a new `MPToken` object with an initial zero balance, owned by the holder account.

If the issuer has set `lsfMPTRequireAuth` (allow-listing) on the `MPTokenIssuance`, the issuer must submit an `MPTokenAuthorize` transaction as well in order to give permission to the holder. If `lsfMPTRequireAuth` is not set and the issuer attempts to submit this transaction, it will fail.

## MPTokenAuthorize Fields

<!-- {% include '_snippets/tx-fields-intro.md' %} -->

| Field               | JSON Type           | [Internal Type][] | Description        |
|:--------------------|:--------------------|:------------------|:-------------------|
| `Account`           | string              | `AccountID`       | This address can indicate either an issuer or a potential holder of a MPT. |
| `TransactionType`   | object              | `UInt16`          | Indicates the new transaction type MPTokenAuthorize. The integer value is 29. |
| `MPTokenIssuanceID` | string              | `UInt256`         | Indicates the ID of the MPT involved. |
| `MPTokenHolder`     | string              | `AccountID`       | (Optional) Specifies the holder's address that the issuer wants to authorize. Only used for authorization/allow-listing; must be empty if submitted by the holder. |
| `Flag`              | string              | `UInt64`          | See [MPTokenAuthorize Flags](#mptokenauthorize-flags). |

### MPTokenAuthorize Flags
Transactions of the MPTokenAuthorize type support additional values in the Flags field, as follows:

| Flag Name          | Hex Value    | Decimal Value | Description                   |
|:-------------------|:-------------|:--------------|:------------------------------|
| `tfMPTUnauthorize` | `0x0001`     | 1             | If set, and transaction is submitted by a holder, it indicates that the holder no longer wants to hold the `MPToken`, which will be deleted as a result. If the holder's `MPToken` has a non-zero balance while trying to set this flag, the transaction fails. On the other hand, if set, and transaction is submitted by an issuer, it would mean that the issuer wants to unauthorize the holder (only applicable for allow-listing), which would unset the `lsfMPTAuthorized` flag on the `MPToken`. |
