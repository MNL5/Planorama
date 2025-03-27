import { Paper, Title, Text, Group, Stack, Button } from "@mantine/core";

import backgroundImage from "../../assets/background.webp";
import { BackgroundContainer, PaperContainer, TitleContainer } from "./style";

const HomePage: React.FC = () => {
  return (
    <BackgroundContainer backgroundImage={backgroundImage}>
      <TitleContainer>
        <Title
          c={"#add8e6"}
          ff={"heading"}
          mt={"xl"}
          style={{
            zIndex: 1,
            fontSize: "80px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow:
              "0 0 25px rgba(173, 216, 230, 1), 0 0 50px rgba(173, 216, 230, 0.8)",
          }}
        >
          Planorama
        </Title>
      </TitleContainer>
      <PaperContainer>
        <Paper
          p={"xl"}
          radius={"lg"}
          shadow={"lg"}
          style={{
            textAlign: "center",
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(173, 216, 230, 0.7))",
            border: "2px solid white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
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
              plan your event easily and efficiently
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
        </Paper>
      </PaperContainer>
    </BackgroundContainer>
  );
};

export { HomePage };
