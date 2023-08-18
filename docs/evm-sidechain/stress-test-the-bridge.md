---
html: stress-test-the-bridge.html
parent: evm-cli.html
blurb: Stress test the bridge.
labels:
  - Development, Interoperability
status: not_enabled
---
# Stress Test the Bridge

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

You can stress test account creations and claims.


## Create Account

```bash
evmcli bridge stress \
    --config ./usd-bridge.json \
    --parallel-creates 10 \
    --create-iterations 10 \
```

Each iteration will:

- Create a random account on the locking chain.
- Make an `XChainCreateAccountCommit` transaction on the issuing chain, using the previously created account.
- Wait for attestations to receive the funds on the locking chain.
- Repeat the process using the destination account as the origin account.


## Create Claims

```bash
evmcli bridge stress \
    --config ./usd-bridge.json \
    --parallel-claims 15 \
    --claim-iterations 5
```

Each iteration will:

- Make an `XChainCreateClaim` transaction on the locking chain.
- Make an `XChainCommit` transaction on the locking chain, using the previously created Claim ID.
- Wait for attestations to receive the funds on the locking chain.
- Repeat the process using the destination account as the origin account, and the origin account as the destination account.