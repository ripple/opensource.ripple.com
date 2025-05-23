import tkinter as tk
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
import json

from xrpl_helpers import (
    get_account,
    get_account_info,
    get_vault_info,
    get_account_object,
    create_single_asset_vault,
    update_single_asset_vault,
    set_ledger,
    convert_drops_to_xrp
)

JSON_INDENT_VALUE = 2


class SAVTestHarness:
    def __init__(self, ui):
        self.ui = ui
        ui.title("Single Asset Vault Test Harness")

        # Apply a Bootstrap theme
        self.style = ttk.Style(theme='flatly')

        # --- Configure the ui grid to be responsive ---
        ui.grid_rowconfigure(0, weight=0) 
        ui.grid_rowconfigure(1, weight=1) 
        ui.grid_rowconfigure(2, weight=1) 
        ui.grid_rowconfigure(3, weight=1) 
        ui.grid_columnconfigure(0, weight=1)
        ui.grid_columnconfigure(1, weight=1)

        # --- Ledger Network Selection ---
        ledger_frame = ttk.LabelFrame(ui, text="Ledger", padding=10)
        ledger_frame.grid(row=0, column=0, columnspan=1, padx=10, pady=10, sticky="ew")
        ttk.Label(ledger_frame, text="Choose your ledger instance:", padding=5).grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.ledger_instance = tk.StringVar(value="Lending")
        ttk.Radiobutton(
            ledger_frame,
            # TODO: Change to Testnet once testing complete
            text="Lending",
            variable=self.ledger_instance,
            value="Lending",
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

        ledger_frame.grid_columnconfigure(0, weight=1)
        ledger_frame.grid_columnconfigure(1, weight=0)
        ledger_frame.grid_columnconfigure(2, weight=0)

        # --- Vault Owner Section ---
        vault_owner_frame = ttk.LabelFrame(ui, text="Account 1", padding=10)
        vault_owner_frame.grid(row=1, column=0, padx=10, pady=10, sticky="nsew")
        vault_owner_frame.grid_columnconfigure(1, weight=1)

        ttk.Label(vault_owner_frame, text="Seed:", padding=5).grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.vault_owner_seed_entry = ttk.Entry(vault_owner_frame, width=40) # Keep width for initial sizing
        self.vault_owner_seed_entry.grid(row=0, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        ttk.Button(vault_owner_frame, text="Get Account 1", command=self.get_account_one, bootstyle=INFO + "-outline").grid(row=0, column=3, padx=5, pady=5, sticky="w")

        ttk.Label(vault_owner_frame, text="Account:", padding=5).grid(row=1, column=0, padx=5, pady=5, sticky="w")
        self.vault_owner_account_entry = ttk.Entry(vault_owner_frame, width=40)
        self.vault_owner_account_entry.grid(row=1, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_owner_frame, text="XRP Balance:", padding=5).grid(row=2, column=0, padx=5, pady=5, sticky="w")
        self.vault_owner_xrp_balance_entry = ttk.Entry(vault_owner_frame, width=40, state="disabled")
        self.vault_owner_xrp_balance_entry.grid(row=2, column=1, columnspan=2, padx=5, pady=5, sticky="ew")


        # --- Depositor Section ---
        depositor_frame = ttk.LabelFrame(ui, text="Account 2", padding=10)
        depositor_frame.grid(row=1, column=1, padx=10, pady=10, sticky="nsew")
        depositor_frame.grid_columnconfigure(1, weight=1)

        ttk.Label(depositor_frame, text="Seed:", padding=5).grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.depositor_seed_entry = ttk.Entry(depositor_frame, width=40)
        self.depositor_seed_entry.grid(row=0, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        ttk.Button(depositor_frame, text="Get Account 2", command=self.get_account_two, bootstyle=INFO + "-outline").grid(row=0, column=3, padx=5, pady=5, sticky="w")

        ttk.Label(depositor_frame, text="Account:", padding=5).grid(row=1, column=0, padx=5, pady=5, sticky="w")
        self.depositor_account_entry = ttk.Entry(depositor_frame, width=40)
        self.depositor_account_entry.grid(row=1, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        ttk.Label(depositor_frame, text="XRP Balance:", padding=5).grid(row=2, column=0, padx=5, pady=5, sticky="w")
        self.depositor_xrp_balance_entry = ttk.Entry(depositor_frame, width=40, state="disabled")
        self.depositor_xrp_balance_entry.grid(row=2, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        # --- Vault Section ---
        vault_frame = ttk.LabelFrame(ui, text="Vault", padding=10)
        vault_frame.grid(row=2, column=0, padx=10, pady=10, sticky="nsew")

        ttk.Label(vault_frame, text="Account:", padding=5).grid(row=0, column=0, padx=5, pady=5, sticky="w")
        self.selected_account_address_var = tk.StringVar(value="Account 1")
        ttk.Radiobutton(
            vault_frame,
            text="Account 1",
            variable=self.selected_account_address_var,
            value="Account 1",
            bootstyle=PRIMARY
        ).grid(row=0, column=1, padx=5, pady=5, sticky="w")
        ttk.Radiobutton(
            vault_frame,
            text="Account 2",
            variable=self.selected_account_address_var,
            value="Account 2",
            bootstyle=PRIMARY
        ).grid(row=0, column=2, padx=5, pady=5, sticky="w")

        ttk.Label(vault_frame, text="Currency (Asset):", padding=5).grid(row=1, column=0, padx=5, pady=5, sticky="w")
        self.currency_entry = ttk.Entry(vault_frame, width=30, state="disabled")
        self.currency_entry.grid(row=1, column=1, padx=5, pady=5, sticky="ew")
        self.currency_entry.config(state="normal")
        self.currency_entry.insert(tk.END, "XRP")
        self.currency_entry.config(state="disabled")

        ttk.Label(vault_frame, text="Currency Maximum:", padding=5).grid(row=2, column=0, padx=5, pady=5, sticky="w")
        self.asset_maximum_entry = ttk.Entry(vault_frame, width=30)
        self.asset_maximum_entry.grid(row=2, column=1, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_frame, text="Transferable Shares:", padding=5).grid(row=3, column=0, padx=5, pady=5, sticky="w")
        self.enable_transferable_shares_var = tk.BooleanVar(value=True) 
        self.enable_transferable_shares = ttk.Checkbutton(vault_frame, variable=self.enable_transferable_shares_var, bootstyle="round-toggle")
        self.enable_transferable_shares.grid(row=3, column=1, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_frame, text="VaultID:", padding=5).grid(row=4, column=0, padx=5, pady=5, sticky="w")
        self.vault_id_entry = ttk.Entry(vault_frame, width=30)
        self.vault_id_entry.grid(row=4, column=1, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_frame, text="Amount:", padding=5).grid(row=5, column=0, padx=5, pady=5, sticky="w")
        self.amount_entry = ttk.Entry(vault_frame, width=30)
        self.amount_entry.grid(row=5, column=1, padx=5, pady=5, sticky="ew")

        ttk.Label(vault_frame, text="Destination:", padding=5).grid(row=6, column=0, padx=5, pady=5, sticky="w")
        self.destination_entry = ttk.Entry(vault_frame, width=30)
        self.destination_entry.grid(row=6, column=1, padx=5, pady=5, sticky="ew")

        ttk.Button(vault_frame, text="Create Vault", command=self.create_vault, bootstyle=INFO).grid(row=1, column=2, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Update Vault", command=self.update_vault, bootstyle=INFO).grid(row=2, column=2, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Delete Vault", command=self.delete_vault, bootstyle=INFO).grid(row=3, column=2, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Get Vault Info", command=self.get_vault_info, bootstyle=INFO).grid(row=4, column=2, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Deposit", command=self.deposit, bootstyle=INFO).grid(row=5, column=2, padx=5, pady=5, sticky="ew")
        ttk.Button(vault_frame, text="Withdraw", command=self.withdraw, bootstyle=INFO).grid(row=6, column=2, padx=5, pady=5, sticky="ew")
        vault_frame.grid_columnconfigure(3, weight=1)
        vault_frame.grid_columnconfigure(4, weight=1)

        # --- Results Section ---
        results_frame = ttk.LabelFrame(ui, text="Results", padding=5)
        results_frame.grid(row=2, column=1, padx=5, pady=5, sticky="nsew")

        self.results_scrollbar = ttk.Scrollbar(results_frame, orient=VERTICAL)
        self.results_scrollbar.grid(row=0, column=1, sticky="ns")
        self.results_text = tk.Text(results_frame, height=10, width=80, yscrollcommand=self.results_scrollbar.set)
        self.results_text.grid(row=0, column=0, padx=5, pady=5, sticky="nsew")
        self.results_text.config(state="disabled")
        self.results_scrollbar.config(command=self.results_text.yview)
        results_frame.grid_rowconfigure(0, weight=1)
        results_frame.grid_columnconfigure(0, weight=1)

    def update_ledger(self):
        """Updates the ledger instance."""
        selected_ledger = self.ledger_instance.get()
        ledger_network_url = set_ledger(selected_ledger)
        self.update_results(f"=== Connected to: {ledger_network_url} ===")

    def get_account_one(self):
        seed = self.vault_owner_seed_entry.get()
        vault_owner_account = get_account(seed)

        if not seed:
            self.vault_owner_seed_entry.delete(0, tk.END)
            self.vault_owner_seed_entry.insert(0, vault_owner_account.seed)

        self.vault_owner_account_entry.config(state="normal")
        self.vault_owner_account_entry.delete(0, tk.END)
        self.vault_owner_account_entry.insert(0, vault_owner_account.classic_address)

        self.update_results("\n=== Account 1 Info ===")
        account_info = get_account_info(self.vault_owner_account_entry.get())
        self.vault_owner_xrp_balance_entry.config(state="normal")
        self.vault_owner_xrp_balance_entry.delete(0, tk.END)
        self.vault_owner_xrp_balance_entry.insert(0, float(convert_drops_to_xrp(account_info['Balance'])))
        self.vault_owner_xrp_balance_entry.config(state="disabled")

        self.update_results(json.dumps(account_info, indent=JSON_INDENT_VALUE))

    def get_account_two(self):
        seed = self.depositor_seed_entry.get()
        depositor_account = get_account(seed)

        if not seed:
            self.depositor_seed_entry.delete(0, tk.END)
            self.depositor_seed_entry.insert(0, depositor_account.seed)

        self.depositor_account_entry.config(state="normal")
        self.depositor_account_entry.delete(0, tk.END)
        self.depositor_account_entry.insert(0, depositor_account.classic_address)

        self.update_results("\n=== Account 2 Info ===")
        account_info = get_account_info(self.depositor_account_entry.get())
        self.depositor_xrp_balance_entry.config(state="normal")
        self.depositor_xrp_balance_entry.delete(0, tk.END)
        self.depositor_xrp_balance_entry.insert(0, float(convert_drops_to_xrp(account_info['Balance'])))
        self.depositor_xrp_balance_entry.config(state="disabled")

        self.update_results(json.dumps(account_info, indent=JSON_INDENT_VALUE))

    def create_vault(self):
        self.update_results(f"\n=== Preparing and Sending VaultCreate Transaction ===")
        
        account_seed = ""
        account_address = ""
        if self.selected_account_address_var.get() == "Account 1":
            account_seed = self.vault_owner_seed_entry.get()
            account_address = self.vault_owner_account_entry.get()
        else:
            account_seed = self.depositor_account_entry.get()
            account_address = self.depositor_account_entry.get()

        # Create single asset vault
        tx, result = create_single_asset_vault(
            account_seed,
            self.asset_maximum_entry.get(),
            self.enable_transferable_shares_var.get()
        )
        self.update_results(json.dumps(tx, indent=JSON_INDENT_VALUE))
        self.update_results(f"\n=== Create Vault Result ===\n{json.dumps(result, indent=JSON_INDENT_VALUE)}")

        vault = get_account_object(account_address, "VAULT")
        if (vault["account_objects"]):
            self.update_results(f"\n=== Create Vault Result ===\n{json.dumps(vault, indent=JSON_INDENT_VALUE)}")
            vault_id=vault["account_objects"][0]["index"]
            self.vault_id_entry.insert(tk.END, vault_id + "\n")
            self.vault_id_entry.see(tk.END)
        

    def update_vault(self):
        self.update_results(f"\n=== Preparing and Sending VaultSet Transaction ===")
        result = update_single_asset_vault(
            self.vault_owner_seed_entry.get(),
            self.asset_maximum_entry.get(),
            self.enable_transferable_shares_var.get()
        )
        vault_id = self.vault_id_entry.get()
        maximum = self.asset_maximum_entry.get()
        self.update_results(f"Attempting to update vault {vault_id} with new value for Currency Maximum: {maximum}")

    def delete_vault(self):
        vault_id = self.vault_id_entry.get()
        self.update_results(f"Attempting to delete vault {vault_id}")

    def get_vault_info(self):
        self.update_results("\n=== Vault Info ===")
        vault_info = get_vault_info(self.vault_id_entry.get())

        self.update_results(json.dumps(vault_info, indent=JSON_INDENT_VALUE))
 
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

# Display the default ledger network the app is connected to
connected_network = set_ledger(app.ledger_instance.get())
app.update_results(f"=== Connected to: {connected_network} ===")

root.mainloop()
