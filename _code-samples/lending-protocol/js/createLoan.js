// IMPORTANT: This example creates a loan using a preconfigured
// loan broker, borrower, and private vault.

import fs from 'fs'
import { execSync } from 'child_process'
import xrpl from 'xrpl'
import { deriveKeypair, sign } from 'ripple-keypairs'
import { encodeForSigning } from 'ripple-binary-codec'

// Connect to the network ----------------------
// This is a lending protocol-specific devnet. This network may be taken
// offline once the lending protocol is live on mainnet.
const client = new xrpl.Client('wss://lend.devnet.rippletest.net:51233')
await client.connect()

// This step checks for the necessary setup data to run the lending protocol tutorials.
// If missing, lendingSetup.js will generate the data.
if (!fs.existsSync('lendingSetup.json')) {
  console.log(`\n=== Lending tutorial data doesn't exist. Running setup script... ===\n`)
  execSync('node lendingSetup.js', { stdio: 'inherit' })
}

// Load preconfigured accounts and LoanBrokerID.
const setupData = JSON.parse(fs.readFileSync('lendingSetup.json', 'utf8'))

// You can replace these values with your own
const loanBroker = xrpl.Wallet.fromSeed(setupData.loanBroker.seed)
const borrower = xrpl.Wallet.fromSeed(setupData.borrower.seed)
const loanBrokerID = setupData.loanBrokerID

console.log(`\nLoan broker address: ${loanBroker.address}`)
console.log(`Borrower address: ${borrower.address}`)
console.log(`LoanBrokerID: ${loanBrokerID}`)

// Prepare LoanSet transaction ----------------------
// Account and Counterparty accounts can be swapped, but determines signing order.
// Account signs first, Counterparty signs second.
console.log(`\n=== Preparing LoanSet transaction ===\n`)
const loanSetTx = await client.autofill({
  TransactionType: 'LoanSet',
  Account: loanBroker.address,
  Counterparty: borrower.address,
  LoanBrokerID: loanBrokerID,
  PrincipalRequested: "10000000",
  InterestRate: 500,
  PaymentTotal: 12,
  PaymentInterval: 2592000,
  GracePeriod: 604800,
  LoanOriginationFee: "100000",
  LoanServiceFee: "10000",
})

console.log(JSON.stringify(loanSetTx, null, 2))

// Loan broker signs first
console.log(`\n=== Adding loan broker signature ===\n`)
const loanBrokerSignature = loanBroker.sign(loanSetTx)
const decodedLoanBrokerSignature = xrpl.decode(loanBrokerSignature.tx_blob)

console.log(`TxnSignature: ${decodedLoanBrokerSignature.TxnSignature}`)
console.log(`SigningPubKey: ${decodedLoanBrokerSignature.SigningPubKey}\n`)
console.log(`Signed loanSetTx for borrower to sign over:\n${JSON.stringify(decodedLoanBrokerSignature, null, 2)}`)

// Borrower signs second
console.log(`\n=== Adding borrower signature ===\n`)

// Wallet.sign() doesn't support signing over signed LoanSet transactions yet.
// Manually sign using 'ripple-keypairs' and 'ripple-binary-codec'.
const keypair = deriveKeypair(borrower.seed)
const encodedTx = encodeForSigning(decodedLoanBrokerSignature)
const borrowerSignature = sign(encodedTx, keypair.privateKey)
console.log(`Borrower TxnSignature: ${borrowerSignature}`)
console.log(`Borrower SigningPubKey: ${keypair.publicKey}`)

const counterpartySignature = {
  SigningPubKey: keypair.publicKey,
  TxnSignature: borrowerSignature
}

// Form a fully signed LoanSet transaction.
let signedLoanSetTx = decodedLoanBrokerSignature
signedLoanSetTx.CounterpartySignature = counterpartySignature

// Validate the transaction structure before submitting.
xrpl.validate(signedLoanSetTx)
console.log(`\nFully signed LoanSet transaction:\n${JSON.stringify(signedLoanSetTx, null, 2)}`)

// Submit and wait for validation ----------------------
console.log(`\n=== Submitting signed LoanSet transaction ===\n`)
const submitResponse = await client.submitAndWait(signedLoanSetTx)
if (submitResponse.result.meta.TransactionResult !== 'tesSUCCESS') {
  const resultCode = submitResponse.result.meta.TransactionResult
  console.error('Error: Unable to create loan broker:', resultCode)
  await client.disconnect()
  process.exit(1)
}
console.log('Loan created successfully!')

// Extract loan information from the transaction result.
console.log(`\n=== Loan Information ===\n`)
const loanNode = submitResponse.result.meta.AffectedNodes.find(node => 
  node.CreatedNode?.LedgerEntryType === 'Loan'
)
console.log(JSON.stringify(loanNode.CreatedNode.NewFields, null, 2))

await client.disconnect()
