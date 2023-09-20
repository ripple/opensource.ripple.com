---
html: witness-servers.html
blurb: Witness servers listen for bridge transactions and provide attestations.
labels:
  - Interoperability
status: not_enabled
---
# Witness Servers

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

A witness server enables bridge operators to listen for transactions on the connected chains and sign attestations. _Attestations_ are used as proof that events on a chain occurred.

Running a witness server requires you to:

1. [Create a bridge door account](deploy-a-bridge.md) and be one of its witnesses or signer owners.
2. [Create a witness server YAML config file](witness-server-configuration.md).
3. [Build and run the witness server](build-and-run-witness-servers.md).