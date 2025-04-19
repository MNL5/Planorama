import { createContext, useContext, useState } from "react";

import { EventType } from "../types/event";

type EventContextType = {
  currentEvent: EventType | undefined;
  setCurrentEvent: React.Dispatch<React.SetStateAction<EventType | undefined>>;
};

const EventContext = createContext<EventContextType | undefined>(undefined);
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
  const [currentEvent, setCurrentEvent] = useState<EventType | undefined>();

  return (
    <EventContext.Provider value={{ currentEvent, setCurrentEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export { EventContextProvider, useEventContext };
