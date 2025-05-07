import {
  Flex,
  Card,
  Text,
  Group,
  Title,
  Image,
  Badge,
  Stack,
  Button,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { Event } from "../../types/event";
import { useEventContext } from "../../contexts/event-context";
import { useFetchEventsList } from "../../hooks/use-fetch-events-list";

const EventList: React.FC = () => {
  const { setCurrentEvent } = useEventContext();
  const { eventsList } = useFetchEventsList(true);
  const navigate = useNavigate();

  const handleSelectEvent = (event: Event) => {
    setCurrentEvent(event);
    navigate("event-details");
  };

  const handleCreateNewEvent = () => {
    navigate("/create-event");
  };

  return (
    <Stack w={"100%"} h={"100vh"} gap={"lg"} align={"center"}>
      <Flex w={"100%"} justify={"flex-end"} style={{ padding: "20px 5%" }}>
        <Button
          size={"md"}
          radius={"md"}
          color={"primary"}
          onClick={handleCreateNewEvent}
        >
          + Create New Event
        </Button>
      </Flex>
      <Flex
        gap={"lg"}
        w={"100%"}
        h={"100vh"}
        wrap={"wrap"}
        justify={"center"}
        align={"center"}
      >
        {eventsList?.map((eventItem) => (
          <Card
            w={400}
            key={eventItem.id}
            shadow={"sm"}
            padding={"lg"}
            radius={"md"}
            withBorder
          >
            <Card.Section>
              <Image mah={240} src={eventItem.invitationImg} />
            </Card.Section>
            <Group justify={"space-between"} mt={"md"} mb={"xs"}>
              <Title size={"xl"}>{eventItem.name}</Title>
              <Badge color={"primary.2"}>
                {new Date(eventItem.time).toLocaleDateString()}
              </Badge>
            </Group>

            <Text size={"sm"} c={"dimmed"}>
              {eventItem.invitationText}
            </Text>

            <Button
              color={"primary"}
              fullWidth
              mt={"md"}
              radius={"md"}
              onClick={() => handleSelectEvent(eventItem)}
            >
              Select Event
            </Button>
          </Card>
        ))}
        ,
      </Flex>
    </Stack>
  );
};

export { EventList };