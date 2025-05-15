import * as React from 'react';
import { 
  LandingContainer, 
  LandingLayout, 
  ButtonToXRPL,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-70 Credentials',
    description: "Learn how credentials help manage authorization and compliance requirements on XRPL, while respecting privacy and decentralization." }
};

export default function Page() {
  const keyDates = [
    { date: "Sep 11, 2024", event: "XLS Spec Review Complete" },
    { date: "Nov 25, 2024", event: "Feature in rippled 2.3.0" },
    { date: "Nov 26, 2024", event: "Open for voting" },
    { date: "TBA", event: "Obtained ≥ 80% validators support" },
    { date: "TBA", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-0070 Credentials"
          subtitle="A W3C-aligned framework for handling on-chain authorization."
        />

        <FeatureContent 
          description="Credentials provide a set of tools for managing authorization and compliance requirements on the XRP Ledger, while respecting privacy and decentralization."
          keyDates={keyDates}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0070-credentials"
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
            to="https://xrpl.org/docs/concepts/decentralized-storage/credentials"
          >
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <ButtonToXRPL>Read the Docs</ButtonToXRPL>
          </Card>

          <Card
            title="Blog"
            to="https://www.idos.network/blog/debate-contribution-xrpl-credentials-are-a-game-changer?ref=twitter"
          >
            <p>
              Read how this feature provides a straightforward, W3C-aligned framework for handling on-chain authorization, and why it matters to institutions.
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
