A `SubmissionHandle` lets you poll or wait for a terminal state without holding the original request open.

| Field | Type | Description |
| --- | --- | --- |
| `kind` | `CustodianKind` | The connector kind that owns the underlying intent or transaction. |
| `id` | `string` | The custodian-native id (an intent id), or the XRPL transaction hash for local signing. |
| `custodian` | `Custodian` | The connector that produced this handle. |
| `poll` | `() => Promise<SubmissionResult>` | A non-blocking snapshot of the current state. |
| `wait` | `(timeoutMs?: number) => Promise<SubmissionResult>` | Block until terminal state or the timeout (defaults to the connector's). |
| `cancel` | `() => Promise<void>` _(optional)_ | Cancel the pending intent, where the backend supports it. |
