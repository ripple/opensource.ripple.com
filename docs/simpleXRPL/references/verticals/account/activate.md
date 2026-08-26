---
seo:
    description: Account.activate activates a created account by sending it XRP from the operator account, then enabling rippling.
labels:
  - simpleXRPL
  - SDK
---

# account.activate()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/account.ts#L153)

Activate a created account by sending it XRP from the operator (primary) account, then enabling rippling. This is the any-network counterpart to [fund](fund.md). The account must be signable by this client (e.g., from [create](create.md)).

## Signature

```ts
account.activate(
  params: AccountActivateParams,
  options?: AccountWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `destination` | `string` | Yes | The r-address to activate (typically from `Account.create`). |
| `amount` | `string` | No | XRP to send, as a decimal string. Must be non-negative, with at most 6 decimal places (1 drop, XRP's smallest unit). Defaults to the network's base reserve (plus a small buffer). |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<undefined>` (from the `defaultRipple` settings change).

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

`Account.activate` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactors

Runs as an ordered, multi-step sequence:

1. [Payment](https://xrpl.org/docs/references/protocol/transactions/types/payment) — the operator sends XRP to the destination.
2. [AccountSet](https://xrpl.org/docs/references/protocol/transactions/types/accountset) — the new account enables rippling (`defaultRipple`).

## Example

```ts
await client.account.activate({
  destination: 'rNewAccount...',
})
```
