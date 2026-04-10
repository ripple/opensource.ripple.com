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
    title: 'XLS-82 MPT DEX Integration',
    description: "Adds Multi-Purpose Token (MPT) support for the XRPL decentralized exchange, including offers, cross-currency payments, checks, and AMM."
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
          title="XLS-82 MPT DEX Integration"
          subtitle="Trade Multi-Purpose Tokens on the XRP Ledger's decentralized exchange."
        />

        <FeatureContent 
          description="The MPT DEX Integration amendment extends the XRPL's decentralized exchange to natively support Multi-Purpose Tokens (MPTs) as a tradeable asset class. MPTs can be paired with XRP, trust line tokens, or other MPTs across existing DEX transactions such as OfferCreate, Payment, AMM, and Checks."
          keyDates={keyDates}
        />

        <AmendmentTracker 
          amendmentId="BE2D87DF21B690ED1497B593FDC013CC04276302380B1BD50A033DCF8DEFB2EB"
          xlsSpecDate="2024-09-19"
          onKeyDatesUpdate={handleKeyDatesUpdate}
        />

        <Cards columns={2}>
          <Card title="XLS Spec" to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0082-mpt-dex">
            <p>Technical spec for the feature outlining requirements, design, and implementation details.</p>
            <Button size="large" variant="primary">
              Read the XLS Spec
            </Button>
          </Card>

          <Card title="Documentation" to="https://xrpl-dev-portal--xls-82-mpt-dex.preview.redocly.app/docs/concepts/tokens/decentralized-exchange">
            <p>Explore key concepts, find detailed references, and follow
              step-by-step tutorials.</p>
            <Button size="large" variant="primary">Read the Docs</Button>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
