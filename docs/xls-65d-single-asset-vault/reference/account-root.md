# AccountRoot

{% partial file="/docs/_snippets/_single-asset-vault-disclaimer.md" /%}

An `AccountRoot` entry holds the XRP, IOU or MPT deposited into the vault. It also acts as the issuer of the vault's shares.
The pseudo-account follows the [XLS-64d specification]() for pseudo accounts. The `AccountRoot` object is created when creating the `Vault` object.
