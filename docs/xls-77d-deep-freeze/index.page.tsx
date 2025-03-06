import * as React from 'react';
import { Header1, Header2, LandingContainer, LandingLayout, Jumbotron, ButtonToXRPL, KeyDatesCard, KeyDate } from "../../components/landing";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-77 Deep Freeze',
    description: "Learn how permissioned domains enable controlled environment within the broader XRPL blockchain ecosystem" }
};

export default function Page() {
  return (
    <LandingLayout>
      <Jumbotron bgImage={require('../../images/feature-page-banner-solid-ripple90.png')}>        
            <Header1>XLS-0077 Deep Freeze</Header1>
            <Header2>Prevent token misuse by frozen account holders.</Header2>
      </Jumbotron> 

      <LandingContainer>

        <Cards columns={2}>
          <Card variant="ghost">
            <p>
              Text goes here
            </p>
          </Card>

          <KeyDatesCard title="Key Dates">
            <KeyDate date="Dec 17, 2024">XLS Spec Review Complete</KeyDate>
            <KeyDate date="Mar 06, 2025">Feature in rippled 2.4.0</KeyDate>
            <KeyDate date=" Mar 06, 2025">Open for voting</KeyDate>
            <KeyDate date="TBA">Obtained ≥ 80% validators support</KeyDate>
            <KeyDate date="TBA">Enabled on Mainnet</KeyDate>
          </KeyDatesCard>
        </Cards>
        
        <Cards columns={3}>

          <Card title="XLS Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0077-deep-freeze">
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
          
          <Card title="Blog" to="https://dev.to/ripplexdev/deep-freeze-strengthening-institutional-asset-control-on-xrpl-2j2a">
            <p>An overview of the feature and why it matters to institutional issuers, explained in our latest blog post.</p>
            <ButtonToXRPL>
              Read the Blog
            </ButtonToXRPL>
          </Card>

        </Cards>
      </LandingContainer>

    </LandingLayout>
  );
}
