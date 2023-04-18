# AccountRoot

The XLS-30d proposal includes some changes to the existing [AccountRoot ledger entry type](https://xrpl.org/accountroot.html).

## AccountRoot Flags

There is a new flag:

| Flag Name | Hex Value    | Decimal Value | Corresponding [AccountSet Flag](https://xrpl.org/accountset.html#accountset-flags) | Description |
|-----------|--------------|---------------|-----------------------------------|----|
| `lsfAMM`  | `0x02000000` | 33554432      | (None)                            | This flag indicates that the account is an Automated Market Maker instance. |

You cannot set this flag on normal accounts.

## Special AMM AccountRoot Objects

Automated Market Makers use an AccountRoot object to issue their LP Tokens and hold the assets in the AMM pool, and an [AMM object](amm.md) for tracking some of the details of the AMM. The address of an AMM's AccountRoot is randomized so that users cannot identify and fund the address in advance of the AMM being created. Unlike normal accounts, AMM AccountRoot objects are created with the following settings:

- `lsfAMM` **enabled**. This indicates that the AccountRoot is part of an AMM and is not a regular account.
- `lsfDisableMaster` **enabled** and no other means of authorizing transactions. This ensures no one can control the account directly, and it cannot send transactions.
- `lsfRequireAuth` **enabled** and no accounts preauthorized. This ensures that the only way to add money to the AMM Account is using the [AMMDeposit transaction](../transaction-types/ammdeposit.md).
- `lsfDefaultRipple` **enabled**. This ensures that users can send and trade the AMM's LP Tokens among themselves.

These special accounts are not subject to the [reserve requirement](https://xrpl.org/reserves.html) but they can hold XRP if it is one of the two assets in the AMM's pool.

In most other ways, these accounts function like ordinary accounts; the LP Tokens they issue behave like other [tokens](https://xrpl.org/tokens.html) except that those tokens can also be used in AMM-related transactions. You can check an AMM's balances and the history of transactions that affected it the same way you would with a regular account.
