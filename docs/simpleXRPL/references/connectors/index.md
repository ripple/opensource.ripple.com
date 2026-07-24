---
seo:
    description: A connector is a signing backend in simpleXRPL — LocalSigner, RippleCustody, or PalisadeCustody — constructed on its own and bound to the client at initialization.
labels:
  - simpleXRPL
  - SDK
---

# Connectors

A connector is a signing backend: it determines how an operation runs and which custodian holds your account keys. Each is constructed and authenticated on its own, then passed to the client constructed by `simpleXRPL` in a `signers` array. `simpleXRPL` supports these connectors:

- [Local](./local.md)
- [Ripple Custody](./ripple-custody.md)
- [Palisade](./palisade.md)
