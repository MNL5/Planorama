import { useNavigate } from "react-router-dom";
import { Group, Stack, Button } from "@mantine/core";

import {
  HomePaper,
  HomeTitle,
  PaperTitle,
  PaperContainer,
  TitleContainer,
  BackgroundContainer,
  PaperText,
} from "./style";
import {
  titleText,
  homePagePaperText,
  homePagePaperTitleText,
  signUpText,
  signInText,
} from "../../types/strings";
import backgroundImage from "../../assets/wedding.png";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <BackgroundContainer backgroundImage={backgroundImage}>
      <TitleContainer>
        <HomeTitle c={"secondary.0"} ff={"heading"} mt={"xl"}>
          {titleText}
        </HomeTitle>
      </TitleContainer>
      <PaperContainer>
        <HomePaper p={"xl"} radius={"lg"} shadow={"lg"}>
          <Stack gap={"lg"}>
            <PaperTitle ff={"text"}>{homePagePaperTitleText}</PaperTitle>
            <PaperText size={"xl"} ff={"text"}>
              {homePagePaperText}
            </PaperText>
            <Group gap={"xl"} justify={"center"}>
              <Button
                w={"200px"}
                size={"lg"}
                color={"#00C853"}
                radius={"md"}
                variant={"filled"}
                style={{
                  border: "2px solid #00b244",
                }}
                onClick={() => navigate("/signup")}
              >
                {signUpText}
              </Button>
              <Button
                size={"lg"}
                w={"200px"}
                color={"#1976D2"}
                radius={"md"}
                variant={"filled"}
                onClick={() => navigate("/signin")}
              >
                {signInText}
              </Button>
            </Group>
          </Stack>
        </HomePaper>
      </PaperContainer>
    </BackgroundContainer>
  );
};

export { HomePage };
