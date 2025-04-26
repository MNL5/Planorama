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
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateTimePicker } from "@mantine/dates";
import { useMutation } from "@tanstack/react-query";

import {
  createEvent,
  updateEvent,
} from "../../services/event-service/event-service";
import { EventType } from "../../types/event";
import { fileToBase64 } from "../../utils/image-utils";
import { useEventContext } from "../../contexts/event-context";
import { toast } from "react-toastify";
import InvitationModal from "../invitationModal/invitationModal";

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { currentEvent, setCurrentEvent } = useEventContext();
  const [invitationImage, setInvitationImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<EventType | null>(null);
  const fileInputRef = useRef<HTMLButtonElement>(null);

  const form = useForm({
    initialValues: {
      eventName: currentEvent?.name ?? "",
      invitationText: currentEvent?.invitationText ?? "",
      eventDate: currentEvent?.time ? new Date(currentEvent?.time) : new Date(),
    },
    validate: {
      eventName: (value) => (value.trim() ? null : "event name is required"),
      invitationText: (value) =>
        value.trim() ? null : "event invitation text is required",
      eventDate: (value) => (value ? null : "Please select a date and time"),
    },
  });

  const imageUrl = useMemo(() => {
    return invitationImage
      ? URL.createObjectURL(invitationImage)
      : currentEvent?.invitationImg;
  }, [invitationImage, currentEvent]);

  const getBase64Image = async () => {
    if (invitationImage) {
      return await fileToBase64(invitationImage);
    }
    return null;
  };

  const handeImagePicker = () => {
    fileInputRef.current?.click();
  };

  const getEventPreview = async (
    values: { eventName: string; invitationText: string; eventDate: Date },
    checkFields = false
  ) => {
    const image = (await getBase64Image()) ?? currentEvent?.invitationImg;
    if (
      image &&
      (!checkFields ||
        (values.eventName && values.invitationText && values.eventDate))
    ) {
      return {
        name: values.eventName,
        invitationImg: image as string,
        invitationText: values.invitationText,
        time: values.eventDate,
      };
    }
  };

  const { mutate: mutateEvent } = useMutation<
    EventType,
    Error,
    Omit<EventType, "id">
  >({
    mutationFn: async (newEvent) => {
      if (!isEmpty(currentEvent)) {
        return updateEvent(newEvent, currentEvent.id);
      } else {
        return createEvent(newEvent);
      }
    },
    onSuccess: (event: EventType) => {
      setCurrentEvent(event);
      if (isEmpty(currentEvent)) {
        navigate("/guests");
      } else {
        toast.success("Event updated successfully");
      }
    },
  });

  return (
    <Flex w={"100%"} align={"center"} justify={"space-evenly"} style={{ flex: "1 1" }}>
      <Flex align={"center"} gap={"xl"}>
        <Image src={imageUrl} radius={"md"} maw={400} mah={360} />
        <FileInput
          size={"lg"}
          style={{ display: "none" }}
          value={invitationImage}
          accept={"image/*"}
          ref={fileInputRef}
          onChange={(file) => {
            if (file) {
              setInvitationImage(file);
            }
          }}
        />
        <Button
          size={"xl"}
          radius={"md"}
          variant={"light"}
          onClick={handeImagePicker}
        >
          <Text size={"xl"}>
            {isNil(imageUrl)
              ? "Select event invitation image"
              : "Change event invitation image"}
          </Text>
        </Button>
      </Flex>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const preview = await getEventPreview(values);
          if (preview) {
            mutateEvent(preview);
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
            key={form.key("invitationText")}
            {...form.getInputProps("invitationText")}
            error={form.errors.invitationText}
          />
          <Flex justify={"flex-end"}>
            <Button
              p={0}
              size={"md"}
              radius={"md"}
              mr={"xl"}
              type={"button"}
              onClick={async () => {
                const preview = await getEventPreview(form.values, true);
                if (preview) {
                  setPreview(preview as EventType);
                } else {
                  toast.error(
                    "Please fill all the fields to preview the invitation"
                  );
                }
              }}
              variant={"transparent"}
            >
              <Text size={"md"}>Preview</Text>
            </Button>
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
      {preview && (
        <InvitationModal event={preview} onClose={() => setPreview(null)} />
      )}
    </Flex>
  );
};

export { CreateEvent };
