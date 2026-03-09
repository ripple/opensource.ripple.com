# Confidential Transfers Code Samples (Python)

This directory contains Python code samples demonstrating XLS-96 Confidential Transfers on the XRP Ledger.

## Installation

Install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## CRITICAL: ElGamal Key Persistence

The scripts in this directory generate **ElGamal keypairs** for encryption and automatically save them to `test-wallets.json`. These keys are **CRITICAL** for managing your confidential MPTs.

**If you lose these keys, you CANNOT**:

- Decrypt confidential balances.
- Generate zero-knowledge proofs for transactions.

**Keys are permanently locked**: Once registered on-ledger, ElGamal public keys cannot be changed, even with `MPTokenIssuanceSet`.

The scripts automatically:

1. Checks if ElGamal keys exist in `test-wallets.json`
2. If not, generates new keys and saves them immediately.
3. Reuses existing keys on subsequent runs.

## Running the Examples

### Issue MPT with Confidential Transfers

```bash
python issue-mpt-confidential.py
```

The script outputs the following:

```sh
```
