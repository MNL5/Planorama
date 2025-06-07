import { useQuery } from "@tanstack/react-query";

import { Guest } from "../types/guest";
import { useEventContext } from "../contexts/event-context";
import { getAllGuests } from "../services/guest-service/guest-service";

const useFetchAllGuests = (isLogged: boolean) => {
  const { currentEvent } = useEventContext();
  const {
    data: guestsData,
    isSuccess,
    isLoading,
    isError,
    isFetching,
    refetch: refetchGuests
  } = useQuery<Guest[], Error>({
    queryKey: ["fetchGuests", currentEvent?.id],
    queryFn: () => getAllGuests(currentEvent?.id as string),
    enabled: isLogged && !!currentEvent?.id,
  });

  return {
    isError,
    isSuccess,
    isLoading,
    isFetching,
    guestsData,
    refetchGuests
  };
};

export { useFetchAllGuests };
