import * as React from 'react';
import { Header1, Header2, LandingContainer, LandingLayout, Jumbotron, ButtonToXRPL } from "./components/landing";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'Ripple Open Source Projects',
    description: "Ripple Open Source is a preview of open-source projects Ripple is building for the Internet of Value.",
  }
};

export default function Page() {
  return (
    <LandingLayout>
      <Jumbotron bgImage={require('images/heroimg.png')}>
      
        <Header1>Open Source Projects</Header1>
        <Header2>Explore open source projects currently in development.</Header2>
      </Jumbotron>
     
      <LandingContainer>
        <Cards columns={2}>

          <Card title="Batch transactions" to="docs/xls-56d-batch-transactions/">
            <p>Prepare and submit up to 8 transactions in a single batch.</p>
            <Button size="large" variant="primary">
              Go to docs
            </Button>
          </Card>

          <Card title="Single Asset Vault" to="docs/xls-65d-single-asset-vault/">
            <p>A single asset vault is an XRP Ledger primitive that aggregates assets from multiple depositors and makes them available to other on-chain protocols.</p>
            <Button size="large" variant="primary">
              Go to docs
            </Button>
          </Card>

          <Card title="Credentials" to="https://xrpl.org/docs/concepts/decentralized-storage/credentials">
            <p>Create and store credentials on the blockchain for compliance checks. Documentation is now live on xrpl.org.</p>
            <ButtonToXRPL>
              Go to docs
            </ButtonToXRPL>
          </Card>

          <Card title="Deep Freeze" to="docs/xls-77d-deep-freeze/">
            <p>Deep Freeze ensures that frozen token holders can neither send nor receive frozen funds until their trust line is unfrozen. Documentation is now live on xrpl.org.</p>
            <Button  size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Multi-purpose Tokens" to="docs/xls-33d-multi-purpose-tokens/">
            <p>Multi-purpose tokens (MPTs) are a more compact and flexible type of fungible token.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Permissioned Domains" to="docs/xls-80d-permissioned-domains/">
            <p>Permissioned Domains are controlled environments where stricter compliance controls can be enforced within the blockchain. Documentation is now live on xrpl.org.</p>
            <Button  size="large" variant="primary">
              Learn more
            </Button>
          </Card>

        </Cards>
      </LandingContainer>

    </LandingLayout>
  );
}
