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
  const KEY_DATE_EVENTS = [
    "XLS Spec Live",
    "Available to Test on Devnet",
    "Open for Voting on Mainnet", 
    "Vote Consensus"
  ];

  const [keyDates, setKeyDates] = React.useState(
    KEY_DATE_EVENTS.map(event => ({ date: "🔄 Loading...", event }))
  );

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

          <Card title="QA Test Report" to="https://dev.to/ripplexdev/permissioned-domains-qa-test-report-3pjl">
            <p>
            The QA Test Report presents results of QA testing performed on the feature across rippled and Clio servers. 
            </p>
            <Button size="large" variant="primary">
              Read the QA Testing Report
            </Button>
          </Card>  
          <Card
            title="Security Audit"
            to="https://www.halborn.com/audits/ripple/ripple---smart-contract-audit---permissioned-domains-0bd9c6"
          >
            <p>
              The security audit performed by third-party security experts, including a link to the full, detailed security audit report.  
            </p>
            <Button size="large" variant="primary">
              Read the Security Audit Report
            </Button>
          </Card>                
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
