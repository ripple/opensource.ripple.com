---
seo:
    description: Account.create generates a new XRPL keypair locally and registers it. No transaction is submitted.
labels:
  - simpleXRPL
  - SDK
---

# account.create()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/account.ts#L72)

Generate a new XRPL keypair locally and register it so it can be funded and used right away. Use this only to mint an additional account outside of `SimpleXRPL.init`.

{% admonition type="warning" name="Warning" %}
Nothing is written to the ledger until the account is funded. The returned `seed` (and `privateKey`) are secret and are the only way to control the account. Store them securely and never log or transmit them.
{% /admonition %}

## Signature

```ts
account.create(): AccountCredentials
```

## Parameters

None. `Account.create` takes no arguments.

## Returns

Returns an `AccountCredentials` object **synchronously**. This is the one `Account` operation that does not submit a transaction, so it does not return a `SubmissionResult`.

### Return fields

| Field | Type | Description |
| --- | --- | --- |
| `address` | `string` | The classic r-address. |
| `publicKey` | `string` | The public key (hex). |
| `privateKey` | `string` | The private key (hex) — sensitive. |
| `seed` | `string` | The account seed (secret) — sensitive. |

## Underlying XRPL transactor

None. `Account.create` generates a keypair locally and writes nothing to the ledger. Use [activate](activate.md) or [fund](fund.md) to bring the account on-ledger.

## Example

```ts
const { address, seed } = client.account.create()

console.log(address)
```
