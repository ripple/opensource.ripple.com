import xrpl from 'xrpl'
import fs from 'fs'

// Setup script for lending protocol tutorials

process.stdout.write('Setting up tutorial: 0/6\r')

const client = new xrpl.Client('wss://s.devnet.rippletest.net:51233')
await client.connect()

// Create and fund wallets
const [
  { wallet: loanBroker },
  { wallet: borrower },
  { wallet: depositor },
  { wallet: credentialIssuer }
] = await Promise.all([
  client.fundWallet(),
  client.fundWallet(),
  client.fundWallet(),
  client.fundWallet()
])

process.stdout.write('Setting up tutorial: 1/6\r')

// Create tickets for later use
// Set up credentials and domain
const credentialType = xrpl.convertStringToHex('KYC-Verified')
const [ticketCreateResponse] = await Promise.all([
  client.submitAndWait({
    TransactionType: 'TicketCreate',
    Account: loanBroker.address,
    TicketCount: 2
  }, { wallet: loanBroker, autofill: true }),
  client.submitAndWait({
  TransactionType: 'Batch',
  Account: credentialIssuer.address,
  Flags: xrpl.BatchFlags.tfAllOrNothing,
  RawTransactions: [
    {
      RawTransaction: {
        TransactionType: 'CredentialCreate',
        Account: credentialIssuer.address,
        Subject: loanBroker.address,
        CredentialType: credentialType,
        Flags: xrpl.GlobalFlags.tfInnerBatchTxn
      }
    },
    {
      RawTransaction: {
        TransactionType: 'CredentialCreate',
        Account: credentialIssuer.address,
        Subject: borrower.address,
        CredentialType: credentialType,
        Flags: xrpl.GlobalFlags.tfInnerBatchTxn
      }
    },
    {
      RawTransaction: {
        TransactionType: 'CredentialCreate',
        Account: credentialIssuer.address,
        Subject: depositor.address,
        CredentialType: credentialType,
        Flags: xrpl.GlobalFlags.tfInnerBatchTxn
      }
    },
    {
      RawTransaction: {
        TransactionType: 'PermissionedDomainSet',
        Account: credentialIssuer.address,
        AcceptedCredentials: [
          {
            Credential: {
              Issuer: credentialIssuer.address,
              CredentialType: credentialType
            }
          }
        ],
        Flags: xrpl.GlobalFlags.tfInnerBatchTxn
      }
    }
  ]
}, { wallet: credentialIssuer, autofill: true })
])

// Extract ticket sequence numbers
const tickets = ticketCreateResponse.result.meta.AffectedNodes
  .filter(node => node.CreatedNode?.LedgerEntryType === 'Ticket')
  .map(node => node.CreatedNode.NewFields.TicketSequence)

const credentialIssuerObjects = await client.request({
  command: 'account_objects',
  account: credentialIssuer.address,
  ledger_index: 'validated'
})
const domainID = credentialIssuerObjects.result.account_objects.find(node =>
  node.LedgerEntryType === 'PermissionedDomain'
).index

process.stdout.write('Setting up tutorial: 2/6\r')

// Accept credentials
await Promise.all(
  [loanBroker, borrower, depositor].map(wallet =>
    client.submitAndWait({
      TransactionType: 'CredentialAccept',
      Account: wallet.address,
      Issuer: credentialIssuer.address,
      CredentialType: credentialType
    }, { wallet, autofill: true })
  )
)

process.stdout.write('Setting up tutorial: 3/6\r')

// Create private vault
const vaultCreateResponse = await client.submitAndWait({
  TransactionType: 'VaultCreate',
  Account: loanBroker.address,
  Asset: {
    currency: 'XRP'
  },
  Flags: xrpl.VaultCreateFlags.tfVaultPrivate,
  DomainID: domainID
}, { wallet: loanBroker, autofill: true })

const vaultID = vaultCreateResponse.result.meta.AffectedNodes.find(node => 
  node.CreatedNode?.LedgerEntryType === 'Vault'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 4/6\r')

// Create loan broker and deposit XRP into vault
const [loanBrokerSetResponse] = await Promise.all([
  client.submitAndWait({
    TransactionType: 'LoanBrokerSet',
    Account: loanBroker.address,
    VaultID: vaultID
  }, { wallet: loanBroker, autofill: true }),
  client.submitAndWait({
    TransactionType: 'VaultDeposit',
    Account: depositor.address,
    VaultID: vaultID,
    Amount: '50000000'
  }, { wallet: depositor, autofill: true })
])

const loanBrokerID = loanBrokerSetResponse.result.meta.AffectedNodes.find(node => 
  node.CreatedNode?.LedgerEntryType === 'LoanBroker'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 5/6\r')

// Create 2 identical loans with complete repayment due in 30 days

// Suppress unnecessary console warning from autofilling LoanSet.
console.warn = () => {}

// Helper function to create and sign a LoanSet transaction
async function createSignedLoanSetTx(ticketSequence) {
  const loanSetTx = await client.autofill({
    TransactionType: 'LoanSet',
    Account: loanBroker.address,
    Counterparty: borrower.address,
    LoanBrokerID: loanBrokerID,
    PrincipalRequested: "10000000",
    InterestRate: 500,
    PaymentTotal: 1,
    PaymentInterval: 2592000,
    LoanOriginationFee: "100000",
    LoanServiceFee: "10000",
    Sequence: 0,
    TicketSequence: ticketSequence
  })

  const loanBrokerSignature = await client.request({
    command: 'sign',
    tx_json: loanSetTx,
    secret: loanBroker.seed
  })

  const borrowerSignature = await client.request({
    command: 'sign',
    tx_json: loanBrokerSignature.result.tx_json,
    secret: borrower.seed,
    signature_target: "CounterpartySignature"
  })
  
  return borrowerSignature.result.tx_json
}

// Create and submit both loans
const [signedLoan1, signedLoan2] = await Promise.all([
  createSignedLoanSetTx(tickets[0]),
  createSignedLoanSetTx(tickets[1])
])

const [submitLoan1, submitLoan2] = await Promise.all([
  client.submit(signedLoan1),
  client.submit(signedLoan2)
])
const hash1 = submitLoan1.result.tx_json.hash
const hash2 = submitLoan2.result.tx_json.hash

// Helper function to check tx hash is validated
async function validateTx(hash, maxRetries = 20) {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    try {
      const tx = await client.request({ command: 'tx', transaction: hash })
      if (tx.result.validated) {
        return tx
      }
    } catch (error) {
      // Transaction not validated yet, check again
    }
  }
  console.error(`Error: Transaction ${hash} not validated after ${maxRetries} attempts.`)
  await client.disconnect()
  process.exit(1)
}

const [submitResponse1, submitResponse2] = await Promise.all([
  validateTx(hash1),
  validateTx(hash2)
])

const loanID1 = submitResponse1.result.meta.AffectedNodes.find(node => 
  node.CreatedNode?.LedgerEntryType === 'Loan'
).CreatedNode.LedgerIndex

const loanID2 = submitResponse2.result.meta.AffectedNodes.find(node => 
  node.CreatedNode?.LedgerEntryType === 'Loan'
).CreatedNode.LedgerIndex

process.stdout.write('Setting up tutorial: 6/6\r')

// Write setup data to JSON file
const setupData = {
  description: 'This file is auto-generated by lendingSetup.js. It stores XRPL account info for use in lending protocol tutorials.',
  loanBroker: {
    address: loanBroker.address,
    seed: loanBroker.seed
  },
  borrower: {
    address: borrower.address,
    seed: borrower.seed
  },
  depositor: {
    address: depositor.address,
    seed: depositor.seed
  },
  credentialIssuer: {
    address: credentialIssuer.address,
    seed: credentialIssuer.seed
  },
  domainID,
  vaultID,
  loanBrokerID,
  loanID1,
  loanID2
}

fs.writeFileSync('lendingSetup.json', JSON.stringify(setupData, null, 2))

process.stdout.write('Setting up tutorial: Complete!\n')

await client.disconnect()
