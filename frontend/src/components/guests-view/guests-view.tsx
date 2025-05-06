import { isNil } from "lodash";
import { Container, Loader, Text } from "@mantine/core";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Guest } from "../../types/guest";
import {
  createGuest,
  updateGuest,
  getAllGuests,
  deleteGuest,
} from "../../Services/guest-service/guest-service";
import { guestColumns } from "../../utils/guest-columns";
import { CustomTable } from "../custom-table/custom-table";
import { useEventContext } from "../../contexts/event-context";
import { useEffect, useState } from "react";
import { Column } from "../../types/column";

const GuestsView: React.FC = () => {
  const { currentEvent } = useEventContext();
  const [columns, setColumns] = useState<Column<Guest>[] | null>(null);

  useEffect(() => {
    if (currentEvent) {
      setColumns(guestColumns(currentEvent));
    }
  }, [currentEvent]);

  const {
    data: guests,
    isSuccess,
    isLoading,
    isError,
    isFetching
  } = useQuery<Guest[], Error>({
    queryKey: ["fetchGuests", currentEvent?.id],
    queryFn: () => getAllGuests(currentEvent?.id as string),
  });

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
    }
  });

  const { mutateAsync: mutateUpdateGuest } = useMutation<
    Guest,
    Error,
    Guest
  >({
    mutationFn: (updatedGuest) =>
      updateGuest(currentEvent?.id as string, updatedGuest, updatedGuest.id),
    onSuccess: () => {
      toast.success("Guest updated successfully");
    },
    onError: () => {
      toast.error("Failed to update guest");
    }
  });

  const { mutateAsync: mutateDeleteGuest } = useMutation<
    Guest,
    Error,
    string
  >({
    mutationFn: (guestId) =>
      deleteGuest(guestId),
    onSuccess: () => {
      toast.success("Guest deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete guest");
    }
  });

  return isSuccess && !isFetching && !isNil(guests) && columns ? (
    <Container size={"xl"} mt={"xl"} mb={"xl"} style={{ flex: "1 1", overflow: "hidden" }}>
      <CustomTable<Guest>
        data={guests}
        columns={columns}
        deleteRow={mutateDeleteGuest}
        createRow={mutateCreateGuest}
        updateRow={mutateUpdateGuest}
      />
    </Container>
  ) : isLoading ? (
    <Loader size="lg" color="primary" />
  ) : isError ? (
    <Text>Oops! Something went wrong. Please try again later.</Text>
  ) : null;
};

export { GuestsView };
