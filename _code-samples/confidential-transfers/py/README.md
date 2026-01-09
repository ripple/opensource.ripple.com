# Confidential Transfers Examples (Python)

This directory contains Python examples demonstrating how to issue Multi-Purpose Tokens (MPTs) with confidential transfer capabilities on the XRP Ledger using XLS-96.

## Setup

Install dependencies before running any examples:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

> **Note**: xrpl-py uses the [mpt-crypto](https://github.com/XRPLF/mpt-crypto) C extension for ElGamal encryption and zero-knowledge proofs. It should be automatically compiled when installing `xrpl-py` with confidential transfer support.

## Issue MPT with Confidential Transfers

```sh
python issue-mpt-confidential.py
```

The script demonstrates the complete flow of creating an MPT with confidential transfer capabilities. It should output:

```sh
=== Generating Accounts ===
Issuer: rD3WNSDgCvjR2BV99iJwuNbWaHw79FnbAe
Issuer Second Account: r37aF5y8LmnevoSazEPBxcuK9q16BxygR5
Auditor: rJ8PzfXouMh9p7pu2qeYQQqNogLZw3E3ZZ

=== Generating ElGamal Keypairs ===
Issuer ElGamal Public Key: 0235DF4B6A3B01BFD8981BB00D7BF93C45B304756E6C0B1BB90DC2C2814C9A5079
Issuer Second Account ElGamal Public Key: 0229FB94F953F527D256156F628BEBF0CC0CF142210B332A7E3EAAF0239E9CA6A3
Auditor ElGamal Public Key: 03DCF9E4AE3425877A8E31FECB7E0D4039E8D6C0A6DC763F8A1FE89A5B5A8C8551

=== Creating MPT Issuance... ===
Submitting MPTokenIssuanceCreate transaction...
MPT issuance created successfully!
MPT Issuance ID: 0035245E850CD28DE38957CCD3AA04AB7AEE25B2F218D0BE

=== Registering ElGamal Keys On-Ledger... ===
Submitting MPTokenIssuanceSet transaction...
{
  "account": "rD3WNSDgCvjR2BV99iJwuNbWaHw79FnbAe",
  "transaction_type": "MPTokenIssuanceSet",
  "signing_pub_key": "",
  "mptoken_issuance_id": "0035245E850CD28DE38957CCD3AA04AB7AEE25B2F218D0BE",
  "issuer_elgamal_public_key": "0235DF4B6A3B01BFD8981BB00D7BF93C45B304756E6C0B1BB90DC2C2814C9A5079",
  "auditor_elgamal_public_key": "03DCF9E4AE3425877A8E31FECB7E0D4039E8D6C0A6DC763F8A1FE89A5B5A8C8551"
}
ElGamal keys registered successfully!

=== Sending public tokens to issuer second account... ===
Submitting MPTokenAuthorize transaction...
Issuer second account authorized CTST MPT successfully!

Submitting Payment transaction...
Payment successful!
Issuer Sent 1000 CTST tokens to r37aF5y8LmnevoSazEPBxcuK9q16BxygR5

=== Converting Public Balance to Confidential... ===
Generating zero-knowledge proof...
Encrypting amount for holder...
Encrypting amount for issuer...
Encrypting amount for auditor...

Submitting ConfidentialMPTConvert transaction...
{
  "account": "r37aF5y8LmnevoSazEPBxcuK9q16BxygR5",
  "transaction_type": "ConfidentialMPTConvert",
  "signing_pub_key": "",
  "mptoken_issuance_id": "0035245E850CD28DE38957CCD3AA04AB7AEE25B2F218D0BE",
  "mpt_amount": 1000,
  "holder_encrypted_amount": "02AA26FCE527014BA9A148721074E4E2D6760399C6C3512ADD51FE14526CF259C9021C9CF39776966B2D095011296BB4D52414B8123463A619E9F7347FD11D6F72F0",
  "issuer_encrypted_amount": "02AA26FCE527014BA9A148721074E4E2D6760399C6C3512ADD51FE14526CF259C903E1FFED64B7F41543AF73B5F9B2B16FDD3BA8D9B477FD0993DAE84FEFCFA94032",
  "blinding_factor": "3E9185BC123763C3F0FA564422768C6BC42B9D1B6B0D722EA81F46347DB6CAC7",
  "holder_elgamal_public_key": "0229FB94F953F527D256156F628BEBF0CC0CF142210B332A7E3EAAF0239E9CA6A3",
  "auditor_encrypted_amount": "02AA26FCE527014BA9A148721074E4E2D6760399C6C3512ADD51FE14526CF259C9029901F33957FD0DEC77DCF25E96E7EDDDC24AA7AE533398CA119297421B97343D",
  "zk_proof": "02DD6A920AA90AA91500D04757D2E51F788F2F751FCABF3698E969606741D206F66C36C37DE4BAAF6EEF423F0C7D08AFE8DB382314C041755B999AB1223435E6AF"
}
Conversion successful!
Converted 1000 CTST tokens to confidential balance.

=== Merging Inbox into Spending Balance... ===
Submitting ConfidentialMPTMergeInbox transaction...
{
  "account": "r37aF5y8LmnevoSazEPBxcuK9q16BxygR5",
  "transaction_type": "ConfidentialMPTMergeInbox",
  "signing_pub_key": "",
  "mptoken_issuance_id": "0035245E850CD28DE38957CCD3AA04AB7AEE25B2F218D0BE"
}
Merge successful!

=== Verifying Confidential Balances ===
Querying issuer second account's MPToken object...

Issuer second account MPToken object:
{
  "Account": "r37aF5y8LmnevoSazEPBxcuK9q16BxygR5",
  "AuditorEncryptedBalance": "02AA26FCE527014BA9A148721074E4E2D6760399C6C3512ADD51FE14526CF259C9029901F33957FD0DEC77DCF25E96E7EDDDC24AA7AE533398CA119297421B97343D",
  "ConfidentialBalanceInbox": "03CE04EA1FC44C65E9DE022DCD08B9DDDFA881922909C2A080E7171CF8574D9A2003F481D7BBAB214E638BE548588B71F7E280EE64C8EFD0424D80FCF5640DBB1A68",
  "ConfidentialBalanceSpending": "02595D92B73CD0A7DDB5D81B5BAF668C5367DDAF499AD8D0EF556D3526AA2FE5A90247149548FF9B26862AB9D980D2ED0AFE5E2B6F940623B1EA97C2868F2E05CAF4",
  "ConfidentialBalanceVersion": 1,
  "Flags": 0,
  "HolderElGamalPublicKey": "0229FB94F953F527D256156F628BEBF0CC0CF142210B332A7E3EAAF0239E9CA6A3",
  "IssuerEncryptedBalance": "02AA26FCE527014BA9A148721074E4E2D6760399C6C3512ADD51FE14526CF259C903E1FFED64B7F41543AF73B5F9B2B16FDD3BA8D9B477FD0993DAE84FEFCFA94032",
  "LedgerEntryType": "MPToken",
  "MPTokenIssuanceID": "0035245E850CD28DE38957CCD3AA04AB7AEE25B2F218D0BE",
  "OwnerNode": "0",
  "PreviousTxnID": "1826376084C31D89B90946306E0D70D0557C6B404DBE4356675269F6660B5432",
  "PreviousTxnLgrSeq": 3482748,
  "index": "5398F35AA4EA52AA0AC10C3A5A067C85FF70F8131921BE8678C9673D6EC5F1F9"
}

=== Saving Keys for Development ===
Keys and issuance data saved to confidential-setup.json
```
