import React from "react";
import { useParams } from "react-router-dom";
import { Title, Text, Stack } from "@mantine/core";

import useEventByGuest from "../../hooks/use-event-by-guest";
import Invitation from "../invitation/invitation";
import MainLoader from "../mainLoader/MainLoader";

const InvitationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading } = useEventByGuest(id);

  if (!event) {
    if (isLoading) {
      return <MainLoader isPending />;
    }
    return (
      <Stack
        align="center"
        justify="center"
        style={{ color: "#50147c", padding: "20px" }}
      >
        <Title>Event not found</Title>
        <Text>Please check the link or contact the event organizer.</Text>
      </Stack>
    );
  }

  return <Invitation event={event} guestId={id} />;
};

export default InvitationPage;
