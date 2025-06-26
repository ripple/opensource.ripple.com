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
    title: 'XLS-69 Simulate',
    description: "Learn how to execute a dry run of any transaction type." }
};

export default function Page() {
  const keyDates = [
    { date: "Aug 01, 2024", event: "XLS Spec Review Complete" },
    { date: "Mar 06, 2025", event: "Feature in rippled 2.4.0" },
    { date: "Mar 06, 2025", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-0069 Simulate"
          subtitle="Execute a dry run of any transaction type."
        />

        <FeatureContent 
          description="Simulate is a new RPC method that applies a transaction, returning the results and metadata, without ever sending it to the network for confirmation or inclusion in a ledger."
          keyDates={keyDates}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0069-simulate"
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
            to="https://xrpl.org/docs/references/http-websocket-apis/public-api-methods/transaction-methods/simulate"
          >
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <ButtonToXRPL>Read the Docs</ButtonToXRPL>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
