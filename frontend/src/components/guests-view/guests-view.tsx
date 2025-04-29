import { isNil } from "lodash";
import { Flex, Loader, Text } from "@mantine/core";
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

const GuestsView: React.FC = () => {
  const { currentEvent } = useEventContext();

  const {
    data: guests,
    isSuccess,
    isLoading,
    isError,
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

  return isSuccess && !isNil(guests) ? (
    <Flex style={{ flex: "1 1", overflowY: "scroll" }}>
      <CustomTable<Guest>
        data={guests}
        columns={guestColumns}
        deleteRow={mutateDeleteGuest}
        createRow={mutateCreateGuest}
        updateRow={mutateUpdateGuest}
      />
    </Flex>
  ) : isLoading ? (
    <Loader size="lg" color="primary" />
  ) : isError ? (
    <Text>Oops! Something went wrong. Please try again later.</Text>
  ) : null;
};

export { GuestsView };
