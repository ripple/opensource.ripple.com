# Updated Permission Values

Sponsored Fees and Reserves introduces two new [granular permissions](https://xrpl.org/docs/references/protocol/data-types/permission-values#granular-permissions).

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## Granular Permissions

| Numeric Value | Name             | Transaction Type | Description |
| :------------ | :--------------- | :--------------- | :---------- |
| 65549         | `SponsorFee`     | SponsorshipSet   | Can set or modify fee sponsorship fields (`FeeAmount`, `MaxFee`) and flags on a Sponsorship object. |
| 65550         | `SponsorReserve` | SponsorshipSet   | Can set or modify reserve sponsorship fields (`ReserveCount`) and flags on a Sponsorship object. |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
