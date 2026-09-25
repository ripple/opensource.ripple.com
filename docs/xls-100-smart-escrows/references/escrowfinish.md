---
seo:
    description: Deliver escrowed funds to the intended recipient.
labels:
    - Escrow
    - Payments
txIcon: finish
requiredAmendment: Escrow
---
# EscrowFinish
{% source-link path="src/libxrpl/tx/transactors/escrow/EscrowFinish.cpp" /%}

Deliver funds from an [escrow](https://xrpl.org/docs/concepts/payment-types/escrow.md) to the recipient.

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "EscrowFinish",
    "Owner": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "OfferSequence": 7,
    "Condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
    "Fulfillment": "A0028000"
}
```

{% tx-example txid="317081AF188CDD4DBE55C418F41A90EC3B959CDB3B76105E0CBE6B7A0F56C5F7" /%}


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Field           | JSON Type            | [Internal Type][] | Required? | Description |
|:----------------|:---------------------|:------------------|:----------|:------------|
| `Owner`         | String - [Address][] | AccountID         | Yes       | The source account that funded the escrow. |
| `OfferSequence` | Number               | UInt32            | Yes       | Transaction sequence of [EscrowCreate transaction][] that created the escrow to finish. |
| `Condition`     | String - Hexadecimal | Blob              | No        | The (previously-supplied) [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1) of the escrow. |
| `CredentialIDs` | Array of Strings     | Vector256         | No        | Set of Credentials to authorize a deposit made by this transaction. Each member of the array must be the ledger entry ID of a Credential entry in the ledger. For details, see [Credential IDs](https://xrpl.org/docs/references/protocol/transactions/types/payment#credential-ids). {% amendment-disclaimer name="Credentials" /%} |
| `Fulfillment`   | String - Hexadecmial | Blob              | No        | The [PREIMAGE-SHA-256 crypto-condition fulfillment](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1.4) matching the escrow's `Condition`. If present, must not be empty. |
| `Gas`           | Number               | UInt32            | No        | The maximum amount of gas that this transaction can use to execute the escrow's smart function, if it has one. Required if the escrow has a `Bytecode` field; must be omitted otherwise. {% amendment-disclaimer name="SmartEscrow" /%} |

Any account may submit an EscrowFinish transaction.

- If the escrow has a `FinishAfter` time, you cannot execute it before this time. Specifically, if the corresponding [EscrowCreate transaction][] specified a `FinishAfter` time that is after the close time of the most recently-closed ledger, the EscrowFinish transaction fails.
- If the escrow has a `Condition`, you cannot execute it unless you provide a matching `Fulfillment` for the condition.
- If the escrow has a `Bytecode` with a smart function, the smart function must return success for the escrow to execute. If the smart function does not return success, the transaction fails with moving funds, but can modify the escrow entry's `Data` field. {% amendment-disclaimer name="SmartEscrow" /%}
- You cannot execute an escrow after it has expired. Specifically, if the corresponding [EscrowCreate transaction][] specified a `CancelAfter` time that is before the close time of the most recently-closed ledger, the EscrowFinish transaction fails.

{% admonition type="info" name="Note" %}
On [test networks](https://xrpl.org/docs/concepts/networks-and-servers/parallel-networks.md) created before `rippled` version 1.6.0 (released in 2017), it may be possible [to delete](https://xrpl.org/docs/concepts/accounts/deleting-accounts) the destination account of a pending escrow. In this case, an attempt to finish the escrow fails with the result `tecNO_TARGET`, but the escrow remains unless it has expired normally. If another payment re-creates the destination account, the escrow can be finished successfully. The destination account of an escrow can only be deleted if the escrow was created before the [fix1523 amendment](https://xrpl.org/resources/known-amendments#fix1523) became enabled. No such escrows exist on the XRP Ledger Mainnet, so this edge case is not possible on Mainnet or any test networks created using `rippled` version 1.6.0 or later.
{% /admonition %}

## Special Transaction Cost

The minimum [transaction cost][] to submit an EscrowFinish transaction increases if it contains a fulfillment. If the transaction has no fulfillment, the transaction cost is the standard ledger base fee, typically 10 drops. If the transaction contains a fulfillment, the transaction cost is 330 [drops of XRP][] plus another 10 drops for every 16 bytes in size of the preimage. If the validators vote to increase or lower the base fee, the cost per 16 bytes is adjusted accordingly. The exact formula is:

```
(32 + ceiling(preimage_size ÷ 16)) × base_fee
```

- `base_fee` is the base transaction fee (typically 10 drops)
- `preimage_size` is the size of the fulfillment in bytes
- `ceiling` is the ceiling function, meaning to round up to the nearest integer

## Smart Escrow Metadata

When the escrow to be finished contains a [smart function](../concepts/programmability.md), the EscrowFinish transaction's [metadata](https://xrpl.org/docs/references/protocol/transactions/metadata) includes the following additional fields:

| Field | JSON Type | [Internal Type][] | Description |
|-------|-----------|-------------------|-------------|
| `GasUsed` | Number | UInt32 | The amount of gas actually used in executing the smart function. This affects the amount of XRP burned by the transaction sender. |
| `VMReturnCode` | Number | Int32 | The return code from the smart function. 

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results/):

| Error Code                 | Description |
|:---------------------------|:------------|
| `tecBYTECODE_REJECTED`     | The escrow's smart function did not return success. It may have returned `0` or a negative value, or thrown an error. {% amendment-disclaimer name="SmartEscrow" /%} |
| `tecCRYPTOCONDITION_ERROR` | The fulfillment did not match the escrow's crypto-condition; or the transaction specified a fulfillment but the escrow doesn't have a crypto-condition; or the crypto-condition specified in the transaction doesn't match the one in the escrow entry. |
| `tecFROZEN`                | The destination's trust line for the escrowed trust line token is deep frozen. {% amendment-disclaimer name="TokenEscrow" /%} |
| `tecINSUFFICIENT_RESERVE`  | Unable to create a trust line or `MPToken` entry due to lack of reserves. {% amendment-disclaimer name="TokenEscrow" /%} |
| `tecLOCKED`                | The destination's `MPToken` entry for the escrowed MPT is locked. {% amendment-disclaimer name="TokenEscrow" /%} |
| `tecNO_AUTH`               | Authorization requirements were not met. For example, the issuer requires authorization and the destination is not authorized. {% amendment-disclaimer name="TokenEscrow" /%} |
| `tecNO_DST`                | The escrow's destination account does not exist. |
| `tecNO_ENTRY`              | The destination account does not have an `MPToken` entry to hold the escrowed MPT. {% amendment-disclaimer name="TokenEscrow" /%} |
| `tecNO_LINE`               | The destination account does not have a trust line to hold the escrowed trust line token. {% amendment-disclaimer name="TokenEscrow" /%} |
| `tecNO_PERMISSION`         | The time-based conditions to finish the escrow haven't been met or the escrow is expired. Alternatively, the escrow's destination requires [Deposit Authorization](https://xrpl.org/docs/concepts/accounts/depositauth) and this transaction was not sent by the destination account nor authorized with the appropriate preauthorization or [credentials](https://xrpl.org/docs/concepts/decentralized-storage/credentials). {% amendment-disclaimer name="Credentials" /%} |
| `tecNO_TARGET`             | The specified escrow does not exist. |
| `tecOBJECT_NOT_FOUND`      | The MPT issuance does not exist for the escrowed MPT. {% amendment-disclaimer name="TokenEscrow" /%} |
| `tefNO_BYTECODE`           | The transaction specified a `Gas` field but the escrow does not have a smart function. {% amendment-disclaimer name="SmartEscrow" /%} |
| `tefBYTECODE_NOT_INCLUDED` | The transaction did not specify a `Gas` field, but escrow has a smart function so it requires gas to run. {% amendment-disclaimer name="SmartEscrow" /%} |
| `temBAD_LIMIT`             | The `Gas` field of the transaction is `0` or is larger than the network's current gas limit. {% amendment-disclaimer name="SmartEscrow" /%} |
| `temTEMP_DISABLED`         | Smart functions have been temporarily disabled by [fee voting](../concepts/fee-voting.md). |

## See Also

- [Escrow entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

<!-- Remove when porting back to xrpl.org: -->
[Escrow entry]: ./escrow-entry.md
[EscrowCreate transaction]: ./escrowcreate.md
