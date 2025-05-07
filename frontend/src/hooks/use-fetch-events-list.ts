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

  useEffect(() => {
    if (doesUserHaveEvents && eventsList.length === 1) {
      setCurrentEvent(eventsList[0]);
    }
  }, [doesUserHaveEvents, eventsList, setCurrentEvent]);

  return {
    eventsList,
    doesUserHaveEvents,
    isLoadingEventsList: isLoading,
  };
};

export { useFetchEventsList };
