---
html: witness-server.html
parent: xrpl-interoperability.html
blurb: A witness server is a light-weight server that witnesses and signs transactions between the XRP Ledger and another chain. 
---
# Witness Server
[[Source]](https://github.com/seelabs/xbridge_witness "Source")

 _(Added by the in-development Sidechains feature)_ :not_enabled:

The _witness server_ is a light-weight server that is aware of the locking and issuing chains in a bridging solution between blockchains. The witness server witnesses and signs transactions between [a locking chain and an issuing chain](cross-chain-bridges.html) when assets are moved to designated addresses, thus enabling cross-chain transactions. 

The witness server is an independent server that has similar responsibilities as that of a validator server on the XRP Ledger's peer-to-peer network and helps avoid double-spend and collusion. 

The witness server serves as a neutral witness for transactions between a locking chain and an issuing chain. 
It listens to the door accounts on both sides of the bridge and signs attestations for cross-chain transfer transactions, essentially affirming that a transaction on the source account happened, so the value can be claimed on the destination account. They are essentially acting as an oracle, to “prove” that the value was locked/burned on the source account, which allows the recipient to then claim (via minting/ unlocking) the equivalent funds on the destination account.

The bridge between the locking chain and the issuing chain includes the following information in its configuration: 

* Witness servers that monitor transactions on the bridge. You can choose one or more witness servers. 
* Fee for witness servers for their service.
 
Anyone can run a witness server. However, the burden is on the participants of the issuing chain to evaluate the reliability of witness servers. 

Note that an issuing chain may choose to configure a bridge with only one witness server initially and run the witness server itself. This strategy may be helpful in the initial period when the issuing chain is yet to establish itself in the marketplace.


## Witness Server Configuration

The witness server takes a JSON configuration file, specified using the `--conf` command-line argument.


### Example Configuration JSON

```json
{
  "LockingChain": {
    "Endpoint": {
      "IP": "127.0.0.1",
      "Port": 6005
    },
    "TxnSubmit": {
      "ShouldSubmit": true,
      "SigningKeySeed": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "SigningKeyType": "ed25519",
      "SubmittingAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "RewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "IssuingChain": {
    "Endpoint": {
      "IP": "127.0.0.1",
      "Port": 6007
    },
    "TxnSubmit": {
      "ShouldSubmit": true,
      "SigningKeySeed": "shUe3eSgGK4e6xMFuCakZnxsMN1uk",
      "SigningKeyType": "ed25519",
      "SubmittingAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
    },
    "RewardAccount": "rpFp36UHW6FpEcZjZqq5jSJWY6UCj3k4Es"
  },
  "RPCEndpoint": {
    "IP": "127.0.0.1",
    "Port": 6010
  },
  "DBDir": "/var/lib/witness0/db",
  "LogFile": "/var/log/witness/witness0.log",
  "SigningKeySeed": "spkHEwDKeChm8PAFApLkF1E2sDs6t",
  "SigningKeyType": "ed25519",
  "XChainBridge": {
    "LockingChainDoor": "r3nCVTbZGGYoWvZ58BcxDmiMUU7ChMa1eC",
    "LockingChainIssue": {"currency": "XRP"},
    "IssuingChainDoor": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
    "IssuingChainIssue": {"currency": "XRP"}
  }
}
```


### Configuration Fields

| Field Name       | JSON Type      | Required? | Description |
|------------------|----------------|-----------|-------------|
| `IssuingChain`   | `object`       | Yes       | The parameters for interacting with the issuing chain. |
| `LockingChain`   | `object`       | Yes       | The parameters for interacting with the locking chain. |
| `RPCEndpoint`    | `object`       | Yes       | The endpoint for RPC requests to the witness server. |
| `LogFile`        | `string`       | Yes       | The location of the log file. | 
| `LogLevel`       | `string`       | Yes       | The level of logs to store in the log file. The options are ["All", "Trace", "Debug", "Info", "Warning", "Error", "Fatal", "Disabled","None"]. |
| `DBDir`          | `string`       | Yes       | The location of the directory where the databases are stored. |
| `SigningKeySeed` | `string`       | Yes       | The seed that the witness server should use to sign its attestations. |
| `SigningKeyType` | `string`       | Yes       | The algorithm used to encode the `SigningKeySeed`. The options are `secp256k1` and `ed25519`. |
| `XChainBridge`   | `XChainBridge` | Yes       | The bridge that the witness server is monitoring. |


#### IssuingChain and LockingChain Fields

| Field Name      | JSON Type | Required? | Description |
|-----------------|-----------|-----------|-------------|
| `Endpoint`      | `object`  | Yes       | The websocket endpoint of a `rippled` node synced with the locking chain. |
| `TxnSubmit`     | `object`  | Yes       | The parameters for transaction submission on the locking chain. |
| `RewardAccount` | `string`  | Yes       | The account that should receive the witness's share of the `SignatureReward` on the locking chain. |


#### Endpoint and RPCEndpoint Fields

| Field Name | JSON Type | Required? | Description |
|------------|-----------|-----------|-------------|
| `IP`       | `string`  | Yes       | The IP address of the rippled node. **Note:** This doesn't accept URLs |
| `Port`     | `string`  | Yes       | The port used for the websocket endpoint. |


#### TxnSubmit Fields

| Field Name          | JSON Type | Required? | Description |
|---------------------|-----------|-----------|-------------|
| `ShouldSubmit`      | `boolean` | Yes       | A boolean indicating whether or not the witness server should submit transactions on the locking chain. |
| `SigningKeySeed`    | `string`  | No        | The seed that the witness server should use to sign its transactions on the locking chain. This is required if `ShouldSubmit` is `true`. |
| `SigningKeyType`    | `string`  | No        | The algorithm used to encode the `SigningKeySeed`. The options are `secp256k1` and `ed25519`. This is required if `ShouldSubmit` is `true`. |
| `SubmittingAccount` | `string`  | No        | The account from which the `XChainAddClaimAttestation` and `XChainAddAccountCreateAttestation` transactions should be sent. This is required if `ShouldSubmit` is `true`. |


#### XChainBridge Fields

| Field               | JSON Type | [Internal Type][] | Required? | Description     |
|:--------------------|:----------|:------------------|:----------|:----------------|
| `IssuingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `IssuingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |
| `LockingChainDoor`  | `string`  | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `LockingChainIssue` | `Issue`   | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain. |
