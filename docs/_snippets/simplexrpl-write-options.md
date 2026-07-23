`options` is an optional second argument that sets the source account and overrides the fee.

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `from` | `AccountSelector` | No | The account to act as. Defaults to the primary signer's primary account. (For IOU verbs, this is the issuer.) |
| `fee` | `FeeIntent` | No | Fee override. |
| `idempotencyKey` | `string` | No | A prior submission's `idempotencyKey`, to retry to the same intent instead of creating a duplicate. Auto-generated when omitted. |
