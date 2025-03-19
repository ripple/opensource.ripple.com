from xrpl.clients import JsonRpcClient
from xrpl.wallet import (
    generate_faucet_wallet,
    Wallet
)
from xrpl.models import VaultCreate
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.models.transactions import (
    TrustSet,
    AccountSet,
    AccountSetAsfFlag
)
from xrpl.models.currencies import IssuedCurrency
from xrpl.models.requests.account_info import AccountInfo
from xrpl.transaction import (
    submit_and_wait,
    XRPLReliableSubmissionException
)

networks = {'Devnet': "https://s.devnet.rippletest.net:51234/", 'Testnet': "https://s.altnet.rippletest.net:51234/"}

_xrpl_client = None

def set_ledger(ledger="Testnet"):
    """Sets the active ledger and updates the client."""
    global _xrpl_client
    global _active_ledger
    _active_ledger = ledger
    if ledger == "Testnet":
        _xrpl_client = JsonRpcClient(networks[ledger])
        return networks[ledger]
    elif ledger == "Devnet":
        _xrpl_client = JsonRpcClient(networks[ledger])
        return networks[ledger]
    else:
        raise ValueError(f"Invalid ledger option: {ledger}")
    return _xrpl_client

def get_client():
    """Returns the currently active XRPL client."""
    global _xrpl_client
    if _xrpl_client is None:
        set_ledger(_active_ledger) 
    return _xrpl_client

def get_account(seed):
    """get_account"""
    client = get_client()
    if (seed == ''):
        new_wallet = generate_faucet_wallet(client)
    else:
        new_wallet = Wallet.from_seed(seed)
    return new_wallet


def get_account_info(accountId):
    """get_account_info"""
    client = get_client()
    acct_info = AccountInfo(
        account=accountId,
        ledger_index="validated"
    )

    try:
        response = client.request(acct_info)
    except XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result['account_data']


def configure_account(seed, default_setting):
    """configure_account"""
    client = get_client()
    wallet = Wallet.from_seed(seed)
    if (default_setting):
        setting_tx = AccountSet(
            account=wallet.classic_address,
            set_flag=AccountSetAsfFlag.ASF_DEFAULT_RIPPLE
        )
    else:
        setting_tx = AccountSet(
            account=wallet.classic_address,
            clear_flag=AccountSetAsfFlag.ASF_DEFAULT_RIPPLE
        )

    try:
        response = submit_and_wait(setting_tx, client, wallet)
    except XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result


def create_single_asset_vault(vault_owner_seed, issuer_wallet_address, currency):
    """create_single_asset_vault"""
    client = get_client()
    owner_wallet = Wallet.from_seed(vault_owner_seed)

    tx = VaultCreate(
        account=owner_wallet.address,
        asset=IssuedCurrency(currency=currency, issuer=issuer_wallet_address),
        asset_maximum="10000",
        withdrawal_policy=1,
    )
    try:
        response = submit_and_wait(tx, client, owner_wallet)
    except XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result


def create_trust_line(seed, issuer, currency, amount):
    """create_trust_line"""
    client = get_client()
    receiving_wallet = Wallet.from_seed(seed)

    # Define the trust line transaction
    trustline_tx = TrustSet(
        account=receiving_wallet.address,
        limit_amount=IssuedCurrencyAmount(
            currency=currency,
            issuer=issuer,
            value=int(amount)
        )
    )
    try:
        response = submit_and_wait(trustline_tx, client, receiving_wallet)
    except XRPLReliableSubmissionException as e:
        response = f"Submit failed: {e}"
    return response.result
