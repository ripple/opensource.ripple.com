# Permissioned Domains

Permissioned Domains are a feature to provide controlled environments within the broader ecosystem of the XRP Ledger blockchain. Domains do nothing on their own, but features such as Permissioned DEXes and Lending Protocols can use Domains to restrict access, so that traditional financial institutions can offer services on chain while complying with various compliance rules.

The only configurable rule for a domain is the set of accepted credentials. Future amendments may add new and different types of rules to encompass any limits that a financial institution may need to follow to maintain compliance with the laws of the jurisdictions where they do business.

Anyone can define a Domain in the ledger. That person becomes the owner of that Domain, and can update its settings or delete it. The only limit to the number of Domains that can exist in the ledger is the reserve requirement: each Domain counts as one item toward its owner's reserve requirement.

## Accepted Credentials

A Domain's accepted credentials is the set of credentials that grant access. The definition for a Domain includes a list of 1 to 10 Credentials; any account that holds _at least one_ of the specified Credentials automatically gains access to the Domain. A Domain serves as an abstraction layer between Credentials and a resource being resricted, because the owner of the Domain can update the list of required Credentials without changing the restricted resource itself.

![Diagram: a Permissioned DEX points to a Domain by ID. The domain's Accepted Credentials points to 3 types of Credentials](./permissioned-domain.svg)

Users do not need to apply to join or leave a Domain. When a transaction requires access to a resource that is restricted by a Domain, the transaction automatically checks if the account holds a Credential matching any of the Domain's Accepted Credentials, and fails if they have none. The user's Credential must be accepted and not expired.

## Uses for Domains

Currently, there are no available XRP Ledger features that use Domains. However, amendments that are in development and use Domains include:

- Single Asset Vault and Lending Protocol
- Permissioned DEXes

## Reference

- [PermissionedDomain entry][]
- [PermissionedDomainSet transaction][]
- [PermissionedDomainDelete transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
