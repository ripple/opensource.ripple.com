---
html: bridge-doors.html
blurb: The bridge door is a smart contract that has the logic to execute transactions introduced by XLS-38d. 
labels:
  - Interoperability
status: not_enabled
---
# Bridge Doors

{% partial file="/snippets/_evm-sidechain-disclaimer.md" /%}

Bridge doors on the XRPL EVM sidechain are _Solidity_ smart contracts that have the logic to execute all transactions introduced by XLS-38d.

The bridge doors don't hold any assets, instead sending them to a Gnosis Safe multisig account.

Bridge doors require permissions to execute safe transactions, unlocking assets when enough attestations are received for an event. As such, there is a close relationship between a bridge door and Gnosis Safe. If at any time the bridge governers want to pause or deactivate the bridge, they can disable the bridge's permissions to execute any more operations.

To learn more about available safety mechanisms, see: [Bridge Door Safety Mechanisms](bridge-door-safety-mechanisms.md).