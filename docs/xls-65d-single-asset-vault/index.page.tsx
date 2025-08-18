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
    title: "XLS-65d Single Asset Vault",
    description: "A single asset vault aggregates assets from multiple depositors and makes them available to other on-chain protocols."
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
          title="XLS-65d Single Asset Vault"
          subtitle="An on-chain primitive for aggregating assets from one or more depositors."
        />

        <FeatureContent 
          description="A single asset vault is an XRP Ledger primitive that aggregates assets from multiple depositors and makes them available to other on-chain protocols, such as a Lending Protocol. A vault asset can be XRP, a Fungible Token, or an MPT (Multi-Purpose Token)."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="81BD2619B6B3C8625AC5D0BC01DE17F06C3F0AB95C7C87C93715B87A4FD240D8"
          xlsSpecDate="2025-02-28"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={2}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0065d-single-asset-vault"
          >
            <p>
              Technical spec for the feature outlining requirements, design,
              and implementation details.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Documentation" to="/docs/xls-65d-single-asset-vault/concepts/single-asset-vault">
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
            to="https://dev.to/ripplexdev/xrp-ledger-lending-protocol-2pla"
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
            to="https://www.halborn.com/audits/ripple/ripple---single-asset-vault---smart-contract-assessment-d39437"
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
