---
html: xrpl-evm-sidechain-faq.html
parent: intro-to-evm-sidechain.html
blurb: Commonly asked legal questions to consider when running an EVM compatible sidechain.
labels:
  - Blockchain
---
# XRPL EVM Sidechain FAQ

### Why are Ripple and Peersyst building an EVM sidechain?

The XRPL natively lacks the full programmability option to add custom business logic. The only programmabilIty option XRPL has today is a “smart transactor” but it's very difficult to write one and any significant change that affects existing protocol needs to go through the amendment process to be approved by the XRPL community. The Hooks feature developed by XRPL Labs promises to bring native programmability to the XRPL. EVM compatible blockchains have “smart contract” functionality that enables developers to build and deploy new applications without a network vote.

EVM compatibility on different blockchains:

| Blockchain Ecosystem | EVM Compatibility Solution/Project |
|----------------------|------------------------------------|
| Ethereum             | Native                             |
| Solana               | Neon                               |
| Polkadot             | Moonbeam                           |
| Cosmos               | Evmos                              |
| Polygon              | zkEVM                              |
| BNB Chain            | BNB Smart Chain                    |
| Avalanche            | Avalance C-chain                   |
| **XRPL**             | **EVM Sidechain**                  |

An EVM sidechain will help the XRPL ecosystem attract EVM developers who can deploy their existing EVM applications on the EVM sidechain with minor modifications.


### What are the main benefits of the EVM sidechain?

The main benefits are:

- Faster time to launch by deploying applications as smart contracts.
- No amendment approval needed to launch applications.
- Make minor changes to existing smart contracts on other blockchains and launch them on the EVM sidechain.
- Grow the XRPL ecosystem by adding EVM ecosystem projects and developers.


### What are the main risks with the EVM sidechain?

With the XRPL, developers use existing primitives such as payments, DEX, escrow etc. which are secure and have a great track record. With EVM applications, the security is the responsibility of the smart contract developer. Smart contract bugs can get exploited and they have led to a loss of funds.


### What is the main use case for the EVM sidechain?

From an XRPL community perspective, the EVM sidechain enables EVM developers to launch their existing applications in the XRPL ecosystem. Developers can now write smart contracts and build applications, and not be constrained by the capabilities of XRPL smart transactors. XRPL developers can launch applications that previously required XRPL protocol change and an amendment proposal which is complex, resource intensive, and risky.


### How many EVM sidechains will there be? Can I set up my own?

There will be one public EVM sidechain supported by Ripple and Peersyst for the XRPL community. This EVM sidechain will have multiple validators run by XRPL community members. The software needed to run an EVM sidechain will be open source and any community member can use it to set up their own EVM sidechains, for permissioned use cases for example.


### What are any critical dependencies to the launch of the EVM sidechain?

The main dependency is that the amendment for cross-chain bridges (XLS-38d) proposal needs to be approved by the community and be live on the XRPL Mainnet. This is because the bridge between the XRPL and the EVM sidechain uses the XLS-38d bridge design.


### Who will run the XRPL - EVM sidechain bridge?

The bridge connecting the XRPL and the EVM sidechain will use the XLS-38d standard and will be operated by XRPL community members by running witness servers.


### What does success look like for the EVM sidechain after launch on XRPL Mainnet?

Long term, the EVM sidechain has a large and sustainable ecosystem of developers. The XRPL developer ecosystem has adopted the EVM sidechain as an extension of the XRPL and uses it as a testing ground before features are proposed on XRPL Mainnet or has deployed apps there that are not suitable for the XRPL Mainnet.


### Who is our target user for the EVM sidechain?

An EVM application developer who has experience writing Solidity applications and who is looking to monetize their applications on other EVM compatible blockchains outside of Ethereum. This developer isn’t happy about the high gas fees and low transaction speeds on Ethereum during peak usage.

Another segment of EVM developers is the EVM core developer that works on new protocol primitives on Ethereum or similar blockchains. They have less opportunities to contribute to Ethereum so the EVM sidechain provides them a blank slate to add new innovative capabilities.


### What consensus algorithm does the EVM sidechain use?

The EVM sidechain will use the Proof of Authority (PoA) consensus algorithm. A set of validators will confirm blocks on the EVM sidechain. New validators can join, or current validators can be updated or removed based on voting by the existing set of validators.


### Why should an EVM developer use the EVM sidechain of the XRPL as opposed to Ethereum or any other EVM compatible blockchain?

An EVM developer that builds on the EVM sidechain essentially gets a blank slate to start from. There will be considerable excitement to deploy the first apps that were successful on other EVM blockchains on the EVM sidechain. The EVM sidechain has a 3.5 second block time  which is much lower than the 12-15 seconds used on Ethereum. XRP is one of the most liquid cryptocurrencies, and developers can reach millions of XRP holders by launching dapps on the EVM sidechain where XRP is a native gas token.


### Are there any incentives for EVM sidechain validator nodes?

The EVM sidechain will not have any block rewards. The transaction fee for transactions confirmed on the EVM sidechain will be distributed to EVM sidechain validator nodes. This is unlike the XRPL where this transaction fee is burnt.


### What applications are recommended to be developed on XRPL vs EVM sidechain?

Developers are free to choose any blockchain they wish. The XRPL has a robust set of native primitives that are secure, performant and with low transaction cost. Developers can build using these primitives natively on the XRPL.

On the other hand, the XRPL has limited programmability options for developers to change business logic in the primitives that exist. The ability to readily deploy programmable applications, combined with ample XRP liquidity from XRPL Mainnet and 3.5 second block times, makes the EVM sidechain especially optimized for DeFi use cases.


### How does the EVM sidechain compare to Hooks and the Xahau sidechain?

We see Hooks and EVM sidechain as two complementary efforts to bring more programmability to the XRPL ecosystem. These target two different types of developers.

- **Native XRPL Developer:** A developer who wants to build new features or add new logic to XRPL protocol that is not currently available on XRPL Mainnet. They are interested in developing natively on the XRPL and the Hooks and Xahau Sidechain allows them to do that. If and when the Hooks feature is live on the XRPL Mainnet, they can use Hooks on the XRPL Mainnet.
- **EVM Developer:** A developer looking to build new applications or deploy their existing EVM applications on the EVM sidechain to leverage the benefits of the XRPL ecosystem. They don’t want to learn a new way to build applications on the XRPL. They like the programmability that the EVM provides and want to maximize their revenue opportunities by deploying their dapps on an EVM compatible blockchain.