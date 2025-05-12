import {
  Button,
  FileInput,
  Flex,
  Image,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { toast } from "react-toastify";
import { isEmpty, isNil } from "lodash";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { DateTimePicker } from "@mantine/dates";
import { useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  createEvent,
  updateEvent,
} from "../../services/event-service/event-service";
import { fileToBase64 } from "../../utils/image-utils";
import { useEventContext } from "../../contexts/event-context";
import InvitationModal from "../invitationModal/invitationModal";
import { Event, CreateEvent as EventToCreate } from "../../types/event";
import MainLoader from "../mainLoader/MainLoader";

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLButtonElement>(null);
  const [preview, setPreview] = useState<Event | null>(null);
  const { currentEvent, setCurrentEvent } = useEventContext();
  const [invitationImage, setInvitationImage] = useState<File | null>(null);

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

  const { mutate: mutateEvent, isPending } = useMutation<Event, Error, EventToCreate>({
    mutationFn: async (newEvent) => {
      if (!isEmpty(currentEvent)) {
        return updateEvent(newEvent, currentEvent.id);
      } else {
        return createEvent(newEvent);
      }
    },
    onSuccess: (event) => {
      setCurrentEvent(event);
      if (isEmpty(currentEvent)) {
        navigate("/guests");
      } else {
        toast.success("Event updated successfully");
      }
    },
  });

  return (
    <Flex
      w={"100%"}
      align={"flex-start"}
      justify={"space-evenly"}
      style={{ marginTop: "16vh" }}
    >
      <MainLoader isPending={isPending} />
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
            size={"lg"}
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
            size={"lg"}
            label="Event invitation text"
            placeholder="We’d be honored to have you celebrate our special day with us."
            key={form.key("invitationText")}
            {...form.getInputProps("invitationText")}
            error={form.errors.invitationText}
          />
          <Flex justify={"flex-end"}>
            <Button
              size={"md"}
              radius={"md"}
              mr={"xl"}
              type={"button"}
              onClick={async () => {
                const preview = await getEventPreview(form.values, true);
                if (preview) {
                  setPreview(preview as Event);
                } else {
                  toast.error(
                    "Please fill all the fields to preview the invitation"
                  );
                }
              }}
              variant={"light"}
            >
              <Text size={"md"}>Preview</Text>
            </Button>
            <Button
              size={"md"}
              radius={"md"}
              type={"submit"}
              variant={"light"}
            >
              <Text size={"md"}>Save</Text>
            </Button>
          </Flex>
        </Stack>
      </form>
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
              ? "Select Invitation Image"
              : "Change Invitation Image"}
          </Text>
        </Button>
      </Flex>
      {preview && (
        <InvitationModal event={preview} onClose={() => setPreview(null)} />
      )}
    </Flex>
  );
};

export { CreateEvent };
