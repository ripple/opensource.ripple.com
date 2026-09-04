# Updated Transactions

The [LendingProtocolV1_1 amendment][] updates the following transactions to support [closed-ended vaults](./closed-ended-vaults.md).

## VaultCreate

### New Fields

| Field Name         | JSON Type | [Internal Type][] | Required? | Description |
| :----------------- | :-------- | :---------------- | :-------- | :---------- |
| `VaultKind`        | Number    | UInt8             | No        | The kind of vault to create. The default value `0` creates an open-ended vault; `1` creates a closed-ended vault. Immutable after the vault is created. |
| `SubscriptionDate` | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The time, in [seconds since the Ripple Epoch][], when the vault's subscription window closes and its investment period begins. Required when `VaultKind` is `1` and immutable after the vault is created. |
| `RedemptionDate`   | Number    | UInt32            | No        | _(Closed-ended vaults only)_ The time, in [seconds since the Ripple Epoch][], when the vault's investment period ends and depositors can redeem their shares. Required when `VaultKind` is `1` and immutable after the vault is created. |

{% admonition type="info" name="Note" %}
- `RedemptionDate` - `SubscriptionDate` must be at least `180` seconds and less than `946708560` seconds (30 years).
- Both dates must be in the future relative to the parent ledger's close time.
{% /admonition %}

### New Error Cases

| Error Code     | Description |
| :------------- | :---------- |
| `temMALFORMED` | <li>`VaultKind` is present with a value other than `0` or `1`.</li><li>`VaultKind` is `0`, but `SubscriptionDate` or `RedemptionDate` is present.</li><li>`VaultKind` is `1`, but is missing `SubscriptionDate` and `RedemptionDate`.</li><li>`RedemptionDate` - `SubscriptionDate` is less than `180` seconds or is greater than or equal to `946708560` seconds.</li> |
| `tecEXPIRED`   | `SubscriptionDate` or `RedemptionDate` isn't ahead of the parent ledger's close time. |
| `temDISABLED`  | `VaultKind`, `SubscriptionDate`, or `RedemptionDate` is present and the [LendingProtocolV1_1 amendment][] isn't enabled. |

## VaultDeposit

### New Error Cases

| Error Code   | Description |
| :----------- | :---------- |
| `tecEXPIRED` | The vault is closed-ended and in its _Investment_ or _Redemption_ phase. |

## VaultWithdraw

### New Error Cases

| Error Code     | Description |
| :------------- | :---------- |
| `tecTOO_SOON`  | The vault is closed-ended and in its _Investment_ phase. |

## LoanSet

A loan can only be originated against a closed-ended vault during its _Investment_ phase, and only if the loan's final scheduled payment is at least 60 seconds before the vault enters its _Redemption_ phase. This means the maximum term of new loans shrink as the vault approaches its `RedemptionDate`.

### New Error Cases

| Error Code         | Description |
| :----------------- | :---------- |
| `tecTOO_SOON`      | The vault is closed-ended and still in its _Subscription_ phase. |
| `tecEXPIRED`       | The vault is closed-ended and has entered its _Redemption_ phase. |
| `tecNO_PERMISSION` | The vault is closed-ended and the loan's final scheduled payment is less than 60 seconds before the vault's `RedemptionDate`. |

## LoanBrokerSet

A loan broker can only be attached to a _closed-ended_ vault. This only applies to loan brokers created after `LendingProtocolV1_1` is enabled.

### New Error Cases

| Error Code         | Description |
| :----------------- | :---------- |
| `tecNO_PERMISSION` | The target vault isn't closed-ended. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
