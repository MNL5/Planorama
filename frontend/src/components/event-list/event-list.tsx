import { Card, Group, Image, Text, Badge, Button } from "@mantine/core";

// import { useEventContext } from "../../contexts/event-context";
import { useFetchEventsList } from "../../hooks/use-fetch-events-list";

const EventList: React.FC = () => {
  // const { setCurrentEvent } = useEventContext();
  const { eventsList } = useFetchEventsList(true);

  return eventsList?.map((eventItem) => (
    <Card
      w={"xl"}
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
        <Badge color="pink">
          {new Date(eventItem.time).toLocaleDateString()}
        </Badge>
      </Group>

      <Text size={"sm"} c={"dimmed"}>
        {eventItem.invitationText}
      </Text>

      <Button color={"primary"} fullWidth mt={"md"} radius={"md"}>
        Select Event
      </Button>
    </Card>
  ));
};

export { EventList };
