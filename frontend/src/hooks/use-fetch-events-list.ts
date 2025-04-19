import { isEmpty } from "lodash";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { EventType } from "../types/event";
import { getEventList } from "../services/event-service/event-service";

const useFetchEventsList = (isLogged: boolean) => {
  const { data: eventsList, isFetching: isLoadingEventsList } = useQuery<
    EventType[],
    Error
  >({
    queryKey: ["fetchEventsList"],
    queryFn: () => getEventList(),
    enabled: isLogged,
  });

  const doesUserHaveEvents = useMemo(() => {
    return !isLoadingEventsList ? !isEmpty(eventsList) : null;
  }, [eventsList, isLoadingEventsList]);

  return { eventsList, isLoadingEventsList, doesUserHaveEvents };
};

export { useFetchEventsList };
