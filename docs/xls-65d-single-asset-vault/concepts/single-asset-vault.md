---
seo:
  description: A single asset vault aggregates assets from multiple depositors and makes them available to other on-chain protocols.
labels:
  - Single Asset Vault 
status: not_enabled
---

# Single Asset Vault

A single asset vault is an XRP Ledger primitive that aggregates assets from multiple depositors and makes them available to other on-chain protocols, such as the Lending Protocol (currently in development). A vault asset can be [XRP](https://xrpl.org/docs/introduction/what-is-xrp), a [trust line token](https://xrpl.org/docs/concepts/tokens/fungible-tokens/trust-line-tokens), or an [MPT (Multi-Purpose Token)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens).

A Vault Owner account manages the vault and can create, update, or delete it as needed. When creating a vault, the Vault Owner can also specify whether shares are transferable or non-transferable. Non-transferable shares cannot be transferred to any other account, and can only be redeemed.

## Public vs. Private Vaults

A vault can be **public** or **private**, depending on the required level of access control.

In a public vault, anyone can deposit or redeem liquidity as long as they hold sufficient shares. In contrast, a private vault restricts access, allowing only depositors with the necessary [Credentials](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0070-credentials), managed through [Permissioned Domains](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0080-permissioned-domains), to deposit assets.

{% admonition type="warning" name="Warning" %}
If a depositor's credentials expire, they can no longer deposit assets in a private vault, but can always redeem their existing shares.
{% /admonition %}

To prevent the Vault Owner from locking funds away, any shareholder in a private vault can redeem their shares for assets.

Choosing between a public or private vault depends on your use case. For example, if depositor identity verification is required, use a private vault and issue credentials only to verified accounts.  

## Vault Share Distribution and Redemption

Depositors can deposit assets to receive shares, which represent their proportional ownership of the vault, or redeem shares for assets.

[{% inline-svg file="./single-asset-vault-img.svg" /%}](./single-asset-vault-img.svg "Diagram: an example of an asset being deposited into the vault and shares being redeemed.")

Since the XRP Ledger is an account-based blockchain, all assets must be held by an account. A `Vault` ledger entry cannot hold assets directly, so a [pseudo-account](pseudo-account.md) is created to hold assets on its behalf. This stand-alone account cannot receive funds or send transactions, and exists solely to store assets and issue shares.

Each share is represented on-chain as an MPT, issued by the vault's pseudo-account. Since MPTs can only exist as whole number units, the vault uses a `Scale` setting to convert fractional asset amounts into whole number shares.

The scale behavior varies based on the type of asset held by the vault:

- **XRP**: Uses a fixed scale that aligns with XRP's native structure, where one share represents one drop.
- **Trust Line Token**: Allows configurable precision (default preserves 6 decimal places).
- **MPT**: Uses a 1-to-1 relationship between MPT units and shares.

Depending on the connected protocol, vault shares may be yield-bearing, meaning shareholders could redeem shares for more or less liquidity than they originally deposited. This is because the total asset balance in the vault can grow or shrink over time, affecting the value of each share. However, the vault asset (e.g., USDC or XRP) does not generate yield on its own.

The value of each share depends on the total assets in the vault:

- If the vault earns yield over time, shares represent a larger claim, allowing depositors to redeem them for more assets.
- If the vault incurs losses, shares hold less value, resulting in lower redemptions.

A vault could generate yield through mechanisms like lending or staking, with yield paid in the same asset deposited. The specific logic for this depends on how the connected on-chain protocol generates yield. For example, if a vault is used by a lending protocol, it could earn yield from interest paid by borrowers.

### Exchange Algorithm

A single asset vault uses an **exchange algorithm** to define how assets convert into shares during deposits and how shares convert back into assets during redemptions.

A vault's total value can fluctuate due to factors like _unrealized losses_, which impact the exchange rate for deposits and redemptions. To ensure fairness, the algorithm adjusts the exchange rate dynamically, so depositors receive shares or redeem them for assets at a rate that accurately reflects the vault’s true value.

#### Unrealized Loss

To prevent depositors from exploiting potential losses by redeeming shares early and shifting the full loss onto the remaining depositors, the vault tracks unrealized losses (or paper loss) using the `LossUnrealized` attribute in the `Vault` ledger entry.

Because the unrealized loss temporarily decreases the vault's value, a malicious depositor may take advantage of this by depositing assets at a lowered price and redeeming shares once the price increases.

For example, consider a vault with a total value of $1.0m and total shares of 1.0m. Let's assume the unrealized loss for the vault is $900k:

1. The new exchange rate is calculated as:

    ```js
    // ExchangeRate = (AssetsTotal - LossUnrealized) / SharesTotal
    exchangeRate = (1,000,000 - 900,000) / 1,000,000
    ```

    The exchange rate value is now **0.1**.

2. After the unrealized loss is cleared, the new effective exchange rate would be:

    ```js
    // ExchangeRate = AssetsTotal / SharesTotal
    exchangeRate = 1,000,000 / 1,000,000
    ```

    The exchange rate is now **1.0**.

A depositor could deposit $100k assets at a 0.1 exchange rate and get 1.0m shares. Once the unrealized loss is cleared, their shares would be worth $1.0m.

To mitigate this, the vault uses separate exchange rates for deposits and redemptions.

#### Exchange Rates

A single asset vault uses **two distinct exchange rates**:

- **Deposit Exchange Rate**: When a depositor adds assets to the vault, they receive shares based on the current exchange rate. This ensures that new deposits do not unfairly impact the value of existing shares.

- **Withdrawal Exchange Rate**: When shares are redeemed, the vault ensures that unrealized losses are accounted for, so depositors cannot withdraw more than the vault’s true asset value.
  - **Redemptions**: The vault calculates the asset payout for a user burning a specific number of shares.
  - **Withdrawals**: The vault first calculates the required shares based on the vault's true value, then determines the final asset payout.

These exchange rates ensure fairness and prevent manipulation, maintaining the integrity of deposits and redemptions.

To understand how the exchange rates are applied, here are the key variables used in the calculations:

- `Γ_assets`: The total balance of assets held within the vault.
- `Γ_shares`: The total number of shares currently issued by the vault.
- `Δ_assets`: The amount of assets being deposited, withdrawn, or redeemed.
- `Δ_shares`: The number of shares being issued or burned.
- `l`: The vault's total unrealized loss.
- `σ`: The scaling factor (σ = 10<sup>Scale</sup>) used to convert fractional assets into whole number shares.

{% tabs %}
  {% tab label="Deposit" %}
    The vault computes the number of shares a depositor will receive as follows:

    - **Initial Deposit (Empty Vault)**: For the first deposit into an empty vault, shares are calculated using the scaling factor to properly represent fractional assets as whole numbers.

      ```js
      Δ_shares = Δ_assets * σ // σ = 10^Scale
      ```

    - **Subsequent Deposits**: For all other deposits, shares are calculated proportionally. The resulting share value is rounded **down** to the nearest whole number.

      ```js
      Δ_shares = (Δ_assets * Γ_shares) / Γ_assets
      ```
    Because the share amount is rounded down, the actual assets taken from the depositor are recalculated. This ensures the depositor isn't overcharged and that new shares are valued against the vault's true value, accounting for any unrealized loss:

    ```js
    Δ_assets = (Δ_shares * (Γ_assets - l)) / Γ_shares
    ```

    After a successful deposit, the _total assets_ and _total shares_ values are updated like so:

    ```js
    Γ_assets = Γ_assets + Δ_assets // New balance of assets in the vault.
    Γ_shares = Γ_shares + Δ_shares // New share balance in the vault.
    ```
  {% /tab %}

  {% tab label="Redeem" %}
  The vault computes the number of assets returned by burning shares as follows:

  ```js
  Δ_assets = (Δ_shares * (Γ_assets - l)) / Γ_shares
  ```

  After a successful redemption, the _total assets_ and _total shares_ values are updated like so:

  ```js
  Γ_assets = Γ_assets - Δ_assets // New balance of assets in the vault.
  Γ_shares = Γ_shares - Δ_shares // New share balance in the vault.
  ```

  {% /tab %}

  {% tab label="Withdraw" %}
  When a depositor requests a specific asset amount, the vault uses a two-step process to determine the final payout:

  1. The requested asset amount (`Δ_assets_requested`) is converted into shares.

      ```js
      Δ_shares = (Δ_assets_requested * Γ_shares) / (Γ_assets - l)
      ```

      The calculated share amount is rounded to the **nearest** whole number.

  2. The rounded number of shares is used to calculate the final asset payout (`Δ_assets_out`), using the same logic as a redemption.

      ```js
      Δ_assets_out = (Δ_shares * (Γ_assets - l)) / Γ_shares
      ```

  Due to rounding in step 1, the final payout may differ slightly from the requested amount.

  After a successful withdrawal, the _total asset_ and _total share_ values are updated like so:

  ```js
  Γ_assets = Γ_assets - Δ_assets_out // New balance of assets in the vault.
  Γ_shares = Γ_shares - Δ_shares     // New share balance in the vault.
  ```

  {% /tab %}
{% /tabs %}

### Can a Depositor Transfer Shares to Another Account?

Vault shares are a first-class asset, meaning that they can be transferred and used in other on-ledger protocols that support MPTs. However, the payee (or the receiver) must have permission to hold both the shares and the underlying asset.

For example, if a private vault holds USDC, the destination account must belong to the vault’s Permissioned Domain and have permission to hold USDC. Any compliance mechanisms applied to USDC also apply to the shares. If the USDC issuer freezes the payee’s trust line, the payee cannot receive shares representing USDC.

It is important to remember that a vault must be configured to allow share transfers, or this will not be possible.

A depositor can transfer vault shares to another account by making a [payment](https://xrpl.org/docs/references/protocol/transactions/types/payment) transaction. Nothing changes in the way the payment transaction is submitted for transferring vault shares. However, there are new failure scenarios to watch out for if the transaction fails:

- The trust line or MPT is frozen between the payer and the issuer.
- There is a global freeze or lock.
- The vault pseudo-account is frozen.
- The underlying asset is an MPT and is locked for the payer, destination, or vault pseudo-account.
- The underlying asset is a trust line token and the trust line is frozen between the issuer and the payer, destination, or vault pseudo-account.

If the transfer succeeds and the payee already holds vault shares, their balance increases. Otherwise, a new MPT entry is created for their account.

## Frozen Assets

When the asset of a vault is frozen, its corresponding shares also cannot be transferred.

The issuer of a vault asset can enact a [freeze](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes) for trust line tokens or [lock an MPT](https://xrpl.org/docs/concepts/tokens/fungible-tokens/deep-freeze#how-does-mpt-freeze/lock-behavior-differ-from-iou). When a vault asset is frozen:

1. Withdrawals can only be made to the asset’s issuer.
2. Frozen assets cannot be deposited into the vault.
3. Its corresponding shares also cannot be transferred.

## Why Use a Single Asset Vault?

With a single asset vault you don't have to manage liquidity at the protocol level. Instead, you can use the vault to handle deposits, redemptions, and asset tracking separately.

Vaults handle asset-to-share conversion, ensure accurate pricing, and eliminate the need to add custom logic to calculate exchange rates or account for unrealized losses.

Depending on the connected on-chain protocol, vaults can be applied to various use cases, such as:

- Lending markets
- Aggregators
- Yield-bearing tokens
- Asset management

The only supported use cases right now are _asset management_ and _lending markets_, with lending currently in development through the [XLS-66d: Lending Protocol](https://github.com/XRPLF/XRPL-Standards/discussions/190).

{% raw-partial file="/docs/_snippets/common-links.md" /%}
