import xrpl from "xrpl"

// Connect to the network ----------------------
// This is a lending protocol-specific devnet. This network may be taken
// offline once the lending protocol is live on mainnet.
const client = new xrpl.Client("wss://lend.devnet.rippletest.net:51233")
await client.connect()

// Use the Lending Devnet faucet
const faucetHost = "lend-faucet.devnet.rippletest.net"
const faucetPath = "/accounts"

// Create and fund vault owner account
const { wallet: vaultOwner } = await client.fundWallet(null, { faucetHost, faucetPath })

// A pre-existing Vault asset, created for this tutorial. You can specify your own Vault asset.
const mptIssuanceId = "0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4"

// A pre-existing Permissioned Domain ID, created for this tutorial. You can specify your own Domain ID.
// NOTE: You don't need this if you want to create a public vault.
const domainId = "3BB81D0D164456A2D74720F63FD923F16DE08FB3223D3ED103D09F525A8D69D1"

console.log(`Vault owner address: ${vaultOwner.address}`)
console.log(`MPT issuance ID: ${mptIssuanceId}`)
console.log(`Permissioned domain ID: ${domainId}\n`)

// Prepare VaultCreate transaction ----------------------
console.log(`\n=== VaultCreate transaction ===`)
const vaultCreateTx = {
  TransactionType: "VaultCreate",
  Account: vaultOwner.address,
  Asset: { mpt_issuance_id: mptIssuanceId },
  Flags: xrpl.VaultCreateFlags.tfVaultPrivate, // Omit tfVaultPrivate flag for public vaults
  // To make vault shares non-transferable add the tfVaultShareNonTransferable flag:
  // Flags: xrpl.VaultCreateFlags.tfVaultPrivate | xrpl.VaultCreateFlags.tfVaultShareNonTransferable
  DomainID: domainId, // Omit for public vaults
  Data: xrpl.convertStringToHex("Private vault"),
  // Encode JSON metadata as hex string per XLS-89 MPT Metadata Schema.
  // See: https://xls.xrpl.org/xls/XLS-0089-multi-purpose-token-metadata-schema.html
  MPTokenMetadata: xrpl.encodeMPTokenMetadata({
    ticker: "SHARE1",
    name: "Vault shares",
    desc: "Proportional ownership shares of the vault.",
    icon: "example.com/asset-icon.png",
    asset_class: "defi",
    issuer_name: "Asset Issuer Name",
    uris: [
      {
        uri: "example.com/asset",
        category: "website",
        title: "Asset Website",
      },
      {
        uri: "example.com/docs",
        category: "docs",
        title: "Docs",
      },
    ],
    additional_info: {
      example_info: "test",
    },
  }),
  AssetsMaximum: "0", // No cap
  WithdrawalPolicy: xrpl.VaultWithdrawalPolicy.vaultStrategyFirstComeFirstServe,
};

// Validate the transaction structure before submitting
xrpl.validate(vaultCreateTx)
console.log(JSON.stringify(vaultCreateTx, null, 2))

// Submit, sign, and wait for validation ----------------------
console.log("\n=== Submitting VaultCreate transaction... ===")
const submit_response = await client.submitAndWait(vaultCreateTx, {
  wallet: vaultOwner,
  autofill: true,
})
if (submit_response.result.meta.TransactionResult !== "tesSUCCESS") {
  const result_code = submit_response.result.meta.TransactionResult;
  console.error("Error: Unable to create vault:", result_code)
  await client.disconnect()
  process.exit(1)
}
console.log("Vault created successfully!")

// Extract vault information from the transaction result
const affectedNodes = submit_response.result.meta.AffectedNodes || []
const vaultNode = affectedNodes.find(
  (node) => node.CreatedNode?.LedgerEntryType === "Vault"
)
if (vaultNode) {
  console.log(`\nVault ID: ${vaultNode.CreatedNode.LedgerIndex}`)
  console.log(`Vault pseudo-account address: ${vaultNode.CreatedNode.NewFields.Account}`)
  console.log(`Share MPT issuance ID: ${vaultNode.CreatedNode.NewFields.ShareMPTID}`)
}

// Call vault_info method to retrieve the vault's information
console.log("\n=== Getting vault_info... ===")
const vaultID = vaultNode.CreatedNode.LedgerIndex
const vault_info_response = await client.request({
  command: "vault_info",
  vault_id: vaultID,
  ledger_index: "validated"
})
console.log(JSON.stringify(vault_info_response, null, 2))

await client.disconnect()
