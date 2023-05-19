import * as React from 'react';

import { H1, H2 } from '@theme/components/Typography';
import { Button } from '@theme/components/Button';
import { useTranslate } from '@portal/hooks';

import { Box, FlexSection, Flex, Jumbotron } from '@theme/ui';
import { WideTile } from '@theme/components/Tiles';

import { Header1, Header2, TileText } from './components';

import heroImage from './images/heroimg.png';

export const frontmatter = {
  seo: {
    title: 'Open Source Projects',
  },
};

export default function () {
  const { translate } = useTranslate();
  return (
    <>
      <Jumbotron
        bgImage={heroImage}
        textColor="white"
        height="350px"
        width="3440px"
        pb="8.5em"
        flexWrap="no-wrap"
        style={{ flexWrap: 'nowrap' }}
      >
        <Header1>{translate('page-heading', 'Open Source Projects')}</Header1>
        <Header2>Explore open source projects currently in development.</Header2>
      </Jumbotron>

      <Box p={{ _: '8px', sm: '12px', md: '16px', lg: '24px' }}>
        <FlexSection justifyContent="space-around" flexWrap="wrap" margin="auto">
          <WideTile
            to="/docs/xls-38d-cross-chain-bridge/cross-chain-bridges"
            textAlign="left"
            header="Cross-chain Bridges"
            style={{ height: '284px' }}
          >
            <TileText>
              Cross-chain bridges for the XRP Ledger enable value in the form of XRP and other tokens (IOUs) to move
              efficiently between blockchains.
            </TileText>
            <Flex pt={5}>
              <Button
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  background: '#005BCC',
                }}
              >
                Go to Docs
              </Button>
            </Flex>
          </WideTile>
          <WideTile
            to="/docs/evm-sidechain/intro-to-evm-sidechain"
            textAlign="left"
            header="EVM Sidechain"
            disableArrow
            style={{ height: '284px' }}
          >
            <TileText>
              The Ethereum Virtual Machine (EVM) compatible XRP Ledger sidechain is a secure and fast public blockchain
              that brings all kinds of web3 applications to the XRP Ledger community.
            </TileText>
            <Flex pt={5}>
              <Button
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  background: '#005BCC',
                }}
              >
                Go to Docs
              </Button>
            </Flex>
          </WideTile>
          <WideTile
            to="/docs/xls-30d-amm/amm-uc"
            textAlign="left"
            header="Automated Market Maker(AMM)"
            disableArrow
            style={{ height: '284px' }}
          >
            <TileText>
              Automated Market Maker(AMM) for the XRP Ledger is a protocol for the Decentralized Exchange (DEX) that
              prices assets through an algorithm, rather than using an order book like a traditional exchange.
            </TileText>
            <Flex pt={5}>
              <Button
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  background: '#005BCC',
                }}
              >
                Go to Docs
              </Button>
            </Flex>
          </WideTile>
        </FlexSection>
      </Box>
    </>
  );
}
