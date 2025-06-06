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
    title: "XLS-33 Multi-Purpose Tokens",
    description:
      "Learn how Multi-purpose Tokens (MPTs) offer flexibility and functionality that spans use cases between fungible and non-fungible tokens.",
  },
};

export default function Page() {
  const keyDates = [
    { date: "TBA", event: "XLS Spec Review Complete" },
    { date: "TBA", event: "Feature in rippled 2.3.0" },
    { date: "TBA", event: "Open for voting" },
    { date: "TBA", event: "Obtained ≥ 80% validators support" },
    { date: "TBA", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-0034d Token Escrow and Payment Channels"
          subtitle="Token escrow and payment channels support both XRP and tokenized assets."
        />

        <FeatureContent 
          description="Token Escrow and Payment Channels support both XRP and tokenized assets."
          keyDates={keyDates}
        />

        <Cards columns={2}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0034d-token-escrow-and-payment-channels"
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
            to="docs/xls-34d-token-escrow-and-payment-channels/token-escrow-payment-channels/"
          >
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <Button size="large" variant="primary">Read the Docs</Button>
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
