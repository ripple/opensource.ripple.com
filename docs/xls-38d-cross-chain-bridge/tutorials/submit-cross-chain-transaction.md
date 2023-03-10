### Prerequisites

Ensure that the following are set up and running before initiating cross-chain transactions. 

* The locking and issuing chains are both up and running.
* The witness server(s) are up and running.
* Set up a bridge between the two chains, including a _door account_ on each chain. On one chain, the asset is locked and unlocked, hence the name "locking chain", and on the other chain, assets are minted and burned, or issued and reclaimed, hence the name "issuing chain".
* Enable the `XChainBridge` amendment in the `rippled.cfg` configuration file on the locking chain and the issuing chain. 

Consider an example where Alice wants to send XRP from her account on the XRP Ledger Mainnet to her alt-Alice account on a sidechain. In this example. the XRP Ledger Mainnet is the locking chain and the sidechain is the issuing chain. 

For the sake of this example, let's assume that the following prerequisites have been met.

* The sidechain has been configured with validators and is up and running.
* A bridge that transfers XRP between the locking chain and the issuing chain has been set up with `XChainCreateBridge`.
* Witness servers are up and running.
* Alice has already run a `XChainAccountCreateCommit` transaction and has an account on the sidechain.

1. alt-Alice first checks out a claim ID with `XChainCreateClaimID` on the sidechain, specifying the above bridge. She retrieves the claim ID from the transaction metadata or the `XChainCreateClaimID` RPC call.

2. Alice then takes the cross-chain claim ID from alt-Alice’s `XChainCreateClaimID` transaction and submits a `XChainCommit` transaction on the XRP Ledger Mainnet with that claim ID, locking up a specified amount of XRP. She specifies alt-Alice’s account in the `OtherChainDestination` field.

3. The witnesses then take note of the `XChainCommit` transaction and submit `XChainAddClaimAttestation` transactions on the sidechain, attesting to the fact that the `XChainCommit` transaction did in fact occur on the Mainnet.

4. When there are enough `XChainAddClaimAttestation` signatures to reach quorum, the XRP is automatically released on the sidechain to alt-Alice’s account.

5. If the XRP is not automatically released, for whatever reason (such as Alice forgetting to specify alt-Alice’s account in the `OtherChainDestination` field), then alt-Alice submits a `XChainClaim` transaction on the sidechain, specifying her account as the destination. This then releases the XRP on the sidechain to alt-Alice’s account.