import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { Event } from "../types/event";
import { useEventContext } from "../contexts/event-context";
import { getEventList } from "../services/event-service/event-service";

const useFetchEventsList = (isLogged: boolean) => {
  const { setCurrentEvent } = useEventContext();
  const {
    data: eventsList,
    isSuccess,
    isLoading,
  } = useQuery<Event[], Error>({
    queryKey: ["fetchEventsList"],
    queryFn: () => getEventList(),
    enabled: isLogged,
  });

  const doesUserHaveEvents = isSuccess && !isEmpty(eventsList);
  const isSingleEvent = doesUserHaveEvents && eventsList.length === 1;

  useEffect(() => {
    if (isSingleEvent) {
      setCurrentEvent(eventsList[0]);
    }
  }, [isSingleEvent, eventsList, setCurrentEvent]);

  return {
    eventsList,
    doesUserHaveEvents,
    isLoadingEventsList: isLoading,
    isSingleEvent,
  };
};

export { useFetchEventsList };
