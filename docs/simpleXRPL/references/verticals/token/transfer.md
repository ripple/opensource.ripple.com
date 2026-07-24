---
seo:
    description: Token.transfer sends MPT units to another account via a Payment transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.transfer()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L266)

Send an MPT amount to another account.

## Signature

```ts
token.transfer(
  params: TokenTransferParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `to` | `string` | Yes | Destination r-address. |
| `amount` | `Amount` | Yes | The MPT amount to send. Its asset must be an MPT (build one with `mpt()`; see the [amount model](../../index.md#amounts-and-assets)). |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<{ to: string; amount: string }>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `Token.transfer`, the `intent` echoes:

| Field | Type | Description |
| --- | --- | --- |
| `to` | `string` | Destination r-address. |
| `amount` | `string` | The amount sent, as a decimal string. |

## Underlying XRPL transactor

Builds and submits a single [Payment](https://xrpl.org/docs/references/protocol/transactions/types/payment) transaction. Throws an `IntentValidationError` if `amount`'s asset is not an MPT — use [XRP.transfer](../xrp/transfer.md) for XRP.

## Example

```ts
await client.token.transfer({
  to: 'rHolder...',
  amount: { asset: mpt('005C...'), value: '100' },
})
```
