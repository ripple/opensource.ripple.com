import * as React from 'react';
import { Header1, Header2, LandingContainer, LandingLayout, Jumbotron, ButtonToXRPL } from "./components/landing";
import { Button } from "@redocly/theme";
import { Card } from '@redocly/theme/markdoc/components/Cards/Card';
import { Cards } from '@redocly/theme/markdoc/components/Cards/Cards';

export const frontmatter = {
  seo: {
    title: 'Ripple Open Source Projects',
    description: "Ripple Open Source is a preview of open-source projects Ripple is building for the Internet of Value.",
  }
};

export default function Page() {
  return (
    <LandingLayout>
      <Jumbotron bgImage={require('images/heroimg.png')}>
      
        <Header1>Open Source Projects</Header1>
        <Header2>Explore open source projects currently in development.</Header2>
      </Jumbotron>
     
      <LandingContainer>
        <Cards columns={2}>

          <Card title="Batch transactions" to="docs/xls-56-batch-transactions/">
            <p>Prepare and submit up to 8 transactions in a single batch.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Lending Protocol" to="docs/xls-66-lending-protocol/">
            <p>The XRPL-native lending protocol offers on-chain, fixed-term loans, utilizing pooled funds from single-asset vaults.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Single Asset Vault" to="docs/xls-65-single-asset-vault/">
            <p>A single asset vault is an XRP Ledger primitive that aggregates assets from multiple depositors and makes them available to other on-chain protocols.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Permission Delegation" to="docs/xls-75-permission-delegation/">
            <p>XRPL accounts can delegate specific transaction permissions to other accounts, enhancing flexibility and enabling use cases such as implementing role-based access control.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Permissioned DEXes" to="docs/xls-81-permissioned-dexes">
            <p>Permissioned DEXes use Permissioned Domains to enable trading tokens in controlled environments within the XRPL's decentralized exchange.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Dynamic MPTs" to="docs/xls-94-dynamic-mpts">
            <p>Dynamic Multi-Purpose Tokens (MPTs) allow some properties of an MPTokenIssuance to be declared as mutable, so the issuer can change them later.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card> 

          <Card title="Confidential Transfers" to="docs/xls-96-confidential-transfers">
            <p>Keep MPT balances and transaction amounts private on the public ledger, while enabling MPT issuers and designated auditors to decrypt these values offchain.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Smart Escrows" to="docs/xls-100-smart-escrows">
            <p>Create escrows with custom, programmable release conditions.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="Sponsored Fees and Reserves" to="docs/xls-68-sponsored-fees-and-reserves/">
            <p>Enable sponsors to pay transaction fees and reserves on behalf of other accounts, reducing barriers to entry on the XRP Ledger.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>

          <Card title="MPT DEX Integration" to="docs/xls-82-mpt-dex">
            <p>Trade Multi-Purpose Tokens on the XRP Ledger's decentralized exchange across offers, payments, AMM, and checks.</p>
            <Button size="large" variant="primary">
              Learn more
            </Button>
          </Card>
        </Cards>
      </LandingContainer>
    </LandingLayout>
  );
}
