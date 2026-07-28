---
seo:
    description: The simpleXRPL client errors.
labels:
  - simpleXRPL
  - SDK
---

# Errors

[[Source]](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/src/errors.ts#L8)

All errors extend `SimpleXRPLError`, so you can catch the base class or narrow to a specific type.

| Error | Description |
| --- | --- |
| `SimpleXRPLError` | Base class for every SDK error. |
| `NoSignerError` | No signer/connector owns the target account. |
| `SignerCapabilityError` | The operation can't be signed on this connector (native path missing, or raw signing not enabled). |
| `AccountNotFoundError` | The referenced account is not bound to the client. |
| `AmbiguousAccountError` | The account reference matches more than one bound account. |
| `DuplicateSignerError` | Two signers target the same backend tenant (same kind and tenant id); rejected at `init`. |
| `RippledSubmitError` | The transaction reached a terminal on-ledger failure (non-`tesSUCCESS`). |
| `IntentPendingError` | A custodian intent is still awaiting approval when a terminal result was expected. |
| `IntentValidationError` | A custodian rejected the intent as invalid. |
| `MultiStepFailureError` | A multi-step operation failed partway through. |
| `CustodyAuthError` | Authenticating with Ripple Custody failed (challenge/JWT exchange or refresh). |
| `CustodyApiError` | A Ripple Custody API call returned an error (HTTP status, `hint`, and raw body preserved). |
| `PalisadeAuthError` | Authenticating with Palisade failed (API key). |
| `PalisadeApiError` | A Palisade API call returned an error (HTTP status, `hint`, and raw body preserved). |
