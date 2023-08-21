---
html: execute-bridge-operations.html
parent: evm-cli.html
blurb: Execute an operation on the bridge.
labels:
  - Development, Interoperability
status: not_enabled
---
# Execute Bridge Operations

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

This tutorial walks you through the process of creating a bridge account and transfering funds from the issuing chain to the locking chain.

## Create Bridge Account

This operation only works for XRP bridges and can only be done once per account. If the destination account already exists or has previously executed a create account operation, this transactions will fail and you'll lose the funds used to create it.

Before running this operation, you'll need:

- A config file exported by the `bridge create` command.
- A private key with enough funds on the issuing chain.
- The destination address to receive the funds.

Run this command to create the bridge account:

```bash
evmcli bridge transact create-account \
    --config ./usd-bridge.json \
    --origin evm \
    --origin-private-key 0x... \
    --destination rB2c... \
    --amount 100
```


## Bridge Claim

This operation transfers funds between accounts on separate chains.

Run this command:

```bash
evmcli bridge transact claim \
    --config ./usd-bridge.json \
    --origin evm \
    --origin-private-key 0x... \
    --destination-private-key s15b... \
    --amount 100
```

These commands create an:

- `XChainCreateClaim` transaction on the locking chain.
- `XChainCommit` transaction on the issuing chain.