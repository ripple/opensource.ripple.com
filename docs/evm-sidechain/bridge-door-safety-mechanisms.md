---
html: bridge-door-safety-mechanisms.html
blurb: Learn more about the safety mechanisms to mitigate risks on a bridge.
labels:
  - Interoperability
status: not_enabled
---
# Bridge Door Safety Mechanisms

{% partial file="/snippets/_evm-sidechain-disclaimer.md" /%}

This page describes the options you have to mitigate any risks that may occur during the life of a bridge. None of these mechanisms can be activated by a single witness; only transactions executed from the Gnosis Safe can activate them.


## Disable Module

This option deactivates the permissions for a bridge door to transfer safe assets. This transaction is native and included in the Gnosis Safe specification. When the call to the disable module contract is executed, the bridge is disabled and won't be able to transfer any assets from the safe.

To learn how to disable gnosis modules, see: [Protocol Kit](https://docs.safe.global/reference/protocol-kit).


## Pause Bridge Door

This option pauses the smart contract, blocking any calls to the contract until it's unpaused. See: [Bridge Door Interface](bridge-door-interface.md#pause)

This mechanism is implemented with the _OpenZeppelin Pausable_ standard. To learn more about the standard, see: [Lifecylce](https://docs.openzeppelin.com/contracts/2.x/api/lifecycle).


## Execute Transaction

This option executes a _call_ or _delegatecall_ from the bridge door itself. This is useful in cases where funds are blocked or the bridge door needs to be modified.

```solidity
function execute(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation
    ) public onlyOwner returns (bool success) {
        uint256 txGas = type(uint256).max;
        if (operation == Enum.Operation.DelegateCall) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                success := delegatecall(txGas, to, add(data, 0x20), mload(data), 0, 0)
            }
        } else {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                success := call(txGas, to, value, add(data, 0x20), mload(data), 0, 0)
            }
        }
    }
```