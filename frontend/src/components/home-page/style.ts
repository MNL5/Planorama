import {
  Flex,
  Paper,
  Stack,
  Title,
  Container,
  PaperProps,
  TitleProps,
  MantineThemeOverride,
} from "@mantine/core";
import styled, { StyledComponent } from "@emotion/styled";

interface BackgroundContainerProps {
  backgroundImage?: string;
}

const BackgroundContainer = styled(Stack)<BackgroundContainerProps>`
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${(props) => `url(${props.backgroundImage})`};
`;

const TitleContainer: StyledComponent<{
  theme?: MantineThemeOverride;
  children?: React.ReactNode;
}> = styled(Flex)`
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const HomeTitle = styled(Title)<TitleProps>`
  z-index: 1;
  font-size: 80px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 25px rgba(173, 216, 230, 1),
    0 0 50px rgba(173, 216, 230, 0.8);
`;

const PaperContainer = styled(Container)`
  z-index: 1;
  height: 88vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const HomePaper: StyledComponent<
  {
    theme?: MantineThemeOverride;
    children?: React.ReactNode;
  } & PaperProps
> = styled(Paper)<PaperProps>`
  text-align: center;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.7),
    rgba(173, 216, 230, 0.7)
  );
  border: 2px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export {
  BackgroundContainer,
  TitleContainer,
  PaperContainer,
  HomeTitle,
  HomePaper,
};
