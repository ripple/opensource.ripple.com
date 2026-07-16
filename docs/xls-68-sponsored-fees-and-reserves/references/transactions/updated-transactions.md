# Updated Transactions

This page describes the changes to existing transaction types introduced by Sponsored Fees and Reserves.

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## Payment Transaction Updates

### Example JSON

```json
{
  "TransactionType": "Payment",
  "Account": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf", // The sponsor funding the account creation
  "Destination": "rfkDkFai4jUfCvAJiZ5Vm7XvvWjYvDqeYo", // The new account being created and sponsored
  "Amount": "1",  // 1 drop, the minimum
  "Flags": 524288, // tfSponsorCreatedAccount
  "Fee": "10",
  "Sequence": 3
}
```

### Payment Flags

A new flag is added to the [Payment transaction](https://xrpl.org/docs/references/protocol/transactions/types/payment) for sponsoring new accounts:

| Flag Name                 | Hex Value    | Decimal Value | Description |
| :------------------------ | :----------- | :------------ | :---------- |
| `tfSponsorCreatedAccount` | `0x00080000` | 524288        | This flag is only valid if the Payment is used to create an account. If it is enabled, the created account will be sponsored by the `Account` submitting the transaction. |

### Error Cases

When `tfSponsorCreatedAccount` is enabled, the following additional error cases apply:

| Error Code                 | Description |
| :------------------------- | :---------- |
| `temINVALID_FLAG`          | `tfNoRippleDirect`, `tfPartialPayment`, or `tfLimitQuality` are enabled. The `tfSponsorCreatedAccount` flag cannot be combined with these flags. |
| `temBAD_AMOUNT`            | The `Amount` specifies a non-XRP currency. |
| `tecNO_SPONSOR_PERMISSION` | The `Destination` already exists. This flag is only valid when creating a new account. |
| `tecUNFUNDED_PAYMENT`      | The sponsoring `Account` does not have enough XRP to deliver the `Amount` while still covering its own reserve (or the transaction fee, whichever is greater). |

## AccountDelete Transaction Updates

The [AccountDelete transaction](https://xrpl.org/docs/references/protocol/transactions/types/accountdelete) adds new constraints for sponsored accounts. If the account being deleted has a `Sponsor` field, the `Destination` must equal the `Sponsor` value to ensure the sponsor can recoup their reserve.

On successful deletion, the sponsor's `SponsoringAccountCount` is decremented by one.

### Example JSON

```json
{
  "TransactionType": "AccountDelete",
  "Account": "rWYkbWkCeg8dP6rXALnjgZSjjLyih5NXm",
  "Destination": "rN7n7otQDd6FczFgLdlqtyMVrn3HMfXpf", // The sponsor
  "Fee": "5000000",
  "Sequence": 2470665
}
```

### Error Cases

The following additional error cases apply for `AccountDelete` transactions:

| Error Code                 | Description |
| :------------------------- | :---------- |
| `tecNO_SPONSOR_PERMISSION` | The `AccountRoot` has a `Sponsor` field, but the `Destination` is not equal to the sponsor. Sponsored account funds must go to the sponsor. |
| `tecHAS_OBLIGATIONS` | The `AccountRoot` has a non-zero `SponsoringOwnerCount` or `SponsoringAccountCount` field. The account cannot be deleted until those sponsorships are transferred or dissolved. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
