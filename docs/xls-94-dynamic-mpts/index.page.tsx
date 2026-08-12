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
    title: 'XLS-94 Dynamic MPTs',
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
          title="XLS-94 Dynamic MPTs"
          subtitle="Issue Multi-Purpose Tokens with modifiable properties."
        />

        <FeatureContent
          description="The Dynamic MPT amendment extends Multi-Purpose Tokens to allow issuers to designate specific properties as mutable during token creation, enabling selected attributes to be updated later as business needs change."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="58E92F338758479C06084E1B6BA366BAD8F75E5329A7F0EEAFFFDA51E5106B7F"
          xlsSpecDate="2025-09-06"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card title="XLS Spec" to="https://xls.xrpl.org/xls/XLS-0094-dynamic-MPT.html">
            <p>Technical spec for the feature outlining requirements, design, and implementation details, currently in review.</p>
            <Button size="large" variant="primary">
              Read the XLS Spec 
            </Button>
          </Card>

          <Card title="Concepts" to="https://xrpl.org/docs/concepts/tokens/fungible-tokens/mutable-mpts">
            <p>Documentation on the feature, including how it works and why.</p>
            <ButtonToXRPL>
              Read the Concepts
            </ButtonToXRPL>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
