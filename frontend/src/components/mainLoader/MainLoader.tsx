import { Flex } from "@mantine/core";
import { CircularProgress } from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";

const MainLoader: React.FC<{ isPending: boolean }> = ({ isPending }) => {
  return (
    isPending &&
    createPortal(
      <Flex
        pos={"absolute"}
        top={0}
        left={0}
        right={0}
        bottom={0}
        justify={"center"}
        align={"center"}
        style={{ zIndex: 100 }}
      >
        <CircularProgress color="secondary" />
      </Flex>,
      document.getElementById("root")!,
    )
  );
};

export default MainLoader;
