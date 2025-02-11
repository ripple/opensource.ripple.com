# Single Asset Vault

{% partial file="/docs/_snippets/_single-asset-vault-disclaimer.md" /%}

A Single Asset Vault aggregates assets from multiple depositors and makes them available to other on-chain protocols. Vault assets can be XRP, [Fungible Tokens](https://xrpl.org/docs/concepts/tokens/fungible-tokens), or [MPTs (Multi-Purpose Tokens)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens).

Depositors can add or withdraw assets and own shares that reflect their proportional ownership of the vault's assets. Vault shares are represented on-chain by MPTs.

The Single Asset Vault decouples liquidity management from protocol-specific logic, offering a flexible primitive for managing liquidity across various use cases, including:

- Lending markets
- Aggregators
- Yield-bearing tokens
- Asset management

## Vault Owner

A designated account called the **Vault Owner** creates and manages the vault, and handles its configuration, updates, and deletions.

A Vault Owner can configure shares as either **transferable** or **non-transferable** when creating the vault. Non-transferable shares cannot be transferred to another account and can only be redeemed.

{% admonition type="info" name="Note" %}
Currently, the same account that creates the vault must also create other protocols, though this may change in future.
{% /admonition %}

## Transactions

The Single Asset Vault adds new transaction types to the ledger.

**Vault Management**

- `VaultCreate`: Creates a new vault object.
- `VaultSet`: Updates an existing vault object.
- `VaultDelete`: Deletes an existing vault object.

**Asset Management**

- `VaultDeposit`: Deposits a specified number of assets into the vault in exchange for shares.
- `VaultWithdraw`: Withdraws a specified number of assets from the vault in exchange for shares.

**Compliance**

- `VaultClawback`: Allows the issuer of an IOU or MPT to [claw back](https://xrpl.org/docs/use-cases/tokenization/stablecoin-issuer#clawback) funds from the vault.

The Vault object is managed with `VaultCreate`, `VaultSet`, and `VaultDelete` transactions.
Depositors call the `VaultDeposit` and `VaultWithdraw` transactions to add or remove assets from the tokenized vault.

The `VaultClawback` transaction performs a Clawback from the vault, exchanging the shares of an account. It allows the issuer of an IOU or MPT to [claw back](https://xrpl.org/docs/use-cases/tokenization/stablecoin-issuer#clawback) funds from the vault.

While Single Asset Vault does not introduce new payment transaction fields, it does, however add new [payment failure conditions]() and [state changes]() when transferring vault shares.

## Public vs. Private Vaults

Vaults can be either **public** or **private**, depending on the level of access control required:

- **Public Vault**: In a public vault, depositors can deposit or redeem liquidity as long as they hold sufficient shares.
- **Private Vault**: A private vault restricts access. Only entities with the proper on-chain [Credentials](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0070-credentials), managed through [Permissioned Domains](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0080-permissioned-domains), can interact with the vault. This ensures only authorized depositors can deposit or redeem assets.

To protect depositor funds, shareholders can withdraw assets from the vault, preventing the Vault Owner from locking away funds or misusing the vault. However, the Vault Owner can still deposit and withdraw assets, regardless of the restrictions within the Permissioned Domain.

## Share Distribution and Redemption

A share is represented by an MPT on-chain, which is issued by the vault.

In a private vault, depositors can transfer shares and use them in other DeFi protocols if the receiving account has authorization to hold them.

Depending on the connected protocol, a vault’s shares may be yield-bearing, allowing holders to withdraw more or less liquidity than they originally deposited.

### Exchange Algorithm

The **Exchange Algorithm** defines how assets are converted into shares and shares into assets. This logic is applied during deposit or redemption transactions.

#### Paper Loss (Unrealized Loss)

To prevent depositors from exploiting potential losses by redeeming shares early and shifting the full loss onto the remaining depositors, the vault introduces the concept of **paper loss**, tracked by the `LossUnrealized` attribute.

The paper loss reflects a potential reduction in the vault’s value due to unrealized losses in its assets, temporarily lowering the vault’s value and adjusting the exchange rate accordingly.

Only a protocol connected to the vault can modify the `LossUnrealized` attribute.

#### Exchange Rates

When the vault experiences a paper loss, the exchange rate temporarily drops to reflect the lower value of the vault’s assets. Without separate rates for deposits and withdrawals, depositors could exploit the situation by depositing at the lower exchange rate and withdrawing at a higher rate once the loss clears.

To prevent this, the vault uses **two distinct exchange rates**:

- **Deposit Exchange Rate**: When assets are deposited, the number of shares a depositor receives is calculated based on the vault’s total assets and shares, adjusted for any unrealized losses.
- **Withdrawal Exchange Rate**: When shares are redeemed, the amount of assets returned is calculated, accounting for unrealized losses to prevent manipulation.

These two exchange rates ensure fairness and prevent manipulation, reflecting the true value of the vault’s assets during both deposits and withdrawals.

## Frozen Assets

The issuer of the vault's asset may enact a freeze either through a [Global Freeze](https://xrpl.org/docs/tutorials/how-tos/use-tokens/enact-global-freeze#enact-global-freeze) for IOUs or by locking MPTs. When a vault's asset is frozen, it can only be withdrawn by specifying the destination account as the issuer of the asset. Similarly, a frozen asset may not be deposited into a vault. Furthermore, when the asset of a vault is frozen, the shares corresponding to the asset may not be transferred.

## Can a Depositor Transfer Shares to Another Account?

Vault shares are a first-class asset, meaning that they can be transferred and used in other on-ledger protocols that support MPTs. However, the payee (or the receiver) must have permission to hold both the shares and the underlying asset.

For example, if a private vault holds USDC, the destination account must belong to the vault’s Permissioned Domain and have permission to hold USDC. Any compliance mechanisms applied to USDC also apply to the shares. If the USDC issuer freezes the payee’s trustline, the payee cannot receive shares representing USDC.

## Transfer Fees

A Single Asset Vault does not apply the [Transfer Fee](https://xrpl.org/docs/concepts/tokens/transfer-fees) to `VaultDeposit` and `VaultWithdraw` transactions. Additionally, whenever a protocol moves assets from or to a vault, the Transfer Fee must not be charged.

<!-- Move this or merge this with another paragraph. -->
## Connecting to the Vault

A protocol connecting to a Single Asset Vault must track its debt. Furthermore, updates to the vault's state when funds are removed or added back must be handled in the transactors of the protocol.

<!-- ## Payment Failure Conditions -->

<!-- ### Payment State Changes -->
