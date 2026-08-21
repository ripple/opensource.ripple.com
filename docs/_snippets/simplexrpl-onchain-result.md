An `OnChainResult` reports a transaction that reached the ledger.

| Field | Type | Description |
| --- | --- | --- |
| `txHash` | `string` | The XRPL transaction hash. |
| `mptIssuanceId` | `string` _(optional)_ | Present only when the transaction created an MPT issuance. |
