---
blurb: A Single Asset Vault aggregates assets from multiple depositors and makes them available to other on-chain protocols.
labels:
  - Single Asset Vault 
status: not_enabled
---

# Single Asset Vault

A Single Asset Vault is an XRP Ledger primitive that aggregates assets from multiple depositors and makes them available to other on-chain protocols, such as the Lending Protocol (currently in development). A vault asset can be [XRP](https://xrpl.org/docs/introduction/what-is-xrp), a [Fungible Token](https://xrpl.org/docs/concepts/tokens/fungible-tokens), or an [MPT (Multi-Purpose Token)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens).

A Vault Owner account manages the vault and can create, update, or delete it as needed. When creating a vault, the Vault Owner can also specify whether shares are transferable or non-transferable. Non-transferable shares cannot be transferred to any other account, and can only be redeemed.

## Public vs. Private Vaults

A vault can be **public** or **private**, depending on the required level of access control.

In a public vault, anyone can deposit or redeem liquidity as long as they hold sufficient shares. In contrast, a private vault restricts access, allowing only depositors with the necessary [Credentials](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0070-credentials), managed through [Permissioned Domains](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0080-permissioned-domains), to deposit assets.

{% admonition type="warning" name="Warning" %}
If a depositor's credentials expire, they can no longer deposit assets in a private vault, but can always withdraw their existing shares.
{% /admonition %}

To prevent the Vault Owner from locking funds away, any shareholder in a private vault can withdraw assets.

Choosing between a public or private vault depends on your use case. For example, if depositor identity verification is required, use a private vault and issue credentials only to verified accounts.  

## Vault Share Distribution and Redemption

Depositors can deposit assets to receive shares, which represent their proportional ownership of the vault, or withdraw assets from the vault.

[{% inline-svg file="./single-asset-vault.svg" /%}](./single-asset-vault.svg "Diagram: an example of an asset being deposited into the vault.")

Since the XRP Ledger is an account-based blockchain, all assets must be held by an account. A `Vault` ledger entry cannot hold assets directly, so a [pseudo-account](https://github.com/XRPLF/XRPL-Standards/discussions/191) is created to hold assets on its behalf. This stand-alone account cannot receive funds or send transactions, and exists solely to store assets and issue shares.

Each share is represented on-chain as an MPT, issued by the vault's `pseudo-account`.

Depending on the connected protocol, vault shares may be yield-bearing, meaning shareholders could withdraw more or less liquidity than they originally deposited.

### Exchange Algorithm

A Single Asset Vault uses an **exchange algorithm** to define how assets convert into shares during deposits and how shares convert back into assets during withdrawals.

A vault’s total value can fluctuate due to factors like _unrealized losses_, which impact the exchange rate for deposits and withdrawals. To ensure fairness, the algorithm adjusts the exchange rate dynamically, so depositors receive or withdraw assets at a rate that accurately reflects the vault’s true value.

#### Unrealized Loss

To prevent depositors from exploiting potential losses, by redeeming shares early and shifting the full loss onto the remaining depositors, the vault tracks unrealized losses (or paper loss) using the `LossUnrealized` attribute in the `Vault` ledger entry.

Because the unrealized loss temporarily decreases the vault's value, a malicious depositor may take advantage of this to deposit assets at a lowered price and withdraw them once the price increases. To mitigate this, the vault uses separate exchange rates for deposits and withdrawals.

#### Exchange Rates

A Single Asset Vault uses **two distinct exchange rates**:  

- **Deposit Exchange Rate**: When a depositor adds assets to the vault, they receive shares based on the current exchange rate, which is calculated as the ratio of _total shares_ to _total assets_. This ensures that new deposits do not unfairly impact the value of existing shares.

- **Withdrawal Exchange Rate**: When assets are withdrawn or shares are redeemed, the vault ensures that unrealized losses are accounted for, so depositors cannot withdraw more than the vault’s true asset value.
  - **Redemptions**: If a depositor redeems a specific number of shares, the vault calculates the asset amount based on the ratio of _total assets_ to _total shares_, adjusted for unrealized losses.
  - **Withdrawals**: If a depositor requests a specific asset amount, the vault determines how many shares must be _burned_ to fulfill the request, ensuring that unrealized losses are accounted for in the calculation.

These exchange rates ensure fairness and prevent manipulation, maintaining the integrity of deposits and withdrawals.

### Can a Depositor Transfer Shares to Another Account?

Vault shares are a first-class asset, meaning that they can be transferred and used in other on-ledger protocols that support MPTs. However, the payee (or the receiver) must have permission to hold both the shares and the underlying asset.

For example, if a private vault holds USDC, the destination account must belong to the vault’s Permissioned Domain and have permission to hold USDC. Any compliance mechanisms applied to USDC also apply to the shares. If the USDC issuer freezes the payee’s trustline, the payee cannot receive shares representing USDC.

## Frozen Assets

The issuer of a vault asset can enact a freeze either through a [Global Freeze](https://xrpl.org/docs/tutorials/how-tos/use-tokens/enact-global-freeze#enact-global-freeze) for Fungible Tokens or by [locking MPTs](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0033d-multi-purpose-tokens#21122-flags). When a vault asset is frozen, withdrawals can only be made to the asset’s issuer. Furthermore, frozen asset cannot be deposited into the vault.

When the asset of a vault is frozen, its corresponding shares also cannot be transferred.

## Why Use a Single Asset Vault?

With a Single Asset Vault you don't have to manage liquidity at the protocol level. Instead, you can use the vault to handle deposits, withdrawals, and asset tracking separately.

Vaults handle asset-to-share conversion, ensure accurate pricing, and eliminate the need to add custom logic to calculate exchange rates or account for unrealized losses.

Depending on the connected on-chain protocol, vaults can be applied to various use cases, such as:

- Lending markets
- Aggregators
- Yield-bearing tokens
- Asset management
