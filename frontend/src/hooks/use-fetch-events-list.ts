import { isEmpty } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { Event } from "../types/event";
import { getEventList } from "../services/event-service/event-service";

const useFetchEventsList = (isLogged: boolean) => {
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

  return {
    eventsList,
    doesUserHaveEvents,
    isLoadingEventsList: isLoading,
  };
};

export { useFetchEventsList };
