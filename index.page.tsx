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

          <Card title="Multi-purpose Tokens" to="docs/xls-33d-multi-purpose-tokens/">
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

          <Card title="Token-Enabled Escrows and Payment Channels" to="docs/xls-34-token-escrow-and-payment-channels">
            <p>The proposed amendment would introduce changes to the ledger objects, transactions, and rpc methods to enable Escrows and Payment Channels to use Trustline balances.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>
        </Cards>
      </LandingContainer>

    </LandingLayout>
  );
}
