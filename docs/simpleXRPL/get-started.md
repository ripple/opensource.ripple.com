---
seo:
    description: Install simpleXRPL, initialize the client, connect a custodian, discover your accounts, check routing, and send your first XRP Ledger payment.
labels:
  - simpleXRPL
  - SDK
---

# Get Started

This tutorial takes you through the basics of sending your first operation on the XRP Ledger with simpleXRPL.


## Goals

By the end of this tutorial, you will be able to:

- Initialize a client.
- Connect a custodian.
- Discover your accounts.
- Check how an operation will route before you submit it.
- Transfer XRP between accounts.


## Prerequisites

To complete this tutorial, you should:

- Have some familiarity with writing code in TypeScript.
- Have **Node.js version 20.19** or later.


## Source Code

You can find the complete source code for this tutorial's examples in the [code samples section of this website's repository](https://github.com/ripple/opensource.ripple.com/tree/main/_code-samples/simplexrpl/getStarted.ts)


## Steps

### 1. Install dependencies

```sh
npm install simplexrpl
```

### 2. Initialize the client

`SimpleXRPL.init(...)` is the single entry point — you never construct the client with `new`. It binds one or more already-authenticated signing backends (the **connectors**) to a network and builds the account index.

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" before="// --- Discover your accounts ---" /%}

- **`primarySigner`** is the default backend for verbs called without an explicit account. It defaults to `signers[0]`, so you only set it when you bind more than one connector.
- With **no `signers`**, the client is read-only: reads work, but write verbs throw `NoSignerError` until a signer is added.
- Bind an account at runtime (for example, a freshly created wallet) with `client.registerLocalAccount(seed)`.

See [Client and initialization](references/index.md#client-and-initialization) for the full configuration reference.

### 3. Connect a custodian

The local signer above is enough for development. For production, construct a custodian connector and pass it to `init`'s `signers` — in place of, or alongside, the local one. simpleXRPL ships **Ripple Custody** and **Palisade**, each constructed and authenticated on its own:

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" from="// --- Connect a custodian (production) ---" /%}

Read credentials from your environment or secrets manager — never hard-code keys. Once bound, every vertical verb works the same regardless of which connector owns the account: the SDK routes each write to the custodian that holds it.

{% admonition type="info" name="Note" %}
Whether an operation runs through a custodian's **native** path or the **raw-signing fallback** is decided per operation; the fallback is off by default and enabled per connector via `allowRawSigning`. See [Operation Execution](index.md#operation-execution) and the [Connector Routing](references/connectors/connector-routing.md) table.
{% /admonition %}

### 4. Discover your accounts

Connectors discover their accounts at init; the client merges them into a single index keyed by r-address. List them, resolve the primary, and read on-chain state — a read needs no signer:

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" from="// --- Discover your accounts ---" before="// --- Check how operations route ---" /%}

### 5. Check how operations route

Before you submit, ask how a given transactor would route for an account — signed locally, through a custodian's native operation, via the raw sign-only fallback, or rejected:

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" from="// --- Check how operations route ---" before="// --- Send a payment ---" /%}

### 6. Send a payment

Operations are grouped into domain-specific **verticals** — `xrp`, `token`, `iou`, `credential`, `domain`, and `account` — reached off the client. Each verb uses the primary account by default; target a different bound account with `from`. Here's a native XRP payment:

{% code-snippet file="/_code-samples/simplexrpl/getStarted.ts" language="ts" from="// --- Send a payment ---" before="// --- Connect a custodian (production) ---" /%}

Every write resolves to a `SubmissionResult` carrying the transaction hash, the backend's raw response, and a typed `intent` output. See [Results and handles](references/index.md#results-and-handles).

{% admonition type="success" name="Tip" %}
On a test network, create and fund an account first with [account.create()](references/verticals/account/create.md) and [account.fund()](references/verticals/account/fund.md), then use its address as the source or destination.
{% /admonition %}

## Next steps

- **Tutorials** — end-to-end workflows: [Issue an RWA as an MPT](tutorials/issue-rwa-as-mpt.md), [Issue and distribute an IOU](tutorials/issue-and-distribute-iou.md), [Place a DEX order](tutorials/place-dex-order.md), and more.
- **Reference** — every vertical, method, connector, and type: [Reference](references/index.md).
- **Concepts** — what simpleXRPL is and why: [What is simpleXRPL](index.md).
