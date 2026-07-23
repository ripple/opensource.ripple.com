---
seo:
    description: Token.issue creates a new Multi-Purpose Token (MPT) issuance via an MPTokenIssuanceCreate transaction.
labels:
  - simpleXRPL
  - SDK
---

# token.issue()

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/verticals/token.ts#L134)

Create a new MPT issuance.

## Signature

```ts
token.issue(
  params: MptIssueParams,
  options?: TokenWriteOptions,
): Promise<SubmissionResult<MptIssueIntent>>
```

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `metadata` | `MPTokenMetadata \| string` | Yes | Token metadata: a structured object (encoded per the XLS-89 standard) or a raw string (UTF-8 hex-encoded as-is). Validated against XLS-89; non-compliant metadata is rejected before submission. |
| `assetScale` | `number` | No | Decimal places between the display value and base units. Defaults to `2`. |
| `maximumAmount` | `string` | No | Maximum issuable amount, in base units. |
| `transferFee` | `number` | No | Transfer fee on secondary sales, as a percentage (`0.5` = 0.5%, range 0–50). |
| `flags` | `MptIssueFlags` | No | Capability flags (see below). |

The `flags` object accepts:

| Flag | Type | Required | Description |
| --- | --- | --- | --- |
| `canLock` | `boolean` | No | The issuer can lock the token (globally or per-holder). |
| `requireAuth` | `boolean` | No | Holders must be authorized before they can hold the token. |
| `canEscrow` | `boolean` | No | The token can be used in escrows. |
| `canTrade` | `boolean` | No | The token can be traded on the DEX. |
| `canTransfer` | `boolean` | No | The token can be transferred between holders. |
| `canClawback` | `boolean` | No | The issuer can claw back the token. |

{% admonition type="info" name="Note" %}
`issue()` applies opinionated, overridable defaults so a bare call yields a usable token: `canLock`, `canEscrow`, `canTrade`, `canTransfer`, and `canClawback` are all enabled, and `requireAuth` is off. Pass any flag explicitly to override it. MPT capability flags are **permanent** once the issuance exists.
{% /admonition %}

### Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

### Response

Resolves to a `SubmissionResult<MptIssueIntent>`.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

#### Response values

For `Token.issue`, the `intent` (`MptIssueIntent`) carries:

| Field | Type | Description |
| --- | --- | --- |
| `mptIssuanceId` | `string` | The id of the newly created MPT issuance. |

### Underlying XRPL transactor

Builds and submits a single [`MPTokenIssuanceCreate`](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuancecreate) transaction.

## Example

```ts
const { intent } = await client.token.issue({
  metadata: {
    ticker: 'TBILL',
    name: 'Acme T-Bill Token',
    icon: 'https://acme.example/icon.png',
    asset_class: 'rwa',
    asset_subclass: 'treasury',
    issuer_name: 'Acme Inc',
  },
})

console.log(intent.mptIssuanceId)
```
