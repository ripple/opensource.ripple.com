---
seo:
  description: Escrow and Payment channels can now accept both XRP and fungible tokens.
labels:
  - Escrow
  - Payment Channels
status: not_enabled
---
# Token-Enabled Escrows and Payment Channels 

The proposed amendment to the XRPL protocol, PaychanAndEscrowForTokens, would introduce changes to the ledger objects, transactions, and rpc methods to enable Escrows and PayChannels to use Trustline balances.

The XRPL supports several types of on-ledger negotiable instruments, namely: Escows, PayChannels and Checks. While each of these instruments is implemented as a first-class on-ledger object, only the Check object supports the use of trust line balances. PayChannels and Escrows supported only the native asset XRP. This limitation is a barrier to wider-spread use of these instruments for reasons including:

- Regulatory compliance.
- Unwillingness to hold a counter-party-free asset (i.e. XRP).
- Volatility and exchange-rate risk.

These issues are addressed by allowing both XRP and fungible tokens to be used for creating escrows and payment channels. 

## Concepts

- [Escrows](concepts/escrow.md)
- [Payment Channels](concepts/payment-channels.md)
- [Ripple State](concepts/ripplestate.md)

## Reference

### Transactions

- [EscrowCreate](./reference/escrowcreate.md)
- [PaymentChannelFund](./reference/paymentchannelfund.md)
- [PaymentChannelClaim](./reference/paymentchannelclaim.md)
- [PaymentChannelCreate](./reference/paymentchannelcreate.md)

### Requests

- [account_lines](./reference/account_lines.md)
- [account_channels](./reference/account_channels.md)
- [account_objects](./reference/account_objects.md)
- [channel_authorize](./reference/channel_authorize.md)
- [channel_verify](./reference/channel_verify.md)
