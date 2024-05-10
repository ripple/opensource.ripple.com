# Axelar Integration

The Axelar-XRPL integration enables messages to pass between the XRPL and other Axelar-supported blockchains. This integration enables the transfer of XRP and XRPL-issued tokens to other chains and back; this also works for briding non-XRPL tokens from their native chains to XRPL.

In addition to cross-chain features, the Axelar Amplifier network utilizes tickets to enable multiple in-flight transactions to improve throughput.

At a high-level, there are two main components that enable the Axelar-XRPL integration. On the XRPL-side, a multisig account is created; this account handles all incoming and outgoing transactions to the Axelar network by:

- Holding and releasing assets as native XRP assets are moved off and on-chain.
- Issuing and burning wrapped assets as non-native XRP assets are bridged to XRPL.

The multisig account is ultimately controlled by the Axelar Network validators, which serve as signers. The XRPL multisig account signers and their weights are kept in sync with the state of the validators on the Axelar network. The Axelar validators' are responsible for verifying transactions on multiple chains, minting and burning as assets are bridged.

**Note:** Future enhancements are planned, such as General Message Passing (GMP), which would enable transactions on XRPL to trigger smart contract calls on other chains.


## Components

### On-chain:

The [XRPL multi-signing account](https://xrpl.org/docs/tutorials/how-tos/manage-account-settings/set-up-multi-signing) handles bridging by releasing/issuing assets, or issuing/burning assets. On EVM and Cosmos chains, the equivalent is a Gateway smart contract.

The Axelar Networks is enabled by four smart contracts:
- **Gateway:** A smart contract that handles incoming and outgoing messages for a particular chain.
- **Voting Verifier:** A smart contract that verifies the authenticity and status of transactions on the XRPL multisig account by counting votes submitted by Axelar validators.
- **Multisig Prover:** Constructs and serializes XRPL multisig transactions to be transmitted to XRPL. Calls the “Multisig” contract on Axelar to initiate a signing session.
- **Multisig:** Handles collection of signatures and keeps record of the weight of each signer.

### Off-chain:
– **relayer:** A permissionless off-chain process that informs the Axelar network of new transactions to be bridged from a source chain, or submits transactions prepared by the Amplifier network to a destination chain. The relayer consists of these sub-components:
    - **Event Monitor:** A sub-component of the relayer that monitors events on the XRPL.
    - **TX Broadcaster:** A sub-component of the relayer that submits serialized and signed transactions to XRPL.
    – **Axelar Validator:** An off-chain component that votes whether transactions have been included on chain and signs new transactions.
    - **Message Verifier:** A sub-component of the validator that verifies the inclusion of a transaction on the XRPL multisig account and the status of that transaction.


## Cross-chain Flows

![Cross-chain Bridging](../../images/axelar-bridging.png)

### Payments from XRPL to another blockchain

1. XRPL users send a `Payment` transaction to the Axelar multisig account. In the `Memos` field, the user includes the destination chain and destination address.
2. The relayer notifies the Axelar network that tokens were transferred to the XRPL multisig.
3. Axelar validators vote to confirm that the transaction was successful on the XRPL.
4. The transaction is encoded and signed for the destination chain.
5. The relayer submits the signed transaction to the destination chain.
6. The destination chain mints/releases assets on the destination chain to the destination address.

### Payments from another source chain to XRPL

1. User transfers tokens to source chain’s Axelar Gateway smart contract, including the XRPL as the destination chain and the XRPL destination account in the contract call.
2. relayer submits the transaction to the Axelar network.
3. Axelar validators vote that the transaction is finalized on the source chain.
4. The transaction is assigned an XRPL multisig ticket number, enabling multiple in-flight transactions. See: Ticket Assignment Logic.
5. The transaction is serialized in the native XRPL binary format.
6. Axelar validators sign the serialized transaction.
7. The relayer submits the signed and serialized transaction to XRPL.
8. The Multisig account issues/releases tokens to the destination address.


## TicketCreate Flow

As mentioned, tickets are used to enable multiple transactions to be in flight, enabling faster transaction confirmation. The XRPL limits the number of available tickets at any given time to 250. When the amount of tickets available matches a configurable threshold, a new `TicketCreate` transaction must be submitted.

1. A `Payment` transaction is confirmed to be included in the XRPL by Axelar validators, making the number of available tickets less than the ticket creation threshold.
2. A relayer requests a `TicketCreate` transaction from the Axelar network.
3. `TicketCreate` is created and serialized with an amount of: 250 - len(available_tickets).
    **Note:** There may actually be less available tickets to use in XRPL than the smart contract is aware of until pending transactions are confirmed, but there can't be more.
4. Axelar validators sign the new `TicketCreate` transaction.
5. The relayer submits the transaction to the XRPL.
6. When the transaction is included in the ledger, the relayer asks for the transaction to be confirmed on Axelar.
7. Axelar validators vote on whether the XRPL transaction has been finalized.
8. If the poll ends successfully, the created tickets are available to be assigned to new `Payment` transactions.


### Ticketing Logic

A set of XRPL multisig tickets are always available: the tickets that have been created with `TicketCreate` but that are not known to have been consumed by transactions that made it to the XRPL ledger. If the number of available tickets falls below a configurable threshold, a new `TicketCreate` transaction is constructed and broadcasted. New transactions are assigned available tickets until they are all exhausted.

![Ticketing Logic 1](../../images/axelar-ticket-1.png)

At that point, ticket assignment will wrap around to the first available tickets (similarl to “round robin” load balancing algorithms), leading to multiple tickets being assigned to the same transaction.

![Ticketing Logic 2](../../images/axelar-ticket-2.png)

Only one of the transactions with the same ticket number will ultimately be included in the ledger, in which case the ticket is assigned to that transaction forever.

![Ticketing Logic 3](../../images/axelar-ticket-3.png)


## SignerListSet Flow

The list of signers and their weights must match the Axelar validators and their stake. Periodically, or when weights change significantly, the XRPL multisig’s signer list must be updated to match the Axelar validator's latest stake. Updating the XRPL multisig siger list goes as follows:

1. Axelar validators or their stake changes.
2. A relayer requests a `SignerListSet` transaction from the Axelar network.
3. An XRPL `SignerListSet` transaction is constructed and serialized.
4. Axelar validators sign the `SignerListSet` transaction.
5. The relayer submits the transaction on the XRPL.
6. When it is included in the ledger, the relayer asks for the `SignerListSet` transaction to be confirmed on Axelar.
7. Axelar validators vote on whether the `SignerListSet` transaction has been included in the XRPL.
8. If verified by validators, the new signer list is used to sign future transactions. Until this step is reached, the previous signer list signs pending transactions.