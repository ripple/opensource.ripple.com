---
html: configure-the-bridge-client.html
blurb: Configure the backend and frontend of the bridge client.
labels:
  - Interoperability
status: not_enabled
---
# Configure the Bridge Client

{% partial file="/snippets/_evm-sidechain-disclaimer.md" /%}

The client requires separate configuration files for the backend frontend. Each environment setting also requires its own configuration files.


## Backend Configuration

The client backend is configured in `src/config`. The folder holds multiple files that configure properties related to the:

- Server
- Logger
- Database (TypeORM)
- EVM
- XRPL
- XUMM

These configuration files use the `buildConfig()` function, taking an object with the configuration properties and a second optional parameter to perform validations. Configuration properties can have a static value or an object specifying values for each environment. The following environments are available:

- `default`
- `production`
- `development`
- `test`
- `staging`

Configuration values can be constants, environment variables or AWS Secrets. Environment variables are defined in a .env file in the root of the backend. AWS Secrets add an extra layer of customisation and security. To load AWS secrets, the `AWS_REGION` and `AWS_SECRET_ID` environment variables must be defined.

**Warning:** Never use constants for sensitive data, such as keys or secrets in production environments.


### Server Options

| Key | Description | EVN Key | AWS Secret | Example |
|-----|-------------|---------|------------|---------|
| port | Server port to receive requests. | `APP_PORT` | | `3000` |
| secretKey | Secret key used to generate JWT tokens. | `APP_JWT_KEY` | | `"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="` |
| enableSwagger | Enable Swagger. | | | `true` |
| enableCor | Enable CORS. | | | `true` |

### Logger Options

| Key | Description | EVN Key | AWS Secret | Example |
|-----|-------------|---------|------------|---------|
| logLevel | Log level used by the server logger. | | | `"info"` |
|logFileName | File name to store logs. | | | `"app.log"` |

### Database (TypeORM) Options

| Key | Description | EVN Key | AWS Secret | Example |
|-----|-------------|---------|------------|---------|
| host | Database host. | `DB_HOST` | `DB_HOST` | `"db"` |
| port | Database port. | `DB_PORT` | `DB_PORT` | `5432` |
| username | Database username. | `DB_USER` | `DB_USER` | `"db_user"` |
| password | Database password. | `DB_PASSWORD` | `DB_PASSWORD` | `"db_password"` |
| database | Database name. | `DB_DATABASE` | `DB_DATABASE` | `"db_database"` |

**Note:** This configuration also extends [Nest TypeORM properties](https://docs.nestjs.com/techniques/database).

### EVM Option

| Key | Description | EVN Key | AWS Secret | Example |
|-----|-------------|---------|------------|---------|
| server | EVM chain RPC. | | | `"https://rpc-evm-sidechain.xrpl.org"` |

### XRPL Option

| Key | Description | EVN Key | AWS Secret | Example |
|-----|-------------|---------|------------|---------|
| server | XRPL chain WebSocket. | | | `"wss://sidechain-net1.devnet.rippletest.net"` |

### XUMM Options

| Key | Description | EVN Key | AWS Secret | Example |
|-----|-------------|---------|------------|---------|
| appKey | XUMM app key. | `XUMM_API_KEY` | `XUMM_API_KEY` | `"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"` |
| appSecret | XUMM app secret. | `XUMM_SECRET_KEY` | `XUMM_SECRET_KEY` | `"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"` |


## Frontend Configuration

The frontend configuration doesn't contain sensitive data and can be modified at `src/common/config`. There's one JSON file for each environment:

| File | Description |
|------|-------------|
| config.base.json | Common configuration used in all environments. |
| config.prod.json | Configuration used in the _production_ environment. |
| config.dev.json | Configuration used in the _development_ environment. |
| config.test.json | Configuration used in the _test_ environment. |
| config.staging.json | Configuration used in the _staging_ environment. |

### Configuration Options

| Key | Description | Example |
|-----|-------------|---------|
| projectName | The name of the project. | `"bridge-client"` |
| publicUrl | React Router's `BrowserRouter basename`. | `"/"` |
| backendUrl | Bridge client backend URL. | "" |
| nativeToken | The symbol of the blockchain's native token. | `"XRP"` |
| network | The network of the chains in the bridge. | `"Devnet"` |
| xrpNodeUrl | XRPL node WebSocket URL. | `"wss://sidechain-net1.devnet.rippletest.net"` |
| evmWsNodeUrl | EVM node WebSocket URL. | `"wss://ws-evm-poa-sidechain.peersyst.tech"` |
| evmRpcUrl | EVM node RPC URL. | `"https://rpc-evm-sidechain.xrpl.org/"` |
| xrpExplorerUrl | XRPL explorer URL. | `"https://custom.xrpl.org/sidechain-net1.devnet.rippletest.net/"` |
| evmExplorerUrl | EVM explorer URL. | `"https://evm-sidechain.xrpl.org/"` |
| xrpFaucetHost | XRPL faucet host. | `"sidechain-faucet.devnet.rippletest.net"` |
| xrpChainName | XRP chain name. | `"XRPL"` |
| evmChainName | EVM chain name. | `"EVM Sidechain"` |
| evmChain | EVM chain ID. | `1440002` |
| evmDecimals | EVM chain decimals. | `18` |
| pctCommission | PCT commission. | `0` |
| minCommission | Minimum commission. | `1` |
| maxCommission | Maximum commission. | `1` |
| xumm | The [XUMM configuration options](#frontend-xumm-options). | |
| enableXumm | Enable a XUMM. Uses an auto-generated XRP faucet wallet if `false`. | `false` |
| maxNumberDecimals | Maximum number of decimals to display in the UI. | `6` |
| txValidationPolling | [Polling Options](#polling-options) for awaiting transaction validations. | |
| attestationsValidationPolling | [Polling Options](#polling-options) for awaiting attestations. | |
| transactionsRefetchInterval | The interval to refetch transaction history in ms. | `10000` |
| balanceRefetchInterval | The interval to refetch balances in ms. | `5000` |
| peersystUrl | The Peersyst web page URL. | `"https://peersyst.com/"` |

### Frontend XUMM Options

| Key | Description | Example |
|-----|-------------|---------|
| statusInterval | The interval to poll the client's backend for XUMM request updates in ms. | `3000` |
| maxNumberOfRetries | The maximum number of attempts to poll the client's backend for XUMM request updates. | `40` |

### Polling Options

| Key | Description | Example |
|-----|-------------|---------|
| delay | Polling delay in ms. | `3000` |
| maxIterations | The maximum number of polling iterations. | `10` |
| timeout | The timeout of the request being polled in ms. | `1000` |