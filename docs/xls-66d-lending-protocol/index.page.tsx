import * as React from "react";
import {
  LandingContainer,
  LandingLayout,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { AmendmentTracker } from "../../components/AmendmentTracker";
import { Button } from "@redocly/theme";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/Cards/Cards";

export const frontmatter = {
  seo: {
    title: "XLS-66d Lending Protocol",
    description: "An XRP Ledger DeFi primitive that enables loans from a Single Asset Vault."
  },
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
          title="XLS-66d Lending Protocol"
          subtitle="An XRP Ledger DeFi primitive that enables loans from a Single Asset Vault."
        />

        <FeatureContent 
          description="The Lending Protocol is an XRP Ledger DeFi primitive that enables on-chain, fixed-term, uncollateralized loans using pooled funds from a Single Asset Vault. The implementation relies on off-chain underwriting and risk management to assess the creditworthiness of borrowers, but offers configurable, peer-to-peer loans without intermediaries like banks or financial institutions."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId=""
          xlsSpecDate=""
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={2}>
          <Card
            title="XLS Spec"
            to=""
          >
            <p>
              Technical spec for the feature outlining requirements, design,
              and implementation details.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Documentation" to="/docs/xls-66d-lending-protocol/concepts/lending-protocol">
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <Button size="large" variant="primary">
              Read the Docs
            </Button>
          </Card>
        </Cards>
        <Cards columns={2}>
        <Card
            title="Blog"
            to=""
          >
            <p>
              An overview of the feature and why it matters to developers, explained in our blog post.
            </p>
            <Button size="large" variant="primary">
              Read the Blog
            </Button>
          </Card>
          <Card
            title="Security Audit"
            to=""
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
