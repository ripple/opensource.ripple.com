import * as React from 'react';
import { Header1, Header2, LandingContainer, LandingLayout, Jumbotron, ButtonToXRPL } from "../../components/landing";
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

          <div style={{ maxWidth: '50%', height: 'auto' }}>
            <p>
              Text goes here
            </p>
            <img src={require('./ripplex-xrpl-features-key-dates-xls80-permissioned-domains.png')} alt="Key Dates for Permissioned Domains Feature" } />
          </div>
        
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
