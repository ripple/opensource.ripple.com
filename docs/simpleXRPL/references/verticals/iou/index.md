---
seo:
    description: The IOU vertical in simpleXRPL issues and manages trust line-based issued currencies.
labels:
  - simpleXRPL
  - SDK
---

# IOU

The `IOU` vertical issues and manages trust line-based issued currencies. Each operation acts as the IOU's **issuer** — the account resolved from `from` (default: the primary signer's account) signs, and its address is the currency issuer. Callers name their own counterparty (`holder` / `destination`) per call.

| Method | Description |
| --- | --- |
| [issue](issue.md) | Bootstrap a new trust line-based IOU between two environment-sourced accounts. |
| [transfer](transfer.md) | Send IOU value to a destination account. |
| [authorize](authorize.md) | Authorize a holder to hold this IOU. |
| [lock](lock.md) | Freeze a holder's trust line (individual + deep freeze). |
| [unlock](unlock.md) | Restore a frozen holder's trust line. |
| [clawback](clawback.md) | Reclaim a holder's balance back to the issuer. |
| [buyOffer](buyOffer.md) | Place a DEX order to acquire this IOU. |
| [sellOffer](sellOffer.md) | Place a DEX order to sell this IOU. |
| [cancelOffer](cancelOffer.md) | Cancel a standing offer. |
| [retrieve](retrieve.md) | Read a single IOU trust line. |
| [list](list.md) | List an account's IOU trust lines. |
| [listOffers](listOffers.md) | List all open offers in the market for an IOU. |
