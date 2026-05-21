import json
import os
import subprocess
import sys

from xrpl.clients import JsonRpcClient
from xrpl.models import AccountInfo, MPTokenAuthorize, Payment, SponsorshipSet
from xrpl.models.transactions.sponsorship_set import SponsorshipSetFlag
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet

SETUP_JSON_FILE = "sponsored_fees_and_reserves.json"
GENESIS_SEED = "snoPBrXtMeMyMHUVTgbuqAfg1SUTb"

SPF_SPONSOR_FEE = 0x00000001
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
print(f"\nMPT Issuance ID: {mpt_issuance_id}")
print(f"Issuer address:  {issuer_address}")

# Fund accounts ----------------------------------------------------------------
print("\n=== Funding accounts... ===")
genesis = Wallet.from_seed(GENESIS_SEED, algorithm="secp256k1")
sponsor = Wallet.create()
sponsee = Wallet.create()

for wallet, name in [(sponsor, "sponsor"), (sponsee, "sponsee")]:
    fund_tx = Payment(
        account=genesis.address,
        destination=wallet.address,
        amount="100000000",  # 100 XRP
    )
    response = submit_and_wait(fund_tx, client, genesis, autofill=True)
    if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
        print(f"Error funding {name}: {response.result['meta']['TransactionResult']}")
        sys.exit(1)

sponsor_info = client.request(AccountInfo(account=sponsor.address))
print(f"Sponsor address: {sponsor.address}")
print(f"        balance: {sponsor_info.result['account_data']['Balance']} drops")
print(f"\nSponsee address: {sponsee.address}")


# Create a sponsorship pool ----------------------------------------------------
# The sponsor creates a pre-funded pool for the sponsee with fees and reserves.
print("\n=== Creating sponsorship pool... ===")
pool_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount="1000000",  # 1 XRP in drops
    reserve_count=5,
)
mpt_auth_response = submit_and_wait(pool_tx, client, sponsor, autofill=True)
if mpt_auth_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = mpt_auth_response.result["meta"]["TransactionResult"]
    print(f"Error creating sponsorship pool: {result_code}")
    sys.exit(1)

sponsor_info = client.request(AccountInfo(account=sponsor.address))
sponsor_balance = int(sponsor_info.result["account_data"]["Balance"])

print("Sponsorship pool created successfully:")
print(f"  Fee allocated:      1000000 drops (1 XRP)")
print(f"  Reserves allocated: 5")
print(f"\nSponsor balance: {sponsor_balance} drops")

# Use the sponsorship pool -----------------------------------------------------
# The sponsee submits an MPTokenAuthorize transaction using the pool, partially consuming it.
print("\n=== Using sponsorship pool... ===")
authorize_tx = MPTokenAuthorize(
    account=sponsee.address,
    mptoken_issuance_id=mpt_issuance_id,
    sponsor=sponsor.address,
    sponsor_flags=SPF_SPONSOR_FEE | SPF_SPONSOR_RESERVE,
)
response = submit_and_wait(authorize_tx, client, sponsee, autofill=True)
if response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = response.result["meta"]["TransactionResult"]
    print(f"Error using sponsorship pool: {result_code}")
    sys.exit(1)

sponsorship_node = next(
    (node for node in response.result["meta"]["AffectedNodes"]
     if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Sponsorship"),
    None,
)
if sponsorship_node:
    fields = sponsorship_node["ModifiedNode"]["FinalFields"]
    print(f"Pool status after usage:")
    print(f"  Fee remaining:      {fields.get('FeeAmount', '0')} drops")
    print(f"  Reserves remaining: {fields.get('ReserveCount', 0)}")

print("\nSponsorship pool partially consumed!")

# Update the sponsorship pool --------------------------------------------------
# The sponsor tops up the fee allocation and adds more reserve slots.
print("\n=== Updating sponsorship pool... ===")
update_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    fee_amount="2000000",  # increase to 2 XRP in drops
    reserve_count=10,
)
update_response = submit_and_wait(update_tx, client, sponsor, autofill=True)
if update_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = update_response.result["meta"]["TransactionResult"]
    print(f"Error updating sponsorship pool: {result_code}")
    sys.exit(1)

sponsorship_node = next(
    (node for node in update_response.result["meta"]["AffectedNodes"]
     if node.get("ModifiedNode", {}).get("LedgerEntryType") == "Sponsorship"),
    None,
)
if sponsorship_node:
    fields = sponsorship_node["ModifiedNode"]["FinalFields"]
    print(f"Pool status after update:")
    print(f"  Fee allocated:      {fields.get('FeeAmount', '0')} drops")
    print(f"  Reserves allocated: {fields.get('ReserveCount', 0)}")

print("\nSponsorship pool updated successfully!")
print(json.dumps(update_response.result["tx_json"], indent=2))

# Check sponsor balance before deletion ----------------------------------------
print("\n=== Checking sponsor balance before deletion... ===")
sponsor_info = client.request(AccountInfo(account=sponsor.address))
balance_before = int(sponsor_info.result["account_data"]["Balance"])
print(f"Sponsor balance: {balance_before} drops")

# Delete the sponsorship pool --------------------------------------------------
# The sponsor deletes the pool to reclaim any remaining funds.
print("\n=== Deleting sponsorship pool... ===")
delete_tx = SponsorshipSet(
    account=sponsor.address,
    sponsee=sponsee.address,
    flags=SponsorshipSetFlag.TF_DELETE_OBJECT,
)
submit_response = submit_and_wait(delete_tx, client, sponsor, autofill=True)
if submit_response.result["meta"]["TransactionResult"] != "tesSUCCESS":
    result_code = submit_response.result["meta"]["TransactionResult"]
    print(f"Error deleting sponsorship pool: {result_code}")
    sys.exit(1)

# Verify the Sponsorship object was deleted ------------------------------------
deleted_node = next(
    (node for node in submit_response.result["meta"]["AffectedNodes"]
     if node.get("DeletedNode", {}).get("LedgerEntryType") == "Sponsorship"),
    None,
)
if deleted_node is None:
    print("Error: Sponsorship object not deleted")
    sys.exit(1)

print("Sponsorship pool deleted successfully!")
print(json.dumps(submit_response.result["tx_json"], indent=2))

# Check sponsor balance after deletion -----------------------------------------
sponsor_info = client.request(AccountInfo(account=sponsor.address))
balance_after = int(sponsor_info.result["account_data"]["Balance"])
delete_fee = int(submit_response.result["tx_json"]["Fee"])
funds_returned = balance_after - balance_before + delete_fee

print(f"\nSponsor balance:          {balance_after} drops")
print(f"Delete transaction fee:     {delete_fee} drops")
print(f"Funds returned from pool:   {funds_returned} drops")
