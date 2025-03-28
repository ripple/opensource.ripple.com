# Permissioned Domains

Permissioned domains are controlled environments within the broader ecosystem of the XRP Ledger blockchain. Domains do nothing on their own, but features such as Permissioned DEXes and Lending Protocols can use domains to restrict access, so that traditional financial institutions can offer services on chain while complying with various compliance rules.

The only configurable rule for a domain is the set of accepted [credentials][]. Future amendments may add new and different types of rules to encompass any limits that a financial institution may need to follow to maintain compliance with the laws of the jurisdictions where they do business.

Anyone can define a permissioned domain in the ledger. That person becomes the owner of that domain, and can update its settings or delete it. The only limit to the number of domains that can exist in the ledger is the reserve requirement: each Domain counts as one item toward its owner's reserve requirement.

## Accepted Credentials

A permissioned domain has a set of _accepted credentials_, a list of 1 to 10 credentials that grant access. Each item in the list describes a credential by its issuer and credential type. Any account that holds _at least one_ matching credential automatically gains access to the domain.

A domain serves as an abstraction layer between credentials and a resource being resricted, because the owner of the domain can update the list of required credentials without changing the restricted resource itself.

[{% inline-svg file="./permissioned-domain.svg" /%}](./permissioned-domain.svg "Diagram: a permissioned DEX points to a permissioned domain by ID. The domain's Accepted Credentials describes 3 possible credentials to get access")

Users do not need to apply to join or leave a domain. When a transaction requires access to a resource that is restricted by a domain, the transaction automatically checks if the account holds a credential matching that domain's accepted credentials, and fails if they have none. The user's credential must be accepted and not expired.

## Uses for Domains

Currently, there are no available XRP Ledger features that use permissioned domains. However, amendments that are in development and use domains include:

- Single Asset Vault and Lending Protocol
- Permissioned DEXes

## PermissionedDomains Amendment

Permissioned domains are added by an [amendment][] with the following details:

| Amendment    | PermissionedDomains |
|:-------------|:--------|
| Amendment ID | A730EB18A9D4BB52502C898589558B4CCEB4BE10044500EE5581137A2E80E849 |
| Status       | In Development |
| Default Vote (Latest stable release) | No |
| Pre-amendment functionality retired? | No |

The **Credentials** amendment is also required. If the Permissioned Domains amendment is enabled without Credentials, PermissionedDomainSet transactions are considered invalid.

## Reference

- [PermissionedDomain entry][]
- [PermissionedDomainSet transaction][]
- [PermissionedDomainDelete transaction][]

{% raw-partial file="/docs/_snippets/common-links.md" /%}
