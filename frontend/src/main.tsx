import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import { App } from "./App.tsx";
import { EventContextProvider } from "./contexts/event-context.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <EventContextProvider>
          <App />
        </EventContextProvider>
      </QueryClientProvider>
    </Router>
  </StrictMode>
);
