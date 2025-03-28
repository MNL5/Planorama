import styled from "@emotion/styled";
import { Title, TitleProps } from "@mantine/core";

const NavbarTitle = styled(Title)<TitleProps>`
  font-size: 100px;
  letter-spacing: 2px;
  font-family: Rouge Script, cursive !important;
  text-shadow: 0 0 25px rgba(173, 216, 230, 1),
    0 0 50px rgba(173, 216, 230, 0.8);
`;

export { NavbarTitle };
