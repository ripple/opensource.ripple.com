---
blurb: Batch allows up to 8 transactions to be submitted as a single unit.
labels:
  - Batch
  - Transactions
status: not_enabled
---
# Batch Transactions

`Batch`  lets you package multiple transactions together and execute them as a single unit. It eliminates the risk of partial completion and unexpected outcomes, giving you a more reliable and predictable experience for complex operations. Up to eight transactions can be submitted in a single batch.

Some potential uses for `Batch` include the following.
- All or nothing: You can mint an NFT and create an offer for it in one transaction. If the offer creation fails, the NFT mint is reverted as well.
- Trying out a few offers: Submit multiple offers with different amounts of slippage, but only one will succeed.
- Platform fees: Package platform fees within the transaction itself, simplifying the process.
- Swaps (multi-account): Trustless token/NFT swaps between multiple accounts.
- Withdrawing accounts (multi-account): Attempt a withdrawal from your checking account, and if that fails, withdraw from your savings account instead.

`Batch` transactions are comprised of the _outer transaction_, the wrapper `Batch` transaction itself, and the _inner transactions_, each of which is executed atomically. The precise way that the inner transactions are processed is determined by the batch _mode_.

## Batch Mode

There are four possible batch modes: `ALLORNOTHING`, `ONLYONE`, `UNTILFAILURE`, and `INDEPENDENT`.

### All or Nothing

In `ALLORNOTHING` mode, all inner transactions must succeed for any one of them to succeed.

### Only One

`ONLYONE` mode means that the first transaction to succeed is the only one to succeed. All other transactions either failed or were never tried.

### Until Failure

`UNTILFAILURE` applies all transactions until the first failure. All transactions after the first failure are not applied.

### Independent

All transactions are applied, even if one or more of the inner transactions fail.

## Raw Transactions

The `RawTransactions` object is a container for the list of transactions to be applied. You can include up to eight transactions in a sincle batch. The transactions can come from one account or multiple accounts.

Each inner transaction:

- must set the `tfInnerBatchTxn` flag.
- must not have a fee. It must use a fee value of _0_.
- must not be signed (the global transaction is already signed by all relevant parties). They must instead have an empty string ("") in the `SigningPubKey` and `TxnSignature` fields.

A transaction is considered a failure if it receives any result that is not `tesSUCCESS`.

<!-- 
The `RawTransactions` field is not included in the validated transaction, nor is it used to compute the outer transaction signature(s), since all transactions are included separately as a part of the ledger.
-->

<!-- 
### BatchTxn

The `BatchTxn` inner object must be included in any inner transaction of a `Batch` transaction. It prevents hash collisions between identical transactions (since sequence numbers aren't included). It ensures that every transaction has a sequence number associated with it, so that created ledger objects that use it in their ID generation can still operate. It allows users to more easily organize their transactions in the correct order.

It captures the account submitting the outer transaction, the sequence number of the outer transaction, the sequence number of the outer transaction. If it is a multi-account transaction, it captures the next available sequence number in the inner transaction's account.
-->

### BatchSigners

This field is included if the account is signing with multi-sign (as opposed to a single signature). It operates equivalently to the `Signers` field used in standard transaction multi-sign. This field holds the signatures for the `Flags` field and the hashes of the transactions in `RawTransactions`. It is only needed if multiple accounts' transactions are included in the `Batch` transaction; otherwise, the normal transaction signature provides the same security guarantees.

This field must be provided if more than one account has inner transactions included in the Batch. In that case, this field must contain signatures from all accounts whose inner transactions are included, excluding the account signing the outer transaction (if applicable).

Each object in this array contains the following fields:

| Field Name	  | Required?	| JSON Type	| Internal Type |
|---------------|-----------|-----------|---------------|
| Account	      | yes       |	string	  | STAccount     |
| SigningPubKey	|	no        | string    | STBlob        |
| TxnSignature  | no        | string    | STBlob        |
| Signers		    | no        | array	    | STArray       |

Either the `SigningPubKey` and `TxnSignature` fields must be included, or the `Signers` field.

#### Account
This is an account that has at least one inner transaction.

#### SigningPubKey and TxnSignature
These fields are included if the account is signing with a single signature (as opposed to multi-sign). They sign the `Flags` field and the hashes of the transactions in `RawTransactions`.

#### Signers
This field is included if the account is signing with multi-sign (as opposed to a single signature). It operates equivalently to the `Signers` field used in standard transaction multi-sign. This field holds the signatures for the `Flags` field and the hashes of the transactions in `RawTransactions`.


<!-- ## Transaction IDs

`TxnIDs` conatains a list of the transaction hashes/IDs for all transactions contained in `RawTranscations`. This is the only information about the inner transactions that is stored on the ledger within the `Batch` transaction, since the inner transactions themselves have their own transactions on the ledger. The hashes in `TxnIDs` must be in the same order as the inner transactions in `RawTransactions`. -->

## Transaction Fee

The fee for the outer transaction is twice the base fee (a total of 20 drops when there is no fee escalation), plus the sum of the transaction fees of all the inner transactions (which incorporates factors like higher fees for `multisign` or `AMMCreate`), plus an additional base fee amount for each additional signature in the transaction (for example, from `BatchSigners`).

The fees for the individual inner transactions are paid in the outer transaction rather than the inner transactions themselves, to ensure that fee escalation is calculated on the total cost of the batch transaction and not just the overhead.

## Metadata

Inner transactions are committed separately to the ledger and therefore have separate metadata. This ensures better backward compatibility for legacy systems, so that they can support `Batch` transactions without needing changes to their systems.

For example, a ledger that only has one `Batch` transaction containing 2 inner transactions would look like this:

[
  OuterTransaction,
  InnerTransaction1,
  InnerTransaction2
]

### Outer Transaction

Each outer transaction contains the metadata for its sequence and fee processing, not for the inner transaction processing. Any error code is only based on the outer transaction processing (for example, sequence and fee), and it returns a tesSUCCESS error even if inner transaction processing fails.

<!--
There is also a list of which transactions are actually processed, which is useful for the ONLYONE and UNTILFAILURE modes, since those might only process a subset of transactions. It can also hellp with debugging all modes. This section is called `BatchExecutions`. It contains a list of objects with the `TransactionHash` and `TransactionResult` for every transaction processed (whether or not it succeeds).

It's possible that not every transaction is included in the list. For example, when using`ONLYONE` mode, once a transaction succeeds, all other transactions are skipped.

Transactions are only included in the ledger if their result code is `tesSuccess` and the outer transaction has a result code of `tesSuccess`. For example, an inner transaction might have a result code of `tesSuccess` without being included in the ledger if you use the `ALLORNOTHING` mode and another transaction in the batch fails.
-->
### Inner Transaction

Each inner transaction contains the metadata for its own processing. Only the inner transactions that are actually committed to the ledger are included. This makes it easier for legacy systems to process `Batch` transactions as if they were normal.

There is also a pointer back to the parent outer transaction (`ParentBatchID`).

## Transaction Common Fields
This standard doesn't add any new fields to the transaction common fields, but it does add another global transaction flag:

| Flag Name	      | Value      |
|-----------------|------------|
| tfInnerBatchTxn	| 0x40000000 |

This flag should be used only if a transaction is an inner transaction in a `Batch` transaction. This signifies that the transaction shouldn't be signed. Any normal transaction that includes this flag should be rejected.

<!-- ## Edge Cases

Inner transactions don't have `Sequences` or `TicketSequences`, unlike a normal transaction. This causes some problems when it comes to transaction processing, due to a few edge cases.

### Ledger Object ID Generation

Some objects, such as offers and escrows, use the sequence number of the creation transaction as a part of their ledger entry ID generation, to ensure uniqueness of the IDs.

To get around this, in single-account Batch transactions, a _phantom sequence number_ is used instead. The phantom sequence number is equal to `BatchTxn.OuterSequence` + `BatchTxn.BatchIndex`.

Multi-account transactions use the same phantom sequence number strategy, using `BatchTxn.Sequence` + `BatchTxn.BatchIndex`, since the outer sequence doesn't map to the inner transaction's account.

### Sequence Number Handling

Sequence numbers are always consumed (i.e. the AccountRoot's Sequence is incremented) if any inner transactions are processed. A transaction counts as being "processed" if it is applied to the ledger (that is, if a `tec` or `tes` error is received). The sequence number for each account is incremented by the total number of inner transactions included in the `Batch` transaction, to avoid any hash collisions. -->

## Security

### Trust Assumptions

Regardless of how many accounts' transactions are included in a `Batch` transaction, all accounts need to sign the collection of transactions.

#### Single Account

In the single account case, the single account must approve all of the transactions it is submitting. No other accounts are involved.

#### Multi Account

The multi-account case is a bit more complicated and is best illustrated with an example. 

Alice and Bob are conducting a trustless swap via a multi-account `Batch`, with Alice providing 1000 XRP and Bob providing 1000 USD. Bob submits the `Batch` transaction, so Alice must provide her part of the swap to him.

If Alice provides a fully autofilled and signed transaction to Bob, Bob can submit Alice's transaction on the ledger without submitting his and receive the 1000 XRP without losing his 1000 USD. Therefore, the inner transactions must be unsigned.

If Alice just signs her part of the Batch transaction, Bob can modify his transaction to only provide 1 USD instead, thereby getting his 1000 XRP at a much cheaper rate. Therefore, the entire Batch transaction (and all its inner transactions) must be signed by all parties.

### Inner Transaction Safety
An inner batch transaction is a special case. It doesn't include a signature or a fee (since those are both included in the outer transaction). Therefore, they must be handled carefully to ensure that someone can't somehow directly submit an inner `Batch` transaction without it being included in an outer transaction.

Inner transactions cannot be broadcast (and won't be accepted if they happen to be broadcast, for example, from a malicious node). They must be generated from the `Batch` outer transaction instead. Inner transactions cannot be directly submitted via the submit RPC.

## Batch Transaction Examples

### One Account

In this example, the user is creating an offer while trading on a DEX UI, and the second transaction is a platform fee. The inner transactions are not signed, and the `BatchSigners` field is not needed on the outer transaction, since there is only one account involved.

```json
{
  TransactionType: "Batch",
  Account: "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
  Flags: 0x00010000,
  RawTransactions: [
    {
      RawTransaction: {
        TransactionType: "OfferCreate",
        Flags: 1073741824,
        Account: "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
        TakerGets: "6000000",
        TakerPays: {
          currency: "GKO",
          issuer: "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
          value: "2"
        },
        Sequence: 4,
        Fee: "0",
        SigningPubKey: ""
      }
    },
    {
      RawTransaction: {
        TransactionType: "Payment",
        Flags: 1073741824,
        Account: "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
        Destination: "rDEXfrontEnd23E44wKL3S6dj9FaXv",
        Amount: "1000",
        Sequence: 5,
        Fee: "0",
        SigningPubKey: ""
      }
    }
  ],
  Sequence: 3,
  Fee: "40",
  SigningPubKey: "022D40673B44C82DEE1DDB8B9BB53DCCE4F97B27404DB850F068DD91D685E337EA",
  TxnSignature: "3045022100EC5D367FAE2B461679AD446FBBE7BA260506579AF4ED5EFC3EC25F4DD1885B38022018C2327DB281743B12553C7A6DC0E45B07D3FC6983F261D7BCB474D89A0EC5B8"
}
```

### Sample Ledger Confirmation

This example shows what the ledger looks like after the transaction is confirmed.
Note that the inner transactions are committed as normal transactions.

```json
[
  {
    TransactionType: "Batch",
    Account: "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    Flags: 0x00010000,
    RawTransactions: [
      {
        RawTransaction: {
          TransactionType: "OfferCreate",
          Flags: 1073741824,
          Account: "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
          TakerGets: "6000000",
          TakerPays: {
            currency: "GKO",
            issuer: "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
            value: "2"
          },
          Sequence: 4,
          Fee: "0",
          SigningPubKey: ""
        }
      },
      {
        RawTransaction: {
          TransactionType: "Payment",
          Flags: 1073741824,
          Account: "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
          Destination: "rDEXfrontEnd23E44wKL3S6dj9FaXv",
          Amount: "1000",
          Sequence: 5,
          Fee: "0",
          SigningPubKey: ""
        }
      }
    ],
    Sequence: 3,
    Fee: "40",
    SigningPubKey: "022D40673B44C82DEE1DDB8B9BB53DCCE4F97B27404DB850F068DD91D685E337EA",
    TxnSignature: "3045022100EC5D367FAE2B461679AD446FBBE7BA260506579AF4ED5EFC3EC25F4DD1885B38022018C2327DB281743B12553C7A6DC0E45B07D3FC6983F261D7BCB474D89A0EC5B8"
  },
  {
    TransactionType: "OfferCreate",
    Flags: 1073741824,
    Account: "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    TakerGets: "6000000",
    TakerPays: {
      currency: "GKO",
      issuer: "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      value: "2"
    },
    Sequence: 4,
    Fee: "0",
    SigningPubKey: ""
  },
  {
    TransactionType: "Payment",
    Flags: 1073741824,
    Account: "rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b",
    Destination: "rDEXfrontEnd23E44wKL3S6dj9FaXv",
    Amount: "1000",
    Sequence: 5,
    Fee: "0",
    SigningPubKey: ""
  }
]
```

### Multiple Accounts

In this example, two users are atomically swapping their tokens, XRP for GKO. The inner transactions still are not signed, but the `BatchSigners` field is needed on the outer transaction, since there are two accounts' inner transactions in this `Batch` transaction.
```json
{
  TransactionType: "Batch",
  Account: "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
  Flags: 0x00010000,
  RawTransactions: [
    {
      RawTransaction: {
        TransactionType: "Payment",
        Flags: 1073741824,
        Account: "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
        Destination: "rUser2fDds782Bd6eK15RDnGMtxf7m",
        Amount: "6000000",
        Sequence: 5,
        Fee: "0",
        SigningPubKey: ""
      }
    },
    {
      RawTransaction: {
        TransactionType: "Payment",
        Flags: 1073741824,
        Account: "rUser2fDds782Bd6eK15RDnGMtxf7m",
        Destination: "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
        Amount: {
          currency: "GKO",
          issuer: "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
          value: "2"
        },
        Sequence: 20,
        Fee: "0",
        SigningPubKey: ""
      }
    }
  ],
  BatchSigners: [
    {
      BatchSigner: {
        Account: "rUser2fDds782Bd6eK15RDnGMtxf7m",
        SigningPubKey: "03C6AE25CD44323D52D28D7DE95598E6ABF953EECC9ABF767F13C21D421C034FAB",
        TxnSignature: "304502210083DF12FA60E2E743643889195DC42C10F62F0DE0A362330C32BBEC4D3881EECD022010579A01E052C4E587E70E5601D2F3846984DB9B16B9EBA05BAD7B51F912B899"
      }
    },
  ],
  Sequence: 4,
  Fee: "60",
  SigningPubKey: "03072BBE5F93D4906FC31A690A2C269F2B9A56D60DA9C2C6C0D88FB51B644C6F94",
  TxnSignature: "30440220702ABC11419AD4940969CC32EB4D1BFDBFCA651F064F30D6E1646D74FBFC493902204E5B451B447B0F69904127F04FE71634BD825A8970B9467871DA89EEC4B021F8"
}
```

#### Sample Ledger Response

```json
[
  {
    TransactionType: "Batch",
    Account: "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
    Flags: 0x00010000,
    RawTransactions: [
      {
        RawTransaction: {
          TransactionType: "Payment",
          Flags: 1073741824,
          Account: "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
          Destination: "rUser2fDds782Bd6eK15RDnGMtxf7m",
          Amount: "6000000",
          Sequence: 5,
          Fee: "0",
          SigningPubKey: ""
        }
      },
      {
        RawTransaction: {
          TransactionType: "Payment",
          Flags: 1073741824,
          Account: "rUser2fDds782Bd6eK15RDnGMtxf7m",
          Destination: "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
          Amount: {
            currency: "GKO",
            issuer: "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
            value: "2"
          },
          Sequence: 20,
          Fee: "0",
          SigningPubKey: ""
        }
      }
    ],
    BatchSigners: [
      {
        BatchSigner: {
          Account: "rUser2fDds782Bd6eK15RDnGMtxf7m",
          SigningPubKey: "03C6AE25CD44323D52D28D7DE95598E6ABF953EECC9ABF767F13C21D421C034FAB",
          TxnSignature: "304502210083DF12FA60E2E743643889195DC42C10F62F0DE0A362330C32BBEC4D3881EECD022010579A01E052C4E587E70E5601D2F3846984DB9B16B9EBA05BAD7B51F912B899"
        }
      },
    ],
    Sequence: 4,
    Fee: "60",
    SigningPubKey: "03072BBE5F93D4906FC31A690A2C269F2B9A56D60DA9C2C6C0D88FB51B644C6F94",
    TxnSignature: "30440220702ABC11419AD4940969CC32EB4D1BFDBFCA651F064F30D6E1646D74FBFC493902204E5B451B447B0F69904127F04FE71634BD825A8970B9467871DA89EEC4B021F8"
  },
  {
    TransactionType: "Payment",
    Flags: 1073741824,
    Account: "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
    Destination: "rUser2fDds782Bd6eK15RDnGMtxf7m",
    Amount: "6000000",
    Sequence: 5,
    Fee: "0",
    SigningPubKey: ""
  },
  {
    TransactionType: "Payment",
    Flags: 1073741824,
    Account: "rUser2fDds782Bd6eK15RDnGMtxf7m",
    Destination: "rUser1fcu9RJa5W1ncAuEgLJF2oJC6",
    Amount: {
      currency: "GKO",
      issuer: "ruazs5h1qEsqpke88pcqnaseXdm6od2xc",
      value: "2"
    },
    Sequence: 20,
    Fee: "0",
    SigningPubKey: ""
  }
]
```

