import styled from "styled-components";
import { Typography } from "@redocly/developer-portal/ui";
import { theme } from "../theme";

const TileText = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) =>
    props.color ? props.color : theme.colors.text.secondary};
  margin-top: 0;
`;

export default TileText;
