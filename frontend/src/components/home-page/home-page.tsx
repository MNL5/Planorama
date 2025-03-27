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

import backgroundImage from "../../assets/background.webp";

const HomePage: React.FC = () => {
  return (
    <Stack
      style={{
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        position: "absolute",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Flex
        justify={"center"}
        style={{
          top: 0,
          left: 0,
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
          height: "60vh",
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
            backgroundColor: "white",
          }}
        >
          <Stack gap={"lg"}>
            <Title
              c={"#add8e6"}
              ff={"text"}
              style={{
                letterSpacing: "2px",
                textTransform: "uppercase",
                textShadow: "0 0 10px #add8e6",
              }}
            >
              Plan your dream event
            </Title>
            <Text size={"lg"} ff={"text"}>
              Helping you plan your event easily and efficiently
            </Text>
            <Group gap={"xl"} justify={"center"}>
              <Button variant={"outline"} size={"lg"} w={"200px"}>
                Sign Up
              </Button>
              <Button variant={"outline"} size={"lg"} w={"200px"}>
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
