import * as React from "react";
import {
  LandingContainer,
  LandingLayout,
  ButtonToXRPL,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { AmendmentTracker } from "../../components/AmendmentTracker";
import { Button } from "@redocly/theme";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/Cards/Cards";

export const frontmatter = {
  seo: {
    title: "XLS-85 Token Escrow",
    description:
      "Learn how trustline balances are enabled for escrows.",
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
          title="XLS-0085 Token Escrow"
          subtitle="Token escrow supports both XRP and tokenized assets."
        />

        <FeatureContent 
          description="Token escrow supports both XRP and tokenized assets."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="138B968F25822EFBF54C00F97031221C47B1EAB8321D93C7C2AEAF85F04EC5DF"
          xlsSpecDate="2025-02-26"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0085d-token-escrow"
          >
            <p>
              Technical spec for the feature outlining requirements, design,
              and implementation details.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Documentation" to="https://xrpl.org/docs/concepts/payment-types/escrow">
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <ButtonToXRPL>Read the Docs</ButtonToXRPL>
          </Card>
          
          <Card title="Blog" to="https://dev.to/dangell7/xrpl-token-escrow-features-benefits-and-getting-started-2ogi"> 
            <p>An overview of the feature and why it matters to institutional issuers, explained in our blog post.</p>
            <Button size="large" variant="primary">
              Read the Blog
            </Button>
          </Card> 
        </Cards>
        
       <Cards columns={2}>
         <Card title="Security Audit" to="https://dev.to/ripplexdev/token-escrow-security-audit-findings-39hn">
            <p>The security audit performed by third-party security experts, including a link to the full, detailed security audit report.
            </p>
            <Button size="large" variant="primary">
            Read the Security Audit Report
            </Button>
          </Card>        
         <Card title="QA Test Report" to="https://dev.to/ripplexdev/token-escrow-qa-test-report-306i">
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
