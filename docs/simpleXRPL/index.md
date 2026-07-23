---
seo:
    description: simpleXRPL is an opinionated TypeScript SDK that lets institutional developers express XRP Ledger operations as business intent and route them through the custodians they already use.
labels:
  - SDKs
---

# simpleXRPL

The `simpleXRPL` is an opinionated TypeScript SDK for the XRP Ledger, built for institutional developers who interact with the ledger through a custodian. It raises the level of your code from XRPL protocol mechanics to business operations that the SDK routes through institutional custodians. Concretely, this means:

- `simpleXRPL` defines the shape of business operations, handling the underlying XRPL transactions and custodian API calls.
- Your code doesn't change even if you switch custodians or operate across several at once.

{% admonition type="info" name="Note" %}
`simpleXRPL` is pre-1.0. The public API may change between releases and no sandbox exists yet to test native custodian operations.
{% /admonition %}


## How It Works

`simpleXRPL` is built around four concepts:

- **Client**: Establishes the network connection and the connector configuration. Both are immutable for the client's lifetime; to change either, you create a new client.
- **Connector**: The execution model that determines *how* operations run and *who* holds account keys. Each connector exposes a uniform interface to the rest of the SDK, so the same code runs across all of them.
- **Accounts**: A separate abstraction, bound to a custodian or a local seed and given a logical name.
- **Verticals**: Domain-specific classes that group related business operations.


## Operation Execution

For every operation, on every connector, `simpleXRPL` has a statically defined routing decision that it reports at initialization:

- **Native**: Maps onto an endpoint the custodian exposes and natively handles.
- **Raw signing fallback (opt-in)**: The custodian has no native endpoint yet, so the SDK constructs and submits the necessary transactions to the XRPL. Raw-signing is only used if you explicitly enable it for a specific operation.
- **Unavailable**: The custodian doesn't expost a native endpoint and raw signing isn't permitted for this operation.

{% admonition type="info" name="Note" %}
For a complete list of supported operations by connector, see the [Connector Routing Table](./references/connector-routing.md)
{% /admonition %}


## Next steps

Ready to build? See [Get Started](./get-started.md) to install `simpleXRPL`, connect a custodian, and run your first operation.
