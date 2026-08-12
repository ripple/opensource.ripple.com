import * as React from "react";
import {
  LandingContainer,
  LandingLayout,
  FeatureHeader,
  FeatureContent,
  ButtonToXRPL
} from "../../components/landing";
import { AmendmentTracker } from "../../components/AmendmentTracker";
import { Button } from "@redocly/theme";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/Cards/Cards";

export const frontmatter = {
  seo: {
    title: "XLS-75 Permission Delegation",
    description: "XRPL accounts can delegate specific transaction permissions to other accounts, enhancing flexibility and enabling use cases such as implementing role-based access control."
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
          title="XLS-75 Permission Delegation"
          subtitle="An on-chain primitive for delegating transaction permissions between accounts."
        />

        <FeatureContent
          description="XRPL accounts can delegate both transaction permissions and granular permissions to other accounts, enhancing flexibility and enabling use cases such as implementing role-based access control."
          keyDates={keyDates}
        />

        <AmendmentTracker
          amendmentId="0F48FF561C709540328F31F1C97FD512ACC8B4E42138A161CB0E21ECA292540B"
          xlsSpecDate="2025-05-08"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0075-permission-delegation"
          >
            <p>
              Technical spec for the feature outlining requirements, design,
              and implementation details.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Concepts" to="https://xrpl.org/docs/concepts/accounts/permission-delegation">
            <p>
              Documentation on the feature, including how it works and why.
            </p>
            <ButtonToXRPL>
              Read the Concepts
            </ButtonToXRPL>
          </Card>

          <Card
            title="Blog"
            to="https://dev.to/ripplexdev/permission-delegation-unlocking-a-new-era-of-xrpl-account-management-34ec"
          >
            <p>
              An overview of the feature and why it matters to developers, explained in our blog post.
            </p>
            <Button size="large" variant="primary">
              Read the Blog
            </Button>
          </Card>

          <Card
            title="Code Samples"
            to="https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/delegate-permissions/"
          >
            <p>
              Explore working code samples to get started.
            </p>
            <ButtonToXRPL>
              View the Code Samples
            </ButtonToXRPL>
          </Card>

          <Card
            title="Security Audit"
            to="https://dev.to/ripplexdev/permission-delegation-security-audit-findings-2h83"
          >
            <p>
              The security audit performed by third-party security experts, including a link to the full, detailed security audit report.  
            </p>
            <Button size="large" variant="primary">
              Read the Security Audit Report
            </Button>
          </Card>

          <Card title="Performance Testing" to="https://dev.to/ripplexdev/xls-0075d-permission-delegation-performance-test-report-3jmm">
            <p>
            The performance testing report to assess the performance implications of the feature.
            </p>
            <Button size="large" variant="primary">
              Read the Perf Testing Report
            </Button>
          </Card>

          <Card title="QA Test Report" to="https://dev.to/ripplexdev/account-permission-delegation-qa-test-report-3j69">
            <p>
            The QA Test Report presents results of QA testing performed on the feature across rippled and Clio servers.
            </p>
            <Button size="large" variant="primary">
              Read the QA Testing Report
            </Button>
          </Card>
        </Cards>

      </LandingContainer>
    </LandingLayout>
  );
}
