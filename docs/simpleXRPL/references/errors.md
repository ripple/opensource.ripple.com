---
seo:
    description: The simpleXRPL client errors.
labels:
  - simpleXRPL
  - SDK
---

# Errors

[[Source]](https://github.com/ripple/simpleXRPL/blob/95b977b15f8950c5bc076b25165217869c0b06d3/src/errors.ts#L8)

All errors extend `SimpleXRPLError`, so you can catch the base class or narrow to a specific type. Distinct failure modes are kept as distinct classes rather than flattened into one, and the underlying detail (HTTP status, engine result, response body) is preserved on the error rather than discarded.

| Error | Description |
| --- | --- |
| `SimpleXRPLError` | Base class for every SDK error. |
| `NoSignerError` | A write was attempted on a client with no signer configured. (An account the client doesn't know raises `AccountNotFoundError` instead.) |
| `SignerCapabilityError` | The resolved connector can't sign the requested transactor and the raw-signing fallback isn't available — see [Connector Routing](connectors/connector-routing.md). |
| `AccountNotFoundError` | The requested account is not registered on the client. Carries `account`. |
| `AmbiguousAccountError` | The same r-address was discovered under more than one connector at `init`. Drop one, or pass an explicit per-call `from`. Carries `account` and `custodians`. |
| `NetworkMismatchError` | The account exists at its connector, but only on XRPL network(s) other than the one the client is connected to. The SDK refuses to route the transaction rather than silently stranding it on the wrong network: point `xrpldUrl` at a matching node, or register the address on this network at the connector. Carries `account`, `clientNetworkId`, and `availableNetworkIds`. |
| `DuplicateSignerError` | Two signers target the same backend tenant (same kind and tenant id); rejected at `init`. Carries `kind` and `tenantId`. |
| `IntentValidationError` | Pre-flight validation failed — intent shape, amount precision, flag rules, or a connector dry-run rejection. Raised before anything is submitted. |
| `XrpldSubmitError` | A xrpld submission was rejected (an on-ledger engine failure). Carries `engineResult` and the full `raw` response. |
| `IntentPendingError` | Not a failure — a "still waiting" signal, raised when a connector intent hasn't reached a terminal state before the SDK's timeout. Carries `intentId`, `custodian`, and `lastState` so you can resume via [`client.intent`](intent-inspector.md). |
| `MultiStepFailureError` | A multi-step operation failed partway through. The SDK does **not** roll back: the already-committed steps are carried on `committed`, and the failing step on `failed`, so you can reconcile manually. |
| `CustodyAuthError` | Authenticating with Ripple Custody failed (challenge/JWT exchange or refresh). |
| `CustodyApiError` | A Ripple Custody API call returned an error. Carries `status`, the diagnostic `hint`, and the `raw` body. |
| `PalisadeAuthError` | Authenticating with Palisade failed — the OAuth2 client-credentials exchange or a refresh, or a `401` that survived one automatic refresh and replay. |
| `PalisadeApiError` | A Palisade API call returned an error. Carries `status`, the diagnostic `hint` (Palisade's `rpcStatus.message`), and the `raw` body. |
| `PalisadeRejectedError` | A Palisade transaction hit a terminal **governance-layer** failure — approval `REJECTED`, or Palisade marked it `FAILED` — before it ever reached the ledger. Distinct from `XrpldSubmitError` (an on-ledger engine failure) and `IntentPendingError` (still in flight): this transaction is dead and will not apply. Carries `transactionId`, `status`, `action`, and `attributes`. |
