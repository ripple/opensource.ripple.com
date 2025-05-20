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
    { date: "Jun 22, 2023", event: "XLS Spec Review Complete" },
    { date: "Nov 25, 2024", event: "Feature in rippled 2.3.0" },
    { date: "Nov 26, 2024", event: "Open for voting" },
    { date: "TBA", event: "Obtained ≥ 80% validators support" },
    { date: "TBA", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-0033 Multi-Purpose Tokens"
          subtitle="A more compact and flexible type of fungible token."
        />

        <FeatureContent 
          description="Multi-purpose Tokens (MPTs) offer flexibility and functionality that spans use cases between fungible and non-fungible tokens, thereby facilitating tokenization of real world assets, compliance controls, and developer accessibility."
          keyDates={keyDates}
        />

        <Cards columns={2}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0033-multi-purpose-tokens"
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
            to="https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens"
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
            to="https://dev.to/ripplexdev/multi-purpose-tokens-mpt-chronology-and-how-to-test-on-devnet-19nj"
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
            to="https://xrpl.org/docs/use-cases/tokenization/creating-an-asset-backed-multi-purpose-token"
          >
            <p>
              Explore how the feature can be used in real-world scenarios.
            </p>
            <ButtonToXRPL>Learn more</ButtonToXRPL>
          </Card>
        </Cards>   
      </LandingContainer>
    </LandingLayout>
  );
}
