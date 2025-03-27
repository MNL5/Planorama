import styled from "@emotion/styled";
import { Stack } from "@mantine/core";

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

export { BackgroundContainer };
