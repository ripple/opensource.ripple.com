The `Amount` type pairs a value with the asset it denominates:

```ts
interface Amount {
  asset: Asset   // what is being moved
  value: string  // the quantity, as a decimal string in display units (e.g., '10.5')
}
```

Build the `asset` field with one of the asset constructors:

| Constructor | Description |
| --- | --- |
| `XRP_ASSET` | XRP |
| `iou(currency, issuer)` | IOUs: `currency` is a 3-character code or 40-character hex; `issuer` is the issuer's r-address. |
| `mpt(mptIssuanceId, scale?)` | MPTs: `scale` is the decimal places between the display value and on-ledger base units (default `0`). |
