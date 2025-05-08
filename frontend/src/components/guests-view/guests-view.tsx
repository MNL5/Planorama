import { isNil } from "lodash";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Flex, Loader, Text } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";

import { Guest } from "../../types/guest";
import { Column } from "../../types/column";
import {
  createGuest,
  updateGuest,
  deleteGuest,
} from "../../services/guest-service/guest-service";
import { guestColumns } from "../../utils/guest-columns";
import { CustomTable } from "../custom-table/custom-table";
import { useEventContext } from "../../contexts/event-context";
import { useFetchAllGuests } from "../../hooks/use-fetch-all-guests";

const GuestsView: React.FC = () => {
  const { currentEvent } = useEventContext();
  const [columns, setColumns] = useState<Column<Guest>[] | null>(null);

  useEffect(() => {
    if (currentEvent) {
      setColumns(guestColumns(currentEvent));
    }
  }, [currentEvent]);

  const {
    guestsData: guests,
    isSuccess,
    isLoading,
    isError,
    isFetching,
  } = useFetchAllGuests(true);

  const { mutateAsync: mutateCreateGuest } = useMutation<
    Guest,
    Error,
    Omit<Guest, "id">
  >({
    mutationFn: (newGuest) => createGuest(currentEvent?.id as string, newGuest),
    onSuccess: () => {
      toast.success("Guest created successfully");
    },
    onError: () => {
      toast.error("Failed to create guest");
    },
  });

  const { mutateAsync: mutateUpdateGuest } = useMutation<Guest, Error, Guest>({
    mutationFn: (updatedGuest) =>
      updateGuest(currentEvent?.id as string, updatedGuest, updatedGuest.id),
    onSuccess: () => {
      toast.success("Guest updated successfully");
    },
    onError: () => {
      toast.error("Failed to update guest");
    },
  });

  const { mutateAsync: mutateDeleteGuest } = useMutation<Guest, Error, string>({
    mutationFn: (guestId) => deleteGuest(guestId),
    onSuccess: () => {
      toast.success("Guest deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete guest");
    },
  });

  return isSuccess && !isFetching && !isNil(guests) && columns ? (
    <Flex style={{ flex: "1 1", overflowY: "scroll" }}>
      <CustomTable<Guest>
        data={guests}
        columns={columns}
        createRow={mutateCreateGuest}
        updateRow={mutateUpdateGuest}
        deleteRow={mutateDeleteGuest}
      />
    </Flex>
  ) : isLoading ? (
    <Loader size="lg" color="primary" />
  ) : isError ? (
    <Text>Oops! Something went wrong. Please try again later.</Text>
  ) : null;
};

export { GuestsView };
