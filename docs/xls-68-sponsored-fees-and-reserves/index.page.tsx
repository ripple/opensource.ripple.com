import * as React from 'react';
import {
  LandingContainer,
  LandingLayout,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { AmendmentTracker } from "../../components/AmendmentTracker";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-68 Sponsored Fees and Reserves',
    description: "Enable sponsors to pay transaction fees and reserves on behalf of other accounts, reducing barriers to entry on the XRP Ledger."
  }
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
          title="XLS-68 Sponsored Fees and Reserves"
          subtitle="Sponsors pay transaction fees and reserves on behalf of other accounts (sponsees)."
        />

        <FeatureContent
          description="Sponsored Fees and Reserves removes onboarding friction by allowing companies, token issuers, and other entities to subsidize transaction costs and reserve requirements for end users. Sponsors can co-sign transactions or pre-fund sponsorships, covering fees and reserves, while sponsees retain full control of their accounts and keys."
          keyDates={keyDates}
        />

        <AmendmentTracker
          amendmentId="BE1F90581635DBCEBFC4678C4B54FEDDC1A17B50FD02CFE765A4132A342126AC"
          xlsSpecDate="2026-01-30"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={2}>
          <Card
            title="XLS Spec"
            to="https://xls.xrpl.org/xls/XLS-0068-sponsored-fees-and-reserves.html"
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
            to="docs/xls-68-sponsored-fees-and-reserves/concepts/sponsored-fees-and-reserves"
          >
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <Button size="large" variant="primary">
              Read the Docs
            </Button>
          </Card>

          <Card
            title="Security Audit"
            to="https://github.com/fyeo-io/public-audit-reports/blob/main/Code%20Audit%20Reports/2026/Ripple/Ripple%20-%20Security%20Code%20Review%20of%20XRPL%20Sponsored%20Fees%20and%20Reserves%20v1.0.pdf"
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
