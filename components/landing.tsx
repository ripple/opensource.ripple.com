import styled from "styled-components";
import * as React from "react";
import { H1, H2, Button } from "@redocly/theme";

const Header1 = styled(H1)`
  color: white !important;
  font-weight: 700 !important;
  font-size: 42px !important;
  margin: 2em 0px 0.4em !important;

  @media (max-width: 550px) {
    margin-top: 100px !important;
    font-size: 30px !important;
    line-height: 30px !important;
    max-width: 272px;
  }
`;

const Header2 = styled(H2)`
  color: white !important;
  font-weight: 400 !important;
  font-size: 22px !important;
  margin: 0 0 2em !important;

  @media (max-width: 550px) {
    font-size: 18px !important;
    line-height: 18px !important;
    max-width: 272px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem 2rem;
`;

function LandingContainer({ children }) {
  return <Container>{children}</Container>;
}

const LandingLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Jumbotron = styled.div<{ bgImage }>`
  width: 100%;
  padding: 0px 1rem 8.5em;
  background: #003d99 url(${(props) => props.bgImage}) center center / cover
    no-repeat;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GradientJumbotron = styled.div`
  width: 100%;
  padding: 4rem 1rem 6rem;
  background: linear-gradient(135deg, #0033a0 0%, #5b4fd8 50%, #8b5cf6 100%);
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BetaBadge = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

const XRPLStyledButton = styled(Button)`
  background: #111112;
  color: #ffffff;

  :hover {
    background: #232325;
    color: #ffffff;
  }
`;

function ButtonToXRPL({ children }) {
  return (
    <XRPLStyledButton size="large">
      <img
        src={require("../images/xrpl-dev-logo-white.png")}
        alt="(XRPL)"
        width={24}
        height={20}
      />
      {children}
    </XRPLStyledButton>
  );
}

// Key Dates component for feature pages
function KeyDatesCard(props: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`key-dates card-variant-filled feature-key-dates ${
        props.className || ""
      }`}
    >
      <h4>{props.title}</h4>
      <ul>{props.children}</ul>
    </div>
  );
}

function KeyDate(props: { date: string; children: React.ReactNode }) {
  return (
    <li>
      <strong>{props.date}</strong>: {props.children}
    </li>
  );
}

// Feature page components
function FeatureHeader({ title, subtitle }) {
  return (
    <div className="feature-header">
      <h1 className="feature-title">{title}</h1>
      <p className="feature-subtitle">{subtitle}</p>
    </div>
  );
}

function FeatureContent({ description, keyDates }) {
  return (
    <div className="feature-content">
      <div className="feature-description">
        <p>{description}</p>
      </div>
      <div className="feature-key-dates">
        <h3 className="feature-key-dates-title">Key Dates</h3>
        <div className="feature-dates-list">
          {keyDates.map((item, index) => (
            <div key={index} className="feature-date-item">
              <span className="feature-date">{item.date}</span>
              <span className="feature-event">{item.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export {
  Header1,
  Header2,
  LandingContainer,
  LandingLayout,
  Jumbotron,
  GradientJumbotron,
  BetaBadge,
  ButtonToXRPL,
  KeyDatesCard,
  KeyDate,
  FeatureHeader,
  FeatureContent,
};
