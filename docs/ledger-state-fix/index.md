---
seo:
  description: Repair corruptions to the XRP ledger.
labels:
  - Utilities, troubleshooting
---

# LedgerStateFix

[[Source]](https://github.com/XRPLF/rippled/blob/develop/src/xrpld/app/tx/detail/LedgerStateFix.cpp "Source")

{% partial file="/snippets/_ledgerstatefix-disclaimer.md" /%}

`LedgerStateFix` is a general purpose transaction used to fix specific issues affecting the XRP ledger. You submit the transaction with the `LedgerFixType` value set to indicate the particular error state to correct.

\_(Added by the [NonFungibleTokensV1_1](https://xrpl.org/resources/known-amendments#nonfungibletokensv1_1) amendment.

## Example LedgerStateFix JSON

```json
{
   "Account" : "<Signer and fee payer>",
   "Fee" : "2000000",
   "LedgerFixType" : 1,
   "Owner" : "<Account with corrupted NFTokenPage directory",
   "Sequence" : <n>,
   "SigningPubKey" : "<Account's public key>",
   "TransactionType" : "LedgerStateFix",
   "TxnSignature" : "<Signature>",
}
```

<table>
  <thead>
    <tr>
      <th style="width: 20%; text-align: left;">Field</th>
      <th style="width: 20%; text-align: left;">Data Type</th>
      <th style="width: 10%; text-align: left;">Required?</th>
      <th style="width: 50%; text-align: left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>TransactionType</code></td>
      <td>uint16</td>
      <td>Required</td>
      <td>Identifies this as a <code>LedgerStateFix</code> transaction.</td>
    </tr>
    <tr>
      <td><code>Account</code></td>
      <td>STAccount</td>
      <td>Required</td>
      <td>Identifies the account signing and submitting the transaction as well as paying the Fee.</td>
    </tr>
    <tr>
      <td><code>Fee</code></td>
      <td>STAmount</td>
      <td>Required</td>
      <td>This transaction is rare and potentially compute intensive. The minimum fee is the same as the fee for an AccountDelete transaction. If the transaction fails with a tec code, the fee is still charged.</td>
    </tr>
    <tr>
      <td><code>Flags</code></td>
      <td>uint32</td>
      <td>Optional</td>
      <td>Not needed for <code>LedgerFixType</code> == _1_. Reserved for a future type of ledger fix.</td>
    </tr>
    <tr>
      <td><code>LedgerFixType</code></td>
      <td>uint16</td>
      <td>Required</td>
      <td>Currently the only type is _1_, which fixes the NFToken directory for a single account.</td>
    </tr>
    <tr>
      <td><code>Owner</code></td>
      <td>STAccount</td>
      <td>Optional</td>
      <td>Required if <code>LedgerFixType</code> == _1_, the account ID that owns the NFToken directory that needs fixing. Need not have any relationship to Account.</td>
    </tr>
  </tbody>
</table>

## LedgerStateFix Flags

Transactions of the LedgerStateFix type can support additional values in the `Flags` field. Currently, there are no flags defined. A future `LedgerFixType` might require flag settings.

## Error Cases

Potential errors are those that can occur for all transactions. {% $frontmatter.seo.title %}.

## LedgerStateFix Types

`LedgerStateFix` might sound like a general panacea for all your ledger's ills, but in practice it is a targeted solution for very rare, known, and specific issues.

### Type 1

There are two different transactions that introduced corruptions to NFT directories. In both cases, the following conditions were met:

- There were at least two NFToken pages in the directory.
- The next-to-last page was completely full, holding 32 NFTokens.
- The very last page of the directory contained only one NFToken.
- The transaction removed the last remaining token from the last page.

When these conditions were met, the last NFToken page was removed and the next-to-last page was left as the final page in the directory.

That would be fine, except the NFToken directory has an expectation that the last page has a specific index. The page with that index was just deleted. When an NFToken is added to the directory, and that token has a high enough value that it doesn't belong on the current last page, then a new last page is created that has no links to the previous page, creating a hole in the middle of the list.

The `fixNFTokenPageLinks` amendment modifies the NFToken page, coalescing code to notice when the very last page of the directory would be removed. In that case, it moves all of the contents of the next lower page into the last page and deletes the next-to-last page. It then fixes up the links.

New invariant checks also validate aspects of the links on pages, so a similar corruption returns a tecINVARIANT_FAILED transaction result. That will prevent this specific type of corruption going forward.
