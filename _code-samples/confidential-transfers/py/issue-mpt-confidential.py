"""
IMPORTANT: ElGamal Key Persistence
----------------------------------
This script generates ElGamal keypairs for encryption and automatically saves them to
test-wallets.json. These keys are CRITICAL for managing your confidential tokens.
"""

import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.transactions import (
    MPTokenIssuanceCreate,
    MPTokenIssuanceCreateFlag,
    MPTokenIssuanceSet,
    MPTokenAuthorize,
    Payment
)
from xrpl.transaction import submit_and_wait
from xrpl.models.requests import AccountObjects
from xrpl.models.mptoken_metadata import MPTokenMetadata, MPTokenMetadataUri
from xrpl.utils.mptoken_metadata import encode_mptoken_metadata
from xrpl.core.confidential import MPTCrypto
from xrpl.core.confidential.transaction_builders import (
    prepare_confidential_convert,
    prepare_confidential_merge_inbox
)

# Load wallets from file
with open("test-wallets.json", "r") as f:
    wallets_data = json.load(f)

# Connect to the confidential devnet
client = JsonRpcClient("https://confidential.devnet.rippletest.net:51234")

# Create wallet instances
issuer = Wallet.from_seed(wallets_data["issuer"]["seed"])
issuer_second_account = Wallet.from_seed(wallets_data["issuer_second_account"]["seed"])
print("=== Accounts ===")
print(f"Issuer Account: {issuer.address}")
print(f"Issuer Second Account: {issuer_second_account.address}\n")

print("=== ElGamal Key Setup ===")
# Initialize MPTCrypto (wrapper for the mpt-crypto C library)
crypto = MPTCrypto()

print("--- Issuer ElGamal Key ---")
# Load or generate ElGamal keypair for the issuer.
# The issuer key allows the issuer to decrypt and track all confidential balances.
if "private_key" in wallets_data["issuer"] and "public_key" in wallets_data["issuer"]:
    # Use existing keys from the wallet file
    issuer_private_key = wallets_data["issuer"]["private_key"]
    issuer_public_key = wallets_data["issuer"]["public_key"]
    print(f"Using existing issuer ElGamal keys from test-wallets.json")
else:
    # Generate new keys if they don't exist
    issuer_private_key, issuer_public_key = crypto.generate_keypair()
    # Save the issuer's ElGamal keys to the json file
    wallets_data["issuer"]["private_key"] = issuer_private_key
    wallets_data["issuer"]["public_key"] = issuer_public_key
    print(f"Generated new issuer ElGamal keys")

    # Persist keys in JSON
    with open("test-wallets.json", "w") as f:
        json.dump(wallets_data, f, indent=2)
    print(f"Saved issuer ElGamal keys to test-wallets.json")

print(f" - Issuer Public Key: {issuer_public_key}")

print("--- Second Account ElGamal Key ---")
# Load or generate ElGamal keypair for issuer_second_account
if "private_key" in wallets_data["issuer_second_account"] and "public_key" in wallets_data["issuer_second_account"]:
    # Use existing keys from the wallet file
    issuer_second_account_private_key = wallets_data["issuer_second_account"]["private_key"]
    issuer_second_account_public_key = wallets_data["issuer_second_account"]["public_key"]
    print(f"Using existing issuer_second_account ElGamal keys from test-wallets.json")
else:
    # Generate new keys if they don't exist
    issuer_second_account_private_key, issuer_second_account_public_key = crypto.generate_keypair()
    # Save the issuer_second_account's ElGamal keys to the wallet file
    wallets_data["issuer_second_account"]["private_key"] = issuer_second_account_private_key
    wallets_data["issuer_second_account"]["public_key"] = issuer_second_account_public_key
    print(f"Generated new issuer_second_account ElGamal keys")

    # Persist keys in JSON
    with open("test-wallets.json", "w") as f:
        json.dump(wallets_data, f, indent=2)
    print(f"Saved issuer_second_account ElGamal keys to test-wallets.json")

print(f" - Issuer Second Account Public Key: {issuer_second_account_public_key}")
print()

print("=== STEP 1: Creating MPT Issuance ===")
print("--- Prepare MPT Metadata ---")
mpt_metadata: MPTokenMetadata = {
    "ticker": "CBOND",
    "name": "Confidential Corporate Bond",
    "desc": "A privacy-preserving corporate bond token with confidential transfer capabilities for institutional investors.",
    "icon": "https://xrpl.org/assets/img/xrp-ledger-logo.svg",
    "asset_class": "rwa",
    "asset_subclass": "treasury",
    "issuer_name": "Example Financial Corp",
    "uris": [
        MPTokenMetadataUri(
            uri="docs.com",
            category="docs",
            title="Documentation"
        ),
        MPTokenMetadataUri(
            uri="examplefinancial.co/bonds",
            category="website",
            title="Corporate Bond Information"
        )
    ],
    "additional_info": {
        "interest_rate": "4.25%",
        "interest_type": "fixed",
    }
}
mpt_metadata_hex = encode_mptoken_metadata(mpt_metadata)

print("--- Create MPTokenIssuanceCreate Transaction ---")
# Create an MPT issuance with the TF_MPT_CAN_PRIVACY flag enabled.
# This flag is required for confidential transfers.
mpt_create_tx = MPTokenIssuanceCreate(
    account=issuer.address,
    flags=MPTokenIssuanceCreateFlag.TF_MPT_CAN_PRIVACY | # Enable confidential transfers
        MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRANSFER | # Enable transfer
        MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRADE | # Enable trade
        MPTokenIssuanceCreateFlag.TF_MPT_CAN_CLAWBACK | # Enable clawback
        MPTokenIssuanceCreateFlag.TF_MPT_CAN_LOCK, # Enable lock
    asset_scale=2,
    maximum_amount="1000000000",
    transfer_fee=0,
    mptoken_metadata=mpt_metadata_hex
)

print("--- Submit Transaction ---")
print("Submitting MPTokenIssuanceCreate transaction...")
response = submit_and_wait(mpt_create_tx, client, issuer, autofill=True)

result_code = response.result["meta"]["TransactionResult"]
if result_code != "tesSUCCESS":
    print(f"Transaction failed with result code: {result_code}")
    exit(1)

print(f"Transaction successful: {result_code}")
mpt_issuance_id = response.result["meta"]["mpt_issuance_id"]
print(f"MPT Issuance ID: {mpt_issuance_id}\n")

print("=== STEP 2: Registering issuer ElGamal key on-ledger ===")
# Register the issuer's public key on the ledger using MPTokenIssuanceSet.
# This allows other accounts to encrypt confidential amounts for the issuer.
# The issuer's public key is stored in the MPTokenIssuance ledger object.
print("Registering Issuer ElGamal key with MPTokenIssuanceSet...")
mpt_set_tx = MPTokenIssuanceSet(
    account=issuer.address,
    mptoken_issuance_id=mpt_issuance_id,
    issuer_elgamal_public_key=issuer_public_key
)

print(json.dumps(mpt_set_tx.to_dict(), indent=2))
print()

mpt_set_response = submit_and_wait(mpt_set_tx, client, issuer)
mpt_set_result_code = mpt_set_response.result["meta"]["TransactionResult"]

if mpt_set_result_code != "tesSUCCESS":
    print(f"Transaction failed: {mpt_set_result_code}")
    exit(1)

print(f"Issuer key registered successfully: {mpt_set_result_code}\n")

print("=== STEP 3: Sending public tokens to second account ===")

# Before receiving MPT tokens, an account must authorize the specific issuance.
# This creates an MPToken ledger object for the account.
print("Second account authorizing MPT...")
authorize_tx = MPTokenAuthorize(
    account=issuer_second_account.address,
    mptoken_issuance_id=mpt_issuance_id
)

authorize_response = submit_and_wait(
    authorize_tx, 
    client, 
    issuer_second_account, 
    autofill=True
)
authorize_result = authorize_response.result["meta"]["TransactionResult"]

if authorize_result != "tesSUCCESS":
    print(f"Authorization failed: {authorize_result}")
    exit(1)

print(f"Second account authorized: {authorize_result}")

# Send public (non-confidential) tokens to the second account.
# These will be converted to confidential tokens in the next step.
print("Sending public tokens to second account...")
payment_tx = Payment(
    account=issuer.address,
    destination=issuer_second_account.address,
    amount={
        "mpt_issuance_id": mpt_issuance_id,
        "value": "1000"
    }
)

payment_response = submit_and_wait(payment_tx, client, issuer, autofill=True)
payment_result = payment_response.result["meta"]["TransactionResult"]

if payment_result != "tesSUCCESS":
    print(f"Payment failed: {payment_result}")
    exit(1)

print(f"Payment successful: {payment_result}")
print(f"Sent 1000 tokens to {issuer_second_account.address}\n")

print("=== STEP 4: Converting public balance to confidential ===")

# Convert 1000 tokens from public to confidential
convert_amount = 1000
print(f"Converting {convert_amount} tokens to confidential balance...")

# Use the prepare_confidential_convert helper to create the transaction.
# This helper automatically:
# - Uses the provided issuer_second_account ElGamal keypair
# - Retrieves the issuer's public key from the ledger
# - Computes the context hash and generates Schnorr proof
# - Encrypts the amount for issuer_second_account and issuer
convert_tx = prepare_confidential_convert(
    client=client,
    wallet=issuer_second_account,
    mpt_issuance_id=mpt_issuance_id,
    amount=convert_amount,
    holder_privkey=issuer_second_account_private_key,
    holder_pubkey=issuer_second_account_public_key,
    issuer_pubkey=issuer_public_key
)

print("Submitting ConfidentialMPTConvert transaction...")
print(json.dumps(convert_tx.to_dict(), indent=2))
print()

convert_response = submit_and_wait(
    convert_tx,
    client,
    issuer_second_account,
    autofill=True
)
convert_result = convert_response.result["meta"]["TransactionResult"]

if convert_result != "tesSUCCESS":
    print(f"Conversion failed: {convert_result}")
    exit(1)

print(f"Conversion successful: {convert_result}")
print(f"Converted {convert_amount} tokens to confidential balance (inbox)\n")

print("=== STEP 5: Merging inbox to spending balance ===")
print("Submitting ConfidentialMPTMergeInbox transaction...\n")

# After converting tokens to confidential form, they arrive in the "inbox".
# The inbox must be merged into the spending balance before the tokens can be spent.
# This is a simple transaction that requires no proofs.
merge_tx = prepare_confidential_merge_inbox(
    wallet=issuer_second_account,
    mpt_issuance_id=mpt_issuance_id
)

print(json.dumps(merge_tx.to_dict(), indent=2))
print()

merge_result = submit_and_wait(merge_tx, client, issuer_second_account)
merge_code = merge_result.result["meta"]["TransactionResult"]

if merge_code != "tesSUCCESS":
    print(f"Merge failed: {merge_code}")
    exit(1)

print(f"Merge successful: {merge_code}")
print("Inbox merged to spending balance\n")

print("=== STEP 6: Issuer second account balances ===\n")

# Query the second account's MPToken object for this specific issuance.
# The MPToken object stores both public (MPTAmount) and encrypted confidential balances.
# Confidential balances are stored in two fields:
# - ConfidentialBalanceSpending: encrypted balance available to spend
# - ConfidentialBalanceInbox: encrypted balance waiting to be merged
holder_objects_response = client.request(AccountObjects(account=issuer_second_account.address))

# Find and display the MPToken object for this issuance
for obj in holder_objects_response.result.get("account_objects", []):
    if obj.get("LedgerEntryType") == "MPToken" and obj.get("MPTokenIssuanceID") == mpt_issuance_id:
        print(json.dumps(obj, indent=2))
        break

print(f"\nIssuer second account has {convert_amount} tokens in confidential spending balance.")
