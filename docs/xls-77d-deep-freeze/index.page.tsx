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
    title: "XLS-77 Deep Freeze",
    description:
      "Learn how deep freeze helps prevent token misuse by frozen account holders.",
  },
};

export default function Page() {
  const keyDates = [
    { date: "Dec 17, 2024", event: "XLS Spec Review Complete" },
    { date: "Mar 06, 2025", event: "Feature in rippled 2.4.0" },
    { date: "Mar 06, 2025", event: "Open for voting" },
    { date: "Apr 20, 2025", event: "Obtained ≥ 80% validators support" },
    { date: "May 04, 2025", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-0077 Deep Freeze"
          subtitle="Prevent token misuse by frozen account holders."
        />

        <FeatureContent 
          description="Deep freeze lets token issuers on the XRP Ledger prevent token misuse by frozen account holders. It enhances interactions between frozen assets and payments, ensuring that frozen token holders cannot receive funds until or unless their trust line is unfrozen. These changes enable token issuers to more easily comply with regulations on the XRPL."
          keyDates={keyDates}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0077-deep-freeze"
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
            to="https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains"
          >
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <ButtonToXRPL>Read the Docs</ButtonToXRPL>
          </Card>

          <Card
            title="Blog"
            to="https://dev.to/ripplexdev/deep-freeze-strengthening-institutional-asset-control-on-xrpl-2j2a"
          >
            <p>
              An overview of the feature and why it matters to institutional
              issuers, explained in our blog post.
            </p>
            <Button size="large" variant="primary">
              Read the Blog
            </Button>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
