import * as React from 'react';

import {
  LandingLayout,
  Button,
  Box,
  FlexSection,
  Jumbotron,
  WideTile,
  NavBar,
} from '@redocly/portal-legacy-ui';
import { Header1, Header2, TileText } from "./components";

import heroImage from './images/heroimg.png';


export const frontmatter = {
  "title": "Open Source Projects"
};

export default function Page() {
  return (
    <LandingLayout>
      <Jumbotron 
        pb="8.5em"
        bgImage={heroImage}
        height="350px"
        width="3440px"
        bgColor="white"
        textColor="black"
      >
      
        <NavBar location={props.location} standalone={false} />
        <Header1>Open Source Projects</Header1>
        <Header2>Explore open source projects currently in development.</Header2>
      </Jumbotron>
      
      <Box p={{ _: "8px", sm: "12px", md: "16px", lg: "24px" }}>
        <FlexSection justifyContent="space-around" flexWrap="wrap">  
          <WideTile 
            style={{ height: "284px"}}
            to="docs/xls-33d-multi-purpose-tokens/index.md"
            header="Multi-purpose Tokens"
            color="#141A1F"
            textAlign="left"
            disableArrow
          >
            <TileText>
              Multi-purpose tokens (MPTs) are a more compact and flexible type of fungible token.
            </TileText>
            <div style={{ bottom: "36px", position: "absolute"}}>
              <Button  style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#FFFFFF",
                  background: "#005BCC",
                }}>
                Go to Docs
              </Button>
            </div>
          </WideTile>
          <WideTile 
            style={{ height: "284px"}}
            to="docs/xls-56d-batch-transactions/index.md"
            header="Batch Transactions"
            color="#141A1F"
            textAlign="left"
            disableArrow
          >
            <TileText>
              Prepare and submit up to 8 transactions in a single batch.
            </TileText>
            <div style={{ bottom: "36px", position: "absolute"}}>
              <Button  style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#FFFFFF",
                  background: "#005BCC",
                }}>
                Go to Docs
              </Button>
            </div>
          </WideTile> 
        </FlexSection>
      </Box>
    </LandingLayout>
  );
}
