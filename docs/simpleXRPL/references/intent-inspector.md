---
seo:
    description: Resume polling or waiting on a custodian governance intent by id, after its original submission has already returned.
labels:
  - simpleXRPL
  - SDK
---

# Intent Inspector

[[Source]](https://github.com/ripple/simpleXRPL/blob/2e7cf1f85dbecb529e95da97cc1178e0813259d6/src/client/intent-inspector.ts#L36)

`client.intent` is a read-only view of custodian governance intents the SDK previously created. Use it to pick an intent back up by ID after its original submission has already returned. For example when a `submitAndWait` times out with `IntentPendingError`, or an async submission's handle wasn't retained.

The SDK is a proposer and observer only. It never approves, rejects, or configures policy; those actions happen in the custodian.

{% admonition type="info" name="Note" %}
Only connectors that expose governance intents by ID are observable here (currently only [Ripple Custody](connectors/ripple-custody.md)). Palisade transactions are wallet-scoped and can't be addressed by an intent ID alone; observe those through the handle returned at submission (`poll()` / `wait()`) instead.

Every operation on this page throws `SimpleXRPLError` if no configured connector can observe intents.
{% /admonition %}


## Two layers of asynchrony

A governed write settles in two stages, and they complete at different times:

| Stage | Reached when | Observe with |
| --- | --- | --- |
| Governance intent | The custodian's policy approves it (`Executed`). | [`await()`](#await) |
| XRPL transaction | The transaction is confirmed on-ledger. | [`awaitOnChain()`](#awaitonchain) |

Both are needed to know that funds or state changes have fully landed. An approved intent has not necessarily reached the ledger yet.


## status()

A non-blocking snapshot of an intent's current state. Read `response.state` for the custodian's own status value.

### Signature

```ts
client.intent.status(intentId: string): Promise<SubmissionResult>
```

### Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `intentId` | `string` | Yes | The intent ID returned at submission. |


## await()

Resume blocking on an intent until it reaches a terminal state.

### Signature

```ts
client.intent.await(intentId: string, timeoutMs?: number): Promise<SubmissionResult>
```

### Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `intentId` | `string` | Yes | The intent ID returned at submission. |
| `timeoutMs` | `number` | No | How long to wait before giving up. Defaults to the connector's own timeout. |

Throws `IntentValidationError` if the intent is rejected, expired, or failed, and `IntentPendingError` if the timeout elapses while it is still pending.


## awaitOnChain()

Poll until the XRPL transaction linked to the intent is confirmed on-ledger, then return its outcome. This covers the second stage that [`await()`](#await) does not.

Resolves to `undefined` if the timeout elapses. Requires a Ripple Custody signer; throws `SimpleXRPLError` otherwise.

### Signature

```ts
client.intent.awaitOnChain(intentId: string, timeoutMs?: number): Promise<OnChainResult | undefined>
```

### Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `intentId` | `string` | Yes | The intent ID returned at submission. |
| `timeoutMs` | `number` | No | How long to poll before giving up. Defaults to the connector's own timeout. |

### Returns

An [`OnChainResult`](types.md#onchainresult), or `undefined` on timeout.

{% raw-partial file="/docs/_snippets/simplexrpl-onchain-result.md" /%}


## handleFor()

Build a submission handle over an intent by ID, equivalent to the one its original submission returned. Use this when you want the handle's own `poll()` / `wait()` rather than the shorthands above.

### Signature

```ts
client.intent.handleFor(intentId: string): SubmissionHandle
```

### Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `intentId` | `string` | Yes | The intent ID to observe. |

### Returns

A [`SubmissionHandle`](types.md#submissionhandle).

{% raw-partial file="/docs/_snippets/simplexrpl-submission-handle.md" /%}


## Example

Recover from a submission that timed out awaiting approval, then confirm the transaction actually landed.

```ts
import { IntentPendingError, RippleCustody, SimpleXRPL } from 'simplexrpl'

const custody = await RippleCustody.fromEnv({
  primary: process.env.RIPPLE_CUSTODY_PRIMARY ?? '',
})
const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233', // XRPL Testnet
  signers: [custody],
})

let intentId: string | undefined
try {
  const result = await client.iou.issue({ ticker: 'USD' })
  intentId = result.intentId
} catch (error) {
  // Policy approval outlived the submission call — keep the id and come back to it.
  if (!(error instanceof IntentPendingError)) throw error
  intentId = error.intentId
}

if (intentId !== undefined) {
  // Where does it stand right now, without blocking?
  const snapshot = await client.intent.status(intentId)
  console.log('intent source:', snapshot.source)

  // Stage 1: block until policy approves (or the intent is rejected).
  await client.intent.await(intentId, 120_000)

  // Stage 2: approval is not confirmation — wait for the ledger.
  const onChain = await client.intent.awaitOnChain(intentId, 60_000)
  console.log(onChain ? `confirmed: ${onChain.txHash}` : 'not yet on-ledger')
}

await client.disconnect()
```


## See Also

- [Client](client.md) — `client.intent` and the other client members
- [Ripple Custody](connectors/ripple-custody.md) — the connector whose intents are observable
- [Errors](errors.md) — `IntentPendingError`, `IntentValidationError`
