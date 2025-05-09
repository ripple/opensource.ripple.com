# Permissioned DEXes

Permissioned DEXes are controlled environments for trading within the XRP Ledger's [decentralized exchange (DEX)](https://xrpl.org/docs/concepts/tokens/decentralized-exchange). Trading in a permissioned DEX works like trading in the open DEX, except that a [_permissioned domain_](../xls-80d-permissioned-domains/index.page.tsx) controls who can place and accept offers. By relying on permissioned DEXes, regulated businesses can participate in trading on the XRP Ledger while ensuring that all the counterparties they deal with have been properly vetted.

There can be multiple permissioned DEXes within the XRP Ledger blockchain. Each one is uniquely associated with a permissioned domain, which acts as an allow-list for accessing that DEX. Trades placed within a permissioned DEX can only execute against other trades in the same permissioned DEX. Each permissioned DEX can have order books for any number of currency pairs, as needed.


## Background

The XRP Ledger has had a single, _open DEX_ since it launched. Literally anyone with an XRP Ledger account can trade in this DEX, and the system automatically executes matching orders, also called offers, with no regard for who placed them. Orders also provide liquidity to cross-currency payments, which can potentially execute several trades as part of one atomic transaction. Since the system inherently knows nothing about the people and organizations behind the accounts, there is no hard certainty of who the counterparties are for any given trade. However, economic sanctions and financial regulations often place strict rules against transacting with criminals, terrorists, or specific countries. Given these limitations, regulated financial institution may not be willing to take the risk of trading in the open DEX.

More background reading:

- [Decentralized Exchange](https://xrpl.org/docs/concepts/tokens/decentralized-exchange)
- [Offers](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/offers)
- [Permissioned Domains](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains)


## Roles

To use a permissioned DEX, parties with the following roles and responsibilities need to exist:

- At least two traders to place matching offers. For example, one selling USD for XRP and one selling XRP for USD.
- A permissioned domain owner, who controls which credentials give access to the domain.
- A credential issuer, who issues credentials to accounts they approve.

It is possible for a single account to play more than one of these roles. For example, you could be the permissioned domain owner, credential issuer, _and_ a trader all at once. The only restriction is that the traders must be different accounts.

{% inline-svg file="./permissioned-dex-roles.svg" /%}

_Figure: A permissioned order book, linked to a permissioned domain. Owen is both the domain owner and the issuer of one of the domain's accepted credentials. Tracy is able to trade in the permissioned order book because she holds an appropriate credential issued by Owen._


## Structure

With the permissioned DEXes feature, a trade offer can be either _permissioned_ or _open_. An open offer uses the open DEX and can be matched by anyone else's open offer, by an [Automated Market Maker (AMM)](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/automated-market-makers), or a combination of offers and an AMM. _Open offers_ are unchanged from how the XRPL's DEX works without permissioned DEXes.

A permissioned offer specifies a domain ID, and is only valid if a permissioned domain with the matching ID exists and the account placing the offer has access to that domain because they hold the correct credentials. Permissioned offers are placed into an order book for the given domain and currency pair, separate from the open DEX's order book for that currency pair. Permissioned offers can only execute by matching other permissioned offers that specify the same domain ID. [Cross-currency payments](https://xrpl.org/docs/concepts/payment-types/cross-currency-payments) can also specify a domain ID, in which case they are restricted to only consuming offers from the corresponding permissioned DEX. Trades in a permissioned DEX can still use [auto-bridging](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/autobridging) as long as the necessary orders all exist in the same permissioned DEX.

There is no single ledger entry to represent a given permissioned DEX: it implicitly exists as the set of order books with the same domain ID. Order books with a given domain ID are implicitly created when valid offers are placed using that domain ID, and those order books are automatically deleted when they are empty. Transactions can use multiple order books with the same domain ID—in other words, different currency pairs in the same permissioned DEX—either as part of a longer cross-currency payment or through .

The amount of liquidity and the best exchange rate available in any given DEX may vary depending on the offers placed in that DEX. Some traders may choose to trade in multiple permissioned DEXes and the open DEX to arbitrage price differences, while other traders may trade strictly in one domain, depending on their compliance requirements.

{% inline-svg file="./permissioned-dex-structure.svg" /%}

_Figure: The open DEX, and two different permissioned DEXes, each containing order books for a subset of possible currency pairs._

### Invalid Permissioned Offers

In addition to the ways offers can be unfunded in the open DEX, offers in a permissioned DEX can become _invalid_. Invalid offers are treated the same way as unfunded offers, and are automatically removed whenever a transaction modifies the order book containing them. They can remain in the ledger data indefinitely until a transaction removes them, but they cannot be executed if they are invalid. Reasons that a permissioned offer can become invalid include:

- A credential, held by the account placing the offer, has expired or has been deleted.
- The permissioned domain has been updated to change the set of credentials that grant access, and the account placing the offer does not hold any of the new credentials.
- The permissioned domain has been deleted.

Like with unfunded offers, it is possible for an offer to become temporarily invalid, then become valid again. For example, if a trader's credential that grants access to a permissioned domain expires, their offers in the corresponding permissioned DEX would be invalid; but if they get the credential renewed, any offers that hadn't already been removed automatically become valid again.

### Limitations

The permissioned DEXes feature is enabled by the **PermissionedDEX** amendment, and relies on the [Credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials) and [Permissioned Domains](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains) amendments, so it cannot be used until _all_ of those amendments have been enabled.

Permissioned DEXes are incompatible with Automated Market Makers (AMMs): Permissioned offers and permissioned payments cannot be filled by AMMs, and access to AMMs cannot be restricted by a permissioned domain.

Each permissioned DEX is completely separate, with its own order books and offers. A single transaction cannot trade in multiple different permissioned DEXes or aggregate liquidity from multiple DEXes. A single transaction also cannot use a mix of permissioned DEXes and the open DEX.

The security and fairness of a permissioned DEX depend on the owner of the permissioned domain and the issuers of credentials that grant access to it. At a baseline, the definition of each credential and the requirements for getting that credential are defined and enforced by the credential issuer, so the existence of a permissioned domain does not inherently mean anything about who is able to use it in practice. A credential issuer can issue or revoke credentials at their discretion. If they are unreliable or compromised, so is any permissioned domain that accepts their credentials. Similarly, the domain owner can modify the domain's list of accepted credentials to grant or deny access to the domain arbitrarily, so if they are untrustworthy or compromised, the domain is as well.
