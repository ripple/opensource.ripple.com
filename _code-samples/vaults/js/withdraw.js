import xrpl from "xrpl"

// Connect to the network ----------------------
const client = new xrpl.Client("wss://lend.devnet.rippletest.net:51233")
await client.connect()

// Get depositor account
const depositor = xrpl.Wallet.fromSeed("sEdVSq9Zsv8vQwfivTk37bWxrvpnruf")

// The ID of the vault to withraw from
const vaultID = "6AC4EC2D775C6275D314996D6ECDD16DCB9382A29FDB769951C42192FCED76EF"
// The ID of the vault's asset (MPT Issuance)
const assetMPTIssuanceId = "0003E3B486D3DACD8BB468AB33793B9626BD894A92AB3AB4"
// The ID of the vault's share (MPT Issuance)
const shareMPTIssuanceId = "0000000152E7CD364F869E832EDB806C4A7AD8B3D0C151C5"

console.log(`Depositor address: ${depositor.address}`)
console.log(`Vault ID: ${vaultID}`)
console.log(`Asset MPT issuance ID: ${assetMPTIssuanceId}`)
console.log(`Vault share MPT issuance ID: ${shareMPTIssuanceId}`)

const withdrawAmount = "10"

// Get initial vault state ----------------------
console.log("\n=== Getting initial vault state... ===")
const initialVaultInfo = await client.request({
  command: "vault_info",
  vault_id: vaultID,
  ledger_index: "validated"
})

console.log(`Initial vault state:`)
console.log(`  Assets Total: ${initialVaultInfo.result.vault.AssetsTotal}`)
console.log(`  Assets Available: ${initialVaultInfo.result.vault.AssetsAvailable}`)

// Check depositor's share balance ----------------------
console.log("\n=== Checking depositor's share balance... ===")
try {
  const shareBalanceResult = await client.request({
    command: "ledger_entry",
    mptoken: {
      mpt_issuance_id: shareMPTIssuanceId,
      account: depositor.address
    },
    ledger_index: "validated"
  })

  const shareBalance = shareBalanceResult.result.node.MPTAmount
  console.log(`Shares held: ${shareBalance}`)
} catch (error) {
  if (error.data?.error === 'entryNotFound') {
    console.error(`Error: The depositor doesn't hold any vault shares with ID: ${shareMPTIssuanceId}.`)
  }
  await client.disconnect()
  process.exit(1)
}

// Prepare VaultWithdraw transaction ----------------------
console.log(`\n=== Preparing VaultWithdraw transaction ===`)
const vaultWithdrawTx = {
  TransactionType: "VaultWithdraw",
  Account: depositor.address,
  VaultID: vaultID,
  Amount: {
    mpt_issuance_id: assetMPTIssuanceId,
    value: withdrawAmount
  },
  // Optional: Add Destination field to send assets to a different account
  // Destination: "rGg4tHPRGJfewwJkd8immCFx9uSo2GgcoY"
}
xrpl.validate(vaultWithdrawTx)
console.log(JSON.stringify(vaultWithdrawTx, null, 2))

// Submit VaultWithdraw transaction ----------------------
console.log("\n=== Submitting VaultWithdraw transaction... ===")
const withdrawResult = await client.submitAndWait(vaultWithdrawTx, {
  wallet: depositor,
  autofill: true,
})
if (withdrawResult.result.meta.TransactionResult !== "tesSUCCESS") {
  const result_code = withdrawResult.result.meta.TransactionResult
  console.error("Error: Unable to withdraw from vault:", result_code)
  await client.disconnect()
  process.exit(1)
}
console.log("Withdrawal successful!")

// Extract vault state from transaction metadata ----------------------
console.log("\n=== Vault state after withdrawal ===")
const affectedNodes = withdrawResult.result.meta.AffectedNodes
const vaultNode = affectedNodes.find(
  (node) => {
    const modifiedNode = node.ModifiedNode || node.DeletedNode
    return (
      modifiedNode &&
      modifiedNode.LedgerEntryType === "Vault" &&
      modifiedNode.LedgerIndex === vaultID
    )
  }
)
if (vaultNode) {
  if (vaultNode.DeletedNode) {
    console.log(`  Vault empty (all assets withdrawn)`)
  } else {
    const vaultFields = vaultNode.ModifiedNode.FinalFields
    console.log(`  Assets Total: ${vaultFields.AssetsTotal}`)
    console.log(`  Assets Available: ${vaultFields.AssetsAvailable}`)
  }
}

// Get the depositor's share balance ----------------------
console.log("\n=== Depositor's share balance ==")
const depositorShareNode = affectedNodes.find((node) => {
  const modifiedNode = node.ModifiedNode || node.DeletedNode
  return (
    modifiedNode &&
    modifiedNode.LedgerEntryType === "MPToken" &&
    modifiedNode.FinalFields?.Account === depositor.address &&
    modifiedNode.FinalFields?.MPTokenIssuanceID === shareMPTIssuanceId
  )
})
if (depositorShareNode) {
  if (depositorShareNode.DeletedNode) {
    console.log(`No more shares held (withdrew all shares)`)
  } else {
    const shareFields = depositorShareNode.ModifiedNode.FinalFields
    console.log(`Shares held: ${shareFields.MPTAmount}`)
  }
}

// Get the depositor's asset balance ----------------------
console.log("\n=== Depositor's asset balance ==")
const depositorAssetNode = affectedNodes.find((node) => {
  const assetNode = node.ModifiedNode || node.CreatedNode
  const fields = assetNode?.FinalFields || assetNode?.NewFields
  return (
    assetNode &&
    assetNode.LedgerEntryType === "MPToken" &&
    fields?.Account === depositor.address &&
    fields?.MPTokenIssuanceID === assetMPTIssuanceId
  )
})
if (depositorAssetNode) {
  const assetNode = depositorAssetNode.ModifiedNode || depositorAssetNode.CreatedNode
  const assetFields = assetNode.FinalFields || assetNode.NewFields
  console.log(`Balance: ${assetFields.MPTAmount}`)
}

await client.disconnect()

