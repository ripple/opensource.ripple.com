import * as React from "react";
import styled from "styled-components";
import { Button } from "@redocly/theme";
import {
  LandingLayout,
  LandingContainer,
  GradientJumbotron,
  BetaBadge,
  Header1,
  Header2,
} from "./components/landing";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/Cards/Cards";

export const frontmatter = {
  seo: {
    title: "Institutional DeFi Portal (Beta)",
    description:
      "A Ripple-led portal designed to help institutions explore and evaluate real-world blockchain adoption on the XRP Ledger.",
  },
};

// Minimal custom styling - only what's unique to this page
const HeroHeader1 = styled(Header1)`
  && {
    margin-top: 0 !important;
    margin-bottom: 0.4em !important;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionText = styled.p`
  font-size: 1.125rem;
  line-height: 1.75;
  text-align: center;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  padding: 2rem 0;
`;

const SectionWithBackground = styled(Section)`
  background: #f9fafb;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding-left: calc(50vw - 50%);
  padding-right: calc(50vw - 50%);

  /* Dark mode styles */
  html:not(.light) & {
    background: #1a1a1a;
  }
`;

const JumbotronText = styled.p`
  color: white;
  font-size: 0.875rem;
  margin-top: 1.5rem;
`;

const CardsWithLargerIcons = styled(Cards)`
  /* Increase icon size in cards */
  img[src*=".svg"] {
    width: 36px !important;
    height: 36px !important;
  }
`;

export default function Page() {
  return (
    <LandingLayout>
      <GradientJumbotron>
        <BetaBadge>Beta</BetaBadge>
        <HeroHeader1>Institutional DeFi on the XRP Ledger</HeroHeader1>
        <Header2>
          A Ripple-led portal designed to help institutions explore and evaluate
          real-world blockchain adoption on the XRP Ledger.
        </Header2>
        {/* TODO: Update to actual domain once available */}
        <Button
          size="large"
          variant="primary"
          to="https://institutional-defi-portal-33qto01dh-ripple-com.vercel.app"
        >
          Enter Institutional DeFi Portal
        </Button>
        <JumbotronText>
          Explore practical pathways to institutional crypto adoption.
        </JumbotronText>
      </GradientJumbotron>

      <Section>
        <LandingContainer>
          <SectionTitle>
            A Clear Starting Point for Institutions Exploring Crypto
          </SectionTitle>
          <SectionText>
            Institutions are increasingly interested in blockchain, but
            onboarding remains fragmented and difficult to navigate. Information
            is spread across documentation, vendors, and products, making it
            hard to understand what's possible and how to move forward with
            confidence.
          </SectionText>
          <SectionText style={{ marginBottom: "3rem" }}>
            The XRPL Institutional DeFi Portal brings these pieces together into
            a single, guided experience focused on practical adoption,
            institutional requirements, and real-world considerations.
          </SectionText>
        </LandingContainer>
      </Section>

      <SectionWithBackground>
        <LandingContainer>
          <SectionTitle>What This Portal Is</SectionTitle>
          <CardsWithLargerIcons columns={3}>
            <Card
              title="Practical by Design"
              icon={require("images/radar.svg")}
              iconPosition="start"
            >
              <p>
                Focused on concrete institutional workflows, not abstract demos
                or hype-driven narratives.
              </p>
            </Card>

            <Card
              title="Built for Institutions"
              icon={require("images/building-columns-check.svg")}
              iconPosition="start"
            >
              <p>
                Considers compliance, custody, operational risk, and production
                readiness from the start.
              </p>
            </Card>

            <Card
              title="Ripple-Led"
              icon={require("images/shield.svg")}
              iconPosition="start"
            >
              <p>
                Developed by Ripple to combine institutional credibility with
                the openness and performance of the XRP Ledger.
              </p>
            </Card>
          </CardsWithLargerIcons>
        </LandingContainer>
      </SectionWithBackground>

      <Section>
        <LandingContainer>
          <SectionTitle>Currently in Beta</SectionTitle>
          <SectionText>
            The Institutional DeFi Portal is an early-stage experience. Use
            cases, partner integrations, and content will continue to evolve
            based on feedback from institutional users.
          </SectionText>
          <SectionText>
            This beta is intended for institutions actively exploring blockchain
            adoption and looking for grounded, implementation-oriented guidance.
          </SectionText>
        </LandingContainer>
      </Section>

      <SectionWithBackground>
        <LandingContainer>
          <SectionTitle>Explore Institutional DeFi on XRPL</SectionTitle>
          <SectionText
            style={{
              lineHeight: "1.8",
              maxWidth: "700px",
              margin: "0 auto 2.5rem",
            }}
          >
            Enter the Institutional DeFi Portal to explore practical onboarding
            paths and learn how institutions can begin adopting blockchain
            technology on the XRP Ledger.
          </SectionText>
          <div style={{ textAlign: "center" }}>
            {/* TODO: Update to actual domain once available */}
            <Button
              size="large"
              variant="primary"
              to="https://institutional-defi-portal-33qto01dh-ripple-com.vercel.app"
            >
              Enter Institutional DeFi Portal
            </Button>
          </div>
        </LandingContainer>
      </SectionWithBackground>
    </LandingLayout>
  );
}
