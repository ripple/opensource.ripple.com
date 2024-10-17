---
html: manage-the-validator-node.html
parent: evm-sidechains.html
blurb: Learn how to manage a validator node on the EVM Sidechain Devnet.
labels:
  - Development, Interoperability
status: not_enabled
---
# Manage the Validator Node

{% partial file="/snippets/_evm-sidechain-disclaimer.md" /%}


## Edit Validator Description

You can edit your validator's public description. This info identifies your validator, and _delegators_ use it when they decide to stake XRP tokens to a particular validator. Make sure to provide input for every flag below. If a flag is not included in the command, the field defaults to empty (`--moniker` defaults to the machine name), if the field has never been set, or remains the same, if it has been set in the past. <!-- SPELLING_IGNORE: delegators --><!-- STYLE_OVERRIDE: defaults to -->

The <key_name> specifies which validator you are editing. If you choose to not include certain flags, remember that the --from flag must be included to identify the validator to update.

The `--identity` can be used as to verify identity with systems like Keybase or UPort. When using with Keybase `--identity` must be populated with a 16-digit string that is generated with a [keybase.io](https://keybase.io/) account. It is a cryptographically secure method of verifying your identity across multiple online networks. The Keybase API allows us to retrieve your Keybase avatar. This is how you can add a logo to your validator profile. <!-- SPELLING_IGNORE: uport -->

```bash
exrpd tx staking edit-validator
  --moniker="<your_custom_moniker>" \
  --website="https://xrpl.org" \
  --identity=6A0D65E29A4CBC8E \
  --details="<your_validator_description>" \
  --chain-id=<chain_id> \
  --gas="auto" \
  --gas-prices="0.025axrp" \
  --from=<key_name> \
  --commission-rate="0.10"
```

Note that the `commission-rate` value must adhere to the following invariants:

  * Must be between 0 and the validator's `commission-max-rate`
  * Must not exceed the validator's `commission-max-change-rate` which is the maximum % point change rate **per day**. In other words, a validator can only change its commission once per day and within `commission-max-change-rate` bounds.

## View Validator Description

View the validator's information with this command:

```bash
exrpd query staking validator <account>
```

## Track Validator Signing Information

To track a validator's signatures from past transactions use the `signing-info` command. 

```bash
exrpd query slashing signing-info <validator-pubkey> --chain-id=<chain_id>
```

## Unjail Validator
<!-- SPELLING_IGNORE: unjail -->

When a validator is "jailed" for downtime, you must submit an `Unjail` transaction from the operator account to restore block proposer awards (depending on the zone fee distribution).

```bash
exrpd tx slashing unjail --from=<key_name> --chain-id=<chain_id>
```

## Confirm Your Validator is Running

Your validator is active if the following command returns anything:

```bash
exrpd query tendermint-validator-set | grep "$(exrpd tendermint show-address)"
```

You should now see your validator in one of the Exrp explorers. You are looking for the `bech32` encoded `address` in the `~/.exprd/config/priv_validator.json` file. <!-- SPELLING_IGNORE: exrp -->

**Note** To be in the validator set, you must have more total voting power than the 100th validator.

## Halting Your Validator

When attempting to perform routine maintenance or planning for an upcoming coordinated upgrade, it can be useful to have your validator systematically and gracefully halt. Set the `halt-height` to the height at which you want your node to shut down, or pass the `--halt-height` flag to `exrpd`. The node shuts down with a 0 exit code at that given height after committing the block.