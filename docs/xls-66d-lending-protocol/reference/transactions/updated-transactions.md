---
seo:
    description: The Lending Protocol updates the sign, sign_for, and submit commands with an additional field.
labels:
  - Transactions
  - Lending Protocol
---
# Updated Transactions

The Lending Protocol updates the [`sign`](https://xrpl.org/docs/references/http-websocket-apis/admin-api-methods/signing-methods/sign), [`sign_for`](https://xrpl.org/docs/references/http-websocket-apis/admin-api-methods/signing-methods/sign_for), and [`submit`](https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/transaction-methods/submit) commands with a new `signature_target` field.


| `Field`            | Type    | Required? | Description |
|:-------------------|:--------|:----------|:------------|
| `signature_target` | String  | No        | Specifies where in the transaction metadata the signature information should be stored. Currently, the only valid value is `CounterpartySignature`. |
