---
seo:
    description: The Token vertical in simpleXRPL issues and manages Multi-Purpose Tokens (MPTs).
labels:
  - simpleXRPL
  - SDK
---

# Token

The `Token` vertical issues and manages [Multi-Purpose Tokens (MPTs)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens).

| Method | Description |
| --- | --- |
| [issue](issue.md) | Create a new MPT issuance. |
| [transfer](transfer.md) | Send MPT units to another account. |
| [authorize](authorize.md) | Opt the calling account in to holding a token. |
| [unauthorize](unauthorize.md) | Opt the calling account out of holding a token. |
| [grantHolder](grantHolder.md) | Issuer authorizes a specific holder (allow-listing). |
| [revokeHolder](revokeHolder.md) | Issuer revokes a specific holder's permission. |
| [lock](lock.md) | Lock a token issuance, or a specific holder's balance. |
| [unlock](unlock.md) | Unlock a token issuance, or a specific holder's balance. |
| [clawback](clawback.md) | Reclaim a holder's MPT balance back to the issuer. |
| [destroy](destroy.md) | Destroy an MPT issuance. |
| [retrieve](retrieve.md) | Read a single MPT issuance by id. |
| [list](list.md) | List the MPTs an account holds or issued. |

{% admonition type="info" name="Note" %}
The `Token` vertical places no DEX offers. MPTs are not yet tradeable on the XRPL DEX, so all offers go through the [XRP](../xrp/index.md) and [IOU](../iou/index.md) verticals.
{% /admonition %}
