{% admonition type="info" name="Attention" %}

Don't use any funds from a `mainnet` wallet to perform the actions in this tutorial. The steps outlined are for a `testnet` deployment, so any funds transferred from `mainnet` may be lost. Additionally:

- Gas payments aren't currently supported. You don't need to call `AxelarGasService` on Ethereum Sepolia to refund our relayer since it's running "pro bono".
- The bridge doesn't charge any fees currently.
- The `IAxelarGateway` interface and `AxelarExecutable` smart contracts used in this tutorial are different from the ones currently deployed by Axelar. Instructions you find elsewhere likely won't be compatible with this `testnet` deployment.
- Only one validator is used to secure this `testnet` bridge.
- Only one relayer is active.
{% /admonition %}