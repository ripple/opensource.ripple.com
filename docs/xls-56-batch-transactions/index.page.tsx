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
    title: 'XLS-56 Batch',
    description: "Learn how to submit up to 8 transactions atomically." }
};

export default function Page() {
  const keyDates = [
    { date: "Jan 23, 2025", event: "XLS Spec Review Complete" },
    { date: "Jun 24, 2025", event: "Feature in rippled 2.5.0" },
    { date: "Jun 24, 2025", event: "Open for voting" },
    { date: "TBA", event: "Obtained ≥ 80% validators support" },
    { date: "TBA", event: "Enabled on Mainnet" },
  ];

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-0056 Batch"
          subtitle="Submit up to 8 transactions that are processed atomically."
        />

        <FeatureContent 
          description="Batch lets you package multiple transactions together and execute them as a single unit. It eliminates the risk of partial completion and unexpected outcomes, giving you a more reliable and predictable experience for complex operations."
          keyDates={keyDates}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0056d-batch"
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
            to="https://xrpl.org/docs/concepts/transactions/batch-transactions"
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
