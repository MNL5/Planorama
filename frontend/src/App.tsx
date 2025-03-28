import "@mantine/core/styles.css";
import { Routes, Route } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";

import { SignIn } from "./components/sign-in/sign-in.tsx";
import { SignUp } from "./components/sign-up/sign-up.tsx";
import { Overview } from "./components/overview/overview.tsx";
import { HomePage } from "./components/home-page/home-page.tsx";

const theme = createTheme({
  fontFamily: "Quicksand, sans-serif",
});

const App: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/overview" element={<Overview />} />
        // TODO: add not found route
      </Routes>
    </MantineProvider>
  );
};

export { App };
