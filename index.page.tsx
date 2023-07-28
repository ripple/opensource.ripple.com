import * as React from 'react';
import styled from 'styled-components';
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
        height="275px"
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
          <StyledWideTile
            to="/docs/xls-38d-cross-chain-bridge/cross-chain-bridges"
            textAlign="left"
            header="Cross-chain Bridges"
            style={{ height: '284px' }}
          >
            <Flex flex="1" flexDirection="column" alignItems="flex-start" justifyContent="space-between">
              <TileText>
                Cross-chain bridges for the XRP Ledger enable value in the form of XRP and other tokens (IOUs) to move
                efficiently between blockchains.
              </TileText>

              <Button
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  background: '#005BCC',
                  border: 'none',
                }}
              >
                Go to Docs
              </Button>
            </Flex>
          </StyledWideTile>
          <StyledWideTile
            to="/docs/evm-sidechain/intro-to-evm-sidechain"
            textAlign="left"
            header="EVM Sidechain"
            disableArrow
            style={{ height: '284px' }}
            className="wide-tile"
          >
            <Flex flex="1" flexDirection="column" alignItems="flex-start" justifyContent="space-between">
              <TileText>
                The Ethereum Virtual Machine (EVM) compatible XRP Ledger sidechain is a secure and fast public
                blockchain that brings all kinds of web3 applications to the XRP Ledger community.
              </TileText>

              <Button
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  background: '#005BCC',
                  border: 'none',
                }}
              >
                Go to Docs
              </Button>
            </Flex>
          </StyledWideTile>
          <StyledWideTile
            to="/docs/xls-30d-amm/amm-uc"
            textAlign="left"
            header="Automated Market Maker(AMM)"
            disableArrow
            style={{ height: '284px' }}
          >
            <Flex flex="1" flexDirection="column" alignItems="flex-start" justifyContent="space-between">
              <TileText>
                Automated Market Maker(AMM) for the XRP Ledger is a protocol for the Decentralized Exchange (DEX) that
                prices assets through an algorithm, rather than using an order book like a traditional exchange.
              </TileText>

              <Button
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  background: '#005BCC',
                  border: 'none',
                }}
              >
                Go to Docs
              </Button>
            </Flex>
          </StyledWideTile>
        </FlexSection>
      </Box>
    </>
  );
}

const StyledWideTile = styled(WideTile)`
  &::before {
    display: none;
  }

  padding-right: 32px;
  display: flex;
  flex-direction: column;
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;

    > span {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  ${Button} {
    margin: 20px 0 0 0;
  }
`;
