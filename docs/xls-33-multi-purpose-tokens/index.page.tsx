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
    title: "XLS-33 Multi-Purpose Tokens",
    description:
      "Learn how Multi-purpose Tokens (MPTs) offer flexibility and functionality that spans use cases between fungible and non-fungible tokens.",
  },
};

export default function Page() {
  const [keyDates, setKeyDates] = React.useState([
    { date: "🔄 Loading...", event: "XLS Spec Live" },
    { date: "🔄 Loading...", event: "Available to Test on Devnet" },
    { date: "🔄 Loading...", event: "Open for Voting on Mainnet" },
    { date: "🔄 Loading...", event: "Vote Consensus" },
  ]);

  const handleKeyDatesUpdate = React.useCallback((newKeyDates: any[]) => {
    setKeyDates(newKeyDates);
  }, []);

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

        <AmendmentTracker 
          amendmentId="950AE2EA4654E47F04AA8739C0B214E242097E802FD372D24047A89AB1F5EC38"
          xlsSpecDate="2023-06-22"
          onKeyDatesUpdate={handleKeyDatesUpdate}
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
