# CredentialIDs Field

The `CredentialIDs` field is a new field added to the following transaction types by XLS-70 (Credentials):

- [AccountDelete][]
- [EscrowFinish][]
- [Payment][]
- [PaymentChannelClaim][]

This field's definition is as follows:

| Field           | JSON Type        | [Internal Type][] | Required? | Description |
|:----------------|:-----------------|:------------------|:----------|:------------|
| `CredentialIDs` | Array of Strings | Vector256 | No | Set of Credentials to authorize a deposit made by this transaction. Each member of the array must be the ledger entry ID of a Credential entry in the ledger and the sender of this transaction must be the subject of the credential. |

You can send money to an account that uses [Deposit Authorization](https://xrpl.org/docs/concepts/accounts/depositauth) by providing this field with an exact set of credentials that are preauthorized by the recipient; the set of credentials must match a [DepositPreauth entry](./depositpreauth-entry.md) in the ledger.

If you provide credentials even though the destination account does not use Deposit Authorization, the credentials are not needed but they are still checked for validity, meaning:

- The provided credentials must exist.
- The provided credentials must have been accepted by the subject.
- None of the provided credentials may be expired.
- The sender of this transaction must be the subject of each of the credentials.

## Special Case for Destination Accounts Below the Reserve

If an account has Deposit Authorization enabled, but its current XRP balance is less than the reserve requirement, there is (already) a special exception to Deposit Authorization where anyone can send a payment, without preauthorization, for up to the account reserve; this exists as an emergency measure to prevent an account from getting "stuck" without enough XRP to transact. To qualify for this special case, the payment MUST NOT use the `CredentialIDs` field.

## Error Cases

The following error cases can occur for all transactions with the `CredentialIDs` field:

| Error Code | Description |
|:-----------|:------------|
| `temDISABLED` | The related amendment is not enabled. |
| `tecBAD_CREDENTIALS` | There was a problem with at least one of the provided credentials. For example, a specified credential doesn't belong to the sender or has not been accepted. |
| `tecEXPIRED` | At least one provided credential has expired. (In this case, the transaction also deletes the expired credentials from the ledger.) |
| `tecNO_PERMISSION` | In addition to cases where this error could already occur, transactions can fail if the provided set of `CredentialIDs` does not exactly match a set of credentials preauthorized by the destination, including if too many credentials are provided. |
| `tecNO_ENTRY` | One or more of the IDs in the `CredentialIDs` field is not a Credential object in the ledger. |


{% raw-partial file="/docs/_snippets/common-links.md" /%}
