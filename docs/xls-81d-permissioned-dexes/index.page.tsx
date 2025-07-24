import * as React from 'react';
import { 
  LandingContainer, 
  LandingLayout, 
  ButtonToXRPL,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { AmendmentTracker } from "../../components/AmendmentTracker";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-81d Permissioned DEXes',
    description: "Trade tokens in controlled environments within the XRPL's decentralized exchange." }
};

export default function Page() {
  const [keyDates, setKeyDates] = React.useState([
    { date: "🔄 Loading...", event: "XLS Spec Live" },
    { date: "🔄 Loading...", event: "Available to Test on Devnet" },
    { date: "🔄 Loading...", event: "Open for Voting on Mainnet" },
    { date: "🔄 Loading...", event: "Vote Consensus" },
  ]);

  const handleKeyDatesUpdate = React.useCallback((newKeyDates: any[]) => {
    setKeyDates(newKeyDates);
  }, []);

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

        <AmendmentTracker 
          amendmentId="677E401A423E3708363A36BA8B3A7D019D21AC5ABD00387BDBEA6BDE4C91247E"
          xlsSpecDate="2024-12-06"
          onKeyDatesUpdate={handleKeyDatesUpdate}
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
