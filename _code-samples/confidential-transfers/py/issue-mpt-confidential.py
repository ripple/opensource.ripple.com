import json
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.transactions import (
    MPTokenIssuanceCreate,
    MPTokenIssuanceCreateFlag,
    MPTokenIssuanceSet,
    MPTokenAuthorize,
    Payment
)
from xrpl.transaction import submit_and_wait
from xrpl.models.requests import AccountObjectType, AccountObjects
from xrpl.utils.mptoken_metadata import encode_mptoken_metadata
from xrpl.core.confidential import MPTCrypto
from xrpl.core.confidential.transaction_builders import (
    prepare_confidential_merge_inbox
)
from xrpl.core.confidential.context import compute_convert_context_hash
from xrpl.models.transactions import ConfidentialMPTConvert
from xrpl.models.requests import AccountInfo

# Connect to the network
client = JsonRpcClient("https://confidential.devnet.rippletest.net:51234")
faucet_host = "https://confidential-faucet.devnet.rippletest.net"

# Generate accounts -------------------------------
print("=== Generating Accounts ===")
issuer = generate_faucet_wallet(client, faucet_host=faucet_host)
issuer_second_account = generate_faucet_wallet(client, faucet_host=faucet_host)
auditor = generate_faucet_wallet(client, faucet_host=faucet_host)
print(f"Issuer: {issuer.address}")
print(f"Issuer Second Account: {issuer_second_account.address}")
print(f"Auditor: {auditor.address}")

# Generate ElGamal keypairs ----------------------
print("\n=== Generating ElGamal Keypairs ===")
# Initialize MPTCrypto (wrapper for the mpt-crypto C library)
crypto = MPTCrypto()

# Generate ElGamal keypair for the issuer.
# The issuer key allows the issuer to decrypt and track all confidential balances.
issuer_private_key, issuer_public_key = crypto.generate_keypair()

# Generate ElGamal keypair for the issuer second account.
issuer_second_account_private_key, issuer_second_account_public_key = crypto.generate_keypair()

# Generate ElGamal keypair for the auditor.
# The auditor key enables regulatory oversight and on-chain selective disclosure.
auditor_private_key, auditor_public_key = crypto.generate_keypair()

print(f"Issuer ElGamal Public Key: {issuer_public_key}")
print(f"Issuer Second Account ElGamal Public Key: {issuer_second_account_public_key}")
print(f"Auditor ElGamal Public Key: {auditor_public_key}")

# Create MPT Issuance ----------------------
print("\n=== Creating MPT Issuance... ===")
# Create an MPT issuance with the TF_MPT_CAN_PRIVACY flag enabled.
# This flag is required for confidential transfers.
mpt_create_tx = MPTokenIssuanceCreate(
    account=issuer.address,
    flags=MPTokenIssuanceCreateFlag.TF_MPT_CAN_PRIVACY |
        MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRANSFER |  # Enable transfer
        MPTokenIssuanceCreateFlag.TF_MPT_CAN_TRADE |  # Enable trade
        MPTokenIssuanceCreateFlag.TF_MPT_CAN_CLAWBACK |  # Enable clawback
        MPTokenIssuanceCreateFlag.TF_MPT_CAN_LOCK,  # Enable lock
    asset_scale=2,
    maximum_amount="1000000000",
    transfer_fee=0,
    mptoken_metadata=encode_mptoken_metadata({
        "ticker": "CTST",
        "name": "Confidential Test Token",
        "desc": "A test token demonstrating confidential transfer capabilities on the XRP Ledger.",
        "icon": "https://xrpl.org/assets/img/xrp-ledger-logo.svg",
        "asset_class": "rwa",
        "asset_subclass": "treasury",
        "issuer_name": "Example Financial Corp",
        "uris": [
            {
                "uri": "docs.com",
                "category": "docs",
                "title": "Documentation"
            },
            {
                "uri": "examplefinancial.co/bonds",
                "category": "website",
                "title": "Corporate Bond Information"
            }
        ],
        "additional_info": {
            "interest_rate": "4.25%",
            "interest_type": "fixed",
        }
    })
)

# Submit, sign, and wait for validation ----------------------
print("Submitting MPTokenIssuanceCreate transaction...")
response = submit_and_wait(mpt_create_tx, client, issuer, autofill=True)

if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = response.result["meta"]["TransactionResult"]
    print(f"Error: Transaction failed: {result_code}")
    exit(1)

print("MPT issuance created successfully!")
mpt_issuance_id = response.result["meta"]["mpt_issuance_id"]
print(f"MPT Issuance ID: {mpt_issuance_id}")

# Register ElGamal keys on the ledger ----------------------
print("\n=== Registering ElGamal Keys On-Ledger... ===")
mpt_set_tx = MPTokenIssuanceSet(
    account=issuer.address,
    mptoken_issuance_id=mpt_issuance_id,
    issuer_elgamal_public_key=issuer_public_key,
    auditor_elgamal_public_key=auditor_public_key
)

# Submit, sign, and wait for validation ----------------------
print("Submitting MPTokenIssuanceSet transaction...")
print(json.dumps(mpt_set_tx.to_dict(), indent=2))
mpt_set_response = submit_and_wait(mpt_set_tx, client, issuer)

if mpt_set_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = mpt_set_response.result["meta"]["TransactionResult"]
    print(f"Error: Transaction failed: {result_code}")
    exit(1)

print("ElGamal keys registered successfully!")

# Send public tokens to issuer second account ----------------------
print("\n=== Sending public tokens to issuer second account... ===")
# Before receiving the MPT, the second account must authorize the issuance.
authorize_tx = MPTokenAuthorize(
    account=issuer_second_account.address,
    mptoken_issuance_id=mpt_issuance_id
)

# Submit, sign, and wait for validation ----------------------
print("Submitting MPTokenAuthorize transaction...")
authorize_response = submit_and_wait(
    authorize_tx,
    client,
    issuer_second_account,
    autofill=True
)

if authorize_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = authorize_response.result["meta"]["TransactionResult"]
    print(f"Error: Authorization failed: {result_code}")
    exit(1)

print("Issuer second account authorized CTST MPT successfully!")

payment_tx = Payment(
    account=issuer.address,
    destination=issuer_second_account.address,
    amount={
        "mpt_issuance_id": mpt_issuance_id,
        "value": "1000"
    }
)

# Submit, sign, and wait for validation ----------------------
print("\nSubmitting Payment transaction...")
payment_response = submit_and_wait(payment_tx, client, issuer, autofill=True)

if payment_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = payment_response.result["meta"]["TransactionResult"]
    print(f"Error: Payment failed: {result_code}")
    exit(1)

print("Payment successful!")
print(f"Issuer Sent 1000 CTST tokens to {issuer_second_account.address}")

# Convert public balance to confidential ----------------------
print("\n=== Converting Public Balance to Confidential... ===")
convert_amount = 1000

# Compute context hash
account_info = client.request(AccountInfo(account=issuer_second_account.address))
sequence = account_info.result["account_data"]["Sequence"]
mpt_issuance_id_bytes = bytes.fromhex(mpt_issuance_id)
context_id = compute_convert_context_hash(
    issuer_second_account.classic_address,
    sequence,
    mpt_issuance_id_bytes,
    convert_amount
)

# Generate Schnorr proof of knowledge
print("Generating zero-knowledge proof...")
schnorr_proof = crypto.generate_pok(
    issuer_second_account_private_key,
    issuer_second_account_public_key,
    context_id
)

# Encrypt amount for holder (issuer second account)
print("Encrypting amount for holder...")
holder_c1, holder_c2, blinding_factor = crypto.encrypt(
    issuer_second_account_public_key,
    convert_amount
)

# Encrypt amount for issuer
print("Encrypting amount for issuer...")
issuer_c1, issuer_c2, _ = crypto.encrypt(
    issuer_public_key,
    convert_amount,
    blinding_factor
)

# Encrypt amount for auditor
print("Encrypting amount for auditor...")
auditor_c1, auditor_c2, _ = crypto.encrypt(
    auditor_public_key,
    convert_amount,
    blinding_factor
)

# Manually create the ConfidentialMPTConvert transaction with auditor support.
# We can't use prepare_confidential_convert helper function because it doesn't 
# support auditor encryption yet.
convert_tx = ConfidentialMPTConvert(
    account=issuer_second_account.address,
    mptoken_issuance_id=mpt_issuance_id,
    mpt_amount=convert_amount,
    holder_elgamal_public_key=issuer_second_account_public_key,
    holder_encrypted_amount=holder_c1 + holder_c2,
    issuer_encrypted_amount=issuer_c1 + issuer_c2,
    auditor_encrypted_amount=auditor_c1 + auditor_c2,
    blinding_factor=blinding_factor,
    zk_proof=schnorr_proof,
)

# Submit, sign, and wait for validation ----------------------
print("\nSubmitting ConfidentialMPTConvert transaction...")
print(json.dumps(convert_tx.to_dict(), indent=2))
convert_response = submit_and_wait(
    convert_tx,
    client,
    issuer_second_account,
    autofill=True
)

if convert_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = convert_response.result["meta"]["TransactionResult"]
    print(f"Error: Conversion failed: {result_code}")
    exit(1)

print("Conversion successful!")
print(f"Converted {convert_amount} CTST tokens to confidential balance.")

# Merge inbox to spending balance ----------------------
print("\n=== Merging Inbox into Spending Balance... ===")
# After converting tokens to confidential form, they arrive in the "inbox".
# The inbox must be merged into the spending balance before the tokens can be spent.
# This is a simple transaction that requires no proofs.
merge_tx = prepare_confidential_merge_inbox(
    wallet=issuer_second_account,
    mpt_issuance_id=mpt_issuance_id
)

print("Submitting ConfidentialMPTMergeInbox transaction...")
print(json.dumps(merge_tx.to_dict(), indent=2))
merge_result = submit_and_wait(merge_tx, client, issuer_second_account)

if merge_result.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = merge_result.result["meta"]["TransactionResult"]
    print(f"Error: Merge failed: {result_code}")
    exit(1)

print("Merge successful!")

# Verify confidential balances ----------------------
print("\n=== Verifying Confidential Balances ===")

# Query the issuer second account's MPToken object for this specific issuance.
# The MPToken object stores both public (MPTAmount) and encrypted confidential balances.
# Confidential balances are stored in two fields:
# - ConfidentialBalanceSpending: encrypted balance available to spend
# - ConfidentialBalanceInbox: encrypted balance waiting to be merged
print(f"Querying issuer second account's MPToken object...")
issuer_second_objects_response = client.request(
    AccountObjects(
        account=issuer_second_account.address,
        type=AccountObjectType.MPTOKEN
   )
)
mpt_object = None
for obj in issuer_second_objects_response.result.get("account_objects", []):
    if obj.get("MPTokenIssuanceID") == mpt_issuance_id:
        mpt_object = obj
        break

if not mpt_object:
    print("Error: MPToken object not found")
    exit(1)

print("\nIssuer second account MPToken object:")
print(json.dumps(mpt_object, indent=2))

# Save keys and issuance data for use in other tutorials
# WARNING: This is for DEVELOPMENT/TESTING ONLY!
# NEVER store private keys in plain text files in production!
print("\n=== Saving Keys for Development ===")
confidential_data = {
   "description": "Setup data for development and testing. Contains account seeds, ElGamal keypairs, and MPT issuance ID.",
    "mpt_issuance_id": mpt_issuance_id,
    "issuer": {
        "address": issuer.address,
        "seed": issuer.seed,
        "elgamal_private_key": issuer_private_key,
        "elgamal_public_key": issuer_public_key
    },
    "issuer_second_account": {
        "address": issuer_second_account.address,
        "seed": issuer_second_account.seed,
        "elgamal_private_key": issuer_second_account_private_key,
        "elgamal_public_key": issuer_second_account_public_key
    },
    "auditor": {
        "address": auditor.address,
        "seed": auditor.seed,
        "elgamal_private_key": auditor_private_key,
        "elgamal_public_key": auditor_public_key
    }
}

with open("confidential-setup.json", "w") as f:
    json.dump(confidential_data, f, indent=2)

print("Keys and issuance data saved to confidential-setup.json")
