# DepositPreauth Transaction

A DepositPreauth transaction grants preauthorization to deliver payments to your account. This is only useful if you are using (or plan to use) [Deposit Authorization](https://xrpl.org/docs/concepts/accounts/depositauth).

{% admonition type="success" name="Tip" %}
You can use this transaction before you enable Deposit Authorization. This may be useful to ensure a smooth transition from not requiring deposit authorization to requiring it.
{% /admonition %}

## Example DepositPreauth JSON


{% tabs %}

{% tab label="Single account preauthorization" %}
```json
{
  "TransactionType" : "DepositPreauth",
  "Account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "Authorize" : "rEhxGqkqPPSxQ3P25J66ft5TwpzV14k2de",
  "Fee" : "10",
  "Flags" : 2147483648,
  "Sequence" : 2
}
```
{% /tab %}

{% tab label="Credential preauthorization" %}
```json
{
  "TransactionType" : "DepositPreauth",
  "Account" : "rsUiUMpnrgxQp24dJYZDhmV4bE3aBtQyt8",
  "AuthorizeCredentials": [{
    "Credential": {
      "Issuer": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
      "CredentialType": "6D795F63726564656E7469616C"
    }
  }],
  "Fee" : "10",
  "Flags": 0,
  "Sequence": 230984
}
```
{% /tab %}
{% /tabs %}

[Query example transaction. >](https://xrpl.org/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_DepositPreauth%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%22CB1BF910C93D050254C049E9003DA1A265C107E0C8DE4A7CFF55FADFD39D5656%22%2C%22binary%22%3Afalse%7D)


## DepositPreauth Fields

In addition to the [common fields][], DepositPreauth transactions use the following fields:

| Field                    | JSON Type            | [Internal Type][] | Required? | Description |
|:-------------------------|:---------------------|:------------------|:----------|:------------|
| `Authorize`              | String - [Address][] | AccountID         | No        | An account to preauthorize. |
| `AuthorizeCredentials`   | Array                | STArray           | No        | A set of credentials to authorize. |
| `Unauthorize`            | String               | AccountID         | No        | An account whose preauthorization should be revoked. |
| `UnauthorizeCredentials` | Array                | STArray           | No        | A set of credentials whose preauthorization should be revoked. |

You must provide **exactly one** of `Authorize`, `AuthorizeCredentials`, `Unauthorize`, or `UnauthorizeCredentials`.

If this transaction is successful, it creates or removes a [DepositPreauth entry](./depositpreauth-entry.md) in the ledger, based on the field provided.


### AuthorizeCredentials Objects

If provided, each member of the `AuthorizeCredentials` field or `UnauthorizeCredentials` field must be an inner object with the following fields:

| Field            | JSON Type            | [Internal Type][] | Required? | Description |
|:-----------------|:---------------------|:------------------|:----------|:------------|
| `Issuer`         | String - [Address][] | AccountID         | Yes       | The issuer of the credential. |
| `CredentialType` | String - Hexadecimal | Blob              | Yes       | The credential type of the credential. |

## Error Cases

In addition to error types that can occur for all transactions, DepositPreauth transactions can result in the following error codes:

| Error Code                | Description |
|:--------------------------|:------------|
| `tecDUPLICATE`            | The transaction would create a preauthorization that already exists. |
| `tecINSUFFICIENT_RESERVE` | The sender would not meet the [reserve requirement][] after adding another entry to the ledger. (A DepositPreauth entry counts as one item towards the authorizer's owner reserve.) |
| `tecNO_ENTRY`             | The transaction tried to revoke a preauthorization that does not exist in the ledger. |
| `tecNO_ISSUER`            | One or more specified credential issuers does not exist in the ledger. |
| `tecNO_TARGET`            | The transaction tried to authorize an account that is not a funded account in the ledger. |
| `temCANNOT_PREAUTH_SELF`  | The address in the `Authorize` field is the sender of the transaction. You cannot preauthorize yourself. |
| `temDISABLED`             | A required amendment is not enabled. |


{% raw-partial file="/docs/_snippets/common-links.md" /%}