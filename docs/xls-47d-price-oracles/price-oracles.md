---
html: price-oracles.html
parent:
blurb: Oracles enable the integration of external data into a blockchain network.
labels:
  - Blockchain
---
# Price Oracles

<embed src="/snippets/_price-oracles-disclaimer.md" />

Blockchains can't inherintly interact with and "know" what's happening off the network, but many of its use cases in decentralized finance require this information.

Price oracles solve this problem. An oracle is a service or technology that gathers real-world information, such as market prices, exchange rates, or interest rates, and relays it to the blockchain.

**Note:** Oracles aren't limited to only providing financial information. It can provide anything, such as what sports team won a game, or even the weather. Price oracles on the XRP Ledger currencly focus on pricing assets.


## How It Works

Most oracle blockchain interactions work like this:

1. An oracle fetches data.
2. The data is sent to the blockchain.
3. The blockchain uses that information to execute a smart contract, such as releasing funds from an escrow.

This process can also work in reverse, pushing transaction information to external systems.


## Price Oracles on the XRP Ledger

XLS-47d implements a native, on-chain price oracle, enhancing the native DeFi functionality of the XRP Ledger. Rather than querying off-chain oracles for the prices of assets, a single on-chain oracle does this work and aggregates the data. Native DeFi protocols and dApps can then query the on-chain oracle for prices.

By standardizing price feeds in this manner, all XRPL apps can access a dependable, shared data source.