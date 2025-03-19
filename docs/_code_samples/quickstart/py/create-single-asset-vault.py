import tkinter as tk
import json
from xrpl.utils import drops_to_xrp

from helpers import get_account, get_account_info, create_single_asset_vault, configure_account

JSON_INDENT_VALUE = 2


def get_vault_owner_account():
    vault_owner_wallet = get_account(ent_vault_owner_seed.get())
    ent_vault_owner_account.delete(0, tk.END)
    ent_vault_owner_seed.delete(0, tk.END)
    ent_vault_owner_currency.delete(0, tk.END)
    ent_vault_owner_account.insert(0, vault_owner_wallet.classic_address)
    ent_vault_owner_seed.insert(0, vault_owner_wallet.seed)

    get_vault_owner_account_info()


def get_vault_owner_account_info():
    account_info = get_account_info(ent_vault_owner_account.get())
    balance = float(drops_to_xrp(account_info['Balance']))
    ent_vault_owner_balance.delete(0, tk.END)
    ent_vault_owner_balance.insert(0, balance)
    text_vault_owner_results.delete("1.0", tk.END)
    text_vault_owner_results.insert("1.0", json.dumps(account_info, indent=JSON_INDENT_VALUE))


def get_issuer_account():
    issuer_wallet = get_account(ent_issuer_account_seed.get())
    ent_issuer_account.delete(0, tk.END)
    ent_issuer_account_seed.delete(0, tk.END)
    ent_issuer_account.insert(0, issuer_wallet.classic_address)
    ent_issuer_account_seed.insert(0, issuer_wallet.seed)

    get_issuer_account_info()


def get_issuer_account_info():
    account_info = get_account_info(ent_issuer_account.get())
    balance = float(drops_to_xrp(account_info['Balance']))
    ent_issuer_account_balance.delete(0, tk.END)
    ent_issuer_account_balance.insert(0, balance)
    text_issuer_account_results.delete("1.0", tk.END)
    text_issuer_account_results.insert("1.0", json.dumps(account_info, indent=JSON_INDENT_VALUE))


def create_vault():
    response = create_single_asset_vault(
        ent_vault_owner_seed.get(), ent_issuer_account_seed.get())
    text_vault_owner_results.delete("1.0", tk.END)
    text_vault_owner_results.insert("1.0", json.dumps(response.result, indent=JSON_INDENT_VALUE))


def vault_owner_configure_account():
    results = configure_account(ent_vault_owner_seed.get(),
                                vault_owner_rippling)
    get_vault_owner_account_info()
    text_vault_owner_results.delete("1.0", tk.END)
    text_vault_owner_results.insert("1.0", json.dumps(results, indent=JSON_INDENT_VALUE))


def issuer_configure_account():
    results = configure_account(
        ent_issuer_account_seed.get(),
        issuer_rippling)
    get_issuer_account_info()
    text_issuer_account_results.delete("1.0", tk.END)
    text_issuer_account_results.insert("1.0", json.dumps(results, indent=JSON_INDENT_VALUE))


def create_trust_line():
    return ""


# Create a new window with the title "Single Asset Vault Test Harness"
window = tk.Tk()
window.title("Single Asset Vault Test Harness")

vault_owner_rippling = tk.BooleanVar()
issuer_rippling = tk.BooleanVar()

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
lbl_vault_owner_currency = tk.Label(master=frm_form, text="Currency:")
ent_vault_owner_currency = tk.Entry(master=frm_form, width=50)
lbl_vault_owner_results = tk.Label(master=frm_form, text='Results:')
text_vault_owner_results = tk.Text(master=frm_form, height=20, width=65)
cb_vault_owner_allow_rippling = tk.Checkbutton(master=frm_form, text="Allow Rippling", variable=vault_owner_rippling, onvalue=True, offvalue=False)

# Place fields in a grid
lbl_vault_owner_seed.grid(row=1, column=0, sticky="e")
ent_vault_owner_seed.grid(row=1, column=1)
lbl_vault_owner_account.grid(row=2, column=0, sticky="e")
ent_vault_owner_account.grid(row=2, column=1)
lbl_vault_owner_balance.grid(row=3, column=0, sticky="e")
ent_vault_owner_balance.grid(row=3, column=1)
lbl_vault_owner_currency.grid(row=4, column=0, sticky="e")
ent_vault_owner_currency.grid(row=4, column=1)
cb_vault_owner_allow_rippling.grid(row=5,column=1, sticky="w")
lbl_vault_owner_results.grid(row=7, column=0, sticky="ne")
text_vault_owner_results.grid(row=7, column=1, sticky="nw")
cb_vault_owner_allow_rippling.select()

# Create the Label and Entry widgets for the "Issuer" account
lbl_issuer_account_seed = tk.Label(master=frm_form, text="Issuer Account Seed:")
ent_issuer_account_seed = tk.Entry(master=frm_form, width=50)
lbl_issuer_account = tk.Label(master=frm_form, text="Issuer Account:")
ent_issuer_account = tk.Entry(master=frm_form, width=50)
lbl_issuer_account_balance = tk.Label(master=frm_form, text="XRP Balance:")
ent_issuer_account_balance = tk.Entry(master=frm_form, width=50)
lbl_issuer_account_currency = tk.Label(master=frm_form, text="Currency:")
ent_issuer_account_currency = tk.Entry(master=frm_form, width=50)
lbl_issuer_account_results = tk.Label(master=frm_form, text='Results:')
text_issuer_account_results = tk.Text(master=frm_form, height=20, width=65)

# Place fields in a grid
lbl_issuer_account_seed.grid(row=1, column=7, sticky="e")
ent_issuer_account_seed.grid(row=1, column=8, sticky="w")
lbl_issuer_account.grid(row=2, column=7, sticky="e")
ent_issuer_account.grid(row=2, column=8, stick="w")
lbl_issuer_account_balance.grid(row=3, column=7, sticky="e")
ent_issuer_account_balance.grid(row=3, column=8, stick="w")
lbl_issuer_account_currency.grid(row=4, column=7, sticky="e")
ent_issuer_account_currency.grid(row=4, column=8, stick="w")
lbl_issuer_account_results.grid(row=7, column=7, sticky="ne")
text_issuer_account_results.grid(row=7, column=8, sticky="nw")


#############################################
## Buttons ##################################
#############################################

# Create the Vault Owner Account Buttons
btn_get_vault_owner_account = tk.Button(master=frm_form, text="Get New Vault Owner Account",
                                        command=get_vault_owner_account)
btn_vault_owner_configure_account = tk.Button(master=frm_form,
                                          text="Configure Account",
                                          command = vault_owner_configure_account)
btn_create_trust_line = tk.Button(master=frm_form,
                                  text="Create VaultOwner <> Issuer TrustLine",
                                  command=create_trust_line)
btn_create_vault = tk.Button(master=frm_form,
                             text="Create Vault",
                             command=create_vault)

btn_get_vault_owner_account.grid(row=0, column=1, sticky="nsew")
btn_vault_owner_configure_account.grid(row=5, column=0, sticky="nswew")
btn_create_trust_line.grid(row=7, column=8, sticky="e")
btn_create_vault.grid(row=10, column=1, sticky="nsew")

# Create Issuer Account Buttons
btn_get_issuer_account = tk.Button(master=frm_form, text="Get New Issuer Account",
                                   command=get_issuer_account)

btn_get_issuer_account.grid(row=0, column=8, sticky="nsew")

window.mainloop()
