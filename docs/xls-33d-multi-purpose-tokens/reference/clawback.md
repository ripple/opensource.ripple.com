---
html: clawback.html
parent: transaction-types.html
blurb: Claw back tokens you've issued.
labels:
  - Tokens
---
# Clawback

{% partial file="/snippets/_mpts-disclaimer.md" /%}

[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/app/tx/impl/Clawback.cpp "Source")
<!-- uncomment for xrpl.org
{% include '_snippets/clawback-disclaimer.md' %}
-->
Claw back tokens issued by your account.

Clawback is disabled by default. To use clawback, you must send an [AccountSet transaction][] to enable the **Allow Trust Line Clawback** setting. An issuer with any existing tokens cannot enable Clawback. You can only enable **Allow Trust Line Clawback** if you have a completely empty owner directory, meaning you must do so before you set up any trust lines, offers, escrows, payment channels, checks, or signer lists.  After you enable Clawback, it cannot reverted: the account permanently gains the ability to claw back issued assets on trust lines.

## Example Clawback JSON

```json
{
    "TransactionType": "Clawback",
    "Account": "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    "Amount": {
      "value": 10,
      "mpt_issuance_id": "0000012FFD9EE5DA93AC614B4DB94D7E0FCE415CA51BED47",
    },
    "MPTokenHolder": "rajgkBmMxmz161r8bWYH7CQAFZP5bA9oSG"
}
```
<!--
{% include '_snippets/tx-fields-intro.md' %}
-->

| Field              | JSON Type | [Internal Type][] | Description       |
|:-------------------|:----------|:------------------|:------------------|
| `Amount`           | [Currency Amount][]  | Amount |Indicates the amount being clawed back, as well as the counterparty from which the amount is being clawed back. The quantity to claw back, in the `value` sub-field, must not be zero. If this is more than the current balance, the transaction claws back the entire balance. The sub-field `issuer` within `Amount` represents the token holder's account ID, rather than the issuer's.|
| `MPTokenHolder`    | string    | AccountID          | (Optional) Specifies the holder's address from which to claw back. The holder must already own an `MPToken` object with a non-zero balance. |

To claw back funds from an MPT holder, the issuer must have specified that the MPT allows clawback by setting the `tfMPTCanClawback` flag when creating the MPT using the `MPTokenIssuanceCreate` transaction. Assuming a MPT was created with this flag set, clawbacks are allowed using the `Clawback` transaction.

**Note:** In the XRP Ledger, the party that created a token is called the _issuer_, but trust lines are bidirectional and, under some configurations, both sides can be seen as the issuer. In this transaction, the token issuer's address is in the `Account` field, and the token holder's address is in the `Amount` field's `issuer` sub-field.


## Error Cases

Besides errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following transaction result codes: <!--[transaction result codes](transaction-results.html):-->

| Error Code | Description |
|:-----------|:------------|
| `temDISABLED` | Occurs if the <!--[Clawback amendment](known-amendments.html#clawback)--> Clawback amendment is not enabled. |
| `temBAD_AMOUNT` | Occurs if the holder's balance is 0. It is not an error if the amount exceeds the holder's balance; in that case, the maximum available balance is clawed back. Also occurs if the counterparty listed in `Amount` is the same as the `Account` issuing this transaction. |
| `tecNO_LINE` | Occurs there is no trust line with the counterparty or that trust line's balance is 0. |
| `tecNO_PERMISSION` | Occurs if you attempt to set `lsfAllowTrustlineClawback` while `lsfNoFreeze` is set. Also occurs, conversely, if you try to set `lsfNoFreeze` while `lsfAllowTrustLineClawback` is set. |

<!-- {# common link defs #} -->
<!-- Uncomment for xrpl.org
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %} -->
