# Vault Donations and Deposit Blocking

The [LendingProtocolV1_2 amendment][] gives vault owners two new ways to control the assets coming into a vault: donating assets without receiving shares, and blocking new deposits.

## Donations

A vault owner can _donate_ assets to their vault by setting the `tfVaultDonate` flag on a `VaultDeposit` transaction. A donation adds assets to the vault without minting any new shares, so the value of every existing share increases.

Donations are useful for:

- Recapitalizing a vault after a loss.
- Adding incentives or bonus yield for depositors.

Donations have the following rules:

- Only the vault owner can donate.
- The vault must have outstanding shares. You can't donate to an empty vault.
- Donations are allowed during every phase of a [closed-ended vault](../lending-protocol-v1-1/closed-ended-vaults.md), including the investment and redemption phases, when other deposits are blocked.
- A donation is the only kind of deposit allowed into an _insolvent_ vault, which has an `AssetsTotal` of `0` while shares are still outstanding. Other deposits into an insolvent vault fail with `tecLOCKED`.
- The vault's `AssetsMaximum`, along with the normal freeze, lock, and authorization checks, still apply.

## Deposit Blocking

A vault owner can pause new deposits into a vault without affecting withdrawals. This is useful when winding down or reviewing a vault's strategy.

Deposit blocking is an opt-in capability that's set when the vault is created:

1. Set the `tfVaultOwnerCanBlockDeposit` flag on the `VaultCreate` transaction. This sets the `lsfVaultOwnerCanBlockDeposit` flag on the vault, which can't be added or removed later.
2. To block deposits, send a `VaultSet` transaction with the `tfVaultDepositBlock` flag. This sets the vault's `lsfVaultDepositBlocked` flag.
3. To unblock deposits, send a `VaultSet` transaction with the `tfVaultDepositUnblock` flag.

While deposits are blocked, every `VaultDeposit` fails with `tecLOCKED`, including deposits and donations from the vault owner. `VaultWithdraw` and `VaultClawback` aren't affected, so depositors can always redeem their shares.

{% admonition type="info" name="Note" %}
Since `lsfVaultOwnerCanBlockDeposit` is visible on the vault, depositors can check whether the owner can block deposits before they deposit. Existing vaults can't gain this capability.
{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
