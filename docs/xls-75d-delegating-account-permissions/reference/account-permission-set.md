---
seo:
    description: An object that stores a set of permissions that an XRPL account delegates to another account.
labels:
  - Accounts
  - Permissions
---

# AccountPermissionSet 

{% partial file="../../_snippets/_delegating-account-permissions-disclaimer.md" /%}

The `AccountPermissionSet` transaction creates, modifies, or deletes an `AccountPermission` ledger object, thereby granting, changing, or revoking delegated permissions between accounts.

## Example AccountPermissionSet JSON

```json
tx_json = { 
  "TransactionType": "AccountPermissionSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": [
    {
      "Permission": {
        "PermissionValue": "Payment"
      }
    },
    {
      "Permission": {
        "PermissionValue": "TrustSet"
      }
    }
  ]
}
```
## AccountPermissionSet Fields

In addition to the common fields, AccountPermissionSet transactions have the following fields:

| Field | Required? | JSON Type | Internal Type | Description |
|-------|-----------|-----------|---------------|-------------|
| `TransactionType` | Yes | string | UInt16         | The transaction type (AccountPermissionSet). |
| `Account` | Yes | string | AccountID       | The address of the account that is delegating the permission(s). |
| `Authorize`| Yes | string | AccountID | The address of the account that is being granted the permission(s).
| `Permissions` | Yes | string | STArray | An array of permission objects. Each object contains a `Permission` object with a `PermissionValue` field specifying the permission being granted. To modify permissions, include all desired permissions in the `Permissions` array. Omitted permissions are revoked. |


## Revoking Permissions

Permissions are revoked using the `AccountPermissionSet` transaction by specifying only the desired permissions and omitting any previous permissions that are no longer needed.

### Revoke All Permissions

To revoke all permissions, send an `AccountPermissionSet` transaction with an empty `Permissions` array:

```json
tx_json = {
  "TransactionType": "AccountPermissionSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": []
}
```

### Revoke Specific Permissions 

To revoke specific permissions, include only the permissions that should remain active in the `Permissions` array.


## Failure Conditions

The AccountPermissionSet transaction fails if:

- The `Permissions` array contains more than 10 entries.
- The `Permissions` array contains duplicate entries.
- Any of the specified `PermissionValues` are invalid.
- The `Authorize` account does not exist.


## State Changes

A successful `AccountPermissionSet` transaction will result in the creation, modification, or deletion of an `AccountPermission` ledger object.

- If no `AccountPermission` object exists for the given `Account` and `Authorize` pair, a new one is created.
- If an `AccountPermission` object already exists, its `Permissions` field is updated.
- If the `Permissions` array is empty, the `AccountPermission` object is deleted.