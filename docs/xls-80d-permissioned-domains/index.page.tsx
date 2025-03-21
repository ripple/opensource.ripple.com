import * as React from 'react';
import { Header1, Header2, LandingContainer, LandingLayout, Jumbotron, ButtonToXRPL, KeyDatesCard, KeyDate } from "../../components/landing";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-80 Permissioned Domains',
    description: "Learn how permissioned domains enable controlled environment within the broader XRPL blockchain ecosystem." }
};

export default function Page() {
  return (
    <LandingLayout>
      <Jumbotron bgImage={require('../../images/feature-permissioned-domains-banner.png')}>        
            <Header1>XLS-0080 Permissioned Domains</Header1>
            <Header2>Enabling controlled environments within the broader XRPL blockchain ecosystem.</Header2>
      </Jumbotron> 

      <LandingContainer>

      <div className="cols_2_to_1">
          <p className="vcentered">
          Permissioned domains are controlled environments within the broader ecosystem of the XRP Ledger blockchain.
          Domains do nothing on their own. However, they enable other features such as Permissioned DEXes and Lending Protocols to restrict access, thereby enabling compliance on chain. 
          </p>

          <KeyDatesCard title="Key Dates">
            <KeyDate date="Oct 21, 2024">XLS Spec Review Complete</KeyDate>
            <KeyDate date="Mar 06, 2025">Feature in rippled 2.4.0</KeyDate>
            <KeyDate date=" Mar 06, 2025">Open for voting</KeyDate>
            <KeyDate date="TBA">Obtained ≥ 80% validators support</KeyDate>
            <KeyDate date="TBA">Enabled on Mainnet</KeyDate>
          </KeyDatesCard>
        </div>
        
        <Cards columns={3}>

          <Card title="XLS Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0080-permissioned-domains">
            <p>Technical spec for the feature outlining requirements, design, and implementation details. </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Documentation" to="https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains">
            <p>Explore key concepts, find detailed references, and follow step-by-step tutorials.</p>
            <ButtonToXRPL>
              Read the Docs
            </ButtonToXRPL>
          </Card>

          <Card title="Blog" to="https://dev.to/ripplexdev/permissioned-domains-enabling-compliance-driven-onchain-finance-on-the-xrpl-29k2">
            <p>An overview of the feature and why it matters to institutional issuers, explained in our latest blog post.</p>
            <Button size="large" variant="primary">
              Read the Blog
            </Button>
          </Card>          
          
        </Cards>
      </LandingContainer>

    </LandingLayout>
  );
}
