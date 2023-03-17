### XChainBridge Fields

| Field               | JSON Type | Internal Type     | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain. |


### XCHAIN_BRIDGE Field Type

`XCHAIN_BRIDGE` is a new field type introduced by XLS-38d.

| Type Name       | Type Code | Bit Length | Length-prefixed? | Description |
|-----------------|-----------|------------|------------------|-------------|
| `XCHAIN_BRIDGE` | 25        | Variable   | No               | A bridge between two blockchains, identified by the door accounts and issued assets on the locking chain and issuing chain. `XCHAIN_BRIDGE` is serialized in this order: locking chain door, locking chain issue, issuing chain door, issuing chain issue.