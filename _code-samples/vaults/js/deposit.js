// IMPORTANT: This example deposits into an existing PRIVATE vault.
// The depositor account used has valid credentials in the vault's Permissioned Domain.
// Without valid credentials, the VaultDeposit transaction will fail.
// If you want to deposit into a public vault, you can replace the vaultID and shareMPTIssuanceId 
// values with your own.

import xrpl from "xrpl"

// Connect to the network ----------------------
const client = new xrpl.Client("wss://lend.devnet.rippletest.net:51233")
await client.connect()

const depositor = xrpl.Wallet.fromSeed("sEdVSq9Zsv8vQwfivTk37bWxrvpnruf")

// The ID of the vault to deposit into
const vaultID = "6AC4EC2D775C6275D314996D6ECDD16DCB9382A29FDB769951C42192FCED76EF" 
// The ID of the vault's asset (MPT Issuance)
const assetMPTIssuanceId = "0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4"
// The ID of the vault's share (MPT Issuance)
const shareMPTIssuanceId = "0000000152E7CD364F869E832EDB806C4A7AD8B3D0C151C5"

console.log(`Depositor address: ${depositor.address}`)
console.log(`Vault ID: ${vaultID}`)
console.log(`Asset MPT issuance ID: ${assetMPTIssuanceId}`)
console.log(`Vault share MPT issuance ID: ${shareMPTIssuanceId}`)

const depositAmount = 10

// Get initial vault state ----------------------
console.log("\n=== Getting initial vault state... ===")
const initialVaultInfo = await client.request({
  command: "vault_info",
  vault_id: vaultID,
  ledger_index: "validated"
})

console.log(` - Total vault value: ${initialVaultInfo.result.vault.AssetsTotal}`)
console.log(` - Available assets: ${initialVaultInfo.result.vault.AssetsAvailable}`)

// Check depositor's asset balance ----------------------
console.log("\n=== Checking depositor's balance... ===")
try {
  // Use ledger_entry to get specific MPT issuance balance
  const ledgerEntryResult = await client.request({
    command: "ledger_entry",
    mptoken: {
      mpt_issuance_id: assetMPTIssuanceId,
      account: depositor.address
    },
    ledger_index: "validated"
  })

  const balance = ledgerEntryResult.result.node?.MPTAmount
  console.log(`Balance: ${balance}`)

  // Check if balance is sufficient
  if (balance < depositAmount) {
    console.error(`Error: Insufficient balance! Have ${balance}, need ${depositAmount}`)
    await client.disconnect()
    process.exit(1)
  }
} catch (error) {
  if (error.data?.error === 'entryNotFound') {
    console.log(`Error: The depositor doesn't hold any assets with ID: ${assetMPTIssuanceId}`)
  }
  await client.disconnect()
  process.exit(1)
}

// Prepare VaultDeposit transaction ----------------------
console.log(`\n=== VaultDeposit transaction ===`)
const vaultDepositTx = {
  TransactionType: "VaultDeposit",
  Account: depositor.address,
  VaultID: vaultID,
  Amount: {
    mpt_issuance_id: assetMPTIssuanceId,
    value: depositAmount.toString()
  }
}
xrpl.validate(vaultDepositTx)
console.log(JSON.stringify(vaultDepositTx, null, 2))

// Submit VaultDeposit transaction ----------------------
console.log("\n=== Submitting VaultDeposit transaction... ===")
const depositResult = await client.submitAndWait(vaultDepositTx, {
  wallet: depositor,
  autofill: true,
})
if (depositResult.result.meta.TransactionResult !== "tesSUCCESS") {
  const result_code = depositResult.result.meta.TransactionResult
  console.error("Error: Unable to deposit:", result_code)
  await client.disconnect()
  process.exit(1)
}
console.log("Deposit successful!")

// Extract vault state from transaction metadata ----------------------
console.log("\n=== Vault state after deposit ===")
const affectedNodes = depositResult.result.meta.AffectedNodes
const vaultNode = affectedNodes.find(
  (node) => {
    return (
      node.ModifiedNode &&
      node.ModifiedNode.LedgerEntryType === "Vault" &&
      node.ModifiedNode.LedgerIndex === vaultID
    )
  }
)
if (vaultNode) {
  const vaultFields = vaultNode.ModifiedNode.FinalFields
  console.log(` - Total vault value: ${vaultFields.AssetsTotal}`)
  console.log(` - Available assets: ${vaultFields.AssetsAvailable}`)
}

// Get the depositor's share balance ----------------------
console.log("\n=== Depositor's share balance ==")
const depositorShareNode = affectedNodes.find((node) => {
  const shareNode = node.ModifiedNode || node.CreatedNode
  const fields = shareNode?.FinalFields || shareNode?.NewFields
  return (
    shareNode &&
    shareNode.LedgerEntryType === "MPToken" &&
    fields?.Account === depositor.address &&
    fields?.MPTokenIssuanceID === shareMPTIssuanceId
  )
})
if (depositorShareNode) {
  const shareNode = depositorShareNode.ModifiedNode || depositorShareNode.CreatedNode
  const shareFields = shareNode.FinalFields || shareNode.NewFields
  console.log(`Shares held: ${shareFields.MPTAmount}`)
}

await client.disconnect()

