Every simpleXRPL write resolves to a `SubmissionResult<T>` — a union tagged by `source`, with the backend's raw response preserved verbatim. Its common fields are:

| Field | Type | Description |
| --- | --- | --- |
| `intent` | `T` | The method-specific output. See the method's response values below. |
| `source` | `'rippled' \| 'custody' \| 'palisade'` | Which backend produced the result; discriminates `response`. |
| `response` | `TxResponse` \| custody record \| Palisade record | The backend's raw response, preserved verbatim. |
| `txHash` | `string` _(optional)_ | The XRPL transaction hash, once the transaction is on-ledger. |
| `intentId` | `string` _(optional)_ | The custodian intent id, when the path produced one. |
| `idempotencyKey` | `string` _(optional)_ | The UUIDv7 this submission carried. Pass it back as a later call's `idempotencyKey` to retry to the same intent. |
