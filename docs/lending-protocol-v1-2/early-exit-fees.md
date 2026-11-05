# Early-Exit Fees

The [LendingProtocolV1_2 amendment][] lets [closed-ended vaults](../lending-protocol-v1-1/closed-ended-vaults.md) allow withdrawals during the _investment_ phase in exchange for a fee.

Without an early-exit fee, depositors in a closed-ended vault can't withdraw during the investment phase. A `VaultWithdraw` transaction fails with `tecTOO_SOON` until the vault enters the redemption phase. An early-exit fee gives depositors a way out before then, while compensating the depositors who stay.

## Setting an Early-Exit Fee

The vault owner sets the fee with the `EarlyExitFeeRate` field when creating a closed-ended vault with a `VaultCreate` transaction. The rate is in units of 1/10th basis points, from `0` to `100000` (0% to 100%). For example, `2000` is a 2% fee.

The fee can't be added, changed, or removed after the vault is created, so depositors know the terms before they deposit.

{% admonition type="info" name="Note" %}
An omitted `EarlyExitFeeRate` and a rate of `0` mean different things. If the field is omitted, investment-phase withdrawals are blocked. If it's `0`, investment-phase withdrawals are allowed with no fee.
{% /admonition %}

## How the Fee Is Charged

| `EarlyExitFeeRate` | Investment-Phase Withdrawals |
| :----------------- | :--------------------------- |
| _(Omitted)_        | Blocked with `tecTOO_SOON`. |
| `0`                | Allowed with no fee. |
| `1` - `99999`      | Allowed, and the fee is deducted from the amount paid out. |
| `100000`           | Allowed, but the depositor's shares are burned and nothing is paid out. |

The fee only applies during the investment phase. Withdrawals during the subscription and redemption phases are never charged a fee.

When a fee applies:

1. The withdrawn shares are valued as usual, and that number of shares is burned.
2. The fee is calculated as the share value multiplied by the fee rate, rounded up.
3. The depositor receives the share value minus the fee, rounded down to the vault's precision. Any transfer fees from the asset's issuer still apply to this amount.

The fee stays in the vault rather than going to the vault owner. Since the vault's assets decrease by less than the value of the burned shares, the value of each remaining share increases.

For example, if a depositor withdraws shares worth 100,000 from a vault with a 2% early-exit fee, they receive 98,000 and the remaining 2,000 stays in the vault for the other shareholders.

## Exceptions

- **Final withdrawal**: If a withdrawal burns all of the vault's outstanding shares, no fee is charged.
- **Clawback**: `VaultClawback` is never charged an early-exit fee.

{% admonition type="info" name="Note" %}
The fee isn't recorded in transaction metadata. You can calculate it from the vault's `EarlyExitFeeRate`, or compare the value of the burned shares with the amount the destination account received.
{% /admonition %}

{% raw-partial file="/docs/_snippets/common-links.md" /%}
