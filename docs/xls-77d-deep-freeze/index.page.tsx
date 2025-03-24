import * as React from 'react';
import { Header1, Header2, LandingContainer, LandingLayout, Jumbotron, ButtonToXRPL, KeyDatesCard, KeyDate } from "../../components/landing";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-77 Deep Freeze',
    description: "Learn how deep freeze helps prevent token misuse by frozen account holders." }
};

export default function Page() {
  return (
    <LandingLayout>
      <Jumbotron bgImage={require('../../images/feature-deep-freeze-banner.png')}>        
            <Header1>XLS-0077 Deep Freeze</Header1>
            <Header2>Prevent token misuse by frozen account holders.</Header2>
      </Jumbotron> 

      <LandingContainer>

        <div className="cols_2_to_1">
          <p className="vcentered">
            Deep Freeze lets token issuers on the XRP Ledger prevent token misuse by frozen account holders. It enhances interactions between frozen assets and payments, ensuring that frozen token holders cannot receive funds until or unless their trust line is unfrozen. These changes enable token issuers to more easily comply with regulations on the XRPL.
          </p>

          <KeyDatesCard title="Key Dates">
            <KeyDate date="Dec 17, 2024">XLS Spec Review Complete</KeyDate>
            <KeyDate date="Mar 06, 2025">Feature in rippled 2.4.0</KeyDate>
            <KeyDate date=" Mar 06, 2025">Open for voting</KeyDate>
            <KeyDate date="TBA">Obtained ≥ 80% validators support</KeyDate>
            <KeyDate date="TBA">Enabled on Mainnet</KeyDate>
          </KeyDatesCard>
        </div>
        
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
            <p>An overview of the feature and why it matters to institutional issuers, explained in our blog post.</p>
            <Button size="large" variant="primary">
              Read the Blog
            </Button>
          </Card>

        </Cards>
      </LandingContainer>

    </LandingLayout>
  );
}
