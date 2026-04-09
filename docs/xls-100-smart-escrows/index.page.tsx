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
    title: 'XLS-100 Smart Escrows',
    description: "Smart Escrows use a programmability layer to define custom release conditions."
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
          title="XLS-100 Smart Escrows"
          subtitle="Create escrows with custom, programmable release conditions."
        />

        <FeatureContent
          description="The Smart Escrows amendment introduces a new programmability layer to the XRPL, powered by a WebAssembly (WASM) engine. Developers can write custom functions that control when an escrow can be finished."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="N/A"
          xlsSpecDate="2025-09-26"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card title="XLS Spec" to="https://xls.xrpl.org/xls/XLS-0100-smart-escrows.html">
            <p>Technical spec for the feature outlining requirements, design, and implementation details, currently in review.</p>
            <Button size="large" variant="primary">
              Read the XLS Spec 
            </Button>
          </Card>

          <Card title="Docs" to="/docs/xls-100-smart-escrows/concepts/programmability">
            <p>Documentation on the feature, including how it works and why.</p>
            <Button size="large" variant="primary">
              Read the Docs
            </Button>
          </Card>

          <Card title="WASM Developer Docs" to="https://ripple.github.io/xrpl-wasm-stdlib/xrpl_wasm_stdlib/guide/index.html">
            <p>Docs for developing custom smart functions in Rust using the XRPL WASM standard library.</p>
            <Button size="large" variant="primary">
              Read WASM Developer Docs
            </Button>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
