import * as React from 'react';
import { 
  LandingContainer, 
  LandingLayout, 
  ButtonToXRPL,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-81d Permissioned DEXes',
    description: "Trade tokens in controlled environments within the XRPL's decentralized exchange." }
};

export default function Page() {
  const keyDates = [
    { date: "In Progress", event: "XLS Spec Review" },
    { date: "TBA", event: "Feature in rippled" },
    { date: "TBA", event: "Open for voting" },
    { date: "TBA", event: "Obtained ≥ 80% validators support" },
    { date: "TBA", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-0081d Permissioned DEXes"
          subtitle="Trade in controlled environments within the XRPL's decentralized exchange."
        />

        <FeatureContent 
          description="Permissioned DEXes use Permissioned Domains (XLS-80) to enable on-chain trading within controlled environments where every participant holds specific credentials, allowing institutions to ensure that they're complying with financial regulations while trading in the XRPL's decentralized exchange."
          keyDates={keyDates}
        />

        <Cards columns={3}>
          <Card title="XLS Draft" to="https://github.com/XRPLF/XRPL-Standards/pull/256">
            <p>Technical spec for the feature outlining requirements, design, and implementation details, currently in review.</p>
            <Button size="large" variant="primary">
              Read the XLS Draft
            </Button>
          </Card>

          <Card title="Docs" to="/docs/xls-81d-permissioned-dexes/permissioned-dexes">
            <p>Documentation on the feature, including how it works and why.</p>
            <Button size="large" variant="primary">
              Read the Docs
            </Button>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
