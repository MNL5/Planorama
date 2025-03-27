import { Title, Text, Group, Stack, Button } from "@mantine/core";

import backgroundImage from "../../assets/background.webp";
import {
  BackgroundContainer,
  HomePaper,
  HomeTitle,
  PaperContainer,
  TitleContainer,
} from "./style";

const HomePage: React.FC = () => {
  return (
    <BackgroundContainer backgroundImage={backgroundImage}>
      <TitleContainer>
        <HomeTitle c={"#add8e6"} ff={"heading"} mt={"xl"}>
          Planorama
        </HomeTitle>
      </TitleContainer>
      <PaperContainer>
        <HomePaper p={"xl"} radius={"lg"} shadow={"lg"}>
          <Stack gap={"lg"}>
            <Title
              c={"#add8e6"}
              ff={"text"}
              style={{
                zIndex: 1,
                letterSpacing: "2px",
                textTransform: "uppercase",
                textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              }}
            >
              Plan your dream event
            </Title>
            <Text
              size={"xl"}
              ff={"text"}
              style={{
                color: "rgba(0, 0, 0, 0.6)",
                fontStyle: "italic",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
              }}
            >
              plan your events easily and efficiently
            </Text>
            <Group gap={"xl"} justify={"center"}>
              <Button
                w={"200px"}
                size={"lg"}
                color={"white"}
                variant={"outline"}
              >
                Sign Up
              </Button>
              <Button
                size={"lg"}
                w={"200px"}
                color={"white"}
                variant={"outline"}
              >
                Sign In
              </Button>
            </Group>
          </Stack>
        </HomePaper>
      </PaperContainer>
    </BackgroundContainer>
  );
};

export { HomePage };
