---
seo:
    description: Account.fund funds a created account from a testnet/devnet faucet, then enables rippling via an AccountSet transaction.
labels:
  - simpleXRPL
  - SDK
---

# account.fund()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/account.ts#L124)

Fund a created account via the network faucet (testnet/devnet), then enable rippling. The account must be one this client can sign for (e.g. from [`create`](create.md)).

{% admonition type="info" name="Note" %}
`fund` requires a faucet-capable ledger (testnet/devnet). On other networks it throws — use [`activate`](activate.md) to fund from an operator account instead.
{% /admonition %}

## Signature

```ts
account.fund(
  params: AccountFundParams,
  options?: AccountWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `destination` | `string` | Yes | The r-address to fund (typically from `Account.create`). |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<undefined>` (from the `defaultRipple` settings change).

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

`Account.fund` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactor

Funds the account via the network faucet (an off-ledger request, not a submitted transaction), then builds and submits a single [`AccountSet`](https://xrpl.org/docs/references/protocol/transactions/types/accountset) transaction to enable rippling (`defaultRipple`).

## Example

```ts
await client.account.fund({
  destination: 'rNewAccount...',
})
```
