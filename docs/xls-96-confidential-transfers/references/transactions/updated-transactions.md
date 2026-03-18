---
seo:
    description: The Confidential Transfers amendment updates the MPTokenIssuanceCreate and MPTokenIssuanceSet transactions to support configuring confidential transfer capabilities.
labels:
  - Multi-Purpose Tokens, MPTs, Tokens
  - Confidential Transfers
---
# Updated Transactions

The Confidential Transfers amendment updates the following transactions to support configuring confidential transfer capabilities:

- [MPTokenIssuanceCreate](#mptokenissuancecreate) - Set initial privacy flags when creating an MPT issuance.
- [MPTokenIssuanceSet](#mptokenissuanceset) - Configure encryption keys and toggle privacy settings after creation.

_(Requires the [ConfidentialTransfers amendment][] {% not-enabled /%})_

## MPTokenIssuanceCreate

### MPTokenIssuanceCreate Flags

In addition to the existing [MPTokenIssuanceCreate flags](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuancecreate#mptokenissuancecreate-flags), confidential `MPTokenIssuanceCreate` transactions support:

| Flag Name                    | Hex Value    | Decimal Value | Description |
|:-----------------------------|:-------------|:--------------|:------------|
| `tfMPTCanConfidentialAmount` | `0x00000080` | 128           | If enabled, the MPT issuance supports confidential transfers. |

### MPTokenIssuanceCreate Mutable Flags

Confidential MPTokenIssuanceCreate transactions support the following value in the `MutableFlags` field:

| Flag Name                                  | Hex Value    | Decimal Value | Description |
|:-------------------------------------------|:-------------|:--------------|:------------|
| `tmfMPTCannotMutateCanConfidentialAmount`  | `0x00040000` | 262144        | If enabled, issuers cannot change the **Can Confidential Amount** flag after the token is issued. |

## MPTokenIssuanceSet

This transaction is the **only** way to register issuer and auditor public keys or modify the privacy status of an MPT issuance.

### MPTokenIssuanceSet Fields

In addition to the existing [MPTokenIssuanceSet](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuanceset) transaction fields, confidential MPTokenIssuanceSet transactions support:

| Field                     | JSON Type            | [Internal Type][]  |  Required? | Description |
|:------------------------- |:-------------------- |:------------------ |:---------- |:------------|
| `IssuerEncryptionKey`     | String               | Blob               | No         | The 33-byte EC-ElGamal public key used for the issuer's mirror balances. |
| `AuditorEncryptionKey`    | String               | Blob               | No         | Optional 33-byte EC-ElGamal public key used for regulatory oversight. Must be provided together with `IssuerEncryptionKey` in the same transaction. |
| `MutableFlags`            | Number               | UInt32             | No         | Flags to enable or disable mutable properties of the MPT issuance. |

#### MPTokenIssuanceSet Mutable Flags

The `MutableFlags` field allows an issuer to enable or disable specific flags on an MPT issuance. For confidential MPTs, the following flags are relevant:

| Flag Name            | Hex Value    | Decimal Value | Description |
|:---------------------|:-------------|:--------------|:------------|
| `tmfMPTSetCanConfidentialAmount`   | `0x00001000` | 4096          | Enable confidential transfers for this MPT issuance by enabling the **Can Confidential Amount** flag. Can only be used if the **Cannot Mutate Can Confidential Amount** flag is _disabled_ and there is no existing confidential outstanding amount. |
| `tmfMPTClearCanConfidentialAmount` | `0x00002000` | 8192          | Disable confidential transfers for this MPT issuance by disabling the **Can Confidential Amount** flag. Can only be used if the **Cannot Mutate Can Confidential Amount** flag is disabled and there is no existing confidential outstanding amount. |

### Error Cases

Besides errors that can occur for all transactions, `MPTokenIssuanceSet` transactions can result in the following [transaction result codes][]:

| Error Code | Description |
|:-----------|:------------|
| `temINVALID_FLAG` | Both `tmfMPTSetCanConfidentialAmount` and `tmfMPTClearCanConfidentialAmount` flags were specified in the same transaction, which is not allowed. |
| `temMALFORMED` | The `AuditorEncryptionKey` was provided without `IssuerEncryptionKey`, or the public key length is incorrect (must be 33 bytes). |
| `tecNO_PERMISSION` | One of the following occurred:<ul><li>Attempted to update a public key that has already been set.</li><li>Attempted to change the privacy flag when the **Cannot Mutate Can Confidential Amount** flag is enabled.</li><li>Attempted to set public keys when the **Can Confidential Amount** flag is disabled.</li><li>Attempted to change the privacy setting when confidential balances already exist.</li><li>Attempted to set public keys when the `ConfidentialOutstandingAmount` field is present.</li></ul> |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
