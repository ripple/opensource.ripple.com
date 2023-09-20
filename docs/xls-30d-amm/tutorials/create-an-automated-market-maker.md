---
parent: use-tokens.html
blurb: Set up an Automated Market Maker (AMM)
embed_xrpl_js: true
status: not_enabled
filters:
  - interactive_steps
labels:
  - Decentralized Exchange
  - Tokens
  - AMM
---
# Create an Automated Market Maker

An [Automated Market Maker (AMM)](../automated-market-makers.md) can be an efficient way to facilitate exchanges between two assets, while earning its liquidity providers passive income. This tutorial shows how to create the AMM for a given asset pair.

## Prerequisites

- You must have an XRP Ledger address and some XRP. For testing, you can get these from a [Faucet](https://xrpl.org/xrp-testnet-faucet.html).
- You should be familiar with the Getting Started instructions for your preferred client library. This page provides examples for the following:
    - **JavaScript** with the [xrpl.js library](https://github.com/XRPLF/xrpl.js/) **version 2.8.0-beta.0 or later**. See [Get Started Using JavaScript](https://xrpl.org/get-started-using-javascript.html) for setup steps.
    - You can also use [an interactive version of this tutorial in your browser](https://mduo13.github.io/xrpl-dev-portal/pr-preview/amm/create-an-automated-market-maker.html).
- You should have a basic understanding of how [tokens](https://xrpl.org/tokens.html) work in the XRP Ledger.
- You may want to read about [Automated Market Makers in the XRP Ledger](../automated-market-makers.md) first.


## Example Code

Complete sample code for all of the steps of these tutorials is available under the MIT license.

- See [Code Samples: Create an AMM](https://github.com/ripple/opensource.ripple.com/tree/main/docs/xls-30d-amm/code-samples/create-amm) in the source repository for this website.


## Steps

### 1. Connect to the network

You must be connected to the network to query it and submit transactions. The following code shows how to connect to a public server using a supported [client library](https://xrpl.org/client-libraries.html):

```js JavaScript
// In browsers, use a <script> tag. In Node.js, uncomment the following line:
// const xrpl = require('xrpl')

const WS_URL = 'wss://amm.devnet.rippletest.net:51233/'
const EXPLORER = 'amm-devnet.xrpl.org' // Optional, for linking

async function main() {
  // Define the network client
  const client = new xrpl.Client(WS_URL)
  await client.connect()

  // ... custom code goes here

  // Disconnect when done (If you omit this, Node.js won't end the process)
  await client.disconnect()
}

main()
```

### 2. Get credentials

To transact on the XRP Ledger, you need an address and secret key, and some XRP. For development purposes, you can get these from the [Faucet](https://xrpl.org/xrp-testnet-faucet.html).

When you're [building production-ready software](https://xrpl.org/production-readiness.html), you should use an existing account, and manage your keys using a [secure signing configuration](https://xrpl.org/set-up-secure-signing.html). The following code shows how to get a `Wallet` instance using either the faucet or a seed provided by environment variable:

```js JavaScript
// Get credentials from the Faucet -------------------------------------------
  console.log("Requesting address from the faucet...")
  const wallet = (await client.fundWallet()).wallet

  // To use an existing account, use code such as the following:
  // const wallet = xrpl.Wallet.fromSeed(process.env['USE_SEED'])
```


### 3. Select and acquire assets

As the creator of an AMM, you are also the first liquidity provider and you have to supply it with a starting pool of assets. Other users of the XRP Ledger can also become liquidity providers by supplying assets after the AMM exists. It's important to choose assets especially carefully because, as a liquidity provider for an AMM, you are supplying some amounts of both for users to swap between. If one of the AMM's assets becomes worthless, other users can use the AMM to trade for the other asset, leaving the AMM (and thus, its liquidity providers including you) holding only the worthless one. Technically, the AMM always holds some positive amount of both assets, but the amounts can be very small.

You can choose any pair of fungible assets in the XRP Ledger, including XRP or tokens, including LP Tokens from another AMM. If you use a token, you must hold some amount of that token. (If a token's issuer uses, [authorized trust lines](https://xrpl.org/authorized-trust-lines.html), that means you have to be authorized first.)

For each of the two assets, you need to know its currency code and issuer; as an exception, XRP has no issuer. For each of the assets, you must hold a balance of the asset (or _be_ the issuer). The following sample code acquires two assets, "TST" (which it buys using XRP) and "FOO" (which it receives from the issuer).

```js JavaScript
// Acquire tokens ------------------------------------------------------------
  const offer_result = await client.submitAndWait({
    "TransactionType": "OfferCreate",
    "Account": wallet.address,
    "TakerPays": {
      currency: "TST",
      issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
      value: "25"
    },
    "TakerGets": xrpl.xrpToDrops(25*10*1.16)
  }, {autofill: true, wallet: wallet})
  if (offer_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`TST offer placed: ${EXPLORER}/transactions/${offer_result.result.hash}`)
    const balance_changes = xrpl.getBalanceChanges(offer_result.result.meta)
    for (const bc of balance_changes) {
      if (bc.account != wallet.address) {continue}
      for (const bal of bc.balances) {
        if (bal.currency == "TST") {
          console.log(`Got ${bal.value} ${bal.currency}.${bal.issuer}.`)
          break
        }
      }
      break
    }

  } else {
    throw `Error sending transaction: ${offer_result}`
  }
  // Successfully placing the offer doesn't necessarily mean that you have TST,
  // but for now, let's assume it matched existing Offers on ledger so you do.

  // Call helper function to set up a new "FOO" issuer, create a trust line to them, 
  // and receive 1000 FOO from them.
  const foo_amount = await get_new_token(client, wallet, "FOO", "1000")
```

This tutorial includes some example code to issue FOO tokens from a second test address. This is not realistic for a production scenario, because tokens do not inherently have value, but it makes it possible to demonstrate creating a new AMM for a unique currency pair. In production, you would acquire a second token in some other way, such as making an off-ledger deposit with the [stablecoin issuer](https://xrpl.org/become-an-xrp-ledger-gateway.html), or buying it in the [decentralized exchange](https://xrpl.org/decentralized-exchange.html).

The helper function for issuing follows an abbreviated version of the steps in the [Issue a Fungible Token](https://xrpl.org/issue-a-fungible-token.html) tutorial:

```js JavaScript
/* Issue tokens ---------------------------------------------------------------
 * Fund a new issuer using the faucet, and issue some fungible tokens 
 * to the specified address. In production, you would not do this; instead,
 * you would acquire tokens from an existing issuer (for example, you might 
 * buy them in the DEX, or make an off-ledger deposit at a stablecoin issuer).
 * For a more thorough explanation of this process, see
 * "Issue a Fungible Token": https://xrpl.org/issue-a-fungible-token.html
 * Params:
 * client: an xrpl.Client instance that is already connected to the network
 * wallet: an xrpl.Wallet instance that should hold the new tokens
 * currency_code: string currency code (3-char ISO-like or hex code)
 * issue_quantity: string number of tokens to issue. Arbitrarily capped 
 *                 at "10000000000"
 * Resolves to: an "Amount"-type JSON object, such as:
 * {
 *   "currency": "TST",
 *   "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
 *   "value": "123.456"
 * }
 */
async function get_new_token(client, wallet, currency_code, issue_quantity) {
  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Funding an issuer address with the faucet...")
  const issuer = (await client.fundWallet()).wallet
  console.log(`Got issuer address ${issuer.address}.`)

  // Enable issuer DefaultRipple ----------------------------------------------
  const issuer_setup_result = await client.submitAndWait({
    "TransactionType": "AccountSet",
    "Account": issuer.address,
    "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
  }, {autofill: true, wallet: issuer} )
  if (issuer_setup_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Issuer DefaultRipple enabled: ${EXPLORER}/transactions/${issuer_setup_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${issuer_setup_result}`
  }

  // Create trust line to issuer ----------------------------------------------
  const trust_result = await client.submitAndWait({
    "TransactionType": "TrustSet",
    "Account": wallet.address,
    "LimitAmount": {
      "currency": currency_code,
      "issuer": issuer.address,
      "value": "10000000000" // Large limit, arbitrarily chosen
    }
  }, {autofill: true, wallet: wallet})
  if (trust_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Trust line created: ${EXPLORER}/transactions/${trust_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${trust_result}`
  }

  // Issue tokens -------------------------------------------------------------
  const issue_result = await client.submitAndWait({
    "TransactionType": "Payment",
    "Account": issuer.address,
    "Amount": {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": issuer.address
    },
    "Destination": wallet.address
  }, {autofill: true, wallet: issuer})
  if (issue_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Tokens issued: ${EXPLORER}/transactions/${issue_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${issue_result}`
  }

  return {
    "currency": currency_code,
    "value": issue_quantity,
    "issuer": issuer.address
  }
}
```


### 4. Check if the AMM exists

Since there can only be one AMM for a specific pair of assets, it's best to check first before trying to create one. Use the [amm_info method](../public-api-methods/amm_info.md) to see if the AMM already exists. For the request, you specify the two assets. The response should be an `actNotFound` error if the AMM does not exist.

```js JavaScript
// Check if AMM already exists ----------------------------------------------
  const amm_info_request = {
    "command": "amm_info", 
    "asset": {
      "currency": "TST",
      "issuer": "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    },
    "asset2": {
      "currency": foo_amount.currency,
      "issuer": foo_amount.issuer
    },
    "ledger_index": "validated"
  }
  try {
    const amm_info_result = await client.request(amm_info_request)
    console.log(amm_info_result)
  } catch(err) {
    if (err.data.error === 'actNotFound') {
      console.log(`No AMM exists yet for the pair 
                   ${foo_amount.currency}.${foo_amount.issuer} / 
                   TST.rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd.
                   (This is probably as expected.)`)
    } else {
      throw(err)
    }
  }
```

If the AMM does already exist, you should double-check that you specified the right pair of assets; if so, someone else has already created this AMM, but you can still deposit to it instead. <!-- TODO: link to a tutorial about depositing to and withdrawing from an AMM when one exists -->


### 5. Look up the AMMCreate transaction cost

Creating an AMM has a special [transaction cost][] to prevent spam: since it creates objects in the ledger that no one owns, you must burn at least one [owner reserve increment](https://xrpl.org/reserves.html) of XRP to send the AMMCreate transaction. The exact value can change due to [fee voting](https://xrpl.org/fee-voting.html), so you should look up the current incremental reserve value using the [server_state method][].

It is also a good practice to display this value and give a human operator a chance to stop before you send the transaction. Burning an owner reserve is typically a much higher cost than sending a normal transaction, so you don't want it to be a surprise. (Currently, on both Mainnet and AMM-Devnet, the cost of sending a typical transaction is 0.000010 XRP but the cost of AMMCreate is 2 XRP.)

```js
// Look up AMM transaction cost. --------------------------------------------
  // AMMCreate requires burning one owner reserve. We can look up that amount
  // (in drops) on the current network using server_state:
  const ss = await client.request({"command": "server_state"})
  const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()
  console.log(`Current AMMCreate transaction cost: 
               ${xrpl.dropsToXrp(amm_fee_drops)} XRP`)
```


### 6. Send AMMCreate transaction

Send an [AMMCreate transaction](../transaction-types/ammcreate.md) to create the AMM. Important aspects of this transaction include:

| Field | Value | Description |
|-------|--------|-------------|
| `Asset` | [Currency Amount][] | Starting amount of one asset to deposit in the AMM. |
| `Asset2` | [Currency Amount][] | Starting amount of the other asset to deposit in the AMM. |
| `TradingFee` | Number | The fee to charge when trading against this AMM instance. The maximum value is `1000`, meaning a 1% fee; the minimum value is `0`. If you set this too high, it may be too expensive for users to trade against the AMM; but the lower you set it, the more you expose yourself to currency risk from the AMM's assets changing in value relative to one another. |
| `Fee` | String - XRP Amount | The transaction cost you looked up in the previous step. Client libraries may require that you add a special exception or reconfigure a setting to specify a `Fee` value this high. |

For the two starting assets, it does not matter which is `Asset` and which is `Asset2`, but you should specify amounts that are about equal in total value, because otherwise other users can profit at your expense by trading against the AMM.

**Tip:** Use `fail_hard` when submitting this transaction, so you don't have to pay the high transaction cost if the transaction initially fails. (It's still _possible_ that the transaction could tentatively succeed, and then fail and still burn the transaction cost, but this protects you from burning XRP on many of types of failures.)

```js JavaScript
// Create AMM ---------------------------------------------------------------
  // This example assumes that 15 TST ≈ 100 FOO in value.
  const ammcreate_result = await client.submitAndWait({
    "TransactionType": "AMMCreate",
    "Account": wallet.address,
    "Amount": {
      currency: "TST",
      issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
      value: "15"
    },
    "Amount2": {
      "currency": foo_amount.currency,
      "issuer": foo_amount.issuer,
      "value": "100"
    },
    "TradingFee": 500, // 0.5%
    "Fee": amm_fee_drops
  }, {autofill: true, wallet: wallet, fail_hard: true})
  // Use fail_hard so you don't waste the tx cost if you mess up
  if (ammcreate_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`AMM created: ${EXPLORER}/transactions/${ammcreate_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${ammcreate_result}`
  }
```

### 7. Check AMM info

If the AMMCreate transaction succeeded, it creates the AMM and related objects in the ledger. You _could_ check the metadata of the AMMCreate transaction, but it is often easier to call the [amm_info method](../public-api-methods/amm_info.md) again to get the status of the newly-created AMM. 

```js JavaScript
// Confirm that AMM exists --------------------------------------------------
  // Make the same amm_info request as earlier, but this time it should succeed
  const amm_info_result2 = await client.request(amm_info_request)
  console.log(amm_info_result2)
  const lp_token = amm_info_result2.result.amm.lp_token
  const amount = amm_info_result2.result.amm.amount
  const amount2 = amm_info_result2.result.amm.amount2
  console.log(`The AMM account ${lp_token.issuer} has ${lp_token.value} total
               LP tokens outstanding, and uses the currency code ${lp_token.currency}.`)
  console.log(`In its pool, the AMM holds ${amount.value} ${amount.currency}.${amount.issuer}
               and ${amount2.value} ${amount2.currency}.${amount2.issuer}`)
```

In the result, the `amm` object's `lp_token` field is particularly useful because it includes the issuer and currency code of the AMM's LP Tokens, which you need to know for many other AMM-related transactions. LP Tokens always have a hex currency code starting with `03`, and the rest of the code is derived from the issuers and currency codes of the tokens in the AMM's pool. The issuer of the LP Tokens is the AMM address, which is randomly chosen when you create an AMM.

Initially, the AMM's total outstanding LP Tokens, reported in the `lp_token` field of the `amm_info` response, match the tokens you hold as its first liquidity provider. However, after other accounts deposit liquidity to the same AMM, the amount shown in `amm_info` updates to reflect the total issued to all liquidity providers. Since others can deposit at any time, even potentially in the same ledger version where the AMM was created, you shouldn't assume that this amount represents your personal LP Tokens balance.


###  8. Check trust lines

You can also use the [account_lines method][] to get an updated view of your token balances. Your balances should be decreased by the amounts you deposited, but you now have a balance of LP Tokens that you received from the AMM.

```js JavaScript
// Check token balances
  const account_lines_result = await client.request({
    "command": "account_lines",
    "account": wallet.address,
    // Tip: To look up only the new AMM's LP Tokens, uncomment:
    // "peer": lp_token.issuer,
    "ledger_index": "validated"
  })
  console.log(account_lines_result)
```

The `account_lines` response shows only the tokens held by the account you looked up (probably yours). If you have a lot of tokens, you may want to specify the AMM address as the `peer` in the request so you don't have to [paginate](https://xrpl.org/markers-and-pagination.html) over multiple requests to find the AMM's LP Tokens. In this tutorial, your account probably only holds the three different tokens, so you can see all three in the same response.

**Tip:** If one of the assets in the AMM's pool is XRP, you need to call the [account_info method][] on your account to see the difference in your balance (the `Balance` field of the account object).


## Next Steps

At this point the AMM is up and running, and [trades in the DEX](https://xrpl.org/trade-in-the-decentralized-exchange.html) automatically use this AMM in combination with Offers to achieve the best exchange rate possible between the two assets in the AMM's pool. If the flow of funds between the two assets is relatively balanced and there are no major shifts in the value of one asset compared to the other, this can become a source of passive income for you and anyone else who deposits liquidity into the AMM's pool.

When you want to withdraw liquidity from the AMM, you can use [AMMDeposit](../transaction-types/ammdeposit.md) to cash in your LP Tokens to receive a share of the AMM's assets. You can also use LP Tokens like any other tokens in the XRP Ledger, which means you can trade them, use them in payments, or even deposit them in another AMM.

However, you should keep an eye on market conditions, and use tools like [AMMBid](../transaction-types/ammbid.md) and [AMMVote](../transaction-types/ammvote.md) to insulate yourself from losses due to changes in the relative value of the two assets in the pool.


<!-- MD: reusable link definitions: -->
[account_info method]: https://xrpl.org/account_info.html
[account_lines method]: https://xrpl.org/account_lines.html
[server_state method]: https://xrpl.org/server_state.html
[Currency Amount]: https://xrpl.org/basic-data-types.html#specifying-currency-amounts
[transaction cost]: https://xrpl.org/transaction-cost.html
