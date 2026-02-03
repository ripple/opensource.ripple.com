# Permissioned DEXes Reference

The Permissioned DEXes amendment does not create any new data types, but it modifies several transactions, ledger entries, and API methods.

- **Transactions:**
    - [OfferCreate](#offercreate-transaction-changes) - Add `DomainID` field that specifies a domain.
    - [Payment](#payment-transaction-changes) - Add `DomainID` field that specifies a domain.
- **Ledger Entries:**
    - [Offer](#offer-entry-changes) - Add `DomainID` field that specifies a domain.
    - [DirectoryNode](#directorynode-entry-changes) - Add `DomainID` field and modify ledger entry ID calculation for directories with a domain.
- **API Methods:**
    - [book_offers](#book_offers-api-method-changes) - Can look up order books by domain.
    - [path_find](#path_find-api-method-changes) - Can get paths limited to a domain.
    - [ripple_path_find](#ripple_path_find-api-method-changes) - Can get paths limited to a domain.
    - [subscribe (books streams)](#subscribe-api-method-changes) - Can subscribe to books in a domain.


## OfferCreate transaction changes

OfferCreate transactions can include the following new field:

| Field            | JSON Type           | [Internal Type][] | Required? | Description |
|:-----------------|:--------------------|:------------------|:----------|-------------|
| `DomainID`       | String - [Hash][]   | Hash256           | No        | The ledger entry ID of a permissioned domain. If provided, restrict this offer to the [permissioned DEX](./permissioned-dexes.md) of that domain. _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |

They can also use the following new flag:

| Flag Name             | Hex Value    | Decimal Value | Description           |
|:----------------------|:-------------|:--------------|:----------------------|
| `tfHybrid`            | `0x00100000` | 1048576       | Make this a hybrid offer that can use both a permissioned DEX and the open DEX. The `DomainID` field must be provided when using this flag. |

Full reference documentation with these changes in context (draft): [OfferCreate](https://xrpl-dev-portal--xls-81.preview.redocly.app/docs/references/protocol/transactions/types/offercreate)


## Payment transaction changes

Payment transactions can include the following new field:

| Field            | JSON Type            | [Internal Type][] | Required? | Description |
|:-----------------|:---------------------|:------------------|:----------|:------------|
| `DomainID`       | String - [Hash][]    | Hash256           | No        | The ledger entry ID of a permissioned domain. If this is a cross-currency payment, only use the corresponding [permissioned DEX](./permissioned-dexes.md) to convert currency. Both the sender and the recipient must have valid credentials that grant access to the specified domain. This field has no effect if the payment is not cross-currency. _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |

Full reference documentation with these changes in context (draft): [Payment](https://xrpl-dev-portal--xls-81.preview.redocly.app/docs/references/protocol/transactions/types/payment)


## Offer entry changes

Offer ledger entries can include the following new fields:

| Name                | JSON Type            | [Internal Type][] | Required? | Description |
|:--------------------|:---------------------|:------------------|:----------|:------------|
| `AdditionalBooks`   | Array                | Array             | No        | A list of additional offer directories that link to this offer. This field is present if this is a hybrid offer in a [permissioned DEX](./permissioned-dexes.md). The array always contains exactly 1 entry. _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |
| `DomainID`          | String - [Hash][]    | Hash256          | No        | The ledger entry ID of a permissioned domain. If present, this offer belongs to the corresponding [Permissioned DEX](./permissioned-dexes.md). _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |

Full reference documentation with these changes in context (draft): [Offer](https://xrpl-dev-portal--xls-81.preview.redocly.app/docs/references/protocol/ledger-data/ledger-entry-types/offer)


## DirectoryNode entry changes

DirectoryNode ledger entries, specifically offer directories, can contain the following new field:

| Field            | JSON Type            | [Internal Type][] | Required? | Description |
|:-----------------|:---------------------|:------------------|:----------|:------------|
| `DomainID`       | String - [Hash][]    | Hash256           | No        | (Offer directories only) The ledger entry ID of a permissioned domain. If present, this order book belongs to the corresponding [Permissioned DEX](./permissioned-dexes.md). _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |

Additionally, the formula for the ledger entry ID of an offer directory's first page incorporates the `DomainID` field at the end of the hashed contents, if the directory is part of a permissioned DEX. The formula for open DEX offer directories' IDs is unchanged.

Full reference documentation with these changes in context (draft): [DirectoryNode](https://xrpl-dev-portal--xls-81.preview.redocly.app/docs/references/protocol/ledger-data/ledger-entry-types/directorynode)


## book_offers API method changes

You can specify the following new field in `book_offers` API method requests:

| `Field`        | Type             | Required? | Description |
|:---------------|:-----------------|:----------|-------------|
| `domain`       | [Hash][]         | No        | The ledger entry ID of a permissioned domain. If provided, return offers from the corresponding [permissioned DEX](./permissioned-dexes.md) instead of using the open DEX. _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |

Full reference documentation with these changes in context (draft): [book_offers method](https://xrpl-dev-portal--xls-81.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/book_offers)


## path_find API method changes

You can specify the following new field in `path_find` API method requests when using the `create` sub-command:

| Field                 | Type                 | Required? | Description |
|:----------------------|:---------------------|:----------|:------------|
| `domain`              | String - [Hash][]    | No        | The ledger entry ID of a permissioned domain. If provided, only return paths that use the corresponding [permissioned DEX](./permissioned-dexes.md). _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |

Full reference documentation with these changes in context (draft): [path_find method](https://xrpl-dev-portal--xls-81.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/path_find)


## ripple_path_find API method changes

You can specify the following new field in `ripple_path_find` API method requests:

| Field                 | Type                 | Required? | Description |
|:----------------------|:---------------------|:----------|:------------|
| `domain`              | String - [Hash][]    | No        | The ledger entry ID of a permissioned domain. If provided, only return paths that use the corresponding [permissioned DEX](./permissioned-dexes.md). _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |

Full reference documentation with these changes in context (draft): [ripple_path_find method](https://xrpl-dev-portal--xls-81.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/ripple_path_find)


## subscribe API method changes

In the `subscribe` API method, when you subscribe to order books using the `books` field of the request, you can use the following new field in the objects nested inside `books`:

| Field        | Type                 | Required? | Description |
|:-------------|:---------------------|:----------|:------------|
| `domain`     | String - [Hash][]    | No        | The ledger entry ID of a permissioned domain. If provided, subscribe to the order book for the corresponding [Permissioned DEX](./permissioned-dexes.md) instead of the open DEX. _(Requires the [PermissionedDEX amendment][] {% not-enabled /%})_ |

Full reference documentation with these changes in context (draft): [subscribe method](https://xrpl-dev-portal--xls-81.preview.redocly.app/docs/references/http-websocket-apis/public-api-methods/path-and-order-book-methods/subscribe)


## Amendment Information

| Amendment    | PermissionedDEX |
|:-------------|:------------|
| Amendment ID | `677E401A423E3708363A36BA8B3A7D019D21AC5ABD00387BDBEA6BDE4C91247E` |
| Status       | In Development |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

{% raw-partial file="/docs/_snippets/common-links.md" /%}
