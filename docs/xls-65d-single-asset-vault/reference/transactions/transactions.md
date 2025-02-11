# Transactions

## Asset Management

Depositors call the `VaultDeposit` and `VaultWithdraw` transactions to add or remove assets from the tokenized vault.

### `VaultDeposit`

### `VaultWithdraw`

## Compliance

### `VaultClawback`

The `VaultClawback` transaction performs a [Clawback](https://xrpl.org/docs/use-cases/tokenization/stablecoin-issuer#clawback) from the vault, exchanging the shares of an account. Conceptually, the transaction performs `VaultWithdraw` on behalf of the holder, sending the funds to the Issuer account of the asset. In case there are insufficient funds for the entire amount, the transaction performs a partial Clawback, up to the `vault.AssetAvailable`.

A Clawback transaction must respect any future fees or penalties.

## Payment Transactions

### State Changes

If `MPTokenobject` for shares does not exist for the destination account, create one.

### Failure Conditions

If `Payment.Amount` is a `Vault` share AND:

- The Vault lsfVaultPrivate flag is set and the Payment.Destination account does not have credentials in the permissioned domain of the Vaults Share.
- The Vault tfVaultShareNonTransferable flag is set.
- The Vault.Asset is MPT:
  - MPTokenIssuance.lsfMPTCanTransfer is not set (the asset is not transferable).
  - MPTokenIssuance.lsfMPTLocked flag is set (the asset is globally locked).
  - MPToken(MPTokenIssuanceID, AccountID).lsfMPTLocked flag is set (the asset is locked for the payer).
  - MPToken(MPTokenIssuanceID, PseudoAccountID).lsfMPTLocked flag is set (the asset is locked for the pseudo-account).
  - MPToken(MPTokenIssuanceID, Destination).lsfMPTLocked flag is set (the asset is locked for the destination account).
- The Vault.Asset is an IOU:
  - The lsfGlobalFreeze flag is set on the issuing account (the asset is frozen).
  - The lsfHighFreeze or lsfLowFreeze flag is set on the RippleState object between the Asset Issuer and the payer account.
  - The lsfHighFreeze or lsfLowFreeze flag is set on the RippleState object between the Asset Issuer and the destination account.
  - The lsfHighFreeze or lsfLowFreeze flag is set on the RippleState object between the Asset Issuer and the pseudo-account.
