---
html: bridges-intro.html
blurb: Introduction to bridges for the EVM compatible XRP Ledger Sidechain.
labels:
  - Interoperability
status: not_enabled
---
# Bridges

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

Bridges are mechanisms that connect two blockchains together, enabling interoperability between the two. This connection enables users to transfer data or digital assets across blockchains, expanding the functionality of decentralized applications and tokens.

Amendment draft XLS-38d introduces bridges to the XRP Ledger, while the EVM sidechain uses _Solidity_ smart contracts to implement the new transactions from XLS-38d.

To learn more about the specifics of the XRPL bridge implementation, see: [XLS-38d-XChainBridge](https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-38d-XChainBridge).


## Bridge Governance

XLS-38d uses an `XChainCreateBridge` transaction to create a bridge by designating door accounts to manage the transfer of assets between blockchains. Door accounts are managed by a list of signers, requiring a specific quorum to approve transactions.

These specialized door accounts don't exist natively on EVM compatible blockchains, so _Gnosis Safe_ is used as an alternate signer list system to manage bridge governance. Gnosis Safe uses smart contracts to manage multisig accounts; the smarts contracts are audited and used in other projects, such as Makr, ENS, and AAVE.

Before creating a bridge, you must create a Gnosis Safe account with a list of owners and a quorum threshold. You can then use the Gnosis account as a door account to manage assets, signers, and quorum.

**Notes:**
    - The EVM sidechain offers a custom implementation of the Gnosis Safe management service. See: [https://safe-evm-poa-sidechain.peersyst.tech/](https://safe-evm-poa-sidechain.peersyst.tech/)
    - You can learn more about Gnosis Safe from their public documents. See: [https://docs.safe.global/](https://docs.safe.global/)