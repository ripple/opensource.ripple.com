---
html: parallel-networks-list.html
parent: xrpl-interoperability.html
blurb: Available parallel networks.
labels:
  - Interoperability
---
# List of Parallel Networks

<embed src="/snippets/_xchain-bridges-disclaimer.md" />

This page lists the parallel networks available for testing interoperability features.

You can use the [XRP Ledger Custom Network Explorer](https://custom.xrpl.org/) to look up parallel network information, such as historical transactions, accounts, ledgers, fees, exchange rates, timestamps, sequence numbers, node uptime, IP addresses, topology, versions, and peers.

**Note:** If you need to monitor a network with custom transactions, or just want to run your own instance of the explorer, see the [README](https://github.com/ripple/explorer).


## XRPL Sidechains Devnet

- **Locking Chain:** sidechain-net1.devnet.rippletest.net
  - **Websocket:** wss://sidechain-net1.devnet.rippletest.net:51233
  - **JSON-RPC:** http://sidechain-net1.devnet.rippletest.net:51234
  - **Faucet:**
    ```curl
    curl -X POST https://http://sidechain-faucet.devnet.rippletest.net/accounts
    ```

- **Issuing Chain:** sidechain-net2.devnet.rippletest.net
  - **Websocket:** wss://sidechain-net2.devnet.rippletest.net:51233
  - **JSON-RPC**: http://sidechain-net2.devnet.rippletest.net:51234
