---
seo:
    description: Escrow funds, which can be released to the destination after a specific time or condition.
labels:
    - Escrow
    - Payments
txIcon: create
requiredAmendment: Escrow
---
# EscrowCreate
{% source-link path="src/libxrpl/tx/transactors/escrow/EscrowCreate.cpp" /%}

Set aside funds in an [escrow](https://xrpl.org/docs/concepts/payment-types/escrow.md) that delivers them to a predetermined recipient when certain conditions are met. If the escrow has an expiration, the funds can also be returned to the sender after it expires.

{% admonition type="info" name="Note" %}
To escrow fungible tokens you must take note of the following:

- Trust Line Tokens must have the **Allow Trust Line Locking** flag enabled on their account.
- Multi-Purpose-Tokens (MPTs) must have both the **Can Escrow** and **Can Transfer** flags enabled.
- If the token requires **authorization**, both sender and recipient must be pre-authorized by the issuer.
{% /admonition %}

{% amendment-disclaimer name="TokenEscrow" mode="updated" /%}


## Example {% $frontmatter.seo.title %} JSON

```json
{
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "TransactionType": "EscrowCreate",
    "Amount": "10000",
    "Destination": "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW",
    "CancelAfter": 533257958,
    "FinishAfter": 533171558,
    "Condition": "A0258020E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855810100",
    "DestinationTag": 23480,
    "SourceTag": 11747
}
```

{% tx-example txid="C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7" /%}


{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}

| Name                | JSON Type            | [Internal Type][] | Required? | Description            |
|:--------------------|:---------------------|:------------------|:----------|:-----------------------|
| `Amount`            | [Currency Amount][]  | Amount            | Yes       | Amount of XRP, in drops, or fungible tokens to deduct from the sender's balance and escrow. Once escrowed, the payment can either go to the `Destination` address (after the `FinishAfter` time) or be returned to the sender (after the `CancelAfter` time). {% amendment-disclaimer name="TokenEscrow" mode="updated" /%} |
| `Bytecode`          | String - Hexadecimal | Blob              | No        | Compiled WebAssembly (WASM) code with a [Smart Escrow](../concepts/programmability.md) function that must return success for the escrow to finish. {% amendment-disclaimer name="SmartEscrow" /%} |
| `Data`              | String - Hexadecimal | Blob              | No        | Arbitrary data that can be read and written by this escrow's smart function. If present, must not be empty and must be less than the  {% amendment-disclaimer name="SmartEscrow" /%} |
| `Destination`       | String - [Address][] | AccountID         | Yes       | Address to receive escrowed funds. |
| `CancelAfter`       | Number               | UInt32            | No        | The time when this escrow expires, in [seconds since the Ripple Epoch][]. This value is immutable; the funds can only be returned to the sender after this time. |
| `FinishAfter`       | Number               | UInt32            | No        | The time, when the escrowed funds can be released to the recipient, in [seconds since the Ripple Epoch][]. This value is immutable, and the funds can't be accessed until this time. |
| `Condition`         | String - Hexadecimal | Blob              | No        | A [PREIMAGE-SHA-256 crypto-condition](https://tools.ietf.org/html/draft-thomas-crypto-conditions-02#section-8.1) that must be fulfilled for funds to be released to the recipient. If the condition is not fulfilled before the expiration time specified in the `CancelAfter` field, the funds can only revert to the sender. |
| `DestinationTag`    | Number               | UInt32            | No        | An arbitrary tag to further specify the destination for this escrowed payment, such as a hosted recipient at the destination address. |

You must specify one of the following combinations of fields:

| Summary                           | `FinishAfter` | `Condition` | `CancelAfter` | `Bytecode` |
|-----------------------------------|---------------|-------------|---------------|------------|
| Time-based (XRP only)             | ✅            |             |               |            |
| Time-based with expiration        | ✅            |             | ✅            |            |
| Timed conditional (XRP only)      | ✅            | ✅          |               |            |
| Timed conditional with expiration | ✅            | ✅          | ✅            |            |
| Conditional with expiration       |               | ✅          | ✅            |            |
| Function-based with expiration    |               |             | ✅            | ✅         |
| Timed function with expiration    | ✅            |             | ✅            | ✅         |
| Conditional function with expiration |            | ✅          | ✅            | ✅         |
| Timed conditional function with expiration | ✅   | ✅          | ✅            | ✅         |

It is not possible to create a conditional or function-based escrow with no expiration, but you can specify an expiration that is very far in the future.

If an escrow has multiple criteria for release, including any combination of a time-based release, a crypto-condition, or a smart function, the escrow can only release funds to the recipient if _all_ of the criteria are met. For example, you can make an escrow that can only be released if the smart function returns success _and_ a crypto-condition is fulfilled, but you cannot make an escrow that can be released if the smart function _or_ crypto-condition are satisfied.

## Special Transaction Cost and Reserve

If the escrow has a `Bytecode` field, it has a special transaction cost of 10 times the base fee plus an additional 5 drops per byte. ***TODO: confirm whether the 5 drops per byte scales with the base fee too.***

## Error Cases

Besides errors that can occur for all transactions, {% $frontmatter.seo.title %} transactions can result in the following [transaction result codes](https://xrpl.org/docs/references/protocol/transactions/transaction-results/):

| Error Code            | Description                                  |
|:--------------------- |:---------------------------------------------|
| `tecNO_PERMISSION`    | The necessary permissions for token escrow are not in place. For example, the issuer hasn't enabled the Allow Trust Line Locking flag for a Trust Line Token.|
| `tecNO_AUTH`          | Authorization requirements for the token were not met. For example, the sender lacks authorization when creating the escrow. |
| `tecUNFUNDED`         | The sender lacks sufficient spendable balance. For Trust Line Tokens, this means the sender's trust line with the issuer has insufficient available balance. For XRP escrows, this means the sender doesn't have enough XRP. |
| `tecOBJECT_NOT_FOUND` | The sender does not hold the MPT. |
| `tecFROZEN`           | The token is frozen (for Trust Line Tokens) or locked (for MPTs) for the sender. |
| `temBAD_AMOUNT`       | The `Amount` is invalid. For example, it is negative; it is not XRP and the {% amendment-disclaimer name="TokenEscrow" compact=true /%} is not enabled; or it is larger than the maximum possible MPT amount. |
| `temBAD_EXPIRATION`   | The was a problem with the expiration (`CancelAfter`) or finish time (`FinishAfter`). For example, the transaction did not specify a required field, or the expiration is before the finish time. |
| `temTEMP_DISABLED`    | Smart functions have been temporarily disabled by [fee voting](../concepts/fee-voting.md). |

## See Also

- [Escrow entry][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}

<!-- Remove when porting back to xrpl.org: -->
[Escrow entry]: ./escrow-entry.md
