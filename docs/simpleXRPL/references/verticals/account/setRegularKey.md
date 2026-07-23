---
seo:
    description: Account.setRegularKey sets or removes the account's regular key via a SetRegularKey transaction.
labels:
  - SDKs
---

# account.setRegularKey()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/account.ts#L235)

Set or remove the account's regular key.

## Signature

```ts
account.setRegularKey(
  params: SetRegularKeyParams = {},
  options?: AccountWriteOptions,
): Promise<SubmissionResult<undefined>>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `regularKey` | `string` | No | The regular key r-address to set. Omit to remove the current regular key. |

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<undefined>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

`Account.setRegularKey` attaches no `intent` output; `intent` is `undefined`.

### Underlying XRPL transactor

Builds and submits a single [`SetRegularKey`](https://xrpl.org/docs/references/protocol/transactions/types/setregularkey) transaction.

## Example

```ts
await client.account.setRegularKey({
  regularKey: 'rRegularKey...',
})
```
