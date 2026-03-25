---
seo:
    description: Sponsors can pay transaction fees and reserve requirements on behalf of other accounts on the XRP Ledger.
labels:
  - Fees
  - Accounts
  - Sponsorship
status: not_enabled
---
# Sponsored Fees and Reserves

The Sponsored Fees and Reserves feature allows an account to pay transaction fees and reserve requirements on behalf of another account. The account that pays is called the _Sponsor_, and the account that benefits is called the _Sponsee_. Sponsees maintain full control over their keys and accounts while sponsors handle transaction submission and cover the associated costs.

{% admonition type="info" name="Note" %}
Sponsorship does not transfer XRP to the sponsee's wallet. The sponsor's XRP stays in the sponsor's account, and the ledger tracks which account is responsible for holding the reserve. This is not an "onramp" for the sponsee; it is a mechanism for the sponsor to cover costs on the sponsee's behalf.
{% /admonition %}

Without sponsorship, accounts must self-fund both transaction fees and reserves before they can transact on the XRP Ledger. Sponsorship provides a mechanism for entities with established XRP balances to subsidize these costs while maintaining strong on-chain accountability.

Sponsorship enables several important use cases, including:

- **Token distribution**: Issuers can distribute tokens without requiring recipients to hold XRP first.
- **NFT minting**: Creators can enable users to mint NFTs without upfront XRP costs.
- **Enterprise onboarding**: Businesses can onboard customers seamlessly without blockchain friction.

{% admonition type="success" name="Tip" %}
Similar features on other chains are often called "sponsored transactions", "meta-transactions", or "relays".
{% /admonition %}

_(Requires the [Sponsor amendment][] {% not-enabled /%})_

## How Sponsorship Works

XRP Ledger accounts can include signatures from sponsors in their transactions, allowing sponsors to pay the transaction cost and the reserve for any accounts or objects created in the transaction. Alternatively, sponsors can pre-fund fees or reserves if they do not want to co-sign every sponsored transaction.

For example, consider Spencer (sponsor) who wants to cover costs for Alice (sponsee):

- **Co-signing**: Alice constructs her transaction and includes Spencer's account and sponsorship type. Spencer signs the transaction, Alice adds his signature, then signs and submits it herself. This gives Spencer fine-grained control over every sponsored transaction.

- **Pre-funding**: Spencer submits a [SponsorshipSet transaction][] to allocate funds for Alice. This can cover both transaction fees and reserves for new objects, such as trust lines, escrows, or NFTs. From then on, Alice can submit transactions that reference Spencer as her sponsor without needing his signature each time. Spencer's involvement ends after the initial setup.

### Enabling Sponsorship and Covering Costs

For a transaction to be sponsored, at least one of the following flags must be enabled:

- `spfSponsorFee`: This flag indicates that the sponsor pays the transaction fee.
- `spfSponsorReserve`: This flag indicates that the sponsor covers the reserve for accounts or objects created in a transaction. No XRP is transferred to the sponsee; the sponsor's XRP stays in their own account, and the ledger simply tracks which account is responsible for holding the reserve.

If a transaction has **both** flags enabled, the sponsor pays for the fee and any reserves for newly created accounts or objects. Additionally, a single transaction cannot have different sponsors for the fee and the reserve; both must come from the same sponsor.

{% admonition type="warning" name="Note" %}
All transactions, other than pseudo-transactions, can use the `spfSponsorFee` flag since they all have a fee.

However, some transactions do not support the `spfSponsorReserve` flag:

- **Batch** transactions do not create objects, so `spfSponsorReserve` has no effect. To sponsor reserves for transactions within a batch, use `spfSponsorReserve` on the _inner_ transactions instead.

- **Pseudo-transactions** do not support the `spfSponsorReserve` flag, since fees and reserves for these transactions are covered by the network, not by any one account.

- Transactions that do not create any _new_ objects or accounts, such as AccountSet, have no effect when using `spfSponsorReserve`.
{% /admonition %}

### Reserve Calculation

Sponsorship modifies the reserve formula, shifting the burden from the sponsee to the sponsor.

The standard reserve calculation is:

```txt
acctReserve + objReserve × acct.OwnerCount
```

With sponsorship, the calculation becomes:

```txt
(acct.Sponsor ? 0 : acctReserve) +
objReserve × (acct.OwnerCount + acct.SponsoringOwnerCount - acct.SponsoredOwnerCount) +
acctReserve × acct.SponsoringAccountCount
```

- If the account has a `Sponsor` field, meaning its account reserve is sponsored, the base account reserve requirement is 0 for that account, and the sponsor covers it instead.
- `SponsoringOwnerCount` tracks objects this account sponsors.
- `SponsoredOwnerCount` tracks objects owned by this account that are sponsored by others.
- `SponsoringAccountCount` tracks accounts this account sponsors.

### Security Considerations

Sponsorship includes safeguards to protect both parties from misuse:

- **Co-signed flow**: Both parties must consent to each transaction by providing their signatures. The sponsor signs the entire transaction, including the sponsee's `Account` and `Sequence` fields, which prevents signature replay attacks. The sponsor also approves the `Fee` value and any fields that affect reserve requirements, such as `Destination` and `TicketCount`.

- **Pre-funded flow**: The sponsor consents once when submitting a `SponsorshipSet` transaction. The sponsee cannot modify the terms or exceed the deposited amount. The sponsor can limit usage with `MaxFee` and `ReserveCount`, or require their signature for specific transactions using the `lsfSponsorshipRequireSignForFee` or `lsfSponsorshipRequireSignForReserve` flags.

The sponsee cannot unilaterally change the sponsorship type, and the sponsor's funds cannot be used beyond the agreed terms. Only the sponsee can transfer a sponsorship to a new sponsor, and the new sponsor must co-sign the transaction to consent. Either party can exit a relationship at any time by submitting a [SponsorshipTransfer transaction][].

## Managing Sponsorships

Over time, sponsors may want to recoup their reserves, and sponsees may want to change sponsors or take on the reserve burden themselves. The [SponsorshipTransfer transaction][] supports three operations:

- **Create sponsorship**: Only the sponsee can create a new sponsorship. The new sponsor provides their signature via the standard signing flow.
- **Reassign sponsorship**: Only the sponsee can transfer an existing sponsorship to a new sponsor. The old sponsor is not directly involved.
- **End sponsorship**: Either the sponsor or sponsee can end a sponsorship at any time. The reserve burden returns to the object owner.

{% admonition type="warning" name="Warning" %}
When transferring the reserve burden back to a sponsee, the sponsee must have enough XRP to cover the reserve. If they do not, and the sponsor needs to exit the relationship quickly, the sponsor can pay the sponsee the XRP needed. However, the sponsor will **not** get their reserve back.

These steps can be executed atomically via a [Batch transaction](https://xrpl.org/docs/concepts/transactions/batch-transactions), to ensure that the sponsee cannot use the funds for something else before the transfer is validated.
{% /admonition %}

### Recouping Object Reserves

A sponsor who wants to recoup the reserve held for a sponsee's object, such as an NFT or trust line, can use the [SponsorshipTransfer transaction][] to transfer the reserve burden back to the sponsee or to a different sponsor.

### Recouping Account Reserves

A sponsor who wants to recoup the reserve held for a sponsee's account has two options:

- **If the sponsee is done using their account**: The sponsee can submit an [AccountDelete transaction](https://xrpl.org/docs/references/protocol/transactions/types/accountdelete). The destination, where leftover XRP goes, must be the sponsor's account. This ensures the sponsor gets their reserve back.

  {% admonition type="info" name="Note" %}
  Any sponsored objects owned by the sponsee are [deletion blockers](https://xrpl.org/docs/concepts/accounts/deleting-accounts/#requirements) and must be removed before the account can be deleted.
  {% /admonition %}

- **If the sponsee wants to keep their account**: Use the [SponsorshipTransfer transaction][] to remove the sponsorship or transfer it to a different sponsor.

### Deleting a Sponsor's Account

A sponsor's account cannot be deleted if it is sponsoring any existing accounts or objects. To unblock deletion, the sponsor can ask the sponsee to delete those objects, or use a [SponsorshipTransfer transaction][] to transfer the reserve burden back to the sponsee or to another sponsor. Sponsors cannot delete sponsored objects directly.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
