---
seo:
    description: simpleXRPL is an opinionated TypeScript SDK that lets institutional developers express XRP Ledger operations as business intent and route them through the custodians they already use.
labels:
  - simpleXRPL
  - SDK
---

# simpleXRPL
[Source](https://github.com/ripple/simpleXRPL)

The `simpleXRPL` is an opinionated TypeScript SDK for the XRP Ledger, built for institutional developers who interact with the ledger through a custodian. It raises the level of your code from XRPL protocol mechanics to business operations that the SDK routes through your institutional custodians. Concretely, this means:

- `simpleXRPL` defines the shape of business operations, handling the underlying XRPL transactions and custodian API calls.
- Your code doesn't change even if you switch custodians or operate across several at once.

{% admonition type="warning" name="Caution" %}
`simpleXRPL` is pre-1.0. The public API may change between releases and no sandbox exists yet to test native custodian operations.
{% /admonition %}


## How It Works

`simpleXRPL` is built around four concepts:

- **Clients**: Establishes the network connection and the connector configuration. Both are immutable for the client's lifetime; to change either, you create a new client.
- **Connectors**: The execution model that determines *how* operations run and *who* holds account keys. Each connector exposes a uniform interface to the rest of the SDK, so the same code runs across all of them.
- **Accounts**: An XRPL [account](https://xrpl.org/docs/concepts/accounts) paired with the connector that signs for it.
- **Verticals**: Domain-specific classes and methods that group related business operations.


## Operation Execution

For every operation, on every connector, `simpleXRPL` has a statically defined routing decision that it reports at initialization:

- **Native**: Maps onto an endpoint a custodian exposes and natively handles.
- **Raw Signing**: For an operation the custodian exposes no native support for, the SDK builds the underlying XRPL transactions, has the custodian sign the raw bytes, and submits them to the XRPL directly. Raw signing is off by default and enabled per connector; once on, it covers every operation that connector can't handle natively.
- **Unavailable**: The custodian doesn't expose a native endpoint and raw signing isn't enabled on the connector, so this operation is rejected.

{% admonition type="info" name="Note" %}
For a complete list of supported operations by connector, see [Connector Routing](./references/connector-routing.md)
{% /admonition %}


## See Also

- [Get Started](./get-started.md)
