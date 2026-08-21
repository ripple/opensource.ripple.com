---
seo:
    description: Core types in simpleXRPL — the shared account records, submission results, and connector identifiers used across the client, connectors, and verticals.
labels:
  - simpleXRPL
  - SDK
---

# Core Types

Core types are the shared records the SDK uses across the client, connectors, and verticals — as opposed to the parameters and results specific to a single operation. They fall into three groups: the [account records](#account) that identify and reference XRPL accounts, the [submission types](#submissionresult) every write resolves to, and the [connector identifiers](#custodiankind) that say which backend owns what.


## Account

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L37)

A discovered account: its r-address paired with the connector that owns and signs for it. The SDK hands you an `Account` from `client.accounts` and [`connector.listAccounts()`](connectors/index.md). It extends [`AccountRef`](#accountref), so `address` and `custodianRef` come from there.

This is distinct from `AccountData`, the on-chain snapshot returned by [`account.retrieve`](verticals/account/retrieve.md).

| Field | Type | Description |
| --- | --- | --- |
| `address` | `string` | The XRPL r-address — the canonical key the SDK uses to identify the account. Inherited from [`AccountRef`](#accountref). |
| `custodianRef` | [`CustodianRef`](#custodianref) _(optional)_ | The owning connector's opaque native id for the account. Inherited from [`AccountRef`](#accountref). |
| `signer` | [`Custodian`](connectors/index.md) | The connector that discovered and signs for this account. |
| `alias` | `string` _(optional)_ | A connector-side alias, when the backend exposes one. |
| `ledgerId` | `string` _(optional)_ | The connector-specific ledger id backing this address, when the backend needs one disambiguated — e.g. Ripple Custody's multi-ledger Vault accounts, which carry no ledger default of their own. |
| `publicKey` | `string` _(optional)_ | The account's XRPL public key (hex), when the connector exposes it. Used to populate `SigningPubKey` on transactions signed by a backend that returns only the signature, e.g. Palisade's raw sign-only path. |
| `metadata` | `object` _(optional)_ | Advisory-only. Shape `{ kind?, tags? }`, where `kind` is a [`CustodianKind`](#custodiankind) and `tags` is a list of strings. |


## AccountRef

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L25)

The minimal reference to an account — just its r-address and the owning connector's native id. [`Account`](#account) extends it, and a connector's `primary` field is an `AccountRef`.

| Field | Type | Description |
| --- | --- | --- |
| `address` | `string` | The XRPL r-address. |
| `custodianRef` | [`CustodianRef`](#custodianref) _(optional)_ | The owning connector's opaque native id for the account. |


## AccountSelector

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L69)

How you choose the source account for an operation — the `from` option on writes. It is one of three forms:

| Form | Type | Description |
| --- | --- | --- |
| r-address | `string` | A bare r-address string. |
| `{ address }` | `object` | An object holding an explicit r-address. |
| `{ signer, account? }` | `object` | A connector, optionally narrowed to one of the accounts it owns (by r-address). |


## SubmissionResult

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L163)

`SubmissionResult<T>` is generic over `T`, the operation-specific `intent` payload — each operation's reference page lists its own return fields. The table below is the same one those pages inline under **Returns**.

{% raw-partial file="/docs/_snippets/simplexrpl-response-fields.md" /%}

{% admonition type="info" name="Note" %}
`txHash` being absent doesn't mean the write failed — on a governed connector the intent may still be awaiting approval. Hold onto `intentId` and resume through [`client.intent`](intent-inspector.md); see [Intent Inspector](intent-inspector.md).
{% /admonition %}


## SubmissionHandle

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L181)

Returned by an async submission, and by [`client.intent.handleFor()`](intent-inspector.md#handlefor). `kind` is a [`CustodianKind`](#custodiankind); `custodian` is the [connector](connectors/index.md) itself.

{% raw-partial file="/docs/_snippets/simplexrpl-submission-handle.md" /%}


## OnChainResult

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L276)

The outcome of a transaction confirmed on-ledger, returned by [`client.intent.awaitOnChain()`](intent-inspector.md#awaitonchain).

{% raw-partial file="/docs/_snippets/simplexrpl-onchain-result.md" /%}


## FeeIntent

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L89)

A normalized fee intent. The public surface never takes raw drops for the fee itself — each path translates this to its backend's fee model. Used as a connector's `defaultFee` and as the per-write `fee` option.

| Field | Type | Description |
| --- | --- | --- |
| `priority` | `'low' \| 'medium' \| 'high'` _(optional)_ | Priority tier. Backends that cannot honor it auto-price and warn. |
| `maxFeeDrops` | `string` _(optional)_ | The maximum fee cap, in drops — the common contract across all paths. |


## CustodianKind

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L10)

Which signing backend a [connector](connectors/index.md) adapts. One of four string literals:

`'local'` · `'ripple-custody'` · `'palisade-custody'` · `'external'`


## CustodianRef

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/domain/model.ts#L18)

A connector's opaque native identifier for an account, read only by the connector that owns it. One of:

| Form | Type | Used by |
| --- | --- | --- |
| account id | `string` | Account-id connectors. |
| `{ vaultId, walletId }` | `object` | Vault-based connectors, e.g. [Palisade](connectors/palisade.md). |
| absent | `undefined` | Local wallets, which have no backend-side id. |
