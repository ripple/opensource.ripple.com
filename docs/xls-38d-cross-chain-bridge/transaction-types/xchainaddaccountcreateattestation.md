---
html: xchainaddaccountcreateattestation.html
parent: transaction-types.html
blurb: The `XChainAddAccountCreateAttestation` transaction provides an attestation from a witness server that a `XChainAccountCreateCommit` transaction occurred on the other chain.
labels:
  - Interoperability
status: not_enabled
---
# XChainAddAccountCreateAttestation

The `XChainAddAccountCreateAttestation` transaction provides an attestation from a witness server that a `XChainAccountCreateCommit` transaction occurred on the other chain.

The signature must be from one of the keys on the door's signer list at the time the signature was provided. If the signature list changes between the time the signature was submitted and the quorum is reached, the new signature set is used and some of the currently collected signatures may be removed.

Any account can submit signatures.

**Note:** The reward is only sent to accounts that have keys on the current list. A quorum of signers need to agree on the `SignatureReward`, the same way they need to agree on the other data. A single witness server can't provide an incorrect value for this in an attempt to collect a larger reward.

***TODO: Get example JSON.***
<!--
## Example {{currentpage.name}} JSON

```json

```
-->

## {{currentpage.name}} Fields

{% include '_snippets/tx-fields-intro.md' %}

| Field                            | JSON Type         | [Internal Type][] | Required? | Description |
|:---------------------------------|:------------------|:------------------|:----------|:------------|
| `Amount`                         | `Currency Amount` | `AMOUNT`          | Yes       | The amount committed by the `XChainAccountCreateCommit` transaction on the source chain. |
| `AttestationRewardAccount`       | `string`          | `ACCOUNT`         | Yes       | The account that should receive this signer's share of the `SignatureReward`. |
| `AttestationSignerAccount`       | `string`          | `ACCOUNT`         | Yes       | The account on the door account's signer list that is signing the transaction. |
| `Destination`                    | `string`          | `ACCOUNT`         | Yes       | The destination account for the funds on the destination chain. |
| `OtherChainSource`               | `string`          | `ACCOUNT`         | Yes       | The account on the source chain that submitted the `XChainAccountCreateCommit` transaction that triggered the event associated with the attestation. |
| `PublicKey`                      | `string`          | `BLOB`            | Yes       | The public key used to verify the signature. |
| `Signature`                      | `string`          | `BLOB`            | Yes       | The signature attesting to the event on the other chain. |
| `SignatureReward`                | `Currency Amount` | `AMOUNT`          | Yes       | The signature reward paid in the `XChainAccountCreateCommit` transaction. |
| `WasLockingChainSend`            | `number`          | `UINT8`           | Yes       | A boolean representing the chain where the event occurred. |
| `XChainAccountCreateCount`       | `string`          | `UINT64`          | Yes       | The counter that represents the order that the claims must be processed in. |
| `XChainBridge`                   | `XChainBridge`    | `XCHAIN_BRIDGE`   | Yes       | The bridge associated with the attestation. |
| `XChainBridge.LockingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the locking chain. |
| `XChainBridge.LockingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is locked and unlocked on the locking chain. |
| `XChainBridge.IssuingChainDoor`  | `string`          | `ACCOUNT`         | Yes       | The door account on the issuing chain. For an XRP-XRP bridge, this must be the genesis account (the account that is created when the network is first started, which contains all of the XRP). |
| `XChainBridge.IssuingChainIssue` | `Issue`           | `ISSUE`           | Yes       | The asset that is minted and burned on the issuing chain. For an IOU-IOU bridge, the issuer of the asset must be the door account on the issuing chain, to avoid supply issues. |


<!-- ## Error Cases

In addition to errors that can occur for all transactions, {{currentpage.name}} transactions can result in the following [transaction result codes](transaction-results.html):

| Error Code                    | Description                                  |
|:------------------------------|:---------------------------------------------|
| `temDISABLED`                 | The [NonFungibleTokensV1 amendment][] is not enabled. |
-->


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
