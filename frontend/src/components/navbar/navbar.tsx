import React from "react";
import { useNavigate } from "react-router-dom";
import { Group, Button, Box, Container, Flex } from "@mantine/core";

import { NavbarTitle } from "./style";
import { titleText } from "../../types/strings";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Box
      p={"md"}
      bg={"secondary.0"}
      style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        position: "fixed",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container m={0}>
        <Flex w={'90vw'} align={"center"} justify={"space-between"}>
          <Group gap={"xl"} align={"center"}>
            <NavbarTitle
              c={"white"}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              {titleText}
            </NavbarTitle>
            <Group gap={"lg"} mt={"sm"}>
              <Button
                size={"lg"}
                color={"primary"}
                variant={"subtle"}
                onClick={() => navigate("/events")}
              >
                My Events
              </Button>
            </Group>
          </Group>
          <Button
            size={"md"}
            radius={"md"}
            variant={"filled"}
            color={"#1976D2"}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export { NavBar };
