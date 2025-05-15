---
seo:
    description: Common configurations for an XRP Ledger account.
labels:
  - Accounts
  - Permissions
---
# Delegating Account Permissions

{% partial file="../../_snippets/_delegating-account-permissions-disclaimer.md" /%}

XRPL accounts can delegate specific transaction permissions to other accounts, enhancing flexibility and enabling use cases such as implementing role-based access control. This delegation is managed using the [AccountPermissionSet][] transaction.

## Assigning Permissions

You can assign permissions to another account by submitting an `AccountPermissionSet` transaction.

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

Permissions can be revoked using the `AccountPermissionSet` transaction. There are two ways to revoke permissions:

* **Revoke All Permissions:** To revoke all permissions previously granted to a delegated account, send an `AccountPermissionSet` transaction with an empty `Permissions` array:

```json
tx_json = {
  "TransactionType": "AccountPermissionSet",
  "Account": "rDelegatingAccount",
  "Authorize": "rDelegatedAccount",
  "Permissions": []
}
```

* **Revoke Specific Permissions:** To revoke specific permissions, send an `AccountPermissionSet` transaction that includes _only_ the permissions that should remain active. Any permissions previously granted to the `Authorize` account that aren't included in the `Permissions` array are revoked.

### **Sending Transactions with Delegated Permissions**

When an account has been granted permissions, it can send transactions on behalf of the delegating account using the `OnBehalfOf` field.

For example, if `rDelegatingAccount` has delegated the `TrustSet` permission to `rDelegatedAccount`, then `rDelegatedAccount` can submit a `TrustSet` transaction on behalf of `rDelegatingAccount` as follows:

```json
transaction_json = {
  "TransactionType": "TrustSet",
  "Account": "rDelegatedAccount",
  "LimitAmount": {
    "currency": "USD",
    "issuer": "rIssuerAccount",
    "value": "1000"
  },
  "OnBehalfOf": "rDelegatingAccount"
} \
```

| Field | Description |
|-------|-------------|
| `Account` | The address of the account submitting the transaction. This must be the account that was granted the permission (the _delegated_ account). |
* `OnBehalfOf` | The address of the account on whose behalf the transaction is being submitted (the _delegating_ account). The account identified here must have previously delegated the required permission to the Account.

{% admonition type="warning" name="Important" %}
* Delegating permissions grants significant control. Ensure you trust the delegated account.
* The account specified in the `OnBehalfOf` field is responsible for paying the transaction fee.
* A delegated account can only perform actions that have been explicitly permitted.
{% /admonition %}