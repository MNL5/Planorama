import { useNavigate } from "react-router-dom";
import { Flex, Card, Group, Image, Text, Badge, Button } from "@mantine/core";

import { useEventContext } from "../../contexts/event-context";
import { useFetchEventsList } from "../../hooks/use-fetch-events-list";
import { Event } from "../../types/event";

const EventList: React.FC = () => {
  const { setCurrentEvent } = useEventContext();
  const { eventsList } = useFetchEventsList(true);
  const navigate = useNavigate();

  const handleSelectEvent = (event: Event) => {
    setCurrentEvent(event);
    navigate("event-details");
  };

  return (
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
            <Image height={160} src={eventItem.invitationImg} />
          </Card.Section>
          <Group justify={"space-between"} mt={"md"} mb={"xs"}>
            <Text fw={500}>{eventItem.name}</Text>
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
  );
};

export { EventList };
