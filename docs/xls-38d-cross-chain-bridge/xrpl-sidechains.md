---
html: xrpl-sidechains.html
parent: xrpl-interoperability.html
blurb: An XRPL sidechain is an independent ledger with its own consensus algorithm, transaction types, and rules.
labels:
  - Blockchain
  - Interoperability
---
# XRPL Sidechains

<embed src="/snippets/_xchain-bridges-disclaimer.md" />

A sidechain is an independent ledger with its own consensus algorithm, transaction types, rules, and servers (including validators). It acts as its own blockchain, running parallel to a mainchain, enabling value to move between the two without compromising the speed, efficiency, and throughput of the mainchain. In the context of XLS-38d, a sidechain is the issuing chain, and the mainchain is the locking chain.

Sidechains can customize the XRP Ledger protocol to the needs of a specific use case or project and run it as its own blockchain. Here are a few examples:

* Build a smart contract layer, powered by an engine compatible with the Ethereum Virtual Machine (EVM), web assembly, or a Move VM. For example, a [smart sidechain with Hooks](https://hooks-testnet.xrpl-labs.com/) enabled.
* Build your own algorithmic stable coin with customised ledger types and transaction rules.
* Build permissioned or nearly permissionless, centralized or largely decentralized ledgers whose assets can be traded on the Mainnet [decentralized exchange](https://xrpl.org/decentralized-exchange.html).


## FAQ

- **Can I clone the rippled UNL to sync a sidechain server with?** No. Sidechains use their own validators and must use a separate UNL.

- **So, would mainchain validators need to vote on sidechain transactions?** No, servers on the mainchain have no knowledge of the sidechain. Door accounts on a mainchain are treated as standard multi-signature accounts.

- **Can I roll up transactions and have an entry on the mainchain?** Transactions on a sidechain aren't visible to servers on the mainchain. Only transactions submitted from the sidechain door account to a destination on the mainchain are visible and will have an entry on the mainchain.

- **When will sidechains be available?** Cross-chain bridges and sidechains have been proposed to the XRPL community with [XLS-38d](https://github.com/XRPLF/XRPL-Standards/discussions/92). You can test cross-chain bridge features on the [`sidechain devnet`](parallel-networks-list.md), using the public locking and issuing chains. You can also use the [`xbridge-cli`](https://github.com/XRPLF/xbridge-cli) tool to set up your own sidechain and witness servers to connect to the locking chain on `sidechain devnet`.