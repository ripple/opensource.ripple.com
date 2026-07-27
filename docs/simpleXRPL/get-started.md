---
seo:
    description: Install simpleXRPL, construct a connector, initialize the client, discover your accounts, and send your first XRP Ledger payment.
labels:
  - simpleXRPL
  - SDK
---

# Get Started

This tutorial takes you through the basics of sending your first operation on the XRP Ledger with **simpleXRPL**.


## Goals

By the end of this tutorial, you will be able to:

- Construct a connector.
- Initialize a client.
- Discover your accounts.
- Transfer XRP between accounts.


## Prerequisites

To complete this tutorial, you should:

- Have some familiarity with writing code in TypeScript.
- Have **Node.js version 20.19** or later.


## Source Code

You can find the complete source code for this tutorial's examples in the [code samples section of this website's repository](https://github.com/ripple/opensource.ripple.com/tree/main/_code-samples/simplexrpl/)


## Steps

### 1. Install dependencies

```sh
npm install simplexrpl
```

### 2. Construct a connector

A connector is a signing backend that determines how operations are executed and signed. This guide uses local signing with a `LocalSigner` constructor. This self-custody connector manages accounts and signs locally, making it ideal for testing and development.

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" before="// --- Initialize the client ---" /%}

For production you'd construct a custodian connector instead and pass it to `init` in place of (or alongside) the local one. See [Connectors](./references/connectors/index.md) for how to build each one; every vertical operation then works the same regardless of which connector owns the account.

### 3. Initialize the client

Initializing an account binds connectors to a network and builds the account index.

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" from="// --- Initialize the client ---" before="// --- Discover your accounts ---" /%}

- `signers[0]` is the default *primary* account used for operations if not specified.
- If you don't set a `signer`, the client is read-only and you will receive a `NoSignerError` when attempting write operations.

### 4. Discover your accounts

Connectors discover their accounts at initialization, and the client merges them into a single index keyed by XRPL account address. List them, resolve the primary, and read on-chain state.

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" from="// --- Discover your accounts ---" before="// --- Send an XRP transfer ---" /%}

### 5. Transfer XRP

Operations are grouped into domain-specific verticals reached off the client. This guide sends XRP from the primary address to another. For a full list of vertical operations, see: [Verticals](./references/verticals/index.md).

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" from="// --- Send an XRP transfer ---" /%}


## See Also

- **References**:
  - [LocalSigner.fromEnv()](./references/connectors/local.md#localsignerfromenv)
  - [SimpleXRPL.init()](./references/index.md#client-and-initialization)
  - [account.retrieve()](./references/verticals/account/retrieve.md)
  - [xrp.transfer()](./references/verticals/xrp/transfer.md)
 