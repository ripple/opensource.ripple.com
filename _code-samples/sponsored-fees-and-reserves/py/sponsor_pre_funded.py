import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import Payment, MPTokenAuthorize, PaymentFlag, SponsorshipSet
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

SETUP_JSON_FILE = "sponsored_fees_and_reserves.json"
GENESIS_SEED = "snoPBrXtMeMyMHUVTgbuqAfg1SUTb"

SPF_SPONSOR_FEE = 0x00000001
SPF_SPONSOR_RESERVE = 0x00000002

client = JsonRpcClient("http://localhost:5005")

# Load setup data
print("=== Loading setup data... ===")
if not os.path.exists(SETUP_JSON_FILE):
    print(f"{SETUP_JSON_FILE} not found. Running setup script...")
    subprocess.run([sys.executable, "sponsored_fees_and_reserves_setup.py"], check=True)

with open(SETUP_JSON_FILE) as f:
    setup_data = json.load(f)

mpt_issuance_id = setup_data["mpt_issuance_id"]
issuer_address = setup_data["issuer"]["address"]
print(f"\nMPT Issuance ID: {mpt_issuance_id}")
print(f"Issuer address:  {issuer_address}")

print("\n=== Creating wallets... ===")
genesis = Wallet.from_seed(GENESIS_SEED, algorithm="secp256k1")
sponsor = Wallet.create()
sponsee = Wallet.create()

# Fund the sponsor only
fund_tx = Payment(
    account=genesis.address,
    destination=sponsor.address,
    amount="100000000",  # 100 XRP
)
response = submit_and_wait(fund_tx, client, genesis, autofill=True)
if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    print(f"Error funding sponsor: {response.result['meta']['TransactionResult']}")
    sys.exit(1)

print(f"Sponsor address: {sponsor.address}")
print("Funded sponsor with 100 XRP")
print(f"\nSponsee address: {sponsee.address}")

# Sponsor creates the sponsee's account ----------------------------------------
print("\n=== Creating sponsee's account... ===")
fund_account_tx = Payment(
    account=sponsor.address,
    destination=sponsee.address,
    amount="1",  # Minimal amount - reserve is sponsored, not transferred
    flags=PaymentFlag.TF_SPONSOR_CREATED_ACCOUNT,
)
print(json.dumps(fund_account_tx.to_xrpl(), indent=2))

response = submit_and_wait(fund_account_tx, client, sponsor, autofill=True)
if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = response.result["meta"]["TransactionResult"]
    print(f"Error funding sponsee address: {result_code}")
    sys.exit(1)

# Verify the sponsee's account was created
account_node = next(
    (node for node in response.result["meta"]["AffectedNodes"]
     if node.get("CreatedNode", {}).get("LedgerEntryType") == "AccountRoot"),
    None,
)
if account_node is None:
    print("Error: AccountRoot not found in metadata")
    sys.exit(1)

new_account = account_node["CreatedNode"]["NewFields"]
if new_account.get("Account") != sponsee.address:
    print("Error: AccountRoot address does not match sponsee")
    sys.exit(1)
if new_account.get("Sponsor") != sponsor.address:
    print("Error: AccountRoot Sponsor does not match sponsor")
    sys.exit(1)

print("\nSponsee account created successfully!")

# Create the Sponsorship object ------------------------------------------------
print("\n=== Creating sponsorship pool... ===")
sponsorship_set_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount="1000000",  # 1 XRP in drops for transaction fees
    reserve_count=5,  # 5 owner count increments for reserves
)
print(json.dumps(sponsorship_set_tx.to_xrpl(), indent=2))

# Submit the SponsorshipSet transaction ----------------------------------------
sponsorship_response = submit_and_wait(sponsorship_set_tx, client, sponsor, autofill=True)
if sponsorship_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = sponsorship_response.result["meta"]["TransactionResult"]
    print(f"Error creating sponsorship pool: {result_code}")
    sys.exit(1)

# Verify the Sponsorship object was created
sponsorship_node = next(
    (node for node in sponsorship_response.result["meta"]["AffectedNodes"]
     if node.get("CreatedNode", {}).get("LedgerEntryType") == "Sponsorship"),
    None,
)
if sponsorship_node is None:
    print("Error: Sponsorship object not found in metadata")
    sys.exit(1)

sponsorship_id = sponsorship_node["CreatedNode"]["LedgerIndex"]
print(f"\nSponsorship pool created successfully!")
print(f"Sponsorship ID: {sponsorship_id}")

# Use the pool to submit a sponsored transaction --------------------------
# The sponsee references the sponsor, but does NOT need the sponsor's signature.
print("\n=== Submitting sponsored transaction... ===")
mptoken_authorize_tx = MPTokenAuthorize(
    account=sponsee.address,
    mptoken_issuance_id=mpt_issuance_id,
    sponsor=sponsor.address,
    sponsor_flags=SPF_SPONSOR_FEE | SPF_SPONSOR_RESERVE,
)
submit_response = submit_and_wait(mptoken_authorize_tx, client, sponsee, autofill=True)
if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error: MPTokenAuthorize failed: {result_code}")
    sys.exit(1)

# Verify the transaction was sponsored
tx_json = submit_response.result["tx_json"]
if tx_json.get("Sponsor") != sponsor.address:
    print("Error: Sponsor field mismatch")
    sys.exit(1)
if tx_json.get("SponsorFlags") != SPF_SPONSOR_FEE | SPF_SPONSOR_RESERVE:
    print("Error: SponsorFlags mismatch")
    sys.exit(1)
if "SponsorSignature" in tx_json:
    print("Error: SponsorSignature should not be present in pre-funded flow")
    sys.exit(1)

# Verify the MPToken was created with the sponsor field
mptoken_node = next(
    (node for node in submit_response.result["meta"]["AffectedNodes"]
     if node.get("CreatedNode", {}).get("LedgerEntryType") == "MPToken"),
    None,
)
if mptoken_node is None:
    print("Error: MPToken not found in metadata")
    sys.exit(1)
if mptoken_node["CreatedNode"]["NewFields"].get("Sponsor") != sponsor.address:
    print("Error: MPToken Sponsor field mismatch")
    sys.exit(1)

print("Transaction successfully sponsored!")
print(json.dumps(submit_response.result["tx_json"], indent=2))

# Show who paid what by inspecting the affected nodes
details = {"sponsor": {}, "sponsee": {}, "pool": {}}

for node in submit_response.result["meta"]["AffectedNodes"]:
    if "ModifiedNode" not in node:
        continue
    modified = node["ModifiedNode"]
    fields = modified["FinalFields"]
    prev = modified.get("PreviousFields", {})

    if modified["LedgerEntryType"] == "AccountRoot":
        if fields["Account"] == sponsor.address:
            details["sponsor"] = {
                "fee": int(prev["Balance"]) - int(fields["Balance"]) if "Balance" in prev else 0,
                "balance": fields["Balance"],
                "reserves": fields.get("SponsoringOwnerCount", 0),
            }
        if fields["Account"] == sponsee.address:
            details["sponsee"] = {
                "fee": int(prev["Balance"]) - int(fields["Balance"]) if "Balance" in prev else 0,
                "balance": fields["Balance"],
            }

    if modified["LedgerEntryType"] == "Sponsorship":
        details["pool"] = {
            "fee": int(prev["FeeAmount"]) - int(fields["FeeAmount"]) if "FeeAmount" in prev else 0,
            "balance": fields["FeeAmount"],
            "reserves_consumed": prev["ReserveCount"] - fields["ReserveCount"] if "ReserveCount" in prev else 0,
        }

print("\nSponsorship details --------------------------------------")
print(f"  Pool:")
print(f"    Fee deducted:          {details['pool'].get('fee', 0)} drops")
print(f"    Balance:               {details['pool'].get('balance', 0)} drops")
print(f"    Reserves consumed:     {details['pool'].get('reserves_consumed', 0)}")
print(f"\n  Sponsor:")
print(f"    Fee deducted:          {details['sponsor'].get('fee', 0)} drops")
print(f"    Balance:               {details['sponsor'].get('balance', 0)} drops")
print(f"    Reserves sponsored:    {details['sponsor'].get('reserves', 0)}")
print(f"\n  Sponsee:")
print(f"    Fee deducted:          {details['sponsee'].get('fee', 0)} drops")
print(f"    Balance:               {details['sponsee'].get('balance', 0)} drops")

