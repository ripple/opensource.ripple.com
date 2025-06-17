---
seo:
    description: An object that stores a set of permissions that an XRPL account delegates to another account.
labels:
  - Accounts
  - Permissions
  - Delegate
---

# Common Fields

The change to the common fields topic introduced for this feature is the new `Delegate` object. For the full draft topic in context, see [Transaction Common Fields](https://xrpl-dev-portal--perm-dele-common-fields-2.preview.redocly.app/docs/references/protocol/transactions/common-fields).

# Delegate

{% partial file="../../_snippets/_delegating-account-permissions-disclaimer.md" /%}

The `Delegate` ledger object stores a set of permissions that an XRPL account has delegated to another account. You create `Delegate` objects using the [`DelegateSet`](./delegate-set.md) transaction.

## Example Delegate JSON

This sample `Delegate` object shows that the _rISAAC_ account has delegated `TrustLineAuthorize` permission to the _rKYLIE_ account.

```json
{
    "LedgerEntryType": "Delegate",
    "Account": "rISAAC......",
    "Authorize": "rKYLIE......",
    "Permissions": [{"Permission": {"PermissionValue": "TrustlineAuthorize"}}],
}
```

## Structure

A `Delegate` object has the following fields:

| Field Name | Required? | JSON Type | Internal Type | Description |
|------------|-----------|-----------|---------------|-------------|
| `LedgerIndex` |  ✔️ | string | Hash256 | The unique ID of the ledger object. |
| `LedgerEntryType` | ✔️ | string | UInt16 | The ledger object's type (`Delegate`) |
| `Account` | ✔️ | string | AccountID | The account that delegates permissions to another account. |
| `Authorize` | ✔️ | string | AccountID | The account to which permissions are delegated. |
| `Permissions` | ✔️ | string | STArray | The transaction permissions that the `Authorize` account has been granted. |
| `OwnerNode` |  | string | UInt64 | A hint indicating which page of the sender's owner directory links to this object, in case the directory consists of multiple pages. |
| `PreviousTxnID` |  | string | Hash256 | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeqNumber`| | number | UInt32 |The index of the ledger that contains the transaction that most recently modified this object. |

## Retrieving Delegate Objects

You can retrieve `Delegate` ledger objects using the `ledger_entry` RPC method. The unique ID of a `Delegate` object is a hash of the `Account` and `Authorize` fields, combined with the unique space key for Delegate objects.


## Account Deletion

A `Delegate` object is not a deletion blocker. This means that deleting an account removes any `Delegate` objects associated with it.


<!-- This needs to be added to the common fields reference as a Draft PR to xrpl.org -->