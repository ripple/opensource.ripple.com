import * as React from 'react';
import { Header1, Header2, LandingContainer, LandingLayout, Jumbotron } from "./components";
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

          <Card title="Multi-purpose Tokens" to="docs/xls-33d-multi-purpose-tokens/">
            <p>Multi-purpose tokens (MPTs) are a more compact and flexible type of fungible token.</p>
            <Button size="large" variant="primary">
              Go to docs
            </Button>
          </Card>

          <Card title="Batch transactions" to="docs/xls-56d-batch-transactions/">
            <p>Prepare and submit up to 8 transactions in a single batch.</p>
            <Button size="large" variant="primary">
              Go to docs
            </Button>
          </Card>

          <Card title="LedgerStateFix" to="docs/ledger-state-fix/">
            <p>A general purpose transaction used to fix specific issues affecting the XRP ledger.</p>
            <Button size="large" variant="primary">
              Go to docs
            </Button>
          </Card>

          <Card title="simulate" to="docs/xls-69d/">
            <p>An API method to test transaction results without submitting a transaction to the XRP Ledger.</p>
            <Button size="large" variant="primary">
              Go to docs
            </Button>
          </Card>

          <Card title="Credentials" to="docs/xls-70d-credentials/">
            <p>Create and store credentials on the blockchain for compliance checks.</p>
            <Button size="large" variant="primary">
              Go to docs
            </Button>
          </Card>

        </Cards>
      </LandingContainer>

    </LandingLayout>
  );
}
