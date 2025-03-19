import tkinter as tk
import json
from xrpl.utils import drops_to_xrp

from helpers import (
    get_account,
    get_account_info,
    create_single_asset_vault,
    configure_account,
)

JSON_INDENT_VALUE = 2


def get_vault_owner_account():
    vault_owner_wallet = get_account(ent_vault_owner_seed.get())
    ent_vault_owner_account.delete(0, tk.END)
    ent_vault_owner_seed.delete(0, tk.END)
    ent_vault_owner_account.insert(0, vault_owner_wallet.classic_address)
    ent_vault_owner_seed.insert(0, vault_owner_wallet.seed)

    get_vault_owner_account_info()


def get_vault_owner_account_info():
    account_info = get_account_info(ent_vault_owner_account.get())
    balance = float(drops_to_xrp(account_info['Balance']))
    ent_vault_owner_balance.delete(0, tk.END)
    ent_vault_owner_balance.insert(0, balance)
    text_results.delete("1.0", tk.END)
    text_results.insert("1.0", json.dumps(account_info, indent=JSON_INDENT_VALUE))

def get_account_from_seed():
    return

def create_vault():
    response = create_single_asset_vault(ent_vault_owner_seed.get(), 
                                         ent_issuer_account.get(),
                                         ent_vault_currency.get())
    text_results.delete("1.0", tk.END)
    text_results.insert("1.0", json.dumps(response.result, indent=JSON_INDENT_VALUE))


def vault_owner_configure_account():
    results = configure_account(ent_vault_owner_seed.get(),
                                vault_owner_rippling)
    get_vault_owner_account_info()
    text_results.delete("1.0", tk.END)
    text_results.insert("1.0", json.dumps(results, indent=JSON_INDENT_VALUE))


# Create a new window with the title "Single Asset Vault Test Harness"
window = tk.Tk()
window.title("Single Asset Vault Test Harness")

private_vault = tk.BooleanVar()
transferable_shares = tk.BooleanVar()

# Form frame
frm_form = tk.Frame(relief=tk.SUNKEN, borderwidth=3)
frm_form.pack()

# Create the Label and Entry widgets for the "Vault Owner" account
lbl_vault_owner_seed = tk.Label(master=frm_form, text="Vault Owner Seed:")
ent_vault_owner_seed = tk.Entry(master=frm_form, width=50)
lbl_vault_owner_account = tk.Label(master=frm_form, text="Vault Owner Account:")
ent_vault_owner_account = tk.Entry(master=frm_form, width=50)
lbl_vault_owner_balance = tk.Label(master=frm_form, text="XRP Balance:")
ent_vault_owner_balance = tk.Entry(master=frm_form, width=50)

# Place fields in a grid
lbl_vault_owner_seed.grid(row=1, column=0, sticky="e")
ent_vault_owner_seed.grid(row=1, column=1)
lbl_vault_owner_account.grid(row=2, column=0, sticky="e")
ent_vault_owner_account.grid(row=2, column=1)
lbl_vault_owner_balance.grid(row=3, column=0, sticky="e")
ent_vault_owner_balance.grid(row=3, column=1)

# Create the Label and Entry widgets for the "Vault"
lbl_vault_currency = tk.Label(master=frm_form, text="Vault Currency:")
ent_vault_currency = tk.Entry(master=frm_form, width=50)
lbl_issuer_account = tk.Label(master=frm_form, text="Issuer Account:")
ent_issuer_account = tk.Entry(master=frm_form, width=50)
lbl_max_asset_amount = tk.Label(master=frm_form, text="Max Currency Amount:")
ent_max_asset_amount = tk.Entry(master=frm_form, width=50)
lbl_domain_id = tk.Label(master=frm_form, text="Domain ID:")
ent_domain_id = tk.Entry(master=frm_form, width=50)
cb_private_vault = tk.Checkbutton(master=frm_form, text="Private Vault", variable=private_vault, onvalue=True, offvalue=False)
cb_transferable_shares = tk.Checkbutton(master=frm_form, text="Transferable Shares", variable=private_vault, onvalue=True, offvalue=False)
lbl_results = tk.Label(master=frm_form, text='Results:')
text_results = tk.Text(master=frm_form, height=20, width=65)

# Place fields in a grid
lbl_vault_currency.grid(row=4, column=0, sticky="e")
ent_vault_currency.grid(row=4, column=1)
lbl_issuer_account.grid(row=5, column=0, sticky="e")
ent_issuer_account.grid(row=5, column=1, stick="w")
lbl_max_asset_amount.grid(row=6, column=0, sticky="e")
ent_max_asset_amount.grid(row=6, column=1, stick="w")
lbl_domain_id.grid(row=7, column=0, sticky="e")
ent_domain_id.grid(row=7, column=1, stick="w")
cb_private_vault.grid(row=8, column=1, sticky="w")
cb_transferable_shares.grid(row=8, column=2, sticky="w")
lbl_results.grid(row=12, column=0, sticky="ne")
text_results.grid(row=12, column=1, sticky="nw")

#############################################
## Buttons ##################################
#############################################

# Vault Owner Buttons
btn_get_vault_owner_account = tk.Button(master=frm_form, text="Get Vault Owner Account",
                                        command=get_vault_owner_account)

btn_get_vault_owner_account.grid(row=1, column=2, sticky="nsew")

# Vault Buttons
btn_create_vault = tk.Button(master=frm_form,
                             text="Create Vault",
                             command=create_vault)
btn_update_vault = tk.Button(master=frm_form,
                             text="Update Vault",
                             command=create_vault)
btn_delete_vault = tk.Button(master=frm_form,
                             text="Delete Vault",
                             command=create_vault)
btn_deposit = tk.Button(master=frm_form,
                             text="Deposit",
                             command=create_vault)
btn_withdraw = tk.Button(master=frm_form,
                             text="Withdraw",
                             command=create_vault)

btn_create_vault.grid(row=3, column=2, sticky="nsew")
btn_update_vault.grid(row=4, column=2, sticky="nsew")
btn_delete_vault.grid(row=5, column=2, sticky="nsew")
btn_deposit.grid(row=6, column=2, sticky="nsew")
btn_withdraw.grid(row=7, column=2, sticky="nsew")

window.mainloop()
