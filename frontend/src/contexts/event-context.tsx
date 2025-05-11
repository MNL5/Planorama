import { createContext, useContext, useState } from "react";

import { Event } from "../types/event";

type EventContextType = {
  currentEvent: Event | null;
  setCurrentEvent: React.Dispatch<React.SetStateAction<Event | null>>;
};

const EventContext = createContext<EventContextType | null>(null);
const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error(
      "useEventContext must be used within a EventContextProvider"
    );
  }
  return context;
};

const EventContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);

  return (
    <EventContext.Provider value={{ currentEvent, setCurrentEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export { EventContextProvider, useEventContext };
