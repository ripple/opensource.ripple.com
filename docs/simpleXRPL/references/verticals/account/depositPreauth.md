---
seo:
    description: Account.depositPreauth grants or revokes deposit preauthorization for another account via a DepositPreauth transaction.
labels:
  - simpleXRPL
  - SDK
---

# account.depositPreauth()

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/verticals/account.ts#L271)

Grant or revoke deposit preauthorization for another account.

## Signature

```ts
account.depositPreauth(
  params: DepositPreauthParams,
  options?: AccountWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `authorize` | `string` | No | An r-address to preauthorize for deposits. |
| `unauthorize` | `string` | No | An r-address to remove preauthorization from. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<undefined>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

`Account.depositPreauth` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactor

Builds and submits a single [DepositPreauth](https://xrpl.org/docs/references/protocol/transactions/types/depositpreauth) transaction.

## Example

```ts
await client.account.depositPreauth({
  authorize: 'rTrusted...',
})
```
