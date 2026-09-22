import * as React from "react";
import {
  LandingContainer,
  LandingLayout,
  FeatureHeader,
  FeatureContent,
  ButtonToXRPL
} from "../../@theme/components/landing";
import { AmendmentTracker } from "../../@theme/components/AmendmentTracker";
import { Button } from "@redocly/theme";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/Cards/Cards";

export const frontmatter = {
  seo: {
    title: "Lending Protocol V1.1",
    description: "Extends Single Asset Vaults and the Lending Protocol with closed-ended vaults and cash-basis accounting."
  },
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
          title="Lending Protocol V1.1"
          subtitle="Extends Single Asset Vaults and the Lending Protocol with closed-ended vaults and cash-basis accounting."
        />

        <FeatureContent
          description="The LendingProtocolV1_1 amendment extends Single Asset Vaults and the Lending Protocol in two ways. It restricts loans to a new type of closed-ended vault, which has defined subscription, investment, and redemption phases. Newly created vaults also utilize an updated cash-basis accounting model instead of the whole-life model implemented by the original Single Asset Vaults amendment."
          keyDates={keyDates}
        />

        <AmendmentTracker
          amendmentId="A360E2BFD775A5B0DCE1C36C16DF31B72735A57584FD163655D2F9564F8E7AC8"
          xlsSpecDate="2026-09-10"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card title="XLS-65 Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0065-single-asset-vault">
            <p>
              Technical spec for Single Asset Vaults outlining requirements, design,
              and implementation details. Updated for LendingProtocolV1_1.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>
          <Card title="XLS-66 Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0066-lending-protocol">
            <p>
              Technical spec for the Lending Protocol outlining requirements, design,
              and implementation details. Updated for LendingProtocolV1_1.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>
          <Card title="Closed-Ended Vaults" to="/docs/lending-protocol-v1-1/closed-ended-vaults">
            <p>
              Learn how a closed-ended vault moves through its Subscription, Investment,
              and Redemption phases.
            </p>
            <Button size="large" variant="primary">
              Read the Concept
            </Button>
          </Card>
          <Card title="Cash-Basis Accounting" to="/docs/lending-protocol-v1-1/cash-basis-accounting">
            <p>
              Learn how vaults and loans recognize interest income under the new cash-basis accounting model.
            </p>
            <Button size="large" variant="primary">
              Read the Concept
            </Button>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
