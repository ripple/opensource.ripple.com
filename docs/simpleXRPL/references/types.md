---
seo:
    description: Core types in simpleXRPL — the shared account records (Account, AccountRef) and the account selector used across the client, connectors, and verticals.
labels:
  - simpleXRPL
  - SDK
---

# Core Types

Core types are the shared records the SDK uses across the client, connectors, and verticals — as opposed to the parameters and results specific to a single operation. They describe how simpleXRPL identifies and references XRPL accounts.

## Account

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/domain/model.ts#L41)

A discovered account: its r-address paired with the connector that owns and signs for it. The SDK hands you an `Account` from `client.accounts` and [`connector.listAccounts()`](connectors/index.md). It extends [`AccountRef`](#accountref).

This is distinct from `AccountData`, the on-chain snapshot returned by [`account.retrieve`](verticals/account/retrieve.md).

| Field | Type | Description |
| --- | --- | --- |
| `address` | `string` | The XRPL r-address — the canonical key the SDK uses to identify the account. |
| `signer` | `object` | The [connector](connectors/index.md) (a `Custodian`) that discovered and signs for this account. |
| `alias` | `string` _(optional)_ | A connector-side alias, when the backend exposes one. |
| `custodianRef` | `string` \| `object` _(optional)_ | The owning connector's opaque native id for the account — a `string` for account-id connectors, or a `{ vaultId, walletId }` object for vault-based connectors; absent for local wallets. |
| `metadata` | `object` _(optional)_ | Advisory-only. Shape `{ kind?, tags? }`, where `kind` is the connector kind (`'local'`, `'ripple-custody'`, `'palisade-custody'`, or `'external'`) and `tags` is a list of strings. |

## AccountRef

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/domain/model.ts#L29)

The minimal reference to an account — just its r-address and the owning connector's native id. [`Account`](#account) extends it, and a connector's `primary` field is an `AccountRef`.

| Field | Type | Description |
| --- | --- | --- |
| `address` | `string` | The XRPL r-address. |
| `custodianRef` | `string` \| `object` _(optional)_ | The owning connector's opaque native id for the account — a `string` for account-id connectors, or a `{ vaultId, walletId }` object for vault-based connectors; absent for local wallets. |

## AccountSelector

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/domain/model.ts#L59)

How you choose the source account for a verb — the `from` option on write operations. It is one of three forms:

| Form | Type | Description |
| --- | --- | --- |
| r-address | `string` | A bare r-address string. |
| `{ address }` | `object` | An object holding an explicit r-address. |
| `{ signer, account? }` | `object` | A connector, optionally narrowed to one of the accounts it owns (by r-address). |
