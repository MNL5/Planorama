import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import Home from "./components/home/home.tsx";
import { mantheme } from "./types/mantheme.ts";
import useRefresh from "./hooks/use-refresh.ts";
import { ENDPOINTS } from "./utils/end-points.tsx";
import Navbar from "./components/navbar/navbar.tsx";
import SignIn from "./components/sign-in/sign-in.tsx";
import SignUp from "./components/sign-up/sign-up.tsx";
import Overview from "./components/overview/overview.tsx";
import { useEventListener } from "./hooks/use-event-listener.ts";
import { useFetchEventsList } from "./hooks/use-fetch-events-list.ts";

const theme = createTheme(mantheme);

const LOGIN_EVENT = "loginEvent";

const App: React.FC = () => {
  const [isLogged, setLogged] = useState<boolean>(false);
  const { isLoading } = useRefresh();
  const { doesUserHaveEvents, isLoadingEventsList } =
    useFetchEventsList(isLogged);

  useEventListener(LOGIN_EVENT, (event: CustomEvent) =>
    setLogged(event.detail)
  );

  if (isLoading || (isLogged && isLoadingEventsList))
    return (
      <CircularProgress
        color="secondary"
        style={{ position: "absolute", top: "40%", left: "50%" }}
      />
    );

  return (
    <MantineProvider theme={theme}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={"colored"}
        style={{ zIndex: "999999999999" }}
      />
      {isLogged && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            isLogged ? (
              doesUserHaveEvents ? (
                <Navigate replace to="/overview" />
              ) : (
                <Navigate replace to="/event-details" />
              )
            ) : (
              <Home />
            )
          }
        />
        {isLogged ? (
          <>
            <Route path="/overview" element={<Overview />} />
            {ENDPOINTS.map((endpoint) => (
              <Route
                key={endpoint.path}
                path={endpoint.path}
                element={endpoint.element}
              />
            ))}
          </>
        ) : (
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MantineProvider>
  );
};

export { App, LOGIN_EVENT };
