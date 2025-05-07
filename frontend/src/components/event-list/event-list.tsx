import {
  Flex,
  Card,
  Text,
  Group,
  Title,
  Stack,
  Image,
  Badge,
  Button,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

import { Event } from "../../types/event";
import { useEventContext } from "../../contexts/event-context";
import { useFetchEventsList } from "../../hooks/use-fetch-events-list";

const EventList: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentEvent } = useEventContext();
  const { eventsList } = useFetchEventsList(true);

  const handleSelectEvent = (event: Event) => {
    setCurrentEvent(event);
    navigate("/event-details");
  };

  const handleCreateNewEvent = () => {
    setCurrentEvent(null);
    navigate("/create-event");
  };

  return (
    <Stack w={"100%"} h={"100vh"}>
      <Flex
        mt={20}
        w={"100%"}
        pos={"relative"}
        align={"center"}
        justify={"center"}
      >
        <Title order={1} c={"primary"}>
          Your Events
        </Title>
        <Button
          size={"md"}
          radius={"md"}
          color={"primary"}
          onClick={handleCreateNewEvent}
          style={{ position: "absolute", right: 20 }}
        >
          + Create New Event
        </Button>
      </Flex>
      <Flex
        gap={"lg"}
        wrap={"wrap"}
        justify={"center"}
        align={"flex-start"}
        style={{ marginTop: "20px" }}
      >
        {eventsList?.map((eventItem) => (
          <Card
            w={400}
            key={eventItem.id}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Card.Section>
              <Image h={240} src={eventItem.invitationImg} />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
              <Title size="xl">{eventItem.name}</Title>
              <Badge color="primary.2">
                {new Date(eventItem.time).toLocaleDateString()}
              </Badge>
            </Group>

            <Text size="sm" c="dimmed">
              {eventItem.invitationText}
            </Text>

            <Button
              color="primary"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => handleSelectEvent(eventItem)}
            >
              Select Event
            </Button>
          </Card>
        ))}
      </Flex>
    </Stack>
  );
};

export { EventList };
