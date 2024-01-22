---
html: multi-purpose-tokens.html
parent: tokens.html
blurb: Multi-purpose tokens offer a more compact, flexible token type than trust lines.
labels:
  - Tokens
status: not_enabled
---
# Multi-purpose Tokens

Multi-purpose tokens (MPTs) are a more compact and flexible type of fungible token.

Unlike trust lines, MPTs do not represent bidirectional debt relationships. Instead, MPTs function more like a unidirectional trust line with only one balance. This reduces the overhead to support common tokenization requirements, including non-monetery use cases such as tracking reputation points in an online game.

## Advantages of MPTs

MPTs offer a less complicated conceptual model than trust lines. 

MPTs require significantly less space than trust lines. They require roughly 52 bytes for each MPT held by a token holder, compared to at least 234 bytes for every new trust line.

They reduce the long-term infrastructure and storage burdens for node operators, increasing network resiliency.

MPTs also improve node perfomance when processing large volumes of transactions.

MPTs are unidirectional. While trust lines use "balance netting," MPTs have only a single balance.

An account can issue a maximum of 32 number of unique MPT issuances. If an issuer wants to support more than this number of MPTs, they can open additional accounts.

Since token holders will not acquire an MPT without first making an off-ledger trust decision, MPTs have no trust limits. For example, a common use case for an MPT is a fiat-backed stablecoin, where a token holder wouldn't purchase more stablecoins than they would feel comfortable holding.

Unlike some existing capabilities of the ledger, MPTs are not subject to rippling, and  do not require configurability settings related to that functionality.
