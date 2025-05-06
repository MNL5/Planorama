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

  // const {
  //   data: gifts,
  //   isSuccess: isSuccessGift,
  //   isLoading: isLoadingGift,
  //   isError: isErrorGift,
  //   isFetching: isFetchingGift
  // } = useQuery<Gift[], Error>({
  //   queryKey: ["fetchGifts", currentEvent?.id],
  //   queryFn: () => getAllGifts(currentEvent?.id as string),
  // });

  const {
    data: gifts,
    isSuccess: isSuccessGift,
    isLoading: isLoadingGift,
    isError: isErrorGift,
    isFetching: isFetchingGift
  } = {
    data: [{
      id: "1",
      guestId: "1",
      greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf Birthday!",
      amount: 100,
    },
    { id: "2", guestId: "2", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf", amount: 200},
    { id: "3", guestId: "3", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf New Year!", amount: 300},
    { id: "4", guestId: "4", greeting: "Congratulations!", amount: 400},
    { id: "5", guestId: "5", greeting: "Best Wishes!", amount: 500},
    { id: "6", guestId: "6", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf Anniversary!", amount: 600},
    { id: "7", guestId: "7", greeting: "Get Well Soon!", amount: 700},
    { id: "8", guestId: "8", greeting: "Thinking of You!", amount: 800},
    { id: "9", guestId: "9", greeting: "Thank You!", amount: 900},
    { id: "10", guestId: "10", greeting: "Good Luck!", amount: 1000},
    { id: "11", guestId: "11", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf Holidays!", amount: 1100},
    { id: "12", guestId: "12", greeting: "Welcome!", amount: 1200},
    { id: "13", guestId: "13", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf Graduation!", amount: 1300},
    { id: "14", guestId: "14", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf Retirement!", amount: 1400},
    { id: "15", guestId: "15", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf Engagement!", amount: 1500},
    { id: "16", guestId: "16", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf Wedding!", amount: 1600},
    { id: "17", guestId: "17", greeting: "Merry Christmas! asjkdhflkasdnl dunrlsfdgnblkdfj.,fdmbl  nldaergj sdrg sd   gfsd f  fg  dfg df g f gt hydr gtf hdsrtgf h sdh ffg sh df g h df fgh ds sd sdf g\ndsf g sdfgsg sfg  fd sd fg\n dsfgsd g  dsfg sdf Baby Shower!", amount: 1700},],
    isSuccess: true,
    isLoading: false,
    isError: false,
    isFetching: false,
  };

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
