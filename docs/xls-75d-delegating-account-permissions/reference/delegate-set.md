---
seo:
    description: An object that stores a set of permissions that an XRPL account delegates to another account.
labels:
  - Accounts
  - Permissions
  - Delegate
---

# DelegateSet 

{% partial file="../../_snippets/_delegating-account-permissions-disclaimer.md" /%}

The `DelegateSet` transaction creates, modifies, or deletes a `Delegate` ledger object, thereby granting, changing, or revoking delegated permissions between accounts.

## Example `DelegateSet` JSON

```json
tx_json = { 
  "TransactionType": "DelegateSet",
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
## `DelegateSet` Fields

In addition to the common fields, `DelegateSet` transactions have the following fields:

| Field | Required? | JSON Type | Internal Type | Description |
|-------|-----------|-----------|---------------|-------------|
| `TransactionType` | Yes | string | UInt16         | The transaction type (DelegateSet). |
| `Account` | Yes | string | AccountID       | The address of the account that is delegating the permission(s). |
| `Authorize`| Yes | string | AccountID | The address of the account that is being granted the permission(s).
| `Permissions` | Yes | string | STArray | An array of permission objects. Each object contains a `Permission` object with a `PermissionValue` field specifying the permission being granted. To modify permissions, include all desired permissions in the `Permissions` array. Omitted permissions are revoked. |


## Revoking Permissions

Permissions are revoked using the `DelegateSet` transaction by specifying only the desired permissions and omitting any previous permissions that are no longer needed.

### Revoke All Permissions

To revoke all permissions, send a `DelegateSet` transaction with an empty `Permissions` array:

```json
tx_json = {
  "TransactionType": "DelegateSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": []
}
```

### Revoke Specific Permissions 

To revoke specific permissions, include only the permissions that should remain active in the `Permissions` array.

## Security

Giving permissions to other parties requires a high degree of trust, especially when the delegated account can potentially access funds (the `Payment` permission) or charge reserves (any transaction that can create objects). In addition, any account that has permissions for the entire `AccountSet`, `SetRegularKey`, or `SignerListSet` transactions can give themselves any permissions even if this was not originally part of the intention.

With granular permissions, however, users can give permissions to other accounts for only parts of transactions without giving them full control. This is especially helpful for managing complex transaction types like `AccountSet`.### Granular Permissions

These permissions support control over some smaller portion of a transaction, rather than being able to do all of the functionality that the transaction allows.

These permissions fall into the gap between the size of the `UInt16` and the `UInt32` (the size of the `SignerListID` field).

| Value | Name  | Description |
|-------|-------|-------------|
|`65537`|`TrustlineAuthorize`|Authorize a trustline.|
|`65538`|`TrustlineFreeze`|Freeze a trustline.|
|`65539`|`TrustlineUnfreeze`|Unfreeze a trustline.|
|`65540`|`AccountDomainSet`|Modify the domain of an account.|
|`65541`|`AccountEmailHashSet`|Modify the `EmailHash` of an account.|
|`65542`|`AccountMessageKeySet`|Modify the `MessageKey` of an account.|
|`65543`|`AccountTransferRateSet`|Modify the transfer rate of an account.|
|`65544`|`AccountTickSizeSet`|Modify the tick size of an account.|
|`65545`|`PaymentMint`|Send a payment for a currency where the sending account is the issuer.|
|`65546`|`PaymentBurn`|Send a payment for a currency where the destination account is the issuer.|
|`65547`|`MPTokenIssuanceLock`|Use the `MPTIssuanceSet` transaction to lock (freeze) a holder.|
|`65548`|`MPTokenIssuanceUnlock`|Use the `MPTIssuanceSet` transaction to unlock (unfreeze) a holder.|

## Failure Conditions

The `DelegateSet` transaction fails if:

- The `Permissions` array contains more than 10 entries.
- The `Permissions` array contains duplicate entries.
- Any of the specified `PermissionValues` are invalid.
- The `Authorize` account does not exist.


## State Changes

A successful `DelegateSet` transaction results in the creation, modification, or deletion of a `Delegate` ledger object.

- If no `Delegate` object exists for the given `Account` and `Authorize` pair, a new one is created.
- If a `Delegate` object already exists, its `Permissions` field is updated.
- If the `Permissions` array is empty, the `Delegate` object is deleted.

## Limitations

The set of permissions must be hard-coded. No custom configurations are allowed. For example, you cannot add permissions based on specific currencies. 

In addition, each permission needs to be implemented on its own in the source code. Adding a new permission requires an amendment.

