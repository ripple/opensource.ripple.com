# AccountRoot

The XLS-30d proposal includes some changes to the existing [AccountRoot ledger entry type](https://xrpl.org/accountroot.html).

## AccountRoot Fields

There is a new field:

| Field            | JSON Type           | [Internal Type][] | Required? | Description  |
|:-----------------|:--------------------|:------------------|:----------|--------------|
| `AMMID`          | String              | Hash256           | No        | The ledger entry ID of the corresponding AMM ledger entry. Set during account creation; cannot be modified. If present, indicates that this is a special AMM AccountRoot; always omitted on non-AMM accounts. |


## Special AMM AccountRoot Objects

Automated Market Makers use an AccountRoot ledger entry to issue their LP Tokens and hold the assets in the AMM pool, and an [AMM ledger entry](amm.md) for tracking some of the details of the AMM. The address of an AMM's AccountRoot is randomized so that users cannot identify and fund the address in advance of the AMM being created. Unlike normal accounts, AMM AccountRoot objects are created with the following settings:

- `lsfDisableMaster` **enabled** and no means of authorizing transactions. This ensures no one can control the account directly, and it cannot send transactions.
- `lsfDepositAuth` **enabled** and no accounts preauthorized. This ensures that the only way to add money to the AMM Account is using the [AMMDeposit transaction](../transaction-types/ammdeposit.md).
- `lsfDefaultRipple` **enabled**. This ensures that users can send and trade the AMM's LP Tokens among themselves.

In addition, the following special rules apply to an AMM's AccountRoot entry:

- It is not subject to the [reserve requirement](https://xrpl.org/reserves.html). It can hold XRP only if XRP is one of the two assets in the AMM's pool.
- It cannot be the destination of Checks, Escrows, or Payment Channels. Any transactions that would create such entries instead fail with the result code `tecNO_PERMISSION`.
- Users cannot create trust lines to it for anything other than the AMM's LP Tokens. Transactions that would create such trust lines instead fail with result code `tecNO_PERMISSION`. (The AMM does have two trust lines to hold the tokens in its pool, or one trust line if the other asset in its pool is XRP.)
- If [Clawback (XLS-39d)](https://github.com/XRPLF/XRPL-Standards/blob/master/XLS-39d-clawback/README.md) is also enabled, the issuer cannot clawback funds from an AMM.

Other than those exceptions, these accounts are like ordinary accounts; the LP Tokens they issue behave like other [tokens](https://xrpl.org/tokens.html) except that those tokens can also be used in AMM-related transactions. You can check an AMM's balances and the history of transactions that affected it the same way you would with a regular account.
