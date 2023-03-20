---
html: cross-chain-bridges.html
parent: xrpl-interoperability.html
blurb: Cross-chain bridges for the XRP Ledger enable value in the form of XRP and other tokens (IOUs) to move efficiently between blockchains.
labels:
  - Blockchain
---
# Cross-Chain Bridges

<embed src="/snippets/_xchain-bridges-disclaimer.md" />

Cross-chain bridges for the XRP Ledger enable value in the form of XRP and other tokens (IOUs) to move efficiently between blockchains such as the XRP Ledger and its sidechains.

A locking chain is a blockchain that holds assets that are then put into trust when a bridge to an issuing chain is created.

An issuing chain is an independent ledger with its own consensus algorithm and transaction types and rules. It acts as its own blockchain.

Both the locking and issuing chains operate as parallel networks with independent nodes and validators. They rely on independent [witness servers](witness-server.md) to watch transactions between the two chains and attest that assets have moved into specifically designated accounts.


## Terminology

- **Bridge**: A method of moving assets/value from one blockchain to another.

- **Locking chain**: The chain on which the bridge locks and unlocks assets.

- **Issuing chain**: The chain on which the bridge mints and burns assets.

- **Witness**: Independent servers that are aware of the locking and issuing chains. See [witness servers](witness-server.md) for more information.

- **Cross-chain transfer**: A transfer of assets from one chain to another.

- **Source chain**: The chain that a cross-chain transfer begins from. The transfer is from the source chain and to the destination chain.

- **Destination chain**: The chain that a cross-chain transfer ends at. The transfer is from the source chain and to the destination chain.

- **Door account**: A special type of account that is used to move assets from one chain to another. The door account on a locking chain is used to put assets into trust, and the door account on an issuing chain used to issue wrapped assets. 

- **Cross-chain claim ID**: A special identifier used for cross-chain transfers. A cross-chain claim ID represents *one* cross-chain transfer of value.


## How Do Cross-Chain Transactions Work?
 
At a high-level, cross-chain transactions involve the following steps: 

1. Claim a cross-chain claim ID on the issuing chain.
2. Submit a commit transaction on the locking chain, attaching the claimed cross-chain claim ID and include a reward for the witness servers. This locks the asset on the locking chain.
3. Obtain the attestations from the witness servers that the transaction occurred on the issuing chain.
4. When there are enough signatures to reach quorum, the XRP is automatically released on the issuing chain to the destination account. In some cases, for example a trustline is not set up properly, or a deposit auth is set up, you need to submit a transaction claim for the transferred value on the issuing chain, attaching the attestation as proof that the value was indeed transferred.
5. The rewards are then distributed to the witness servers' accounts on the issuing chain.


## Test Cross-Chain Transactions


### Client Library Support (Beta)

- **JavaScript:** xrpl.js 2.7.0-beta.3
  - **Binary Codec:** ripple-binary-codec 1.5.0-beta.3
- **Python:** xrpl-py 1.8.0b2


### Sidechain-CLI

The [`xbridge-cli`](https://github.com/XRPLF/xbridge-cli) is a commandline tool that simplifies setting up a cross-chain bridge on your local machine.

Follow the [tutorial](https://github.com/XRPLF/xbridge-cli/blob/main/scripts/tutorial.sh) to walk through the steps of creating a bridge and completing your first cross-chain transaction.


## FAQ

- _Do sidechains use their own nodes and validators?_ Yes. Sidechains are independent ledgers with their own set of servers (nodes and validators).
- _Can I clone the rippled UNL to sync my sidechain server with?_ No. Sidechains use their own validators, and must use a separate UNL.
- _So, would mainchain validators need to vote on sidechain transactions?_ No, the servers on the mainchain have no knowledge of the sidechain. For servers on the mainchain, the door account is treated as a multi-signature account on the mainchain.
- _Can I roll up transactions and have an entry on the mainchain?_ Transactions on a sidechain are not visible to the servers on the mainchain. Only transactions submitted from the sidechain door account to a destination on the main chain are visible to the servers on the main chain and will have an entry on the mainchain.
- _When will cross-chain bridges be available?_ Cross-chain bridges has been proposed to the XRPL community with [XLS-38d](https://github.com/XRPLF/XRPL-Standards/discussions/92). You can test the feature on the [`sidechain devnet`](parallel-networks-list.md).


## See Also

- **Tutorials:**
  - [Set Up an XRP-XRP Bridge](tutorials/set-up-xrp-xrp-bridge.md)
  - [Set Up an IOU-IOU Bridge](tutorials/set-up-iou-iou-bridge.md)
  - [Submit Cross-chain Transactions](tutorials/submit-cross-chain-transaction.md)
