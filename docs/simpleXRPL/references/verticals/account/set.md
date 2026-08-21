---
seo:
    description: Account.set updates account settings and flags via an AccountSet transaction.
labels:
  - simpleXRPL
  - SDK
---

# account.set()

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/account.ts#L190)

Update account settings. Flags are named booleans (`true` enables, `false` disables); `transferRate`, `tickSize`, and `domain` are set directly. At least one parameter is required.

{% admonition type="info" name="Note" %}
A single `AccountSet` enables at most one flag and disables at most one. Toggling more than one flag in the same direction is rejected. Call `set()` once per such change.
{% /admonition %}

## Signature

```ts
account.set(
  params: AccountSetParams,
  options?: AccountWriteOptions,
): Promise<SubmissionResult<undefined>>
```

## Parameters

All parameters are optional individually, but at least one must be provided.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `noFreeze` | `boolean` | No | Permanently give up the ability to freeze trust lines (irreversible). |
| `clawbackEnabled` | `boolean` | No | Permanently allow this issuer to claw back issued tokens (irreversible). |
| `trustLineLocking` | `boolean` | No | Permanently allow trust line locking (irreversible). |
| `disableMaster` | `boolean` | No | Permanently disable the master key pair (irreversible). |
| `requireAuth` | `boolean` | No | Require holders to be authorized before they can hold issued tokens. |
| `requireDest` | `boolean` | No | Require a destination tag on incoming payments. |
| `defaultRipple` | `boolean` | No | Enable rippling on trust lines by default. |
| `globalFreeze` | `boolean` | No | Freeze all trust lines issued by this account. |
| `disallowXRP` | `boolean` | No | Disallow incoming XRP payments (advisory). |
| `transferRate` | `number` | No | Transfer fee for issued currencies, as a percentage (`0.5` = 0.5%, range 0–100). |
| `tickSize` | `number` | No | Tick size for offers (3–15, or `0` to disable). |
| `domain` | `string` | No | The account domain, as a plain string (hex-encoded on the ledger). |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<undefined>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

`Account.set` attaches no `intent` output; `intent` is `undefined`.

## Underlying XRPL transactor

Builds and submits a single [AccountSet](https://xrpl.org/docs/references/protocol/transactions/types/accountset) transaction.

## Example

```ts
await client.account.set({
  requireAuth: true,
})
```
