# Sponsored Fees and Reserves Examples (Python)

This directory contains Python examples demonstrating how to sponsor transaction fees and reserves for other accounts on the XRP Ledger.

## Setup

Install dependencies before running any examples:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Sponsor a Transaction (Co-signed)

```sh
python sponsor_co_signed.py
```

The script should output the sponsored MPTokenAuthorize transaction and sponsorship details:

```sh
=== Loading setup data... ===

MPT Issuance ID: 0000A98C748BDAE6F4A202E5B1EF4EE65A3EFA6C65EA9E65
Issuer address:  rBdNvZ3z1JuioZaXejFXQkf5otfnuwPNFD

=== Creating wallets... ===
Sponsor address: rJq1SZRgbPyi6inJjvU5Uoux1rJNaTaJyu
Funded sponsor with 100 XRP

Sponsee address: rLu5q357e4obMEo68CCS3Le2fT4ahikMHv

=== Creating sponsee's account... ===
{
  "Account": "rJq1SZRgbPyi6inJjvU5Uoux1rJNaTaJyu",
  "TransactionType": "Payment",
  "Flags": 524288,
  "SigningPubKey": "",
  "Amount": "1",
  "Destination": "rLu5q357e4obMEo68CCS3Le2fT4ahikMHv"
}

Sponsee account created successfully!

=== Preparing sponsored transaction... ===
{
  "Account": "rLu5q357e4obMEo68CCS3Le2fT4ahikMHv",
  "TransactionType": "MPTokenAuthorize",
  "Fee": "10",
  "Sequence": 79694,
  "LastLedgerSequence": 79715,
  "SigningPubKey": "EDAE01CC5520AA86F36F267115634B72EA7545C44B12FA20DB08EF42D9BDB97840",
  "TxnSignature": "2F05FF9DF5F49621A9BF3950947BDF4ED1A19A6028B5E08CC96AEACE2131BEA680C9A533F50CD10EB35B27CD041BF070AC82AA214C3A99FB661509CAD767AC0A",
  "Sponsor": "rJq1SZRgbPyi6inJjvU5Uoux1rJNaTaJyu",
  "SponsorFlags": 3,
  "SponsorSignature": {
    "SigningPubKey": "ED325E2D6C23A4FB9D6985BC3500C9E7C645ED769A7BC121FEB4ACC20ADBE9C909",
    "TxnSignature": "5E1FF4E17D6FEF32045691E5BA6480440AC9CCEF7D7F2F25B638673FB4A9E9AC4BE895B0823F41AD0DFC8FFBCB899070AE261D5D4072EE742222625C72036804"
  },
  "MPTokenIssuanceID": "0000A98C748BDAE6F4A202E5B1EF4EE65A3EFA6C65EA9E65"
}

=== Submitting sponsored transaction... ===
Transaction successfully sponsored!
{
  "Account": "rLu5q357e4obMEo68CCS3Le2fT4ahikMHv",
  "Fee": "10",
  "LastLedgerSequence": 79715,
  "MPTokenIssuanceID": "0000A98C748BDAE6F4A202E5B1EF4EE65A3EFA6C65EA9E65",
  "Sequence": 79694,
  "SigningPubKey": "EDAE01CC5520AA86F36F267115634B72EA7545C44B12FA20DB08EF42D9BDB97840",
  "Sponsor": "rJq1SZRgbPyi6inJjvU5Uoux1rJNaTaJyu",
  "SponsorFlags": 3,
  "SponsorSignature": {
    "SigningPubKey": "ED325E2D6C23A4FB9D6985BC3500C9E7C645ED769A7BC121FEB4ACC20ADBE9C909",
    "TxnSignature": "5E1FF4E17D6FEF32045691E5BA6480440AC9CCEF7D7F2F25B638673FB4A9E9AC4BE895B0823F41AD0DFC8FFBCB899070AE261D5D4072EE742222625C72036804"
  },
  "TransactionType": "MPTokenAuthorize",
  "TxnSignature": "2F05FF9DF5F49621A9BF3950947BDF4ED1A19A6028B5E08CC96AEACE2131BEA680C9A533F50CD10EB35B27CD041BF070AC82AA214C3A99FB661509CAD767AC0A",
  "ctid": "C001375000000066",
  "date": 830292742,
  "ledger_index": 79696
}

Sponsorship details --------------------------------------
  Sponsor:
    Fee deducted:          10 drops
    Balance:               99999979 drops
    Reserves sponsored:    1

  Sponsee:
    Fee deducted:          0 drops
    Balance:               1 drops
```

## Sponsor a Transaction (Pre-funded Pool)

```sh
python sponsor_pre_funded.py
```

The script should output the sponsorship pool creation and the sponsored transaction details:

```sh
=== Loading setup data... ===

MPT Issuance ID: 0000A98C748BDAE6F4A202E5B1EF4EE65A3EFA6C65EA9E65
Issuer address:  rBdNvZ3z1JuioZaXejFXQkf5otfnuwPNFD

=== Creating wallets... ===
Sponsor address: rwV12Ti6bzm8K7bqiLKSqJWajCJSziDTqB
Funded sponsor with 100 XRP

Sponsee address: rNp5uQdjanayFWfrcHD7uEcyq7eiYADgZ4

=== Creating sponsee's account... ===
{
  "Account": "rwV12Ti6bzm8K7bqiLKSqJWajCJSziDTqB",
  "TransactionType": "Payment",
  "Flags": 524288,
  "SigningPubKey": "",
  "Amount": "1",
  "Destination": "rNp5uQdjanayFWfrcHD7uEcyq7eiYADgZ4"
}

Sponsee account created successfully!

=== Creating sponsorship pool... ===
{
  "Account": "rwV12Ti6bzm8K7bqiLKSqJWajCJSziDTqB",
  "TransactionType": "SponsorshipSet",
  "SigningPubKey": "",
  "Sponsee": "rNp5uQdjanayFWfrcHD7uEcyq7eiYADgZ4",
  "FeeAmount": "1000000",
  "ReserveCount": 5
}

Sponsorship pool created successfully!
Sponsorship ID: 214929E9019F4BC4D59C96E08229AB50FB5A771315C35FF9316A9E151751E4E4

=== Submitting sponsored transaction... ===
Transaction successfully sponsored!
{
  "Account": "rNp5uQdjanayFWfrcHD7uEcyq7eiYADgZ4",
  "Fee": "10",
  "LastLedgerSequence": 79503,
  "MPTokenIssuanceID": "0000A98C748BDAE6F4A202E5B1EF4EE65A3EFA6C65EA9E65",
  "Sequence": 79480,
  "SigningPubKey": "EDC46E55C48BF0CFD99EF75EAA80FA17DF0A9100D2A441E6A460FA9C876F0367F9",
  "Sponsor": "rwV12Ti6bzm8K7bqiLKSqJWajCJSziDTqB",
  "SponsorFlags": 3,
  "TransactionType": "MPTokenAuthorize",
  "TxnSignature": "E6526057E301FAB9BF071FA2A931AD82A96FBF6ADF23A3EBBD1EC39F065FDEE614CF777EB519A3019639AC87173C6D588BE20F99922F904FBE2F1EE845F28408",
  "ctid": "C001367C00000066",
  "date": 830292530,
  "ledger_index": 79484
}

Sponsorship details --------------------------------------
  Pool:
    Fee deducted:          10 drops
    Balance:               999990 drops
    Reserves consumed:     1

  Sponsor:
    Fee deducted:          0 drops
    Balance:               98999979 drops
    Reserves sponsored:    1

  Sponsee:
    Fee deducted:          0 drops
    Balance:               1 drops
```

## Transfer a Reserve Sponsorship

```sh
python transfer_sponsorship.py
```

The script should output the full lifecycle of a reserve sponsorship — create, reassign, and end:

```sh
=== Loading setup data... ===
MPT Issuance ID: 0000A98C748BDAE6F4A202E5B1EF4EE65A3EFA6C65EA9E65
Issuer address:  rBdNvZ3z1JuioZaXejFXQkf5otfnuwPNFD

=== Funding accounts... ===
Sponsor A address: rM8C8CsPpnwno5NZ5XqU6gknvkzveUku21
Sponsor B address: rD8djknRvCyqGi4GTZ1826pxJsNTe8Sw1g
Sponsee address:   rhpYcHHetQdCnMfKn4dvnAtR4fpKSTMyjU

=== Submitting unsponsored MPTokenAuthorize transaction... ===
MPTokenAuthorize transaction successful!
MPToken ID: C7E9F77AE8D414E4537715D4C58C9BA5B524D2E3F84A8C47FC70BA7EF6F0B001

=== Creating reserve sponsorship... ===
Submitting SponsorshipTransfer transaction...
Sponsor A (rM8C8CsPpnwno5NZ5XqU6gknvkzveUku21) is now sponsoring the MPToken reserve!
{
  "Account": "rhpYcHHetQdCnMfKn4dvnAtR4fpKSTMyjU",
  "Fee": "10",
  "Flags": 2,
  "LastLedgerSequence": 79633,
  "ObjectID": "C7E9F77AE8D414E4537715D4C58C9BA5B524D2E3F84A8C47FC70BA7EF6F0B001",
  "Sequence": 79611,
  "SigningPubKey": "ED5DD35377B24FFF8AEEDDC3BA9B68E89FB1BEDAC91524322D1066A9BC0EFFCCA5",
  "Sponsor": "rM8C8CsPpnwno5NZ5XqU6gknvkzveUku21",
  "SponsorFlags": 2,
  "SponsorSignature": {
    "SigningPubKey": "EDF6368FFA10FCC71DF320CC2E605B85D74614C6255060D567A382719A28590B0C",
    "TxnSignature": "34A861A42F95EA4898315490737233BE63725C0CDCCD2C70202B3B0D3F3F03402A2BB623E458907195A926E3F4C7C7DA6BCA3CAECB3484FB72B180F388AFB10B"
  },
  "TransactionType": "SponsorshipTransfer",
  "TxnSignature": "4C48840DA1F82D5B8C2820AB0E2E0B319792AB3D7B4212DB5571C0FDB815A48BB444C78140CC639F1843A499B374D536FC57DDC3C9A31D7255F941923BE4B807",
  "ctid": "C00136FE00000066",
  "date": 830292660,
  "ledger_index": 79614
}

=== Reassigning reserve sponsorship... ===
Submitting SponsorshipTransfer transaction...
Sponsorship reassigned from Sponsor A (rM8C8CsPpnwno5NZ5XqU6gknvkzveUku21) to Sponsor B (rD8djknRvCyqGi4GTZ1826pxJsNTe8Sw1g)!
{
  "Account": "rhpYcHHetQdCnMfKn4dvnAtR4fpKSTMyjU",
  "Fee": "10",
  "Flags": 4,
  "LastLedgerSequence": 79635,
  "ObjectID": "C7E9F77AE8D414E4537715D4C58C9BA5B524D2E3F84A8C47FC70BA7EF6F0B001",
  "Sequence": 79612,
  "SigningPubKey": "ED5DD35377B24FFF8AEEDDC3BA9B68E89FB1BEDAC91524322D1066A9BC0EFFCCA5",
  "Sponsor": "rD8djknRvCyqGi4GTZ1826pxJsNTe8Sw1g",
  "SponsorFlags": 2,
  "SponsorSignature": {
    "SigningPubKey": "ED4F373BA1B49040A55F81FA5C8071FCAC6098DB7EF2364294EC571E90F5516065",
    "TxnSignature": "02086F3525A2771885FC047A7D23548FDC5A88F69F5F69C42DBA6214B4467B182E2F892CD860C6324AA6DA6956BC4921B6A84FB610EE80F8A6C5CD479720D208"
  },
  "TransactionType": "SponsorshipTransfer",
  "TxnSignature": "4C7265A1886DC99B909395BC76E1FD74D1140375458FC6AB48705A01C4C5E3DD8432ACBDB80066C9C10B55E14C690E010FCC5712587CCBA691DC532EC45E2104",
  "ctid": "C001370000000066",
  "date": 830292662,
  "ledger_index": 79616
}

=== Ending reserve sponsorship... ===
Submitting SponsorshipTransfer transaction...
Reserve sponsorship ended successfully!
{
  "Account": "rhpYcHHetQdCnMfKn4dvnAtR4fpKSTMyjU",
  "Fee": "10",
  "Flags": 1,
  "LastLedgerSequence": 79637,
  "ObjectID": "C7E9F77AE8D414E4537715D4C58C9BA5B524D2E3F84A8C47FC70BA7EF6F0B001",
  "Sequence": 79613,
  "SigningPubKey": "ED5DD35377B24FFF8AEEDDC3BA9B68E89FB1BEDAC91524322D1066A9BC0EFFCCA5",
  "TransactionType": "SponsorshipTransfer",
  "TxnSignature": "EF8378545F7FB48C71833EEBC97A7CC43D3D4F4598FCBEA88F5D2364E504AB844F57D4661A5A16BB4C82BBD3A2843ADD3D4D4EDFC4EE7A585F930919A07AFD0C",
  "ctid": "C001370200000066",
  "date": 830292664,
  "ledger_index": 79618
}
```

## Manage a Sponsorship Pool

```sh
python manage_sponsorship_pool.py
```

The script should output the pool creation, partial consumption, update, and deletion with balance verification:

```sh
=== Loading setup data... ===

MPT Issuance ID: 000189E54C940954D5B3E7EC8BB85C4A48F5A6E7A32226CB
Issuer address:  rfyu6LEAy6TEqoGabKUT6J22nn8cCgi7qn

=== Funding accounts... ===
Sponsor address: r4bYbadz4mgDhniFk7wkwJ3cP4gXaNw1vu
        balance: 100000000 drops

Sponsee address: rLjWLF1a6CGMK8p5cevXAC4rW7q5Ad1cZT

=== Creating sponsorship pool... ===
Sponsorship pool created successfully:
  Fee allocated:      1000000 drops (1 XRP)
  Reserves allocated: 5

Sponsor balance: 98999990 drops

=== Using sponsorship pool... ===
Pool status after usage:
  Fee remaining:      999990 drops
  Reserves remaining: 4

Sponsorship pool partially consumed!

=== Updating sponsorship pool... ===
Pool status after update:
  Fee allocated:      2000000 drops
  Reserves allocated: 10

Sponsorship pool updated successfully!
{
  "Account": "r4bYbadz4mgDhniFk7wkwJ3cP4gXaNw1vu",
  "Fee": "10",
  "FeeAmount": "2000000",
  "LastLedgerSequence": 100904,
  "ReserveCount": 10,
  "Sequence": 100878,
  "SigningPubKey": "ED5E89EB74FD36F95C4BE249C63C0B1F36C47CD7AA2AC85891E4F8AEB633199229",
  "Sponsee": "rLjWLF1a6CGMK8p5cevXAC4rW7q5Ad1cZT",
  "TransactionType": "SponsorshipSet",
  "TxnSignature": "7FB390CEB0EF276740F8CAB8BF25E28C1C7E4EA335B0FDB69E6A2A297B23F1FF02E34248672F68FA634567AC7E43F257177BD9F9C7561AD9CB3CEBC7C281970C",
  "ctid": "C0018A1500000066",
  "date": 830354179,
  "ledger_index": 100885
}

=== Checking sponsor balance before deletion... ===
Sponsor balance: 97999970 drops

=== Deleting sponsorship pool... ===
Sponsorship pool deleted successfully!
{
  "Account": "r4bYbadz4mgDhniFk7wkwJ3cP4gXaNw1vu",
  "Fee": "10",
  "Flags": 1048576,
  "LastLedgerSequence": 100906,
  "Sequence": 100879,
  "SigningPubKey": "ED5E89EB74FD36F95C4BE249C63C0B1F36C47CD7AA2AC85891E4F8AEB633199229",
  "Sponsee": "rLjWLF1a6CGMK8p5cevXAC4rW7q5Ad1cZT",
  "TransactionType": "SponsorshipSet",
  "TxnSignature": "F5C0F7EA883B7CA8C436E94502791A0C8ADD4A70179F0DF73F0DEF4C521E92D544A553155A76BFCC6E7BD949E9F5E7327E7B7A6DCB81D0CCF0A931D3FCB03E0B",
  "ctid": "C0018A1700000066",
  "date": 830354181,
  "ledger_index": 100887
}

Sponsor balance:          99999960 drops
Delete transaction fee:     10 drops
Funds returned from pool:   2000000 drops
```
