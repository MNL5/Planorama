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
import { isEmpty, isNil } from "lodash";
import { useForm } from "@mantine/form";
import { useMemo, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import { useMutation } from "@tanstack/react-query";

import { EventType } from "../../types/event";
import {
  createEvent,
  updateEvent,
} from "../../services/event-service/event-service";
import { useNavigate } from "react-router-dom";
import { fileToBase64 } from "../../utils/image-utils";

const CreateEvent: React.FC<{ eventToEdit: EventType | null }> = ({
  eventToEdit,
}) => {
  const navigate = useNavigate();
  const [invitationImage, setInvitationImage] = useState<File | null>(null);

  const form = useForm({
    initialValues: {
      eventName: eventToEdit?.name ?? "",
      invitationTxt: eventToEdit?.invitationTxt ?? "",
      eventDate: eventToEdit?.time ?? new Date(),
    },
    validate: {
      eventName: (value) => (value.trim() ? null : "event name is required"),
      invitationTxt: (value) =>
        value.trim() ? null : "event invitation text is required",
      eventDate: (value) => (value ? null : "Please select a date and time"),
    },
  });

  const imageUrl = useMemo(() => {
    if (!isEmpty(eventToEdit)) {
      return eventToEdit.invitationImg;
    } else if (invitationImage) {
      return URL.createObjectURL(invitationImage);
    }
  }, [invitationImage, eventToEdit]);

  const getBase64Image = async () => {
    if (invitationImage) {
      return await fileToBase64(invitationImage);
    }
    return null;
  };

  const handeImageReset = () => {
    setInvitationImage(null);
  };

  const { mutate: mutateEvent } = useMutation<
    EventType,
    Error,
    Omit<EventType, "id">
  >({
    mutationFn: async (newEvent) => {
      if (!isEmpty(eventToEdit)) {
        return updateEvent(newEvent, eventToEdit.id);
      } else {
        return createEvent(newEvent);
      }
    },
    onSuccess: () => {
      navigate("/overview");
    },
  });

  return (
    <Flex w={"100%"} align={"center"} justify={"space-evenly"} mt={"18vh"}>
      <Flex align={"center"} gap={"xl"}>
        <Image src={imageUrl} radius={"md"} maw={400} mah={360} />
        {isNil(imageUrl) ? (
          <FileInput
            size={"lg"}
            placeholder={"Select event invitation image"}
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
      <form
        onSubmit={form.onSubmit(async (values) => {
          const image = (await getBase64Image()) ?? eventToEdit?.invitationImg;
          if (image) {
            mutateEvent({
              name: values.eventName,
              invitationImg: image as string,
              invitationTxt: values.invitationTxt,
              time: values.eventDate,
            });
          }
        })}
      >
        <Stack gap={"xl"}>
          <TextInput
            w={400}
            size={"xl"}
            label="Event name"
            placeholder="What's your event?"
            key={form.key("eventName")}
            {...form.getInputProps("eventName")}
            error={form.errors.eventName}
          />
          <DateTimePicker
            size={"lg"}
            clearable
            label="Event date and time"
            placeholder="Choose date and time of the event"
            {...form.getInputProps("eventDate")}
            error={form.errors.eventDate}
          />
          <Textarea
            w={400}
            size={"xl"}
            label="Event invitation text"
            placeholder="We’d be honored to have you celebrate our special day with us."
            key={form.key("invitationTxt")}
            {...form.getInputProps("invitationTxt")}
            error={form.errors.invitationTxt}
          />
          <Flex justify={"flex-end"}>
            <Button
              p={0}
              size={"md"}
              radius={"md"}
              type={"submit"}
              variant={"transparent"}
            >
              <Text size={"md"}>Save</Text>
            </Button>
          </Flex>
        </Stack>
      </form>
    </Flex>
  );
};

export { CreateEvent };
