import styled, { StyledComponent } from "@emotion/styled";
import { Container, Flex, MantineThemeOverride, Stack } from "@mantine/core";

interface BackgroundContainerProps {
  backgroundImage?: string;
}

const BackgroundContainer = styled(Stack)`
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${(props: BackgroundContainerProps) =>
    `url(${props.backgroundImage})`};
`;

const TitleContainer: StyledComponent<{
  theme?: MantineThemeOverride;
  children: React.ReactNode;
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

const PaperContainer = styled(Container)`
  z-index: 1;
  height: 88vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export { BackgroundContainer, TitleContainer, PaperContainer };
