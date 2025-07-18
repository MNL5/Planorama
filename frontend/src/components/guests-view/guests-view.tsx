import { isNil } from "lodash";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Container, Text } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";

import { Guest } from "../../types/guest";
import { Column } from "../../types/column";
import MainLoader from "../mainLoader/MainLoader";
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

  const {
    guestsData: guests,
    isSuccess,
    isLoading,
    isError,
    isFetching,
    refetchGuests,
  } = useFetchAllGuests(true);

  useEffect(() => {
    if (currentEvent && guests) {
      setColumns(guestColumns(currentEvent, guests));
    }
  }, [currentEvent, guests]);

  const { mutateAsync: mutateCreateGuest, isPending: isCreatePending } =
    useMutation<Guest, Error, Omit<Guest, "id">>({
      mutationFn: (newGuest) =>
        createGuest(currentEvent?.id as string, newGuest),
      onSuccess: () => {
        toast.success("Guest created successfully");
      },
      onError: () => {
        toast.error("Failed to create guest");
      },
    });

  const { mutateAsync: mutateUpdateGuest, isPending: isUpdatePending } =
    useMutation<Guest, Error, Guest>({
      mutationFn: (updatedGuest) =>
        updateGuest(currentEvent?.id as string, updatedGuest, updatedGuest.id),
      onSuccess: () => {
        toast.success("Guest updated successfully");
      },
      onError: () => {
        toast.error("Failed to update guest");
      },
    });

  const { mutateAsync: mutateDeleteGuest, isPending: isDeletePeding } =
    useMutation<Guest, Error, string>({
      mutationFn: (guestId) => deleteGuest(guestId),
      onSuccess: () => {
        toast.success("Guest deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete guest");
      },
    });

  return isSuccess && !isFetching && !isNil(guests) && columns ? (
    <Container
      size={"xl"}
      mt={"xl"}
      mb={"xl"}
      style={{ flex: "1 1", overflow: "hidden" }}
    >
      <MainLoader
        isPending={isCreatePending || isUpdatePending || isDeletePeding}
      />
      <CustomTable<Guest>
        data={guests}
        columns={columns}
        createRow={mutateCreateGuest}
        updateRow={mutateUpdateGuest}
        deleteRow={mutateDeleteGuest}
        refetchData={refetchGuests}
      />
    </Container>
  ) : isLoading ? (
    <MainLoader isPending />
  ) : isError ? (
    <Text>Oops! Something went wrong. Please try again later.</Text>
  ) : null;
};

export { GuestsView };
