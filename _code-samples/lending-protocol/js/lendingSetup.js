import xrpl from 'xrpl'
import fs from 'fs'
import { deriveKeypair, sign } from 'ripple-keypairs'
import { encodeForSigning } from 'ripple-binary-codec'

// Setup script for lending protocol tutorials

process.stdout.write('Setting up tutorial: 0/6\r')

const client = new xrpl.Client('wss://lend.devnet.rippletest.net:51233')
await client.connect()

// Lending Devnet info
const faucetHost = 'lend-faucet.devnet.rippletest.net'
const faucetPath = '/accounts'

// Create and fund wallets
const [
  { wallet: loanBroker },
  { wallet: borrower },
  { wallet: depositor },
  { wallet: credentialIssuer }
] = await Promise.all([
  client.fundWallet(null, { faucetHost, faucetPath }),
  client.fundWallet(null, { faucetHost, faucetPath }),
  client.fundWallet(null, { faucetHost, faucetPath }),
  client.fundWallet(null, { faucetHost, faucetPath })
])

process.stdout.write('Setting up tutorial: 1/6\r')

// Set up credentials and domain
const credentialType = xrpl.convertStringToHex('KYC-Verified')

await client.submitAndWait({
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

// Create a loan with complete repayment due in 30 days

// Suppress unnecessary console warning from autofilling LoanSet.
console.warn = () => {}

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
})

const loanBrokerSignature = loanBroker.sign(loanSetTx)
const decodedLoanBrokerSignature = xrpl.decode(loanBrokerSignature.tx_blob)

const keypair = deriveKeypair(borrower.seed)
const encodedTx = encodeForSigning(decodedLoanBrokerSignature)
const borrowerSignature = sign(encodedTx, keypair.privateKey)

const counterpartySignature = {
  SigningPubKey: keypair.publicKey,
  TxnSignature: borrowerSignature
}

// Form and submit the fully signed LoanSet transaction.
let signedLoanSetTx = decodedLoanBrokerSignature
signedLoanSetTx.CounterpartySignature = counterpartySignature

const submitResponse = await client.submitAndWait(signedLoanSetTx)
const loanID = submitResponse.result.meta.AffectedNodes.find(node => 
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
  loanID
}

fs.writeFileSync('lendingSetup.json', JSON.stringify(setupData, null, 2))

process.stdout.write('Setting up tutorial: Complete!\n')

await client.disconnect()
