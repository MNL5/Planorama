import React from "react";
import { Box } from "@mantine/core";

import { NavBar } from "../navbar/navbar";

const Overview: React.FC = () => {
  return (
    <Box pt={180} pl={20}>
      <NavBar />
      <div>
        {/* Your main content goes here */}
        <h1>Welcome to the Event Planning Website</h1>
        <p>This is the content of the page.</p>
      </div>
    </Box>
  );
};

export { Overview };
