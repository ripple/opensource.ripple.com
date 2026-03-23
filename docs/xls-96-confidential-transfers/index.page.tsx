import * as React from "react";
import {
  LandingContainer,
  LandingLayout,
  ButtonToXRPL,
  FeatureHeader,
  FeatureContent
} from "../../components/landing";
import { AmendmentTracker } from "../../components/AmendmentTracker";
import { Button } from "@redocly/theme";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/Cards/Cards";

export const frontmatter = {
  seo: {
    title: "XLS-96 Confidential Transfers",
    description:
      "Learn how Confidential Transfers keep MPT balances and transaction amounts private while maintaining public auditability.",
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
          title="XLS-96 Confidential Transfers"
          subtitle="Private auditable transactions for Multi-Purpose Tokens (MPTs)."
        />

        <FeatureContent
          description={
            <>
              The Confidential Transfers feature provides institutional-grade privacy for Multi-Purpose Tokens using advanced cryptography (EC-ElGamal and ZKPs).
              Individual balances and transfer amounts remain shielded from the public ledger while maintaining compliance mechanisms for authorized parties (issuers, auditors, or designated entities) to verify total supply and meet regulatory obligations.
              <br /><br />
              <strong>Confidential Devnet:</strong> https://confidential.devnet.rippletest.net
              <br />
              <strong>Devnet Faucet:</strong> https://confidential-faucet.devnet.rippletest.net
            </>
          }
          keyDates={keyDates}
        />

        <AmendmentTracker
          amendmentId="2110E4A19966E2EF517C0A8C56A5F35099D7665B0BB89D7B126B30D50B86AAD5"
          xlsSpecDate="2026-01-15"
          devnetDate="2025-12-01"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={3}>
          <Card
            title="XLS Spec"
            to="https://xls.xrpl.org/xls/XLS-0096-confidential-mpt.html"
          >
            <p>
              Technical spec for the feature outlining requirements, design,
              and implementation details.
            </p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Documentation" to="/docs/xls-96-confidential-transfers/concepts/confidential-transfers">
            <p>
              Explore key concepts, find detailed references, and follow
              step-by-step tutorials.
            </p>
            <Button size="large" variant="primary">
              Read the Docs
            </Button>
          </Card>

        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}

