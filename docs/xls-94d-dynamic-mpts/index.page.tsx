import * as React from 'react';
import { 
  LandingContainer, 
  LandingLayout, 
//   ButtonToXRPL, // TODO: Uncomment when we move docs to xrpl.org
  FeatureHeader,
  FeatureContent
} from "../../components/landing";

import { AmendmentTracker } from "../../components/AmendmentTracker";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'XLS-94d Dynamic MPTs',
    description: "Dynamic Multi-Purpose Tokens (MPTs) allow issuers to create and update MPTs with dynamic metadata."
  }
};

export default function Page() {
  const KEY_DATE_EVENTS = [
    "XLS Spec Live",
    "Available to Test on Devnet",
    "Open for Voting on Mainnet", 
    "Vote Consensus"
  ];

  const [keyDates, setKeyDates] = React.useState(
    KEY_DATE_EVENTS.map(event => ({ date: "🔄 Loading...", event }))
  );

  const handleKeyDatesUpdate = React.useCallback((newKeyDates: any[]) => {
    setKeyDates(newKeyDates);
  }, []);

  return (
    <LandingLayout>
      <LandingContainer>
        <FeatureHeader 
          title="XLS-94d Dynamic MPTs"
          subtitle="Issue Multi-Purpose Tokens with modifiable properties."
        />

        <FeatureContent 
          description="Dynamic Multi-Purpose Tokens (MPTs) let you create digital assets that can evolve over time. Unlike standard MPTs that can't be changed after creation, Dynamic MPTs allow you to choose which specific properties can be updated later to adapt to changing business needs."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="N/A"
          xlsSpecDate="2025-09-06"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card title="XLS Spec" to="https://xls.xrpl.org/xls/XLS-0094-dynamic-MPT.html">
            <p>Technical spec for the feature outlining requirements, design, and implementation details, currently in review.</p>
            <Button size="large" variant="primary">
              Read the XLS Draft
            </Button>
          </Card>

          <Card title="Docs" to="/docs/xls-94d-dynamic-mpts/dynamic-mpts">
            <p>Documentation on the feature, including how it works and why.</p>
            <Button size="large" variant="primary">
              Read the Docs
            </Button>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
