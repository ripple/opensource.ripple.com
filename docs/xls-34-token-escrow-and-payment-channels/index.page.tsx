import * as React from "react";
import {
  LandingContainer,
  LandingLayout,
  ButtonToXRPL,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { Button } from "@redocly/theme";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/Cards/Cards";

export const frontmatter = {
  seo: {
    title: "XLS-34 Token Enabled Escrows and Payment Channels",
    description:
      "Learn how trustline balances are enabled for escrows and payment channels.",
  },
};

export default function Page() {
  const keyDates = [
    { date: "Feb 26, 2025", event: "XLS Spec Review Complete" },
    { date: "Jun 24, 2025", event: "Feature in rippled 2.5.0" },
    { date: "Jun 24, 2025", event: "Open for voting" },
    { date: "TBA", event: "Obtained ≥ 80% validators support" },
    { date: "TBA", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-0034 Token Escrow and Payment Channels"
          subtitle="Token escrow and payment channels support both XRP and tokenized assets."
        />

        <FeatureContent 
          description="Token Escrow and Payment Channels support both XRP and tokenized assets."
          keyDates={keyDates}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0034d-paychan-escrow-for-tokens/"
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
            to="https://xrpl.org/docs/concepts/tokens/fungible-tokens"
          >
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <ButtonToXRPL>Read the Docs</ButtonToXRPL>
          </Card>
          <Card
            title="Security Audit"
            to="https://dev.to/ripplexdev/token-escrow-security-audit-findings-39hn"
          >
            <p>
            The security audit performed by third-party security experts, including a link to the full, detailed security audit report.
            </p>
            <Button size="large" variant="primary">
            Read the Report
            </Button>
          </Card> 
        </Cards>
        
        {/* <Cards columns={2}>
          <Card
            title="Blog"
            to="https://xrpl.org/blog/feature-overview-token-escrow-and-payment-channels.html"
          >
            <p>
              An overview of the feature and why it matters to developers, explained in our blog post.
            </p>
            <Button size="large" variant="primary">
              Read the Blog
            </Button>
          </Card>         
          <Card
            title="Use Cases"
            to="https://xrpl.org/use-cases/token-escrow-and-payment-channels.html"
          >
            <p>
              Explore how the feature can be used in real-world scenarios.
            </p>
            <ButtonToXRPL>Learn more</ButtonToXRPL>
          </Card>
        </Cards>    */}
      </LandingContainer>
    </LandingLayout>
  );
}
