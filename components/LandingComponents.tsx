import styled from "styled-components";
import { H1, H2 } from "@redocly/developer-portal/ui";

const Header1 = styled(H1)`
  color: white !important;
  font-weight: 700 !important;
  font-size: 42px !important;

  @media (max-width: 550px) {
    margin-top: 100px !important;
    font-size: 22px !important;
    max-width: 272px;
    margin-left: calc(50vw - 136px) !important;
  }
`;

const Header2 = styled(H2)`
  color: white !important;
  font-weight: 400 !important;
  font-size: 22px !important;

  @media (max-width: 550px) {
    font-size: 14px !important;
    max-width: 272px;
    margin-left: calc(50vw - 136px) !important;
  }
`;

export { Header1, Header2 };
