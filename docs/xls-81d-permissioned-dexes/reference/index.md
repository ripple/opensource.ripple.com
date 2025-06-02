# Permissioned DEXes Reference

The Permissioned DEXes amendment does not create any totally-new data types, but it modifies several transactions, ledger entries, and API methods:

- **Transactions:**
    - [OfferCreate](./offercreate.md) - Add `DomainID` field that specifies a domain.
    - [Payment](./payment.md) - Add `DomainID` field that specifies a domain.
- **Ledger Entries:**
    - [Offer](./offer.md) - Add `DomainID` field that specifies a domain.
    - [DirectoryNode](./directorynode.md) - Add `DomainID` field and modify ledger entry ID calculation for directories with a domain.
- **API Methods:**
    - [book_offers](./book_offers.md) - Can look up order books by domain.
    - [path_find](./path_find.md) - Can get paths limited to a domain.
    - [ripple_path_find](./ripple_path_find.md) - Can get paths limited to a domain.
    - [subscribe (books streams)](./subscribe.md) - Can subscribe to books in a domain.

## Amendment Information

| Amendment    | PermissionedDEX |
|:-------------|:------------|
| Amendment ID | `677E401A423E3708363A36BA8B3A7D019D21AC5ABD00387BDBEA6BDE4C91247E` |
| Status       | In Development |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |
