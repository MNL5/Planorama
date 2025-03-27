import {
  Flex,
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Button,
  Container,
} from "@mantine/core";

import classes from "./home-page.module.css";
import backgroundImage from "../../assets/background.webp";

const HomePage: React.FC = () => {
  return (
    <Stack
      className={classes.backgroundContainer}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Flex
        justify={"center"}
        style={{
          top: 0,
          left: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
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
      </Flex>
      <Container
        style={{
          zIndex: 1,
          height: "88vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
                variant={"outline"}
                color={"white"}
                size={"lg"}
                w={"200px"}
              >
                Sign Up
              </Button>
              <Button
                variant={"outline"}
                color={"white"}
                size={"lg"}
                w={"200px"}
              >
                Sign In
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    </Stack>
  );
};

export { HomePage };
