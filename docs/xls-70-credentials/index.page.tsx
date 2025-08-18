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
    title: 'XLS-70 Credentials',
    description: "Learn how credentials help manage authorization and compliance requirements on XRPL, while respecting privacy and decentralization." }
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
          title="XLS-0070 Credentials"
          subtitle="A W3C-aligned framework for handling on-chain authorization."
        />

        <FeatureContent 
          description="Credentials provide a set of tools for managing authorization and compliance requirements on the XRP Ledger, while respecting privacy and decentralization."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="1CB67D082CF7D9102412D34258CEDB400E659352D3B207348889297A6D90F5EF"
          xlsSpecDate="2024-09-11"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={2}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0070-credentials"
          >
            <p>
              Technical spec for the feature outlining requirements, design,
              and implementation details.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card
            title="Documentation"
            to="https://xrpl.org/docs/concepts/decentralized-storage/credentials"
          >
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <ButtonToXRPL>Read the Docs</ButtonToXRPL>
          </Card>
        </Cards>
        <Cards columns={2}>
          <Card
            title="Blog"
            to="https://www.idos.network/blog/debate-contribution-xrpl-credentials-are-a-game-changer?ref=twitter"
          >
            <p>
              Read how this feature provides a straightforward, W3C-aligned framework for handling on-chain authorization, and why it matters to institutions.
            </p>
            <Button size="large" variant="primary">
              Read the Blog
            </Button>
          </Card>
          <Card
            title="Security Audit"
            to="https://www.halborn.com/audits/ripple/ripple---smart-contract-audit---credentials-c092b3"
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
