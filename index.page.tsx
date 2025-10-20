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

          <Card title="Batch transactions" to="docs/xls-56-batch-transactions/">
            <p>Prepare and submit up to 8 transactions in a single batch.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Single Asset Vault" to="docs/xls-65d-single-asset-vault/">
            <p>A single asset vault is an XRP Ledger primitive that aggregates assets from multiple depositors and makes them available to other on-chain protocols.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Permission Delegation" to="docs/xls-75-permission-delegation/">
            <p>XRPL accounts can delegate specific transaction permissions to other accounts, enhancing flexibility and enabling use cases such as implementing role-based access control.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Credentials" to="docs/xls-70-credentials/">
            <p>Create and store credentials on the blockchain for compliance checks. Documentation is now live on xrpl.org.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Multi-purpose Tokens" to="docs/xls-33-multi-purpose-tokens/">
            <p>Multi-purpose tokens (MPTs) are a more compact and flexible type of fungible token.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Permissioned Domains" to="docs/xls-80-permissioned-domains/">
            <p>Permissioned Domains are controlled environments where stricter compliance controls can be enforced within the blockchain. Documentation is now live on xrpl.org.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Permissioned DEXes" to="docs/xls-81d-permissioned-dexes">
            <p>Permissioned DEXes use Permissioned Domains to enable trading tokens in controlled environments within the XRPL's decentralized exchange.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Token Escrow" to="docs/xls-85-token-escrow">
            <p>Extends the existing Escrow functionality to support escrowing issued tokens or Multi-purpose tokens (MPTs).</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>          

          <Card title="Dynamic MPTs" to="docs/xls-94d-dynamic-mpts">
            <p>Dynamic Multi-Purpose Tokens (MPTs) allow some properties of an MPTokenIssuance to be declared as mutable, so the issuer can change them later.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card> 
        </Cards>
      </LandingContainer>

    </LandingLayout>
  );
}
