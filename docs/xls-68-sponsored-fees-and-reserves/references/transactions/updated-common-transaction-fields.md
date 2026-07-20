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

[Pseudo-transactions](https://xrpl.org/docs/references/protocol/transactions/pseudo-transaction-types) do not support either sponsorship flag as they simply don't have fees or reserves at all. For all other transactions:

- The **`spfSponsorFee`** flag can be used with any transaction type.
- The **`spfSponsorReserve`** flag can only be used with the following transactions:
  - [AccountSet](https://xrpl.org/docs/references/protocol/transactions/types/accountset)
  - [CheckCancel](https://xrpl.org/docs/references/protocol/transactions/types/checkcancel)
  - [CheckCash](https://xrpl.org/docs/references/protocol/transactions/types/checkcash)
  - [CheckCreate](https://xrpl.org/docs/references/protocol/transactions/types/checkcreate)
  - [Clawback](https://xrpl.org/docs/references/protocol/transactions/types/clawback)
  - [CredentialAccept](https://xrpl.org/docs/references/protocol/transactions/types/credentialaccept)
  - [CredentialCreate](https://xrpl.org/docs/references/protocol/transactions/types/credentialcreate)
  - [CredentialDelete](https://xrpl.org/docs/references/protocol/transactions/types/credentialdelete)
  - [DelegateSet](https://xrpl.org/docs/references/protocol/transactions/types/delegateset)
  - [DepositPreauth](https://xrpl.org/docs/references/protocol/transactions/types/depositpreauth)
  - [EscrowCancel](https://xrpl.org/docs/references/protocol/transactions/types/escrowcancel)
  - [EscrowCreate](https://xrpl.org/docs/references/protocol/transactions/types/escrowcreate)
  - [EscrowFinish](https://xrpl.org/docs/references/protocol/transactions/types/escrowfinish)
  - [MPTokenAuthorize](https://xrpl.org/docs/references/protocol/transactions/types/mptokenauthorize)
  - [MPTokenIssuanceCreate](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuancecreate)
  - [MPTokenIssuanceDestroy](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuancedestroy)
  - [MPTokenIssuanceSet](https://xrpl.org/docs/references/protocol/transactions/types/mptokenissuanceset)
  - [Payment](https://xrpl.org/docs/references/protocol/transactions/types/payment)
  - [PaymentChannelClaim](https://xrpl.org/docs/references/protocol/transactions/types/paymentchannelclaim)
  - [PaymentChannelCreate](https://xrpl.org/docs/references/protocol/transactions/types/paymentchannelcreate)
  - [PaymentChannelFund](https://xrpl.org/docs/references/protocol/transactions/types/paymentchannelfund)
  - [SetRegularKey](https://xrpl.org/docs/references/protocol/transactions/types/setregularkey)
  - [SignerListSet](https://xrpl.org/docs/references/protocol/transactions/types/signerlistset)
  - [SponsorshipTransfer](./sponsorshiptransfer.md)
  - [TrustSet](https://xrpl.org/docs/references/protocol/transactions/types/trustset)

{% admonition type="info" name="Note" %}
Fee-sponsored transactions cannot be queued. If a fee-sponsored transaction does not make it into the open ledger, it fails with `telCAN_NOT_QUEUE` instead of entering the transaction queue.
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
A sponsor signature is only required if no pre-funded `Sponsorship` ledger entry exists, or if the `lsfSponsorshipRequireSignForFee` or `lsfSponsorshipRequireSignForReserve` flags are enabled on the [Sponsorship ledger entry][].
{% /admonition %}

#### Transaction Fee Calculation

If the `SponsorSignature.Signers` field is necessary, the total fee of the transaction will be increased due to the extra signatures that need to be processed. This is similar to the additional fees for multi-signing.

The total fee calculation for signatures is:

```text
(1 + |tx.Signers| + |tx.SponsorSignature.Signers|) × base_fee (+ any transaction-specific fees)
```

## Batch Transactions

The `SponsorFlags` apply at opposite levels of a Batch. Reserve sponsorship goes on the _inner_ transactions, because the outer Batch doesn't support `spfSponsorReserve`. Fee sponsorship works the other way, so `spfSponsorFee` is valid **only** on the _outer_ Batch, not on the inner transactions.

When a reserve sponsor co-signs an inner transaction, that transaction's `SponsorSignature` field must be present but **empty**. The sponsor signs the outer Batch transaction instead and appears as a `BatchSigners` entry.

## Delegated Transactions

For transactions that include a `Delegate` field, note the following:

- Fee sponsorship applies to the delegate, since the delegate pays the transaction fee.
- When using pre-funded fee sponsorship, the _delegate_ must be the sponsee instead of the account sending the transaction.
- Reserve sponsorship cannot be combined with delegation and fails with `temINVALID`.

## Error Cases
<!-- TODO: When porting to xrpl.org, move these error codes to the Transaction Results section. -->

The following failure conditions have been added to transactions using the sponsorship fields:

| Error Code                | Description |
| :------------------------ | :---------- |
| `temDISABLED`             | The Sponsor amendment is not enabled. |
| `temMALFORMED`            | The transaction is malformed. This can occur when:<ul><li>The sponsor and the transaction sender are the same account.</li><li>The transaction includes a sponsor signature but does not specify a sponsor.</li><li>The sponsor signature contains an invalid combination of signing fields.</li></ul> |
| `temINVALID`              | The transaction has an invalid sponsor configuration. This can occur when:<ul><li>The sponsor signature is invalid.</li><li>The transaction combines the `spfSponsorReserve` flag with a `Delegate` field. Reserve sponsorship cannot be combined with delegation.</li></ul> |
| `temINVALID_FLAG`         | The transaction has invalid flags. This can occur when:<ul><li>The `SponsorFlags` field contains invalid flags. Valid flags are `spfSponsorFee` and `spfSponsorReserve`.</li><li>The transaction includes `SponsorFlags` but does not specify a sponsor.</li><li>The `SponsorFlags` field is included but set to zero.</li><li>The `spfSponsorReserve` flag is set on a transaction type that does not support reserve sponsorship.</li></ul> |
| `terNO_ACCOUNT`           | The sponsor account does not exist. |
| `tefBAD_AUTH`             | The sponsor signature is invalid. The public key does not match the sponsor account's master key or regular key, or the key type is unknown. |
| `tefNOT_MULTI_SIGNING`    | The sponsor account does not have a signer list. |
| `tefBAD_SIGNATURE`        | The sponsor multi-signature is invalid. A signer is not in the signer list, a public key is invalid, or a signature is invalid. |
| `tefBAD_QUORUM`           | The sponsor multi-signature does not meet the required quorum. |
| `terNO_PERMISSION`        | The transaction does not meet the sponsorship requirements. This can occur when:<ul><li>The transaction requires a sponsor signature, but none was provided and no pre-funded `Sponsorship` exists.</li><li>The `Sponsorship` requires a signature for fee sponsorship.</li><li>The `Sponsorship` requires a signature for reserve sponsorship.</li></ul> |
| `terINSUF_FEE_B`          | The sponsor cannot pay the transaction fee: the co-signing sponsor's balance above its own reserve, or the pre-funded `Sponsorship`'s `FeeAmount` (capped by `MaxFee`), is insufficient. Returned against the open ledger, or when the fee payer has nothing spendable at all. |
| `tecINSUFF_FEE`           | The same insufficient-fee condition as `terINSUF_FEE_B`, returned when the transaction is applied in a closed ledger and the fee payer has some spendable balance (non-zero) but not enough. |
| `tecINSUFFICIENT_RESERVE` | The sponsor does not have enough XRP to cover the reserve, or the pre-funded `Sponsorship` does not have enough `RemainingOwnerCount`. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
