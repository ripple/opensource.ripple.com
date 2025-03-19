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
import json

testnet_url = "https://s.devnet.rippletest.net:51234/"


def get_account(seed):
    """get_account"""
    client = JsonRpcClient(testnet_url)
    if (seed == ''):
        new_wallet = generate_faucet_wallet(client)
    else:
        new_wallet = Wallet.from_seed(seed)
    return new_wallet


def get_account_info(accountId):
    """get_account_info"""
    client = JsonRpcClient(testnet_url)
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
    wallet = Wallet.from_seed(seed)
    client = JsonRpcClient(testnet_url)
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


def create_single_asset_vault(vault_owner_seed, issuer_seed, asset, assetMaximum,):
    """create_single_asset_vault"""
    owner_wallet = Wallet.from_seed(vault_owner_seed)
    issuer_wallet = Wallet.from_seed(issuer_seed)
    client = JsonRpcClient(testnet_url)

    tx = VaultCreate(
        account=owner_wallet.address,
        asset=IssuedCurrency(currency=asset, issuer=issuer_wallet.address),
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
    receiving_wallet = Wallet.from_seed(seed)
    client = JsonRpcClient(testnet_url)
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
