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
  const [keyDates, setKeyDates] = React.useState([
    { date: "🔄 Loading...", event: "XLS Spec Live" },
    { date: "🔄 Loading...", event: "Available to Test on Devnet" },
    { date: "🔄 Loading...", event: "Open for Voting on Mainnet" },
    { date: "🔄 Loading...", event: "Voting Status" },
  ]);

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
          amendmentId="AE6AB9028EEB7299EBB03C7CBCC3F2A4F5FBE00EA28B8223AA3118A0B436C1C5"
          xlsSpecDate="2025-05-09"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0075d-permission-delegation"
          >
            <p>
              Technical spec for the feature outlining requirements, design,
              and implementation details.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Documentation" to="./docs/xls-75d-permission-delegation/concepts/permission-delegation/">
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <ButtonToXRPL>
              Read the Docs
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
        </Cards>

        <Cards columns={2}>
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
        </Cards>

      </LandingContainer>
    </LandingLayout>
  );
}
