---
seo:
    description: Create, update, or delete a Sponsorship ledger entry on the XRP Ledger.
labels:
    - Fees
    - Accounts
    - Sponsorship
status: not_enabled
---
# SponsorshipSet

[[Source]](https://github.com/tequdev/rippled/blob/sponsor/src/libxrpl/tx/transactors/Sponsor/SponsorshipSet.cpp)

Create, update, or delete a [Sponsorship ledger entry][] on the XRP Ledger.

{% admonition type="warning" name="Warning" %}
This transaction requires that you specify either the **CounterpartySponsor** or **Sponsee**, but not both.
{% /admonition %}

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## Example JSON

```json
{
  "TransactionType": "SponsorshipSet",
  "Account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf",
  "Sponsee": "rfkDkFai4jUfCvAJiZ5Vm7XvvWjYvDqeYo",
  "FeeAmount": "1000000",
  "MaxFee": "1000",
  "ReserveCount": 5,
  "Fee": "12",
  "Sequence": 42
}
```

## {% $frontmatter.seo.title %} Fields

In addition to the [common fields](./updated-common-transaction-fields.md#common-transaction-updates#common-transaction-fields), {% code-page-name /%} transactions use the following fields:

| Field Name            | JSON Type | [Internal Type][] | Required? | Description |
| :-------------------- | :-------- | :---------------- | :-------- | :---------- |
| `CounterpartySponsor` | String    | AccountID         | No        | The sponsor associated with this relationship. This account also pays for the reserve of this object. If this field is included, the `Account` is assumed to be the sponsee. |
| `FeeAmount`           | String    | Amount            | No        | The remaining amount of XRP that the sponsor has provided for the sponsee to use for fees. This value replaces what is currently in the `Sponsorship.FeeAmount` field, if it exists. |
| `MaxFee`              | String    | Amount            | No        | The maximum fee per transaction that will be sponsored. This prevents abuse or excessive draining of the sponsored fee pool. |
| `ReserveCount`        | Number    | UInt32            | No        | The remaining amount of reserves that the sponsor has provided for the sponsee to use. This value replaces what is currently in the `Sponsorship.ReserveCount` field, if it exists. |
| `Sponsee`             | String    | AccountID         | No        | The sponsee associated with this relationship. If this field is included, the `Account` is assumed to be the sponsor. |

## {% $frontmatter.seo.title %} Flags

{% code-page-name /%} transactions support additional values in the `Flags` field, as follows:

| Flag Name                                   | Hex Value    | Decimal Value | Description |
| :------------------------------------------ | :----------- | :------------ | :---------- |
| `tfSponsorshipSetRequireSignForFee`         | `0x00010000` | 65536         | Adds the restriction that every use of this sponsor for sponsoring fees requires a signature from the sponsor. |
| `tfSponsorshipClearRequireSignForFee`       | `0x00020000` | 131072        | Removes the restriction that every use of this sponsor for sponsoring fees requires a signature from the sponsor. |
| `tfSponsorshipSetRequireSignForReserve`     | `0x00040000` | 262144        | Adds the restriction that every use of this sponsor for sponsoring reserves requires a signature from the sponsor. |
| `tfSponsorshipClearRequireSignForReserve`   | `0x00080000` | 524288        | Removes the restriction that every use of this sponsor for sponsoring reserves requires a signature from the sponsor. |
| `tfDeleteObject`                            | `0x00100000` | 1048576       | Deletes the `Sponsorship` ledger object. When enabled, no other fields or flag-setting fields may be specified. Deleting returns any remaining XRP in `FeeAmount` to the sponsor's account. |

## Deleting a Sponsorship Object

To delete a `Sponsorship` object, the sponsor or sponsee submits a {% code-page-name /%} transaction with the `tfDeleteObject` flag enabled. Any remaining XRP in `FeeAmount` is returned to the sponsor's account upon deletion.

Deleting the `Sponsorship` object only removes the pre-funded fee and reserve arrangement between the sponsor and sponsee. Ledger entries that were previously created using sponsored reserves retain their `Sponsor` field and remain sponsored. To transfer or dissolve sponsorship for those existing ledger entries, use the [SponsorshipTransfer transaction][].

## Error Cases

Besides errors that can occur for all transactions, {% code-page-name /%} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results):

| Error Code        | Description |
| :---------------- | :---------- |
| `tecNO_DST`       | The sponsor or sponsee account does not exist on the ledger. |
| `tecNO_ENTRY`     | The `tfDeleteObject` flag is enabled but the `Sponsorship` object does not exist. |
| `tecUNFUNDED`     | The sponsor does not have sufficient XRP to fund the `FeeAmount` or to cover the reserve for the `Sponsorship` object. |
| `temBAD_AMOUNT`   | An amount field is invalid. This can occur when:<ul><li>`FeeAmount` is negative or not denominated in XRP.</li><li>`MaxFee` is negative or not denominated in XRP.</li></ul> |
| `temINVALID_FLAG` | The transaction has invalid flags. This can occur when:<ul><li>Conflicting flags are enabled, such as both `tfSponsorshipSetRequireSignForFee` and `tfSponsorshipClearRequireSignForFee`.</li><li>The `tfDeleteObject` flag is enabled with flags that modify the object's settings.</li></ul> |
| `temMALFORMED`    | The transaction is malformed. This can occur when:<ul><li>The `Account` is not equal to either the sponsor or sponsee.</li><li>Both `CounterpartySponsor` and `Sponsee` are specified.</li><li>Neither `CounterpartySponsor` nor `Sponsee` is specified.</li><li>The sponsee attempts to create or update the object. Only the sponsor can create or update.</li><li>The `tfDeleteObject` flag is enabled and `FeeAmount`, `MaxFee`, or `ReserveCount` is specified.</li><li>The sponsor and sponsee are the same account.</li></ul> |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
