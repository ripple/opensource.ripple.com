import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import MPTokenAuthorize, Payment, SponsorshipTransfer
from xrpl.models.transactions.sponsorship_transfer import SponsorshipTransferFlag
from xrpl.transaction import autofill, sign, sign_as_sponsor, submit_and_wait
from xrpl.wallet import Wallet

SETUP_JSON_FILE = "sponsored_fees_and_reserves.json"
GENESIS_SEED = "snoPBrXtMeMyMHUVTgbuqAfg1SUTb"

SPF_SPONSOR_RESERVE = 0x00000002

client = JsonRpcClient("http://localhost:5005")

# Load setup data --------------------------------------------------------------
print("=== Loading setup data... ===")
if not os.path.exists(SETUP_JSON_FILE):
    print(f"{SETUP_JSON_FILE} not found. Running setup script...")
    subprocess.run([sys.executable, "sponsored_fees_and_reserves_setup.py"], check=True)

with open(SETUP_JSON_FILE) as f:
    setup_data = json.load(f)

mpt_issuance_id = setup_data["mpt_issuance_id"]
issuer_address = setup_data["issuer"]["address"]
print(f"MPT Issuance ID: {mpt_issuance_id}")
print(f"Issuer address:  {issuer_address}")

# Fund accounts ----------------------------------------------------------------
print("\n=== Funding accounts... ===")
genesis = Wallet.from_seed(GENESIS_SEED, algorithm="secp256k1")
sponsor_a = Wallet.create()
sponsor_b = Wallet.create()
sponsee = Wallet.create()

for wallet, name in [(sponsor_a, "sponsor_a"), (sponsor_b, "sponsor_b"), (sponsee, "sponsee")]:
    fund_tx = Payment(
        account=genesis.address,
        destination=wallet.address,
        amount="100000000",  # 100 XRP
    )
    response = submit_and_wait(fund_tx, client, genesis, autofill=True)
    if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
        print(f"Error funding {name}: {response.result['meta']['TransactionResult']}")
        sys.exit(1)

print(f"Sponsor A address: {sponsor_a.address}")
print(f"Sponsor B address: {sponsor_b.address}")
print(f"Sponsee address:   {sponsee.address}")

# Submit an unsponsored MPTokenAuthorize transaction ------------------------------------------------
# The sponsee authorizes an MPToken without any sponsorship.
print("\n=== Submitting unsponsored MPTokenAuthorize transaction... ===")
mptoken_authorize_tx = MPTokenAuthorize(
    account=sponsee.address,
    mptoken_issuance_id=mpt_issuance_id,
)
response = submit_and_wait(mptoken_authorize_tx, client, sponsee, autofill=True)
if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = response.result["meta"]["TransactionResult"]
    print(f"Error creating MPToken: {result_code}")
    sys.exit(1)

mptoken_node = next(
    (node for node in response.result["meta"]["AffectedNodes"]
     if node.get("CreatedNode", {}).get("LedgerEntryType") == "MPToken"),
    None,
)
if mptoken_node is None:
    print("Error: MPToken not found in metadata")
    sys.exit(1)

print(f"MPTokenAuthorize transaction successful!")
mptoken_id = mptoken_node["CreatedNode"]["LedgerIndex"]
print(f"MPToken ID: {mptoken_id}")

# Create a reserve sponsorship -------------------------------------------------
# Sponsor A creates a sponsorship on the existing unsponsored MPToken.
print("\n=== Creating reserve sponsorship... ===")
create_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=mptoken_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_CREATE,
    sponsor=sponsor_a.address,
    sponsor_flags=SPF_SPONSOR_RESERVE,
)
create_tx = autofill(create_tx, client)
sponsee_signed = sign(create_tx, sponsee)
co_signed = sign_as_sponsor(sponsor_a, sponsee_signed)

print("Submitting SponsorshipTransfer transaction...")
response = submit_and_wait(co_signed.tx, client)
if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = response.result["meta"]["TransactionResult"]
    print(f"Error creating sponsorship: {result_code}")
    sys.exit(1)

# Verify the sponsorship was created
mptoken_modified = next(
    (node for node in response.result["meta"]["AffectedNodes"]
     if node.get("ModifiedNode", {}).get("LedgerEntryType") == "MPToken"),
    None,
)
if mptoken_modified is None:
    print("Error: MPToken not found in metadata")
    sys.exit(1)
new_sponsor = mptoken_modified["ModifiedNode"]["FinalFields"].get("Sponsor")
if new_sponsor != sponsor_a.address:
    print(f"Error: Expected Sponsor {sponsor_a.address}, got {new_sponsor}")
    sys.exit(1)

print(f"Sponsor A ({sponsor_a.address}) is now sponsoring the MPToken reserve!")
print(json.dumps(response.result["tx_json"], indent=2))

# Reassign the reserve sponsorship ---------------------------------------------
# Transfer the reserve sponsorship from Sponsor A to Sponsor B.
print("\n=== Reassigning reserve sponsorship... ===")
reassign_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=mptoken_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_REASSIGN,
    sponsor=sponsor_b.address,
    sponsor_flags=SPF_SPONSOR_RESERVE,
)
reassign_tx = autofill(reassign_tx, client)
sponsee_signed = sign(reassign_tx, sponsee)
co_signed = sign_as_sponsor(sponsor_b, sponsee_signed)

print("Submitting SponsorshipTransfer transaction...")
response = submit_and_wait(co_signed.tx, client)
if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = response.result["meta"]["TransactionResult"]
    print(f"Error reassigning sponsorship: {result_code}")
    sys.exit(1)

# Verify the sponsorship was reassigned
mptoken_modified = next(
    (node for node in response.result["meta"]["AffectedNodes"]
     if node.get("ModifiedNode", {}).get("LedgerEntryType") == "MPToken"),
    None,
)
if mptoken_modified is None:
    print("Error: MPToken not found in metadata")
    sys.exit(1)
new_sponsor = mptoken_modified["ModifiedNode"]["FinalFields"].get("Sponsor")
if new_sponsor != sponsor_b.address:
    print(f"Error: Expected Sponsor {sponsor_b.address}, got {new_sponsor}")
    sys.exit(1)

print(f"Sponsorship reassigned from Sponsor A ({sponsor_a.address}) to Sponsor B ({sponsor_b.address})!")
print(json.dumps(response.result["tx_json"], indent=2))

# End the reserve sponsorship --------------------------------------------------
# The sponsee takes over the reserve obligation for the MPToken.
print("\n=== Ending reserve sponsorship... ===")
end_tx = SponsorshipTransfer(
    account=sponsee.address,
    object_id=mptoken_id,
    flags=SponsorshipTransferFlag.TF_SPONSORSHIP_END,
)

print("Submitting SponsorshipTransfer transaction...")
submit_response = submit_and_wait(end_tx, client, sponsee, autofill=True)
if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error ending reserve sponsorship: {result_code}")
    sys.exit(1)

# Verify the sponsorship was ended ---------------------------------------------
mptoken_modified = next(
    (node for node in submit_response.result["meta"]["AffectedNodes"]
     if node.get("ModifiedNode", {}).get("LedgerEntryType") == "MPToken"),
    None,
)
if mptoken_modified is None:
    print("Error: MPToken not found in metadata")
    sys.exit(1)
if "Sponsor" in mptoken_modified["ModifiedNode"]["FinalFields"]:
    print("Error: Sponsor field still present on MPToken")
    sys.exit(1)

print("Reserve sponsorship ended successfully!")
print(json.dumps(submit_response.result["tx_json"], indent=2))
