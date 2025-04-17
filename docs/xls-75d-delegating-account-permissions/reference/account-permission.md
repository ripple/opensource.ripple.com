---
seo:
    description: An object that stores a set of permissions that an XRPL account delegates to another account.
labels:
  - Accounts
  - Permissions
---

# AccountPermission

{% partial file="../../_snippets/_delegating-account-permissions-disclaimer.md" /%}

The `AccountPermission` ledger object stores a set of permissions that an XRPL account has delegated to another account. You create `AccountPermission` objects using the [`AccountPermissionSet`](./account-permission-set.md) transaction.

## Example AccountPermission JSON

This sample `AccountPermission` object shows that the _rISAAC_ account has delegated `TrustLineAuthorize` permission to the _rKYLIE_ account.

```json
{
    "LedgerEntryType": "AccountPermission",
    "Account": "rISAAC......",
    "Authorize": "rKYLIE......",
    "Permissions": [{"Permission": {"PermissionValue": "TrustlineAuthorize"}}],
}
```

## Structure

An AccountPermission object has the following fields:

| Field Name | Required? | JSON Type | Internal Type | Description |
|------------|-----------|-----------|---------------|-------------|
|  `LedgerIndex` |  ✔️ | string | Hash256 | The unique ID of the ledger object. |
| `LedgerEntryType` | ✔️ | string | UInt16 | The ledger object's type (`AccountPermission`) |
| `Account` | ✔️ | string | AccountID | The account that authorized another account. |
| `Authorize` | ✔️ | string | AccountID | The authorized account. |
| `Permissions` | ✔️ | string | STArray | The transaction permissions that the `Authorize` account has been granted. |
| `OwnerNode` | string | UInt64 | A hint indicating which page of the sender's owner directory links to this object, in case the directory consists of multiple pages. |
| `PreviousTxnID` | string | Hash256 | The identifying hash of the transaction that most recently modified this object. |
| `PreviousTxnLgrSeqNumber`| number | UInt32 |The index of the ledger that contains the transaction that most recently modified this object. |

## Retrieving AccountPermission Objects

You can retrieve `AccountPermission` ledger objects using the `ledger_entry` RPC method. The unique ID of an `AccountPermission` object is a hash of the `Account` and `Authorize` fields, combined with the unique space key for AccountPermission objects.


## Account Deletion

An `AccountPermission` object is not a deletion blocker. This means that deleting an account removes any `AccountPermission` objects associated with it.
