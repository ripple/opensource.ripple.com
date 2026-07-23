---
seo:
    description: The connector routing table — per XRPL transactor and per custodian, whether an operation routes native, requires the raw-signing fallback, or is unavailable.
labels:
  - SDKs
---

# Connector Routing

[Source](https://github.com/ripple/simpleXRPL/blob/50619258cf753008e8a185eaeb3ceca489e5998a/docs/connector-routing.md)

How simpleXRPL dispatches each XRPL transactor per connector. Derived directly from each custodian's native-operation set and the transactors the verticals build, so it always matches the code.

{% admonition type="info" name="Note" %}
This page is generated from the SDK source by `scripts/gen-connector-routing.mjs` — do not edit by hand. Regenerate with `npm run docgen:routing`.
{% /admonition %}

## Transactor → connector path

The pipeline routes by transactor type: **Local** signs everything in-process; a custodian uses its **native** operation when the transactor is in its capability set, otherwise the **raw** sign-only fallback, otherwise the write is rejected.

| Transactor | Local | Ripple Custody | Palisade |
| --- | --- | --- | --- |
| `AccountSet` | signs locally | **native** | **native** |
| `Clawback` | signs locally | **native** | **native** |
| `CredentialAccept` | signs locally | raw fallback¹ | raw fallback¹ |
| `CredentialCreate` | signs locally | raw fallback¹ | raw fallback¹ |
| `CredentialDelete` | signs locally | raw fallback¹ | raw fallback¹ |
| `DepositPreauth` | signs locally | **native** | raw fallback¹ |
| `EscrowFinish` | signs locally | **native** | raw fallback¹ |
| `MPTokenAuthorize` | signs locally | **native** | raw fallback¹ |
| `MPTokenIssuanceCreate` | signs locally | **native** | raw fallback¹ |
| `MPTokenIssuanceDestroy` | signs locally | **native** | raw fallback¹ |
| `MPTokenIssuanceSet` | signs locally | **native** | raw fallback¹ |
| `OfferCancel` | signs locally | raw fallback¹ | **native** |
| `OfferCreate` | signs locally | **native** | **native** |
| `Payment` | signs locally | **native** | **native** |
| `PermissionedDomainDelete` | signs locally | raw fallback¹ | raw fallback¹ |
| `PermissionedDomainSet` | signs locally | raw fallback¹ | raw fallback¹ |
| `SetRegularKey` | signs locally | raw fallback¹ | raw fallback¹ |
| `TrustSet` | signs locally | **native** | **native** |

¹ **raw fallback** applies only when raw signing is enabled on that custodian (`allowRawSigning`). With raw signing disabled, a non-native transactor is rejected with `SignerCapabilityError` — use a Local account or a custodian that natively supports it. The raw path signs the encoded transaction and submits it through the shared XRPL connection.

## Vertical → transactors

Which XRPL transactors each vertical builds. Cross-reference with the table above to see how a given method routes on each connector.

| Vertical | Transactors emitted |
| --- | --- |
| `account` | `AccountSet`, `DepositPreauth`, `Payment`, `SetRegularKey` |
| `credential` | `CredentialAccept`, `CredentialCreate`, `CredentialDelete` |
| `domain` | `PermissionedDomainDelete`, `PermissionedDomainSet` |
| `iou` | `AccountSet`, `Clawback`, `OfferCancel`, `OfferCreate`, `Payment`, `TrustSet` |
| `token` | `MPTokenAuthorize`, `MPTokenIssuanceCreate`, `MPTokenIssuanceDestroy`, `MPTokenIssuanceSet`, `OfferCancel`, `OfferCreate`, `Payment` |
| `xrp` | `Payment` |

---

_Native-ops sets: `NATIVE_XRPL_TRANSACTORS` (Ripple Custody), `PALISADE_NATIVE_TRANSACTORS` (Palisade). Local signs all transactors._
