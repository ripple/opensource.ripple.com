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
    title: 'XLS-56 Batch',
    description: "Learn how to submit up to 8 transactions atomically." }
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
          title="XLS-0056 Batch"
          subtitle="Submit up to 8 transactions that are processed atomically."
        />

        <FeatureContent 
          description="Batch lets you package multiple transactions together and execute them as a single unit. It eliminates the risk of partial completion and unexpected outcomes, giving you a more reliable and predictable experience for complex operations."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="894646DD5284E97DECFE6674A6D6152686791C4A95F8C132CCA9BAF9E5812FB6"
          xlsSpecDate="2025-01-23"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={2}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0056d-batch"
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
            to="https://xrpl.org/docs/concepts/transactions/batch-transactions"
          >
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <ButtonToXRPL>Read the Docs</ButtonToXRPL>
          </Card>
          <Card title="Security Audit" to="https://www.halborn.com/audits/ripple/ripple---batch---smart-contract-assessment-420598">
            <p>
            The security audit performed by third-party security experts, including a link to the full, detailed security audit report. 
            </p>
            <Button size="large" variant="primary">
              Read the Security Audit Report
            </Button>
          </Card>
          <Card title="Performance Testing" to="https://dev.to/ripplexdev/batch-transaction-performance-testing-report-13j8">
            <p>
            The performance testing report to assess the performance implications of the feature.  
            </p>
            <Button size="large" variant="primary">
              Read the Perf Testing Report
            </Button>
          </Card>        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
