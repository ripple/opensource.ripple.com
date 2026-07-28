---
seo:
    description: Reference index for the simpleXRPL SDK — its verticals, connectors, the amount and asset model, submission results, and the error hierarchy.
labels:
  - simpleXRPL
  - SDK
---

# Reference

This section is the map of `simpleXRPL`'s public API surface: the client entry point, the business-intent verticals, the custodian connectors, the amount and asset model, submission results, and the error hierarchy. Complete type-level signatures for every symbol are generated from the source with TypeDoc; the tables below are the curated index of what you actually build against.

New to simpleXRPL? Start with [What is simpleXRPL](../index.md) for the concepts, then [Get Started](../get-started.md) to install and connect a custodian.

{% admonition type="info" name="Note" %}
This index covers the public surface only. Internal and testing seams (the dispatch pipeline, injected I/O ports, and the production ledger port) are intentionally omitted — you don't call them directly.
{% /admonition %}


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
- [**Connector routing table**](connectors/connector-routing.md) — per operation and per connector, whether it routes native, requires raw-signing fallback, or is unavailable.
- **Institutional defaults** — the full set of defaults the SDK applies unless overridden.
