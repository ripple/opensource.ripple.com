import * as React from "react";
import {
  LandingContainer,
  LandingLayout,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { Button } from "@redocly/theme";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/Cards/Cards";

export const frontmatter = {
  seo: {
    title: "XLS-65d Single Asset Vault",
    description: "A single asset vault aggregates assets from multiple depositors and makes them available to other on-chain protocols."
  },
};

export default function Page() {
  const keyDates = [
    { date: "Feb 28, 2025", event: "XLS Spec Review Complete" },
    { date: "TBA", event: "Feature in rippled" },
    { date: "TBA", event: "Open for voting" },
    { date: "TBA", event: "Obtained ≥ 80% validators support" },
    { date: "TBA", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-65d Single Asset Vault"
          subtitle="An on-chain primitive for aggregating assets from one or more depositors."
        />

        <FeatureContent 
          description="A single asset vault is an XRP Ledger primitive that aggregates assets from multiple depositors and makes them available to other on-chain protocols, such as a Lending Protocol. A vault asset can be XRP, a Fungible Token, or an MPT (Multi-Purpose Token)."
          keyDates={keyDates}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0065d-single-asset-vault"
          >
            <p>
              Technical spec for the feature outlining requirements, design,
              and implementation details.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Documentation" to="/docs/xls-65d-single-asset-vault/concepts/single-asset-vault">
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <Button size="large" variant="primary">
              Read the Docs
            </Button>
          </Card>

          <Card
            title="Blog"
            to="https://dev.to/ripplexdev/xrp-ledger-lending-protocol-2pla"
          >
            <p>
              An overview of the feature and why it matters to developers, explained in our blog post.
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
