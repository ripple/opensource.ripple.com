---
html: get-started-evm-sidechain.html
parent: evm-sidechains.html
blurb: Get started with the EVM compatible sidechain for the XRP Ledger.
labels:
  - Development, Interoperability
status: not_enabled
---
# Get Started with the XRPL EVM Sidechain

<embed src="/snippets/_evm-sidechain-disclaimer.md" />

This getting started tutorial walks you through the steps to set up your account and submit a transaction using the EVM sidechain bridge. 

## 1. Create an Account Using an EVM Compatible Wallet
<!-- STYLE_OVERRIDE: wallet -->

In order to interact with the network, you need to create an account in the XRPL EVM sidechain. To create and manage this account you can use any EVM compatible wallet such as MetaMask.

For instructions on how to install and create an account using MetaMask, see [Connect MetaMask to XRP Ledger EVM Sidechain](connect-metamask-to-xrpl-evm-sidechain.md).


## 2. Submit a Transaction Using the EVM Sidechain Bridge

Once you have your account set up, submit a transaction to assign some of your test tokens from the XRP Ledger Devnet to the EVM Sidechain using the EVM Sidechain bridge.

The EVM Sidechain bridge is a tool that enables transactions between chains in a fast and secure way.


### 1. Select the networks

To start the transaction, you need to select the networks you want to interact with. The EVM Sidechain bridge currently supports transactions between the XRP Ledger Devnet and the XRPL EVM Sidechain.

![Select Network](../img/evm-sidechain-select-network.png '#width=720px;')

In this case we are going to select **From `XRPL Devnet`** and **To `EVM Sidechain Devnet`**.

### 2. Connect Both Wallets


**Connect Faucet Wallet**

Use the bridge client to generate a new wallet using the faucet and connect it to the bridge. To do so, you select the option **XRP Faucet Wallet**.

This option generates a new wallet using the faucet and directly connects it to the bridge.

**Connect MetaMask Wallet**

Use your MetaMask wallet to interact with the XRP Ledger EVM Sidechain. 
Ensure that you have created a MetaMask account and connected to the public XRP Ledger Devnet as described in [Connect MetaMask to XRP Ledger EVM Sidechain](connect-metamask-to-xrpl-evm-sidechain.md).

To connect a MetaMask wallet to the bridge, go to the [EVM sidechain bridge](https://bridge.devnet.xrpl.org/) and click **Connect Metamask Wallet**.

![Connect MetaMask Wallet](../img/evm-sidechain-connect-metamask.png '#width=300px;')

### 3. Select a token

Now that both wallets are connected to the bridge, you must select the token you want to transfer. In this case, we are going to select `XRP`.

![Select a token](../img/evm-sidechain-token.png '#width=720;')


### 4. Start the Transaction 

With everything configured, it is time to start the bridge transfer. You will now need to enter the amount of XRP that you want to transfer to the EVM Sidechain and click **Transfer** 

You will be asked to sign transactions on the Metamask wallet and the Faucet wallet.

![Signature request](../img/evm-sidechain-signature-request.png '#width=720px;')

**Note**: The faucet wallet transactions will be signed automatically by the bridge client.

Once you approve the transactions in either the Faucet Wallet or Metamask (depending on the direction of the transfer), a loading screen displays. This process can take up to a few minutes.

![Transaction in progress](../img/evm-sidechain-transfer-in-progress.png '#width=720px;')


### 5. Receive the Funds

After a few minutes of transaction processing time, you are redirected to the **Transaction Confirmation** screen where you can verify the details of the bridge transaction.

- **Origin transaction hash**: Hash of the transaction in the origin chain.
- **Destination transaction hash**: Hash of the transaction in the destination chain.
- **From address**: Address on the origin chain.
- **To address**: Address on the destination chain.
- **Receive**: The amount received in the destination address.

![Transaction confirmation](../img/evm-sidechain-transaction-confirmation.png '#width=720px;')

Your transaction has completed successfully and the test XRP tokens are now available in the other chain.
