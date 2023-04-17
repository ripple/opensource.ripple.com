# AMM Transaction Result Codes

XLS-30d adds new result codes for transactions. (AMM-related transactions also reuse some existing result codes where appropriate.)

## ter Codes

| Code             | Explanation                                               |
|:-----------------|:----------------------------------------------------------|
| `terNO_AMM`      | The AMM-related transaction specifies an asset pair that does not currently have an AMM instance. |

## tec Codes

| Code                     | Value | Explanation                             |
|:-------------------------|:------|:----------------------------------------|
| `tecAMM_UNFUNDED`        | 162   | The [AMMCreate transaction](../transaction-types/ammcreate.md) failed because the sender does not have enough of the specified assets to fund it. |
| `tecAMM_BALANCE`         | 163   | The [AMMDeposit](../transaction-types/ammdeposit.md) or [AMMWithdraw](../transaction-types/ammwithdraw.md) failed because either the AMM or the user does not hold enough of one of the specified assets. (For example, you tried to withdraw more than the AMM holds.) |
| `tecAMM_FAILED_DEPOSIT`  | 164   | The [AMMDeposit transaction](../transaction-types/ammdeposit.md) failed, probably because the sender does not have enough of the specified assets, or because the deposit requested an effective price that isn't possible with the available amounts. |
| `tecAMM_FAILED_WITHDRAW` | 165   | The [AMMWithdraw transaction](../transaction-types/ammwithdraw.md) failed, probably because the sender does not have enough LP Tokens, or because the withdraw requested an effective price that isn't possible with the available amounts. |
| `tecAMM_INVALID_TOKENS`  | 166   | The AMM-related transaction failed due to insufficient LP Tokens or problems with rounding; for example, depositing a very small amount of assets could fail if the amount of LP Tokens to be returned rounds down to zero. |
| `tecAMM_FAILED_BID`      | 167   | The [AMMBid transaction](../transaction-types/ammbid.md) failed, probably because the price to win the auction was higher than the specified maximum value or the sender's current balance. |
| `tecAMM_FAILED_VOTE`     | 168   | The [AMMVote transaction](../transaction-types/ammvote.md) failed, probably because there are already too many votes from accounts that hold more LP Tokens for this AMM. (This can still recalculate the AMM's trading fee.) |

## tem Codes

| Code                | Explanation                                   |
|:--------------------|:----------------------------------------------|
| `temAMM_BAD_TOKENS` | The transaction incorrectly specified one or more assets. For example, the asset's issuer does not match the corresponding asset in the AMM's pool, or the transaction specified the same asset twice. |