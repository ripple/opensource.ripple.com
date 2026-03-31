# Programmability

A programmability layer, powered by a WebAssembly (WASM) engine, allows users to extend the core functionality of the ledger with custom code. Currently, the only extensible functionality suite is Smart Escrows. Further amendments are expected to fall into two categories:

- **Smart Transactions** are core transaction types with specific, limited extensibility in the form of custom functions that run at specific times.
    - **Smart Escrows** ([XLS-100](https://xls.xrpl.org/xls/XLS-0100-smart-escrows.html)) are the first smart transactor to be proposed.
    - Further smart transactions, such as "Smart MPTs", are under consideration, pending more detailed analysis.
- **Smart Contracts** are more full-fledged systems that can encompass an entire suite of functionality to be built and deployed on the blockchain. The draft proposal for smart contracts is [XLS-101](https://xls.xrpl.org/xls/XLS-0101-smart-contracts.html).

[The XLS-102 standard](https://xls.xrpl.org/xls/XLS-0102-wasm-vm.html) specifies the WASM engine to power both smart transactors and smart contracts.

## Gas Costs

Since every node in the network must calculate the outcome of a smart function to reach the same conclusion about a smart transaction's outcome, it's essential that smart functions cannot use unbounded compute time or memory. To ensure this is handled fairly and deterministically, the WASM engine calculates a "gas" cost any time it's running. The more memory it allocates or compute time it uses, the higher the gas cost. If a smart function exceeds certain gas limits, the WASM engine terminates the smart function and fails the transaction with a `tec` code. Whether the transaction succeeded or failed, the calculated gas value is translated into an amount of XRP and destroyed as part of the cost of processing the transaction. Transactions that cause smart function code to run must specify a maximum "gas allowance" that the sender is willing to spend, and the sender must have enough XRP to pay the full gas allowance.

The conversion between units of gas and units of XRP is flexible, and can be changed by a consensus of validators as part of [Fee Voting](https://xrpl.org/docs/concepts/consensus-protocol/fee-voting). In the default configuration, 1000 gas is equal to 1 drop of XRP.

## Developing Smart Code

Code in many programming languages can be compiled to machine code that runs in the XRP Ledger's WASM engine, but Rust is recommended as the language of choice for smart function and smart contract development. The `xrpl_wasm_stdlib` library provides higher-level abstractions to the host functions that the XRPL's WASM engine provides for interacting with transaction and ledger data.

For setup instructions, smart function examples, API definitions and more, see the **[XRPL WebAssembly Standard Library Documentation](https://ripple.github.io/xrpl-wasm-stdlib/xrpl_wasm_stdlib/guide/index.html)**.

## Smart Escrows

Smart escrows extend the XRP Ledger's built-in escrow functionality with custom release conditions. When created, an escrow can have a custom function that determines its release conditions. The escrow can be finished if and only if the custom finish function returns a successful result when the EscrowFinish transaction is processed.

Smart escrows are required to have an expiration value, as a safeguard. If the finish function never returns success, whether intentionally or not, it eventually expires and the escrowed funds can only be returned to the sender.
