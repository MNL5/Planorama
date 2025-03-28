import React from "react";
import { useNavigate } from "react-router-dom";
import { Group, Text, Button, Box, Container } from "@mantine/core";

import { titleText } from "../../types/strings";

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/signin");
  };

  return (
    <Box
      p={"md"}
      bg={"#add8e6"}
      style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        position: "fixed",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Container size={"xl"}>
        <Group justify={"space-between"}>
          {/* Logo section */}
          <Text
            size={"xl"}
            fw={700}
            c={"white"}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            {titleText}
          </Text>

          <Group gap={"lg"}>
            <Button
              color={"white"}
              variant={"outline"}
              onClick={() => navigate("/events")}
            >
              My Events
            </Button>
            <Button variant={"white"} onClick={handleLogout} color={"white"}>
              Logout
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export { NavBar };
