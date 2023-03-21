---
html: xrpl-sidechains.html
parent: xrpl-interoperability.html
blurb: An XRPL sidechain is an independent ledger with its own consensus algorithm, transaction types, and rules.
labels:
  - Blockchain
  - Interoperability
---
# XRPL Sidechains

An XRPL sidechain is an independent ledger with its own consensus algorithm, transaction types, rules, and servers (including validators). It acts as its own blockchain and enables value in the form of XRP and other tokens to move efficiently between it and an XRP Ledger _mainchain_ (usually Mainnet, but could be [Testnet or Devnet](https://xrpl.org/parallel-networks.html#parallel-networks) for testing). XRPL sidechains operate without compromising the speed, efficiency, and throughput of the public Mainnet.

Sidechains enable developers to launch new features and applications, using the foundation of XRP Ledger technology. Sidechains can customize the XRP Ledger protocol to the needs of a specific use case or project and run it as its own blockchain. Here are a few examples:

* Build a smart contract layer, powered by an engine compatible with the Ethereum Virtual Machine (EVM), web assembly, or a Move VM. For example, a [smart sidechain with Hooks](https://hooks-testnet.xrpl-labs.com/) enabled.
* Build your own algorithmic stable coin with customised ledger types and transaction rules.
* Build permissioned or nearly permissionless, centralized or largely decentralized ledgers whose assets can be traded on the Mainnet [decentralized exchange](https://xrpl.org/decentralized-exchange.html).


## FAQ

- _Can I clone the rippled UNL to sync my sidechain server with?_

    No. Sidechains use their own validators and must use a separate UNL.

- _So, would mainchain validators need to vote on sidechain transactions?_

    No, the servers on the mainchain have no knowledge of the sidechain. Mainchain servers treat door accounts for bridges as just another multi-signature account on the mainchain.

- _Can I roll up transactions and have an entry on the mainchain?_

    Transactions on a sidechain are not visible to the servers on the mainchain. Only transactions submitted from the sidechain door account to a destination on the mainchain are visible to the mainchain and will have an entry on the mainchain.