import * as React from 'react';
import { 
  LandingContainer, 
  LandingLayout, 
  ButtonToXRPL,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { AmendmentTracker } from "../../components/AmendmentTracker";
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
    { date: "Sep 10, 2024", event: "XLS Spec Live" },
    { date: "Nov 6, 2024", event: "Available to Test on Devnet" },
    { date: "Nov 25, 2024 (2.3.0)", event: "Open for Voting on Mainnet" },
    { date: "Enabled Sep 3, 2025", event: "Vote Consensus" }
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
            title="Concepts"
            to="https://xrpl.org/docs/concepts/decentralized-storage/credentials"
          >
            <p>
              Documentation on the feature, including how it works and why.
            </p>
            <ButtonToXRPL>Read the Concepts</ButtonToXRPL>
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
          <Card
            title="Tutorials"
            to="https://xrpl.org/docs/tutorials/compliance-features/manage-credentials"
          >
            <p>
              Follow step-by-step tutorials to start building.
            </p>
            <ButtonToXRPL>Read the Tutorials</ButtonToXRPL>
          </Card>
          <Card
            title="Security Audit"
            to="https://www.halborn.com/audits/ripple/ripple---smart-contract-audit---credentials-c092b3"
          >
            <p>
              The security audit performed by third-party security experts, including a link to the full, detailed security audit report.  
            </p>
            <Button size="large" variant="primary">
              Read the Security Audit Report
            </Button>
          </Card>
        </Cards>        
      </LandingContainer>
    </LandingLayout>
  );
}
