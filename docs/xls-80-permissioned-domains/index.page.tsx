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
    title: 'XLS-80 Permissioned Domains',
    description: "Learn how permissioned domains enable controlled environments within the broader XRPL blockchain ecosystem." }
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
          title="XLS-0080 Permissioned Domains"
          subtitle="Enabling controlled environments within the broader XRPL blockchain ecosystem."
        />

        <FeatureContent 
          description="Permissioned domains are controlled environments within the broader ecosystem of the XRP Ledger blockchain. Domains do nothing on their own. However, they enable other features such as Permissioned DEXes and Lending Protocols to restrict access, thereby enabling compliance on chain."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="A730EB18A9D4BB52502C898589558B4CCEB4BE10044500EE5581137A2E80E849"
          xlsSpecDate="2024-10-21"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card title="XLS Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0080-permissioned-domains">
            <p>Technical spec for the feature outlining requirements, design, and implementation details.</p>
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
