import * as React from 'react';
import { Header1, Header2, LandingContainer, LandingLayout, Jumbotron, ButtonToXRPL, KeyDatesCard, KeyDate } from "../../components/landing";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-80 Permissioned Domains',
    description: "Learn how permissioned domains enable controlled environment within the broader XRPL blockchain ecosystem" }
};

export default function Page() {
  return (
    <LandingLayout>
      <Jumbotron bgImage={require('../../images/heroimg.png')}>        
            <Header1>XLS-0080 Permissioned Domains</Header1>
            <Header2>Enabling controlled environments within the broader XRPL blockchain ecosystem.</Header2>
      </Jumbotron> 

      <LandingContainer>

        <Cards columns={2}>
          <Card variant="ghost">
            <p>
              Text goes here
            </p>
          </Card>

          <KeyDatesCard title="Key Dates">
            <KeyDate date="Oct 21, 2024">XLS Spec Review Complete</KeyDate>
            <KeyDate date="Mar 05, 2025">Feature in rippled 2.4.0</KeyDate>
            <KeyDate date=" Mar 05, 2025">Open for voting</KeyDate>
            <KeyDate date="TBA">Obtained ≥ 80% validators support</KeyDate>
            <KeyDate date="TBA">Enabled on Mainnet</KeyDate>
          </KeyDatesCard>
        </Cards>
        
        <Cards columns={2}>

          <Card title="XLS Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0080-permissioned-domains">
            <p>Prepare and submit up to 8 transactions in a single batch.</p>
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
          
        </Cards>
      </LandingContainer>

    </LandingLayout>
  );
}
