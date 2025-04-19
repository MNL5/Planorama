import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { EventType } from "../types/event";
import { useEventContext } from "../contexts/event-context";
import { getEventList } from "../services/event-service/event-service";

const useFetchEventsList = (isLogged: boolean) => {
  const { setCurrentEvent } = useEventContext();
  const {
    data: eventsList,
    isSuccess,
    isLoading: isLoadingEventsList,
  } = useQuery<EventType[], Error>({
    queryKey: ["fetchEventsList"],
    queryFn: () => getEventList(),
    enabled: isLogged,
  });

  const doesUserHaveEvents = isSuccess && !isEmpty(eventsList);

  useEffect(() => {
    if (doesUserHaveEvents) {
      setCurrentEvent(eventsList[0]);
    }
  }, [doesUserHaveEvents, eventsList, setCurrentEvent]);

  return { eventsList, doesUserHaveEvents, isLoadingEventsList };
};

export { useFetchEventsList };
