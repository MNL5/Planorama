import { isNil } from "lodash";
import { Container, Loader, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { Guest } from "../../types/guest";
import {
  getAllGuests,
} from "../../Services/guest-service/guest-service";
import { CustomTable } from "../custom-table/custom-table";
import { useEventContext } from "../../contexts/event-context";
import { useEffect, useState } from "react";
import { Column } from "../../types/column";
import { Gift } from "../../types/gift";
import { getAllGifts } from "../../Services/gift-service/gift-service";
import { giftsColumns } from "../../utils/gift-columns";

const GiftsList: React.FC = () => {
  const { currentEvent } = useEventContext();
  const [columns, setColumns] = useState<Column<Gift>[] | null>(null);

  const {
    data: guests,
    isSuccess: isSuccessGuest,
    isLoading: isLoadingGuest,
    isError: isErrorGuest,
    isFetching: isFetchingGuest
  } = useQuery<Guest[], Error>({
    queryKey: ["fetchGuests", currentEvent?.id],
    queryFn: () => getAllGuests(currentEvent?.id as string),
  });

  useEffect(() => {
    if (isSuccessGuest && !isFetchingGuest && !isNil(guests)) {
      setColumns(giftsColumns(guests));
    }
  }, [isSuccessGuest, isFetchingGuest, guests]);

  const {
    data: gifts,
    isSuccess: isSuccessGift,
    isLoading: isLoadingGift,
    isError: isErrorGift,
    isFetching: isFetchingGift
  } = useQuery<Gift[], Error>({
    queryKey: ["fetchGifts", currentEvent?.id],
    queryFn: () => getAllGifts(currentEvent?.id as string),
  });

  const isSuccess = isSuccessGuest && isSuccessGift;
  const isLoading = isLoadingGuest || isLoadingGift;
  const isError = isErrorGuest || isErrorGift;
  const isFetching = isFetchingGuest || isFetchingGift;

  return isSuccess && !isFetching && !isNil(gifts) && columns ? (
    <Container size={"xl"} mt={"xl"} mb={"xl"} style={{ flex: "1 1", overflow: "hidden" }}>
      <CustomTable<Gift>
        data={gifts}
        columns={columns}
      />
    </Container>
  ) : isLoading ? (
    <Loader size="lg" color="primary" />
  ) : isError ? (
    <Text>Oops! Something went wrong. Please try again later.</Text>
  ) : null;
};

export { GiftsList };
