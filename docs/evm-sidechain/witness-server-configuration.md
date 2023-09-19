---
html: witness-server-configuration.html
blurb: Witness servers use a YAML config file.
labels:
  - Interoperability
status: not_enabled
---
# Witness Server Configuration

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

Before running a witness server, you must create a YAML configuration file. Some fields can be configured through environment variables; in the case of conficts, the environment variable is used instead of the YAML key.


| Key | Description | Example | ENV Key |
|-----|-------------|---------|---------|
| server | All the server generic configuration. | | |
| server.queue_period | The amount of seconds to wait before fetching for new events. | `5` | SERVER_QUEUE_PERIOD |
| server.logging_level | The log level of the server. Can be: `debug`, `info`, `warn`, or `error`. | `info` | SERVER_LOGGING_LEVEL |
| server.log_file_path | The file path to store the server logs. | `./logs/log.txt` | SERVER_LOG_FILE_PATH |
| server.validate_bridge | If the server must run a config validation before starting. | `true` | SERVER_VALIDATE_BRIDGE |
| xrp | XRPL side related configuration. | | |
| xrp.node | XRPL node to connect with. | `"wss://sidechain-net1.devnet.rippletest.net"` | XRP_NODE |
| xrp.bridge_address | The address of the bridge on the XRPL side. | `"rs99jCuSAjrXzdebKm1AgpErz9M2FwHQCE"` | XRP_BRIDGE_ADDRESS |
| xrp.starting_block | The block that the server will start listening for attestations. If not declared, server will start listening on the latest block. | `1` | XRP_STARTING_BLOCK |
| xrp.signer_list_seconds | The amount that pass before checking if the witness server is in the signer list. | `300` | XRP_SIGNER_LIST_SECONDS |
| xrp.signer | XRPL signer related configuration. | | |
| evm | EVM related configuration. | | |
| evm.node | EVM node to connect with. | `"https://rpc-evm-sidechain.xrpl.org"` | EVM_NODE |
| evm.bridge_address | The address of the bridge on the EVM side. | `"0x4C5033DB823538d398e84Bf65fAdEbA0b4d71599"` | EVM_BRIDGE_ADDRESS |
| evm.starting_block | The block that the server will start listening for attestations. If not declared, server will start listening on the latest block. | `1` | EVM_STARTING_BLOCK |
| evm.signer_list_seconds | The amount that pass before checking if the witness server is in the signer list. | `300` | EVM_SIGNER_LIST_SECONDS |
| evm.signer | EVM signer related configuration. | | |


## Signer Types

In order to give the node operator flexibility, there are two types of signers that can be configured. Each one has different configuration options.


### Local Signer

This is the most simple signer. The witness operator holds the private key and configures the signer using these parameters:

| Key | Description | Example | ENV Key |
|-----|-------------|---------|---------|
| xrp.signer.type<br>evm.signer.type | To configure a local signer , this value must be `local`. | `"local"` | XRP_SIGNER_TYPE<br>EVM_SIGNER_TYPE |
| xrp.signer.spec<br>evm.signer.spec | Local signer related configuration. | | |
| xrp.signer.spec.private_key<br>evm.signer.spec.private_key | The private key of the local signer. If the local signer is on an XRPL chain, the private key must be in hexadecimal format. | `"****"` | XRP_SIGNER_PRIVATE_KEY<br>EVM_SIGNER_PRIVATE_KEY |


### AWS Signer

This signer type uses the AWS KMS systems to store its private key. The private key is under AWS custody and never leaves their system, making the signing process more secure. You can configure the witness server for AWS, using these parameters:

| Key | Description | Example | ENV Key |
|-----|-------------|---------|---------|
| xrp.signer.type<br>evm.signer.type | To configure an AWS signer, this value must be `aws`. | `"aws"` | |
| xrp.signer.type<br>evm.signer.type | AWS signer related configuration. | | |
| xrp.signer.spec.region<br>evm.signer.spec.region | The AWS region where the KMS key is stored. | `"eu-west-1"` | XRP_SIGNER_AWS_REGION<br>EVM_SIGNER_AWS_REGION |
| xrp.signer.spec.access_key<br>evm.signer.spec.access_key | An AWS access key with read access to the KMS key. | `"fake-access-key"` | AWS_ACCESS_KEY |
| xrp.signer.spec.secret_key<br>evm.signer.spec.secret_key | An AWS secret key with read access to the KMS key. | `"fake-secret-key"` | AWS_SECRET_KEY |
| xrp.signer.spec.key_id<br>evm.signer.spec.key_id | The AWS KMS key id. | `"fake-key-id"` | XRP_SIGNER_KMS_KEY_ID<br>EVM_SIGNER_KMS_KEY_ID |


## Example Configuration File

```yaml
server:
  queue_period: 5
  logging_level: info
  log_file_path: ./logs/log.txt
  validate_bridge: true
xrp:
  node: "wss://sidechain-net1.devnet.rippletest.net"
  bridge_address: "rs99jCuSAjrXzdebKm1AgpErz9M2FwHQCE"
  starting_block: 1
  signer_list_seconds: 300
  signer:
    type: "aws"
    spec:
      region: "eu-west-1"
      access_key: "fake-access-key"
      secret_key: "fake-secret-key"
      key_id: "fake-key-id"
      
evm:
  node: "https://rpc-evm-sidechain.xrpl.org"
  bridge_address: "0x4C5033DB823538d398e84Bf65fAdEbA0b4d71599"
  starting_block: 1
  signer_list_seconds: 300
  signer:
    type: "local"
    spec:
      private_key: "****"
```