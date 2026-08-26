---
seo:
    description: IOU.issue bootstraps a new trust line-based IOU. It enables rippling, extends trust, and optionally distributes an opening amount to the hot wallet.
labels:
  - simpleXRPL
  - SDK
---

# iou.issue()

[[Source]](https://github.com/ripple/simpleXRPL/blob/24bdf29e215fd559229e24a9f57505952bfb39f7/src/verticals/iou.ts#L101)

Generate a new trust line-based IOU in one call: the issuer enables rippling, the hot wallet extends trust to the maximum limit, and if `amount` is given, the issuer distributes that amount to the hot wallet.

Omit `amount` to set the trust line up only and distribute later with [iou.transfer](transfer.md).

## Sourcing the issuer and hot wallet

There are two ways to name the two accounts an issuance needs:

- **Pass `holder`** — a client-owned account, on any connector. The issuer comes from `options.from` (default: the primary signer). Both resolve through the client's signers, so either can be custody-held on [Ripple Custody](../../connectors/ripple-custody.md) or [Palisade](../../connectors/palisade.md).
- **Omit `holder`** — both accounts are bootstrapped from the `XRPL_ISSUER_SEED` and `XRPL_HOT_WALLET_SEED` environment seeds. This is the local dev flow.

## Signature

```ts
iou.issue(
  params: IOUIssueParams,
  options?: IOUWriteOptions,
): Promise<SubmissionResult<IOUIssueIntent>>
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ticker` | `string` | Yes | The currency code: a 3-character ISO-4217-style code or a 40-character hex code. Any other code (e.g., a 5-character ticker) is auto-encoded to the 40-character hex form. |
| `holder` | `string` | No | The hot-wallet (holder) r-address that extends trust to the issuer — a client-owned account on any connector. Omit to bootstrap both accounts from the environment seeds. |
| `amount` | `string` | No | How much of the new IOU the issuer distributes to the hot wallet as a final step, as a decimal string. Must be **strictly positive** (`'0'` is rejected) with at most 15 significant digits. Omit to set the trust line up only. |

## Options

{% raw-partial file="/docs/_snippets/simplexrpl-write-options.md" /%}

## Returns

Resolves to a `SubmissionResult<IOUIssueIntent>` (from the final step).

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

### Return fields

For `IOU.issue`, the `intent` (`IOUIssueIntent`) carries:

| Field | Type | Description |
| --- | --- | --- |
| `iouID` | `string` | The currency code and issuer of the new IOU, e.g. `USD.rIssuer...`. |
| `amount` | `string` _(optional)_ | The amount distributed to the hot wallet, or `undefined` when the issuance only set the trust line up. |

## Underlying XRPL transactors

Runs as an ordered, multi-step sequence (no rollback on partial failure):

1. [AccountSet](https://xrpl.org/docs/references/protocol/transactions/types/accountset) — the issuer enables rippling (`defaultRipple`).
2. [TrustSet](https://xrpl.org/docs/references/protocol/transactions/types/trustset) — the hot wallet extends trust to the issuer, up to the maximum limit.
3. [Payment](https://xrpl.org/docs/references/protocol/transactions/types/payment) — **only when `amount` is given**. The issuer distributes that amount to the hot wallet. The distribution must follow the `TrustSet`: without the limit in place, the `Payment` fails with `tecPATH_DRY`.

Throws an `IntentValidationError` if the environment-seed flow is used and the required seeds aren't set, or if `amount` is not a positive finite number. Throws a `MultiStepFailureError` if any step fails, carrying the steps that already committed — a distribution failure leaves the trust line in place, so it can be retried with [iou.transfer](transfer.md).

## Example

```ts
// Issue USD and put 1,000 into circulation on a custody-held hot wallet.
const { intent } = await client.iou.issue(
  {
    ticker: 'USD',
    holder: 'rHotWallet...',
    amount: '1000',
  },
  { from: 'rIssuer...' },
)

console.log(intent.iouID, intent.amount)
```
