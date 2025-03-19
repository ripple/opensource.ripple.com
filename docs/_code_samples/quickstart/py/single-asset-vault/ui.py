import tkinter as tk
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
from xrpl.utils import drops_to_xrp
import json

from xrpl_helpers import (
    get_account,
    get_account_info,
    create_single_asset_vault,
    set_ledger,
)

JSON_INDENT_VALUE = 2


class SAVTestHarness:
    def __init__(self, master):
        self.master = master
        master.title("Single Asset Vault Test Harness")

        # Apply a Bootstrap theme
        self.style = ttk.Style(theme='flatly')

        # --- Ledger Instance Selection ---
        ledger_frame = ttk.LabelFrame(master, text="Ledger", padding=10)
        ledger_frame.grid(row=0, column=0, padx=10, pady=10, sticky="ew")

        ttk.Label(ledger_frame, text="Choose your ledger instance:", padding=5).grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.ledger_instance = tk.StringVar(value="Testnet")
        ttk.Radiobutton(
            ledger_frame,
            text="Testnet",
            variable=self.ledger_instance,
            value="Testnet",
            bootstyle=PRIMARY,
            command=self.update_ledger
        ).grid(row=0, column=1, padx=5, pady=5, sticky="w")
        ttk.Radiobutton(
            ledger_frame,
            text="Devnet",
            variable=self.ledger_instance,
            value="Devnet",
            bootstyle=PRIMARY,
            command=self.update_ledger
        ).grid(row=0, column=2, padx=5, pady=5, sticky="w")

         # Initialize the ledger in xrpl_helpers
        set_ledger(self.ledger_instance.get())

        # --- Vault Owner Section ---
        vault_owner_frame = ttk.LabelFrame(master, text="Vault Owner", padding=10)
        vault_owner_frame.grid(row=1, column=0, padx=10, pady=10, sticky="ew")  

        ttk.Label(vault_owner_frame, text="Vault Owner Seed:", padding=5).grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.vault_owner_seed_entry = ttk.Entry(vault_owner_frame, width=40)
        self.vault_owner_seed_entry.grid(row=0, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        ttk.Button(vault_owner_frame, text="Get VaultOwner Account", command=self.get_vault_owner_account, bootstyle=INFO + "-outline").grid(row=0, column=3, padx=5, pady=5, sticky="w")

        ttk.Label(vault_owner_frame, text="Vault Owner Account:", padding=5).grid(row=1, column=0, padx=5, pady=5, sticky="w")
        self.vault_owner_account_entry = ttk.Entry(vault_owner_frame, width=40)
        self.vault_owner_account_entry.grid(row=1, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_owner_frame, text="XRP Balance:", padding=5).grid(row=2, column=0, padx=5, pady=5, sticky="w")
        self.vault_owner_xrp_balance_entry = ttk.Entry(vault_owner_frame, width=40, state="disabled")
        self.vault_owner_xrp_balance_entry.grid(row=2, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        # --- Depositor Section ---
        depositor_frame = ttk.LabelFrame(master, text="Depositor", padding=10)
        depositor_frame.grid(row=3, column=0, padx=10, pady=10, sticky="ew")  

        ttk.Label(depositor_frame, text="Depositor Seed:", padding=5).grid(row=4, column=0, padx=5, pady=5, sticky="w")
        self.depositor_seed_entry = ttk.Entry(depositor_frame, width=40)
        self.depositor_seed_entry.grid(row=4, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        ttk.Button(depositor_frame, text="Get Depositor Account", command=self.get_depositor_account, bootstyle=INFO + "-outline").grid(row=4, column=3, padx=5, pady=5, sticky="w")

        ttk.Label(depositor_frame, text="Depositor Account:", padding=5).grid(row=5, column=0, padx=5, pady=5, sticky="w")
        self.depositor_account_entry = ttk.Entry(depositor_frame, width=40)
        self.depositor_account_entry.grid(row=5, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        ttk.Label(depositor_frame, text="XRP Balance:", padding=5).grid(row=6, column=0, padx=5, pady=5, sticky="w")
        self.depositor_xrp_balance_entry = ttk.Entry(depositor_frame, width=40, state="disabled")
        self.depositor_xrp_balance_entry.grid(row=6, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        # --- Vault Section ---
        vault_frame = ttk.LabelFrame(master, text="Vault", padding=10)
        vault_frame.grid(row=7, column=0, padx=10, pady=10, sticky="ew")  

        ttk.Label(vault_frame, text="Currency (Asset):", padding=5).grid(row=7, column=0, padx=5, pady=5, sticky="w")
        self.currency_entry = ttk.Entry(vault_frame, width=30)
        self.currency_entry.grid(row=7, column=1, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_frame, text="Currency Maximum:", padding=5).grid(row=8, column=0, padx=5, pady=5, sticky="w")
        self.asset_maximum_entry = ttk.Entry(vault_frame, width=30)
        self.asset_maximum_entry.grid(row=8, column=1, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_frame, text="Transferable Shares:", padding=5).grid(row=9, column=0, padx=5, pady=5, sticky="w")
        self.enable_transferable_shares = ttk.Checkbutton(vault_frame, bootstyle="round-toggle")
        self.enable_transferable_shares.grid(row=9, column=1, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_frame, text="VaultID:", padding=5).grid(row=10, column=0, padx=5, pady=5, sticky="w")
        self.vault_id_entry = ttk.Entry(vault_frame, width=30)
        self.vault_id_entry.grid(row=10, column=1, padx=5, pady=5, sticky="ew")
        
        ttk.Label(vault_frame, text="Currency Amount:", padding=5).grid(row=11, column=0, padx=5, pady=5, sticky="w")
        self.amount_entry = ttk.Entry(vault_frame, width=30)
        self.amount_entry.grid(row=11, column=1, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_frame, text="Shares:", padding=5).grid(row=12, column=0, padx=5, pady=5, sticky="w")
        self.shares_entry = ttk.Entry(vault_frame, width=30)
        self.shares_entry.grid(row=12, column=1, padx=5, pady=5, sticky="ew")

        ttk.Button(vault_frame, text="Create Vault", command=self.create_vault, bootstyle=SUCCESS).grid(row=7, column=2, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Update Vault", command=self.update_vault, bootstyle=WARNING).grid(row=7, column=3, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Delete Vault", command=self.delete_vault, bootstyle=DANGER).grid(row=8, column=2, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Deposit", command=self.deposit, bootstyle=PRIMARY).grid(row=9, column=2, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Withdraw", command=self.withdraw, bootstyle=SECONDARY).grid(row=10, column=2, padx=5, pady=5, sticky="ew")

        # --- Results Section ---
        results_frame = ttk.LabelFrame(master, text="Results", padding=10)
        results_frame.grid(row=13, column=0, padx=5, pady=5, sticky="ew")

        self.results_text = tk.Text(results_frame, height=10, width=80)
        self.results_text.grid(row=13, column=0, padx=5, pady=5, sticky="ew")
        self.results_text.config(state="disabled")

    def update_ledger(self):
        """Updates the ledger instance."""
        selected_ledger = self.ledger_instance.get()
        ledger_network_url = set_ledger(selected_ledger)
        self.update_results(f"Connecting to {selected_ledger}: {ledger_network_url}")

    def get_vault_owner_account(self):
        seed = self.vault_owner_seed_entry.get()
        vault_owner_account = get_account(seed)
        if not seed:
            self.vault_owner_seed_entry.delete(0, tk.END)
            self.vault_owner_seed_entry.insert(0, vault_owner_account.seed)

        self.vault_owner_account_entry.config(state="normal")
        self.vault_owner_account_entry.delete(0, tk.END)
        self.vault_owner_account_entry.insert(0, vault_owner_account.classic_address)

        account_info = get_account_info(self.vault_owner_account_entry.get())
        balance = float(drops_to_xrp(account_info['Balance']))
        self.vault_owner_xrp_balance_entry.config(state="normal")
        self.vault_owner_xrp_balance_entry.delete(0, tk.END)
        self.vault_owner_xrp_balance_entry.insert(0, balance)
        self.vault_owner_xrp_balance_entry.config(state="disabled")

        self.update_results(json.dumps(account_info, indent=JSON_INDENT_VALUE))

    def get_depositor_account(self):
        seed = self.depositor_seed_entry.get()
        depositor_account = get_account(seed)
        if not seed:
            self.depositor_seed_entry.delete(0, tk.END)
            self.depositor_seed_entry.insert(0, depositor_account.seed)

        self.depositor_account_entry.config(state="normal")
        self.depositor_account_entry.delete(0, tk.END)
        self.depositor_account_entry.insert(0, depositor_account.classic_address)

        account_info = get_account_info(self.depositor_account_entry.get())
        balance = float(drops_to_xrp(account_info['Balance']))
        self.depositor_xrp_balance_entry.config(state="normal")
        self.depositor_xrp_balance_entry.delete(0, tk.END)
        self.depositor_xrp_balance_entry.insert(0, balance)
        self.depositor_xrp_balance_entry.config(state="disabled")

        self.update_results(json.dumps(account_info, indent=JSON_INDENT_VALUE))

    def create_vault(self):
        currency = self.currency_entry.get()
        vault_owner = self.vault_owner_account_entry.get()
        enable_transferable_shares = self.enable_transferable_shares.get()
        if enable_transferable_shares:
            self.update_results(f"Vault Owner: {vault_owner} is attempting to create vault with Currency: {currency} with Transferable Shares")
        else:
            self.update_results(f"Vault Owner: {vault_owner} is attempting to create vault with Currency: {currency}")

    def update_vault(self):
        vault_id = self.vault_id_entry.get()
        maximum = self.asset_maximum_entry.get()
        self.update_results(f"Attempting to update vault {vault_id} with new value for Currency Maximum: {maximum}")

    def delete_vault(self):
        vault_id = self.vault_id_entry.get()
        self.update_results(f"Attempting to delete vault {vault_id}")

    def deposit(self):
        depositor = self.depositor_account_entry.get()
        amount = self.amount_entry.get()
        vault_id = self.vault_id_entry.get()
        currency = self.currency_entry.get()
        self.update_results(f"Depositor {depositor} is attempting to deposit {amount} {currency} into vault {vault_id}")

    def withdraw(self):
        depositor = self.depositor_account_entry.get()
        shares = self.shares_entry.get()
        vault_id = self.vault_id_entry.get()
        self.update_results(f"Depositor {depositor} is attempting to withdraw {shares} shares from vault {vault_id}")

    def update_results(self, text):
        self.results_text.config(state="normal")
        self.results_text.insert(tk.END, text + "\n")
        self.results_text.see(tk.END)
        self.results_text.config(state="disabled")

root = tk.Tk()
app = SAVTestHarness(root)
root.mainloop()
