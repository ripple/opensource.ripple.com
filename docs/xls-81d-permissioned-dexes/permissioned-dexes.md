# Permissioned DEXes

Permissioned DEXes are controlled environments for trading within the XRP Ledger's decentralized exchange (DEX). Trading in a permissioned DEX works like trading in the open DEX, except that a [_permissioned domain_](../xls-80d-permissioned-domains/index.page.tsx) controls who can place and accept offers. By relying on permissioned DEXes, regulated businesses can participate in trading on the XRP Ledger while ensuring that all the counterparties they deal with have been properly vetted.

There can be multiple permissioned DEXes within the XRP Ledger blockchain. Each one is uniquely associated with a permissioned domain, which acts as an allow-list for accessing that DEX. Trades placed within a permissioned DEX can only execute against other trades in the same permissioned DEX. Each permissioned DEX can have order books for any number of currency pairs, as needed.

## Background

The XRP Ledger has had a single, _open DEX_ since it launched. Literally anyone with an XRP Ledger account can trade in this DEX, and the system automatically executes matching orders, also called offers, with no regard for who placed them. Since the system inherently knows nothing about the people and organizations behind the accounts, there is no hard certainty of who the counterparties are for any given trade. However, economic sanctions and financial regulations often place strict rules against transacting criminals, terrorists, or specific countries. Given these limitations, regulated financial institution may not be willing to take the risk of trading in the open DEX.

## Roles

To use a permissioned DEX, parties with the following roles and responsibilities need to exist:

- At least two traders to place matching offers. For example, one selling USD for XRP and one selling XRP for USD.
- A permissioned domain owner, who controls which credentials give access to the domain.
- A credential issuer, who issues credentials to accounts they approve.

It is possible for a single account to play more than one of these roles. For example, you could be the permissioned domain owner, credential issuer, _and_ a trader all at once. The only restriction is that the traders must be different accounts.

## Structure

With the permissioned DEXes feature, a trade offer can be either _permissioned_ or _open_. An open offer uses the open DEX and can be matched by anyone else's open offer or by an Automated Market Maker. This is unchanged from how the XRPL's DEX works without permissioned DEXes.

A permissioned offer specifies a domain ID, and is only valid if a permissioned domain with the matching ID exists and the account placing the offer has access to that domain because they hold the correct credentials. Permissioned offers are placed into a separate order book for the given domain and currency pair. Permissioned offers can only execute by matching other permissioned offers that specify the same domain ID. They cannot match offers from the open DEX or from different permissioned DEXes, and they cannot use Automated Market Makers.

There is no single ledger entry to represent a given permissioned DEX: it implicitly exists as the set of order books with the same domain ID. Order books with a given domain ID are implicitly created when valid offers are placed using that domain ID, and those order books are automatically deleted when they are empty.

The amount of liquidity and the best exchange rate available in any given DEX may vary depending on the offers placed in that DEX. Some traders may choose to trade in multiple permissioned DEXes and the open DEX to arbitrage price differences, while other traders may trade strictly in one domain, depending on their compliance requirements.

{% inline-svg file="./permissioned-dex.svg" /%}

_Figure: A permissioned DEX ecosystem with traders, domain owners, and credential issuers._

### Invalid Permissioned Offers

In addition to the ways offers can be unfunded in the open DEX, offers in a permissioned DEX can become _invalid_. Invalid offers are treated the same way as unfunded offers, and are automatically removed whenever a transaction modifies the order book containing them. They can remain in the ledger data indefinitely until a transaction removes them. Reasons that a permissioned offer can become invalid include:

- A credential, held by the account placing the offer, has expired or has been deleted.
- The permissioned domain has been updated to change the set of credentials that grant access, and the account placing the offer does not hold any of the new credentials.
- The permissioned domain has been deleted.

