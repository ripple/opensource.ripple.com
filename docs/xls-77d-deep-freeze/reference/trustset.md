---
html: trustset.html
parent: transaction-types.html
seo:
    description: Add or modify a trust line.
labels:
  - Tokens
---
# TrustSet
{% partial file="/docs/_snippets/_deep-freeze-disclaimer.md" /%}


[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/xrpld/app/tx/detail/SetTrust.cpp "Source")

Create or modify a [trust line](https://xrpl.org/docs/concepts/tokens/fungible-tokens) linking two accounts.

## Example {% $frontmatter.seo.title %} JSON

```json
{
    "TransactionType": "TrustSet",
    "Account": "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
    "Fee": "12",
    "Flags": 262144,
    "LastLedgerSequence": 8007750,
    "LimitAmount": {
      "currency": "USD",
      "issuer": "rsP3mgGb2tcYUrxiLFiHJiQXhsziegtwBc",
      "value": "100"
    },
    "Sequence": 12
}
```

[Query example transaction. >](https://xrpl.org/resources/dev-tools/websocket-api-tool?server=wss%3A%2F%2Fxrplcluster.com%2F&req=%7B%22id%22%3A%22example_TrustSet%22%2C%22command%22%3A%22tx%22%2C%22transaction%22%3A%228566673ECD0A9731C516906E5D2F47129C5C13713602140733831A56CEAE1A05%22%2C%22binary%22%3Afalse%7D)

{% raw-partial file="/docs/_snippets/tx-fields-intro.md" /%}
<!--{# fix md highlighting_ #}-->

| Field                    | JSON Type | [Internal Type][] | Description       |
|:-------------------------|:----------|:------------------|:------------------|
| `LimitAmount`            | Object    | Amount            | Object defining the trust line to create or modify, in the format of a [Currency Amount][https://xrpl.org/docs/references/protocol/data-types/currency-formats#xrp-amounts]. |
| `LimitAmount`.`currency` | String    | (Amount.currency) | The currency to this trust line applies to, as a three-letter [ISO 4217 Currency Code](https://www.xe.com/iso4217.php) or a 160-bit hex value according to [currency format](https://xrpl.org/docs/references/protocol/data-types/currency-formats). "XRP" is invalid. |
| `LimitAmount`.`value`    | String    | (Amount.value)    | Quoted decimal representation of the limit to set on this trust line. |
| `LimitAmount`.`issuer`   | String    | (Amount.issuer)   | The address of the account to extend trust to. |
| `QualityIn`              | Number    | UInt32            | _(Optional)_ Value incoming balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value. For example, if you set the value to 10,000,000, 1% of incoming funds remain with the sender. If an account sends 100 currency, the sender retains 1 currency unit and the destination receives 99 units. This option is included for parity: in practice, you are much more likely to set a `QualityOut` value. Note that this fee is separate and independent from token transfer fees. |
| `QualityOut`             | Number    | UInt32            | _(Optional)_ Value outgoing balances on this trust line at the ratio of this number per 1,000,000,000 units. A value of `0` is shorthand for treating balances at face value.  For example, if you set the value to 10,000,000, 1% of outgoing funds would remain with the issuer.  If the sender sends 100 currency units, the issuer retains 1 currency unit and the destination receives 99 units. Note that this fee is separate and independent from token transfer fees. |

If the account specified in `LimitAmount.issuer` is blocking incoming trust lines, the transaction fails with the result code `tecNO_PERMISSION`. _(Requires the [DisallowIncoming amendment][https://xrpl.org/docs/concepts/] )_


## TrustSet Flags

Transactions of the TrustSet type support additional values in the [`Flags` field](https://xrpl.org/docs/references/protocol/transactions/common-fields#flags-field), as follows:

| Flag Name         | Hex Value    | Decimal Value | Description               |
|:------------------|:-------------|:--------------|:--------------------------|
| `tfSetfAuth`      | `0x00010000` | 65536         | Authorize the other party to hold [currency issued by this account](https://xrpl.org/docs/concepts/tokens). (No effect unless using the [`asfRequireAuth` AccountSet flag](https://xrpl.org/docs/references/protocol/transactions/types/accountset#accountset-flags).) Cannot be unset. |
| `tfSetNoRipple`   | `0x00020000` | 131072        | Enable the No Ripple flag, which blocks [rippling](https://xrpl.org/docs/concepts/tokens/fungible-tokens/rippling) between two trust lines of the same currency if this flag is enabled on both. |
| `tfClearNoRipple` | `0x00040000` | 262144        | Disable the No Ripple flag, allowing [rippling](https://xrpl.org/docs/concepts/tokens/fungible-tokens/rippling) on this trust line. |
| `tfSetFreeze`     | `0x00100000` | 1048576       | [Freeze](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes) the trust line. |
| `tfClearFreeze`   | `0x00200000` | 2097152       | [Unfreeze](https://xrpl.org/docs/concepts/tokens/fungible-tokens/freezes) the trust line. |
| `tfSetDeepFreeze` | `0x00400000` | 4194304       | [Deep Freeze](../deep-freeze.md) the trust line. |
| `tfClearDeepFreeze` | `0x00800000` | 8388608     | Clear the deep freeze on the trust line. |

If a transaction tries to enable No Ripple but cannot, it fails with the result code `tecNO_PERMISSION`. Before the [fix1578 amendment](https://xrpl.org/resources/known-amendments#fix1578) became enabled, such a transaction would result in `tesSUCCESS` (making any other changes it could) instead.

The Auth flag of a trust line does not determine whether the trust line counts towards its owner's XRP reserve requirement. However, an enabled Auth flag prevents the trust line from being in its default state. An authorized trust line can never be deleted. An issuer can pre-authorize a trust line with the `tfSetfAuth` flag only, even if the limit and balance of the trust line are 0.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
