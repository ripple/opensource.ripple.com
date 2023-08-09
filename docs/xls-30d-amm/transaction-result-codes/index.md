# AMM Transaction Result Codes

XLS-30d adds new result codes for transactions. (AMM-related transactions also reuse some existing result codes where appropriate.)

## ter Codes

| Code             | Explanation                                               |
|:-----------------|:----------------------------------------------------------|
| `terNO_AMM`      | The AMM-related transaction specifies an asset pair that does not currently have an AMM instance. |

## tec Codes

| Code                     | Value | Explanation                             |
|:-------------------------|:------|:----------------------------------------|
| `tecAMM_ACCOUNT`         | 168   | The transaction failed because the operation is not allowed on Automated Market Maker (AMM) accounts. |
| `tecAMM_UNFUNDED`        | 162   | The [AMMCreate transaction](../transaction-types/ammcreate.md) failed because the sender does not have enough of the specified assets to fund it. |
| `tecAMM_BALANCE`         | 163   | The [AMMDeposit](../transaction-types/ammdeposit.md) or [AMMWithdraw](../transaction-types/ammwithdraw.md) failed because either the AMM or the user does not hold enough of one of the specified assets. (For example, you tried to withdraw more than the AMM holds.) |
| `tecAMM_EMPTY`           | 166   | The AMM-related transaction failed because the AMM has no assets in its pool. |
| `tecAMM_FAILED`          | 164   | The AMM-related transaction failed. For an [AMMDeposit](../transaction-types/ammdeposit.md) or [AMMWithdraw](../transaction-types/ammwithdraw.md) this could be because the sender does not have enough of the specified assets, or the transaction requested an effective price that isn't possible with the available amounts. For [AMMBid](../transaction-types/ammbid.md) this could be because the account does not have enough to win the bid or needs more than their specified maximum bid. For [AMMVote](../transaction-types/ammvote.md), this could be because there are already too many votes from other accounts that hold more of this AMM's LP Tokens. |
| `tecAMM_INVALID_TOKENS`  | 165   | The AMM-related transaction failed due to insufficient LP Tokens or problems with rounding; for example, depositing a very small amount of assets could fail if the amount of LP Tokens to be returned rounds down to zero. |
| `tecAMM_NOT_EMPTY`       | 167   | The transaction was meant to operate on an AMM with empty asset pools, but the specified AMM currently holds assets. |


## tem Codes

| Code                | Explanation                                   |
|:--------------------|:----------------------------------------------|
| `temBAD_AMM_TOKENS` | The transaction incorrectly specified one or more assets. For example, the asset's issuer does not match the corresponding asset in the AMM's pool, or the transaction specified the same asset twice. |