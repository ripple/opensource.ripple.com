# XRPL Cross-Chain DApps FAQ

## What is an XRPL Cross-chain app?

An XRPL cross-chain application has an XRPL native component and a smart contract component on the XRPL EVM sidechain. These two components are connected by a bridge, using the Axelar network.


## Why should developers build cross-chain apps?

**For XRPL Developers**: XRPL developers can now add EVM smart contract functionality to their applications, bringing more programmability and flexibility. XRPL apps can access the EVM smart contract functionality, using a cross-chain smart contract call over the Axelar network.

**For EVM Developers**: EVM developers can now build applications using some of the XRPL's native primitives, such as payments, escrow, and the DEX. The XRPL also provides security for tokens and accounts on a tried-and-tested chain without risk to core components from smart contracts.

EVM developers don't need their entire application written as smart contracts. They can choose to use robust XRPL crypto primitives to make their application more secure and performant and use the EVM functionality where they need custom business logic. 

EVM developers also get a running start when working with the XRPL, as unlike a brand-new chain, it already has users, tokens, liquidity, tooling, etc.


## What use cases work best with cross-chain apps?

XRPL applications where the corresponding functionality doesn't exist natively on the XRPL.

Examples include:

- A lending protocol on the EVM sidechain accessed through an XRPL app.
- An options/derivatives protocol on the EVM sidechain accessed through an XRPL app.


## What use cases don’t work well with cross-chain apps?

Cross-chain apps require communication across a bridge run with the Axelar network. Applications that require the entire transaction to be atomic or have extremely low latency won’t work well with a cross-chain application. Cross-chain applications are also unsuitable if your application requires the computation result in the same block.


## What are the different components of a cross-chain app?

1. A cross-chain app as an XRPL component running on the XRPL (native XRPL app).
2. An EVM component running on the XRPL EVM sidechain (EVM smart contract).
3. The two components talk to each other using a cross-chain smart contract call using Axelar GMP.

Here is an example of a yield farming protocol as a cross-chain application:

A user has an account on the XRPL mainnet. The user deposits into the AMM pool on the mainnet and receives an LP token. The user then sends the LP token over the Axelar network to the EVM sidechain and deposits it into a Vault smart contract on the EVM sidechain. The Vault smart contract sends the LP2 token back through the Axelar bridge to the user to hold on the mainnet until they wish to withdraw from the vault.


## What is Axelar GMP?

See: [What Is General Message Passing and How Can It Change Web3?](https://www.axelar.network/blog/general-message-passing-and-how-can-it-change-web3)


## Can you explain the technical details of how a cross-chain transaction between the XRPL and the XRPL EVM sidechain works, using Axelar GMP functionality?

The XRPL EVM Sidechain chain smart contract must implement the `AxelarExecutable` interface for Axelar GMP.

The application initiates a cross-chain smart contract call using Axelar GMP. The app initiates a deposit payment transaction to the Axelar XRPL multi-sig account. The deposit Payment TX transfers XRP or some other token to the Axelar XRPL multi-sig account (if it's a GMP call with tokens), which acts as an escrow. The equivalent number of tokens are transferred when the destination contract is called.

The memo field of this transaction has metadata representing the destination chain smart contract address, and an ABI-encoded payload field which is both the smart contract function and parameters.

The steps involved in a cross-chain transaction are as follows:

1. This transaction needs to be confirmed on the XRPL by XRPL validators.
2. The relayer nodes for the Axelar network monitor transactions on the Axelar XRPL multi-sig account. Once they see a transaction with confirmed status, they notify the XRPL gateway contract on the Axelar network.
3. A poll is initiated on the XRPL’s Verifier contract on Axelar, and Axelar network validators vote on the validity of the message relayed.
4. The message is routed to the AxelarGateway on Axelar.
5. A GMP call is made to the ITSHub contract on Axelar, which executes another GMP call to the XRPL EVM Sidechain Gateway.
6. A new GMP call is sent to the XRPL EVM Sidechain Gateway contract on Axelar via the Router.
7. Relayers for the Axelar network monitor events on the XRPL EVM Sidechain Gateway. Once the relayer observes that a message was routed, the XRPL EVM Sidechain Multisig Prover is notified.
8. A signing session is initiated on the XRPL EVM Sidechain's Multisig Prover contract on Axelar, and Axelar validators sign the GMP call.
9. A relayer observes the signing session reaching quorum. It relays the GMP call and its corresponding signatures to the AxelarGateway contract on the XRPL EVM Sidechain, marking the call as approved.
10. A relayer calls the destination smart contract, executing the GMP call.

Additional Info:

- [General Message Passing](https://docs.axelar.dev/dev/general-message-passing/overview)
- [Call a Smart Contract Function](../axelar/call-a-smart-contract-function.md)


## What portion of the cross-chain app should developers deploy on the XRPL, and what should they deploy on the XRPL EVM sidechain?

The app's XRPL component should utilize the battle-tested primitives of the XRPL, which are known for their speed, security, and performance. These could include payment functionalities, access to the XRPL DEX, trust lines, escrow, etc. There is no need for customization here.

The EVM component should include any new functionality that doesn't exist on the XRPL today or requires custom business logic that isn't available on the XRPL. This functionality could consist of a DeFi app such as a lending protocol, options/derivatives protocol, or more complex business rules or logic flow.


## What other technical considerations are essential?

**Liquidity needs**: Developers need to understand their liquidity needs. Which DEX do they plan to use to execute a trade? The XRPL DEX is an excellent option for native XRPL apps. 

**Latency**: Any cross-chain transaction effectively requires a confirmation across three chains: the XRPL, Axelar, and the XRPL EVM sidechain. This confirmation time will introduce some latency for apps. The end-to-end latency for a cross-chain transaction could be more than one minute. 

**User experience**: An XRPL cross-chain app will have an XRPL-like user experience. Developers will build this application using XRPL SDKs, and the XRPL application will access EVM functionality in the background. The EVM sidechain acts as a backend computational layer. Developers should consider how they design the application's UX. 

**Prerequisites for your application**: Does your application need an on-chain Oracle? Does it need access to high-quality stablecoins? Which tokens do you need liquidity support for on the XRPL DEX? 


## What is the end-to-end latency of a cross-chain transaction?

From our current testing, an end-to-end transaction can take more than a minute. This time could be longer in a mainnet environment with many validators needing to reach consensus across all three chains—XRPL, Axelar, and the EVM sidechain.


## What is the best way to start building? What tools are available?

- A working XRPL testnet and Axelar Devnet integration can be found [here](../axelar/intro-to-axelar.md).
- Axelar documentation can be found [here](https://docs.axelar.dev/).
- Axelar SDK details can be found [here](https://www.npmjs.com/package/@axelar-network/axelarjs-sdk).
- XRPL Axelar integration details can be found [here](../axelar/call-a-smart-contract-function.md).
