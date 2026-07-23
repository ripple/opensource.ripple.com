---
seo:
    description: A vertical is a domain-specific class of business-intent operations in simpleXRPL — one per area of XRPL functionality, reached off the client.
labels:
  - SDKs
---

# Verticals

A **vertical** is a domain-specific class that groups related operations — one per area of XRPL functionality. Each vertical's methods are the _business-intent verbs_ for that domain (`token.issue(...)`, `iou.transfer(...)`), and each vertical is reached off the client under a lowercase name (`client.token`, `client.iou`). The term contrasts with _horizontal_ operations that cut across domains, such as payments and batch transactions.

Most vertical methods submit a transaction and resolve to a `Promise<SubmissionResult<T>>`, where `T` is the method's typed [intent output](../index.md#results-and-handles); they also accept an optional second argument to target a non-primary account and override the fee. (A few helpers differ — for example, `Account.create` generates a keypair and returns synchronously.) Each vertical's page lists its methods; every method has its own page with parameters, response, and the underlying XRPL transactor(s).

| Vertical | Reached as | What it does |
| --- | --- | --- |
| [XRP](xrp/index.md) | `client.xrp` | Native XRP payments. |
| [Token](token/index.md) | `client.token` | Issue and manage [Multi-Purpose Tokens (MPTs)](https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens) and place DEX offers. |
| [IOU](iou/index.md) | `client.iou` | Issue and manage trust-line-based issued currencies. |
| [Credential](credential/index.md) | `client.credential` | Issue, accept, and delete on-ledger [credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials). |
| [Domain](domain/index.md) | `client.domain` | Create, update, and delete [permissioned domains](https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-dexes). |
| [Account](account/index.md) | `client.account` | Account creation, funding, and administration. |

{% admonition type="info" name="Note" %}
Where a vertical's natural class name would collide with a type, the class is suffixed — the Account vertical's class is `AccountVertical` — but it is still reached as `client.account`.
{% /admonition %}
