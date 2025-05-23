from xrpl.clients import JsonRpcClient
from xrpl.wallet import (generate_faucet_wallet, Wallet)
from xrpl.models import (
    AccountObjects,
    VaultCreate,
    VaultSet,
    # VaultCreateFlag
)
from xrpl.models.requests import (
    AccountInfo,
    VaultInfo
)
from xrpl.transaction import (submit_and_wait, XRPLReliableSubmissionException)
from xrpl.asyncio.clients.exceptions import XRPLRequestFailureException
from xrpl.utils import drops_to_xrp
from xrpl.models.currencies.xrp import XRP

# TODO: Remove lending env once done testing the feature
NETWORKS = {
    'Lending': "https://lend.devnet.rippletest.net:51234/",
    'Devnet': "https://s.devnet.rippletest.net:51234/",
    'Testnet': "https://s.altnet.rippletest.net:51234/"
}

_xrpl_client = None
_active_ledger = "Testnet"


def set_ledger(ledger="Testnet"):
    """
    Sets the active ledger and initializes the XRPL client for it.
    """
    global _xrpl_client, _active_ledger
    if ledger not in NETWORKS:
        raise (ValueError(f"Invalid ledger network: {ledger}"))
    _active_ledger = ledger
    _xrpl_client = JsonRpcClient(NETWORKS[ledger])
    return NETWORKS[ledger]


def get_client():
    """
    Returns the XRPL client for the active ledger.
    Ensures the client is initialized before use.
    """
    if _xrpl_client is None:
        set_ledger(_active_ledger)
    return _xrpl_client


def get_account(seed):
    """get_account"""
    client = get_client()
    if (seed == ''):
        # TODO: Remove faucet_host once completed testing
        # new_wallet = generate_faucet_wallet(client, faucet_host="lend-faucet.devnet.rippletest.net", usage_context="testing")
        wallet = generate_faucet_wallet(client)
    else:
        wallet = Wallet.from_seed(seed)
    return wallet


def get_account_info(accountId):
    """get_account_info"""
    client = get_client()
    acct_info = AccountInfo(account=accountId, ledger_index="validated")
    try:
        response = client.request(acct_info)
        return response.result['account_data']
    except XRPLReliableSubmissionException as e:
        return f"[Error]: {e}"


def create_single_asset_vault(account_seed, asset_maximum, is_transferable=True):
    """create_single_asset_vault"""
    client = get_client()
    vault_owner_wallet = Wallet.from_seed(account_seed)
    set_flags = []

    if not is_transferable:
        # TODO: Add this when code exports the flag class
        # set_flags=[VaultCreateFlag.TF_VAULT_SHARE_NON_TRANSFERABLE]
        print(f"[FAKE]Setting flags: [TF_VAULT_SHARE_NON_TRANSFERABLE]...")

    tx = VaultCreate(
        account=vault_owner_wallet.address,
        asset=XRP(),
        assets_maximum="0" if asset_maximum == "" else asset_maximum,
        withdrawal_policy=1,
        flags=set_flags
    )
    try:
        response = submit_and_wait(tx, client=client, wallet=vault_owner_wallet, autofill=True)
        return tx.to_xrpl(), response.result
    except XRPLRequestFailureException as e:
        return tx.to_xrpl(), f"Error: {e.error} - {e.error_message}"


def update_single_asset_vault(vault_owner_seed, asset_maximum):
    """update_single_asset_vault"""
    client = get_client()
    owner_wallet = Wallet.from_seed(vault_owner_seed)
    set_flags = []
    tx = VaultSet(
        account=owner_wallet.address,
        asset=XRP(),
        asset_maximum="0" if asset_maximum == "" else asset_maximum,
        withdrawal_policy=1,
        flags=set_flags,
    )

    try:
        response = submit_and_wait(tx, client=client, wallet=owner_wallet, autofill=True)
        return response.result
    except XRPLRequestFailureException as e:
        return f"Error: {e}"


def get_vault_info(vaultId):
    """get_vault_info"""
    client = get_client()
    vault_info = VaultInfo(vault_id=vaultId, ledger_index="validated")
    try:
        response = client.request(vault_info)
        return response.result['vault']
    except XRPLReliableSubmissionException as e:
        return f"[Error]: {e}"

def get_account_object(account_address, account_object_type):
    """get_account_object"""
    client = get_client()
    try:
        response = client.request(
            AccountObjects(account=account_address, type=account_object_type.lower())
        )
        return response.result
    except XRPLReliableSubmissionException as e:
        return f"Error: {e}"


def convert_drops_to_xrp(drops_amount):
    return drops_to_xrp(drops_amount)
