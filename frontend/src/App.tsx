import "devextreme/dist/css/dx.light.css";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import Home from "./components/home/home.tsx";
import { mantheme } from "./types/mantheme.ts";
import useRefresh from "./hooks/use-refresh.ts";
import { ENDPOINTS, GUEST_ENDPOINTS } from "./utils/end-points.tsx";
import Navbar from "./components/navbar/navbar.tsx";
import SignIn from "./components/sign-in/sign-in.tsx";
import SignUp from "./components/sign-up/sign-up.tsx";
import { useEventListener } from "./hooks/use-event-listener.ts";
import { EventList } from "./components/event-list/event-list.tsx";
import { useFetchEventsList } from "./hooks/use-fetch-events-list.ts";
import { useEventContext } from "./contexts/event-context.tsx";
import { CreateEvent } from "./components/create-event/create-event.tsx";

const theme = createTheme(mantheme);

const LOGIN_EVENT = "loginEvent";

const App: React.FC = () => {
  const { pathname } = useLocation();
  const isGuest = GUEST_ENDPOINTS.some((endpoint) =>
    pathname.startsWith(endpoint.path),
  );
  const [isLogged, setLogged] = useState<boolean>(false);
  const { isLoading } = useRefresh(isGuest);
  const { doesUserHaveEvents, isLoadingEventsList } =
    useFetchEventsList(isLogged);
  const { currentEvent } = useEventContext();

  useEventListener(LOGIN_EVENT, (event: CustomEvent) =>
    setLogged(event.detail),
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
        style={{ zIndex: "999999999999", whiteSpace: "pre-line" }}
      />
      {isLogged && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            isLogged ? (
              doesUserHaveEvents ? (
                <Navigate replace to="/event-list" />
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
            <Route path="/event-list" element={<EventList />} />
            <Route path="/event-details" element={<CreateEvent />} />
            {currentEvent &&
              ENDPOINTS.map((endpoint) => (
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
        {GUEST_ENDPOINTS.map((endpoint) => (
          <Route
            key={endpoint.path}
            path={`${endpoint.path}/:id`}
            element={endpoint.element}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MantineProvider>
  );
};

export { App, LOGIN_EVENT };
