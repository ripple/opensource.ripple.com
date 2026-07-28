---
seo:
    description: Reference index for the simpleXRPL SDK — its verticals, connectors, the amount and asset model, submission results, and the error hierarchy.
labels:
  - simpleXRPL
  - SDK
---

# Reference

This section is the map of `simpleXRPL`'s public API surface: the client entry point, the business-intent verticals, the custodian connectors, the amount and asset model, submission results, and the error hierarchy. Complete type-level signatures for every symbol are generated from the source with TypeDoc; the tables below are the curated index of what you actually build against.

New to simpleXRPL? Start with [What is simpleXRPL](../index.md) for the concepts, then [Get Started](../get-started.md) to install and connect a custodian.

{% admonition type="info" name="Note" %}
This index covers the public surface only. Internal and testing seams (the dispatch pipeline, injected I/O ports, and the production ledger port) are intentionally omitted — you don't call them directly.
{% /admonition %}
