---
seo:
    description: Reference index for the simpleXRPL SDK — its verticals, connectors, the amount and asset model, submission results, and the error hierarchy.
labels:
  - simpleXRPL
  - SDK
---

# Reference

This section is the map of simpleXRPL's public API surface: the client entry point, the business-intent verticals, the custodian connectors, the amount and asset model, submission results, and the error hierarchy. Complete type-level signatures for every symbol are generated from the source with TypeDoc; the tables below are the curated index of what you actually build against.

New to simpleXRPL? Start with [What is simpleXRPL](../index.md) for the concepts, then [Get Started](../get-started.md) to install and connect a custodian.

{% admonition type="info" name="Note" %}
This index covers the public surface only. Internal and testing seams (the dispatch pipeline, injected I/O ports, and the production ledger port) are intentionally omitted — you don't call them directly.
{% /admonition %}

## Client and initialization

The client owns the network connection and the connector configuration, both immutable for its lifetime.

| Symbol | Description |
| --- | --- |
| `SimpleXRPL` | The entry point. `SimpleXRPL.init(...)` establishes the network, connector, and account bindings. |
| `SimpleXRPLClient` | The runtime client returned by `init`; exposes the verticals. |
| `SimpleXRPLConfig` | The initialization configuration shape (network, connector, accounts). |
| `NetworkInfo` | Resolved network details for the connected client. |

## Verticals

Operations are grouped into domain-specific **verticals**, one per area of XRPL functionality and reached off the client. See [Verticals](verticals/index.md) for what a vertical is and the full list of verticals and their methods.

## Connectors

The connector is the execution model — it determines how operations run and who holds the keys. See [Operation Execution](../index.md#operation-execution) for how each operation routes.

| Connector | Use | Key configuration types |
| --- | --- | --- |
| `LocalSigner` | Development and testing; holds `xrpl` wallets in-process. | `LocalSignerCreateOptions`, `LocalSignerFromEnvOptions` |
| `RippleCustody` | Production; routes through Ripple Custody. | `RippleCustodyOptions`, `RippleCustodyAuthOptions`, `RippleCustodyFromEnvOptions` |
| `PalisadeCustody` | Production; routes through Palisade. | `PalisadeCustodyConfig`, `PalisadeWalletRef` |

## Amounts and assets

The amount model represents XRP, IOU, and MPT values and handles decimal/scale conversion.

| Symbol | Description |
| --- | --- |
| `Amount` | A value paired with the asset it denominates. |
| `Asset` | The asset an amount is in (XRP, IOU, or MPT). |
| `XRP_ASSET` | The canonical XRP asset constant. |
| `iou(currency, issuer)` | Construct an issued-currency asset. |
| `mpt(mptIssuanceId, scale?)` | Construct an MPT asset; `scale` is the decimal places between display value and on-ledger base units. |
| `toLedgerAmount` / `fromLedgerAmount` | Convert between display amounts and on-ledger base units. |
| `LedgerAmount` | The on-ledger (base-unit) amount representation. |

## Results and handles

| Symbol | Description |
| --- | --- |
| `SubmissionResult<T>` | The terminal result of an operation; carries the discriminated `source`/`response` pairing and the vertical's typed `intent` output. |
| `SubmissionResultFields` | The common fields present on every submission result. |
| `SubmissionPath` | Which path the operation took (native vs. raw-signing). |
| `SubmissionHandle` | Handle over an asynchronously-submitted operation, for flows that resolve later. |
| `CustodyTransactionResult` / `PalisadeTransactionResult` | The connector-specific transaction record inside the result. |

The `*Intent` types (`XrpTransferIntent`, `MptIssueIntent`, `IOUIssueIntent`, `DomainIntent`, and the rest) are the typed `intent` payloads attached to each result.

## Errors

All errors extend `SimpleXRPLError`, so you can catch the base class or narrow to a specific type.

| Error | Raised when |
| --- | --- |
| `SimpleXRPLError` | Base class for every SDK error. |
| `NoSignerError` | No signer/connector owns the target account. |
| `SignerCapabilityError` | The operation can't be signed on this connector (native path missing, or raw signing not enabled). |
| `AccountNotFoundError` | The referenced account is not bound to the client. |
| `AmbiguousAccountError` | The account reference matches more than one bound account. |
| `RippledSubmitError` | The transaction reached a terminal on-ledger failure (non-`tesSUCCESS`). |
| `IntentPendingError` | A custodian intent is still awaiting approval when a terminal result was expected. |
| `IntentValidationError` | A custodian rejected the intent as invalid. |
| `MultiStepFailureError` | A multi-step operation failed partway through. |
| `CustodyApiError` / `CustodyAuthError` | Ripple Custody API or authentication failure. |
| `PalisadeApiError` / `PalisadeAuthError` | Palisade API or authentication failure. |

## Related reference

Companion reference pages that live alongside this index:

- **Function-to-transactor mapping** — the underlying XRPL transactor(s) each method expands into (also shown inline on each method page).
- [**Connector routing table**](connector-routing.md) — per operation and per connector, whether it routes native, requires raw-signing fallback, or is unavailable.
- **Institutional defaults** — the full set of defaults the SDK applies unless overridden.
