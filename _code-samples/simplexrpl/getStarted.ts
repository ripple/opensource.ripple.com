// This Get Started sample walks through the basics of using simpleXRPL.

import { LocalSigner, SimpleXRPL } from 'simplexrpl'

// --- Construct a connector ---
// The LocalSigner constructor is a self-custody option that signs locally.
// Intended for testing and development.
const signer = LocalSigner.fromEnv()

// --- Initialize the client ---
const client = await SimpleXRPL.init({
  xrpldUrl: 'wss://s.altnet.rippletest.net:51233',
  faucetUrl: 'https://faucet.altnet.rippletest.net/accounts',
  signers: [signer],
})

// --- Discover your accounts ---
// Connectors discover their accounts at init; the client merges them into one
// index keyed by XRPL address.
for (const [address, account] of client.accounts) {
  console.log(`${address}: ${account.signer.kind}`)
}

// Get the primary account used to submit vertical operations.
// No args returns the primary account.
const primary = client.resolveAccount()
console.log(`primary: ${primary.address}`)

// Read an account's on-chain state. No args retrieves the primary account.
const state = await client.account.retrieve()
console.log(`balance (XRP): ${state.data.xrpBalance} | sequence: ${state.data.sequence}`)

// --- Send an XRP transfer ---
const result = await client.xrp.transfer({
  to: 'rDestination00000000000000000000000',
  amount: '10',
})
console.log(`submitted: ${result.txHash}`)

await client.disconnect()
