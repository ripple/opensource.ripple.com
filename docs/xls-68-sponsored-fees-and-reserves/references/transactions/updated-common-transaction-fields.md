# Updated Common Transaction Fields

This page describes the new fields and flags added to all transactions to support Sponsored Fees and Reserves. These fields extend the existing [common transaction fields](https://xrpl.org/docs/references/protocol/transactions/common-fields).

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## New Common Fields

The following fields are added to the common transaction fields:

| Field Name                              | JSON Type | [Internal Type][] | Required? | Description  |
| :-------------------------------------- | :-------- | :---------------- | :-------- | :----------- |
| `Sponsor`                               | String    | AccountID         | No        | The address of the sponsoring account. |
| [`SponsorFlags`](#sponsorflags)         | Number    | UInt32            | No        | Flags indicating the type of sponsorship. If included, at least one flag must be set. |
| [`SponsorSignature`](#sponsorsignature) | Object    | Object            | No        | Contains the signing information for the sponsorship. |

### SponsorFlags

The `SponsorFlags` field allows the user to specify which sponsorship type(s) they wish to participate in.

| Flag Name           | Hex Value    | Decimal Value | Description |
| :------------------ | :----------- | :------------ | :---------- |
| `spfSponsorFee`     | `0x00000001` | 1             | Sponsoring the fee of the transaction. |
| `spfSponsorReserve` | `0x00000002` | 2             | Sponsoring the reserve for any objects created in the transaction. |

{% admonition type="info" name="Note" %}
Both flags can be used together in a single transaction. At least one flag must be set if the `Sponsor` field is included.
{% /admonition %}

### SponsorSignature

The `SponsorSignature` field is an object containing the sponsor's signing information.

| Field Name      | JSON Type | [Internal Type][] | Required? | Description  |
| :-------------- | :-------- | :---------------- | :-------- | :----------- |
| `SigningPubKey` | String    | Blob              | No        | The `SigningPubKey` for the `Sponsor`, if single-signing. |
| `TxnSignature`  | String    | Blob              | No        | A signature of the transaction from the sponsor, to indicate their approval of this transaction, if single-signing. |
| `Signers`       | Array     | Array             | No        | An array of signatures of the transaction from the sponsor's signers to indicate their approval of this transaction, if the sponsor is [multi-signing](https://xrpl.org/multi-signing.html). |

These fields are not included in transaction signatures, though they are still included in the stored transaction. There is no additional transaction fee for using `TxnSignature`.

{% admonition type="info" name="Note" %}
A sponsor signature is only required if no pre-funded `Sponsorship` object exists, or if the `lsfSponsorshipRequireSignForFee` or `lsfSponsorshipRequireSignForReserve` flags are enabled on the [Sponsorship ledger entry][].
{% /admonition %}

#### Transaction Fee Calculation

If the `SponsorSignature.Signers` field is necessary, the total fee of the transaction will be increased due to the extra signatures that need to be processed. This is similar to the additional fees for multi-signing.

The total fee calculation for signatures is:

```text
(1 + |tx.Signers| + |tx.SponsorSignature.Signers|) × base_fee (+ any transaction-specific fees)
```

## Error Cases
<!-- TODO: When porting to xrpl.org, move these error codes to the Transaction Results section. -->

The following failure conditions have been added to transactions using the sponsorship fields:

| Error Code                | Description |
| :------------------------ | :---------- |
| `temDISABLED`             | The Sponsor amendment is not enabled. |
| `temMALFORMED`            | The transaction is malformed. This can occur when:<ul><li>The sponsor and the transaction sender are the same account.</li><li>The transaction includes a sponsor signature but does not specify a sponsor.</li><li>The sponsor signature contains an invalid combination of signing fields.</li></ul> |
| `temINVALID_FLAG`         | The transaction has invalid flags. This can occur when:<ul><li>The `SponsorFlags` field contains invalid flags. Valid flags are `spfSponsorFee` and `spfSponsorReserve`.</li><li>The transaction includes `SponsorFlags` but does not specify a sponsor.</li><li>The `SponsorFlags` field is included but set to zero.</li></ul> |
| `terNO_ACCOUNT`           | The sponsor account does not exist. |
| `tefBAD_AUTH`             | The sponsor signature is invalid. The public key does not match the sponsor account's master key or regular key, or the key type is unknown. |
| `tefNOT_MULTI_SIGNING`    | The sponsor account does not have a signer list. |
| `tefBAD_SIGNATURE`        | The sponsor multi-signature is invalid. A signer is not in the signer list, a public key is invalid, or a signature is invalid. |
| `tefBAD_QUORUM`           | The sponsor multi-signature does not meet the required quorum. |
| `telINSUF_FEE_P`          | The sponsor account does not have enough XRP to pay the transaction fee. |
| `terNO_SPONSORSHIP`       | The transaction requires a sponsor signature, but none was provided. This can occur when:<ul><li>No pre-funded `Sponsorship` object exists.</li><li>The `Sponsorship` object requires a signature for fee sponsorship.</li><li>The `Sponsorship` object requires a signature for reserve sponsorship.</li></ul> |
| `terINSUF_FEE_B`          | The pre-funded `Sponsorship` object does not have enough XRP in `FeeAmount`, or the transaction fee exceeds `MaxFee`. |
| `tecINSUFF_FEE`           | The pre-funded `Sponsorship` object does not have enough XRP in `FeeAmount`, or the transaction fee exceeds `MaxFee`. This error occurs on a closed ledger when the balance is non-zero. |
| `tecINSUFFICIENT_RESERVE` | The sponsor does not have enough XRP to cover the reserve, or the pre-funded `Sponsorship` object does not have enough remaining `ReserveCount`. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
