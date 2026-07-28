---
seo:
    description: The simpleXRPL client errors.
labels:
  - simpleXRPL
  - SDK
---

# Errors

All errors extend `SimpleXRPLError`, so you can catch the base class or narrow to a specific type.

| Error | Description |
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