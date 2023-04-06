import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

function LandingContainer({ children }) {
  return <Container>{children}</Container>;
}

export default LandingContainer;
