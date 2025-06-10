---
seo:
    description: Common configurations for an XRP Ledger account.
labels:
  - Accounts
  - Permissions
---
# Permission Delegation

{% partial file="../../_snippets/_delegating-account-permissions-disclaimer.md" /%}

XRPL accounts can delegate both transaction permissions and granular permissions to other accounts, enhancing flexibility and enabling use cases such as implementing role-based access control. This delegation is managed using the [DelegateSet][] transaction.

## Assigning Permissions

You can assign permissions to another account by submitting an `DelegateSet` transaction.

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
    } 
  ] 
} 
```

| Field | Description |
|-------|-------------|
| `Account` | The address of the account that is delegating the permission(s). |
| `Authorize` | The address of the account that is being granted the permission(s). |
| `Permissions` | An array of permission objects, specifying the permissions to delegate. Each permission is defined within a `Permission` object, using the `PermissionValue` field. See [XLS-74d, Account Permissions] for a complete list of valid `PermissionValues`. |  


## Revoking Permissions

Permissions can be revoked using the `DelegateSet` transaction. There are two ways to revoke permissions:

### Revoke All Permissions

To revoke all permissions previously granted to a delegated account, send a `DelegateSet` transaction with an empty `Permissions` array:

```json
tx_json = {
  "TransactionType": "DelegateSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": []
}
```

### Revoke Specific Permissions

To revoke specific permissions, send a `DelegateSet` transaction that includes _only_ the permissions that should remain active. Any permissions previously granted to the `Authorize` account that aren't included in the `Permissions` array are revoked.

## Sending Transactions with Delegated Permissions

When an account has been granted permissions, it can send transactions on behalf of the delegating account using the `Delegate` field.

For example, if `rDelegatingAccount` has delegated the `TrustSet` permission to `rDelegatedAccount`, then `rDelegatedAccount` can submit a `TrustSet` transaction on behalf of `rDelegatingAccount` as follows:

```json
transaction_json = {
  "TransactionType": "TrustSet",
  "Account": "rDelegatingAccount",
  "Delegate": "rDelegatedAccount",
  "LimitAmount": {
    "currency": "USD",
    "issuer": "rIssuerAccount",
    "value": "1000"
  }
} 
```

The `rDelegatedAccount` signs the transaction.

| Field | Description |
|-------|-------------|
| `Account` | The address of the account that granted permission for the transaction (the _delegating_ account). |
| `Delegate` | The address of the account submitting and signing the transaction. This must be the account that was granted permission (the _delegated_ account). |

{% admonition type="warning" name="Important" %}
* Delegating permissions grants significant control. Ensure you trust the delegated account.
* The account specified in the `Delegate` field is responsible for paying the transaction fee.
* A delegated account can only perform actions that have been explicitly permitted.
{% /admonition %}