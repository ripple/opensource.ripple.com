---
seo:
    description: The Account vertical in simpleXRPL manages account creation, funding, settings, regular keys, and deposit preauthorization.
labels:
  - simpleXRPL
  - SDK
---

# Account

The `Account` vertical handles account creation, funding, and administration. (The class is named `AccountVertical` to avoid colliding with the [`Account`](../../types.md#account) record type — a [core type](../../types.md) used across the SDK; it is reached as `client.account`.)

| Method | Description |
| --- | --- |
| [create](create.md) | Generate a new keypair locally (no transaction). |
| [activate](activate.md) | Activate a created account with operator-funded XRP. |
| [fund](fund.md) | Fund a created account from a testnet/devnet faucet. |
| [set](set.md) | Update account settings and flags. |
| [setRegularKey](setRegularKey.md) | Set or remove the account's regular key. |
| [depositPreauth](depositPreauth.md) | Grant or revoke deposit preauthorization. |
| [retrieve](retrieve.md) | Read an account's on-chain state. |
| [listOffers](listOffers.md) | List the DEX offers placed by an account. |
