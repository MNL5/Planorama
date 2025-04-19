import {
  Flex,
  Stack,
  Text,
  Image,
  Button,
  Textarea,
  TextInput,
  FileInput,
} from "@mantine/core";
import { isNil } from "lodash";
import { useMemo, useState } from "react";
import { DateTimePicker } from "@mantine/dates";

import { EventType } from "../../types/event";

const CreateEvent: React.FC<{ eventToEdit: EventType | null }> = ({
  eventToEdit,
}) => {
  const [eventName, setEventName] = useState(eventToEdit?.name ?? "");
  const [invitationTxt, setInvitationTxt] = useState(
    eventToEdit?.invitationTxt ?? ""
  );
  const [invitationImage, setInvitationImage] = useState<File | null>(null);

  const imageUrl = useMemo(() => {
    if (invitationImage) {
      return URL.createObjectURL(invitationImage);
    }
  }, [invitationImage]);

  const handeImageReset = () => {
    setInvitationImage(null);
  };

  return (
    <Flex w={"100%"} align={"center"} justify={"space-evenly"} mt={"18vh"}>
      <Flex align={"center"} gap={"xl"}>
        <Image src={imageUrl} radius={"md"} maw={400} mah={360} />
        {isNil(imageUrl) ? (
          <FileInput
            size={"lg"}
            placeholder={"Select Event invitation image"}
            value={invitationImage}
            accept={"image/*"}
            onChange={(file) => {
              if (file) {
                setInvitationImage(file);
              }
            }}
          />
        ) : (
          <Button
            size={"xl"}
            radius={"md"}
            variant={"light"}
            onClick={handeImageReset}
          >
            <Text size={"xl"}>Remove Image</Text>
          </Button>
        )}
      </Flex>
      <Stack gap={"xl"}>
        <TextInput
          size={"xl"}
          w={400}
          label="Event name"
          placeholder="What's your event?"
          value={eventName}
          onChange={(event) => setEventName(event.currentTarget.value)}
        />
        <DateTimePicker
          size={"xl"}
          clearable
          label="Event date and time"
          placeholder="Choose date and time of the event"
        />
        <Textarea
          size={"xl"}
          w={400}
          label="Event invitation text"
          placeholder="We’d be honored to have you celebrate our special day with us."
          value={invitationTxt}
          onChange={(event) => setInvitationTxt(event.currentTarget.value)}
        />
      </Stack>
    </Flex>
  );
};

export { CreateEvent };
