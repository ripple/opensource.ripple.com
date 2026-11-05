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
    title: "Lending Protocol V1.2",
    description: "Extends Single Asset Vaults and the Lending Protocol with fixed-precision accounting, two-step loan creation, private loan brokers, early-exit fees, and new vault deposit controls."
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
          title="Lending Protocol V1.2"
          subtitle="Extends Single Asset Vaults and the Lending Protocol with fixed-precision accounting, two-step loan creation, private loan brokers, early-exit fees, and new vault deposit controls."
        />

        <FeatureContent
          description="The LendingProtocolV1_2 amendment builds on LendingProtocolV1_1. New vaults track amounts at a fixed precision that stays the same for the life of the vault. Loan brokers can propose loans that borrowers accept on-chain, and can restrict borrowing to holders of credentials accepted by a permissioned domain. Closed-ended vaults can charge an early-exit fee to allow withdrawals during the investment phase, and vault owners can donate assets to a vault or block new deposits. Lending and vault transactions can also be included in batch transactions."
          keyDates={keyDates}
        />

        <AmendmentTracker
          amendmentId="5AE2B8F0B54FFB81E7B27BD7005C8401D9555E4F399369CA22D041F22815C824"
          xlsSpecDate="2026-10-01"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card title="XLS-65 Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0065-single-asset-vault">
            <p>
              Technical spec for Single Asset Vaults outlining requirements, design,
              and implementation details. Updated for LendingProtocolV1_2.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>
          <Card title="XLS-66 Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0066-lending-protocol">
            <p>
              Technical spec for the Lending Protocol outlining requirements, design,
              and implementation details. Updated for LendingProtocolV1_2.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>
          <Card title="Fixed-Precision Vaults" to="/docs/lending-protocol-v1-2/fixed-precision-vaults">
            <p>
              Learn how new vaults track amounts at a single, fixed precision for their entire lifetime.
            </p>
            <Button size="large" variant="primary">
              Read the Concept
            </Button>
          </Card>
          <Card title="Two-Step Loan Creation" to="/docs/lending-protocol-v1-2/two-step-loan-creation">
            <p>
              Learn how a loan broker proposes a loan and the borrower accepts it with a separate transaction.
            </p>
            <Button size="large" variant="primary">
              Read the Concept
            </Button>
          </Card>
          <Card title="Private Loan Brokers" to="/docs/lending-protocol-v1-2/private-loan-brokers">
            <p>
              Learn how to restrict loans to borrowers with credentials accepted by a permissioned domain.
            </p>
            <Button size="large" variant="primary">
              Read the Concept
            </Button>
          </Card>
          <Card title="Early-Exit Fees" to="/docs/lending-protocol-v1-2/early-exit-fees">
            <p>
              Learn how closed-ended vaults can allow fee-bearing withdrawals during the investment phase.
            </p>
            <Button size="large" variant="primary">
              Read the Concept
            </Button>
          </Card>
          <Card title="Vault Donations and Deposit Blocking" to="/docs/lending-protocol-v1-2/vault-donations-and-deposit-blocking">
            <p>
              Learn how vault owners can add assets without minting shares, or pause new deposits.
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
