import { Box, Card, Group, Text, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import Scheduler from "devextreme-react/scheduler";

import {
  createTimeSlot,
  deleteTimeSlot,
  getAllTimeSlots,
  updateTimeSlot,
} from "../../services/time-slot-service/time-slot-service";
import { useEventContext } from "../../contexts/event-context";
import MainLoader from "../mainLoader/MainLoader";
import { toast } from "react-toastify";
import { TimeSlot } from "../../types/schedule";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "@mui/material";

export const Schedule: React.FC = () => {
  const { currentEvent } = useEventContext();
  const schedulerRef = useRef<Scheduler>(null);
  const date = useRef(new Date(currentEvent?.time || Date.now()));
  const {
    data: timeSlots = [],
    isLoading,
    isError,
    isFetching,
    isSuccess,
    refetch,
  } = useQuery<TimeSlot[], Error>({
    queryKey: ["timeSlots"],
    queryFn: () => getAllTimeSlots(currentEvent?.id as string),
    enabled: !!currentEvent?.id,
  });
  const createMutation = useMutation<TimeSlot, Error, Omit<TimeSlot, "id">>({
    mutationFn: (newTimeSlot) =>
      createTimeSlot(currentEvent?.id as string, newTimeSlot),
    onSuccess: () => {
      toast.success("Time slot created successfully");
      refetch();
    },
  });

  const updateMutation = useMutation<TimeSlot, Error, TimeSlot>({
    mutationFn: (newTimeSlot) =>
      updateTimeSlot(currentEvent?.id as string, newTimeSlot),
    onSuccess: () => {
      toast.success("Time slot updated successfully");
      refetch();
    },
  });

  const deleteMutation = useMutation<TimeSlot, Error, string>({
    mutationFn: (timeSlotId) =>
      deleteTimeSlot(currentEvent?.id as string, timeSlotId),
    onSuccess: () => {
      toast.success("Time slot deleted successfully");
      refetch();
    },
  });

  const data = timeSlots.map((slot) => ({
    id: slot.id,
    startDate: new Date(slot.startTime),
    endDate: new Date(slot.endTime),
    text: slot.text,
    description: slot.description,
  }));

  const onAdded = useCallback(
    (e) => {
      createMutation.mutate({
        startTime: e.appointmentData.startDate,
        endTime: e.appointmentData.endDate,
        text: e.appointmentData.text,
        description: e.appointmentData.description,
      });
    },
    [createMutation],
  );
  const onUpdated = useCallback(
    (e) => {
      updateMutation.mutate({
        id: e.appointmentData.id,
        startTime: e.appointmentData.startDate,
        endTime: e.appointmentData.endDate,
        text: e.appointmentData.text,
        description: e.appointmentData.description,
      });
    },
    [updateMutation],
  );

  const onDeleted = useCallback(
    (e) => {
      deleteMutation.mutate(e.appointmentData.id);
    },
    [deleteMutation],
  );

  const onAppointmentFormOpening = useCallback((e) => {
    const { form } = e;

    // Get current form items
    const items = form.option("items");

    // Locate the "Main" tab (usually contains startDate, endDate, allDay)
    const mainGroup = items.find((item) => item.name === "mainGroup");
    if (mainGroup && Array.isArray(mainGroup.items)) {
      // Filter out the "allDay" field
      mainGroup.items = mainGroup.items.filter((_, i) => i !== 2); // Assuming "allDay" is the third item (index 2)
      mainGroup.items.forEach((item) => {
        if (item.dataField === "text") {
          // Add validation rule
          item.validationRules = [
            {
              type: "required",
              message: "Subject is required",
            },
          ];
        }
      });
    }

    form.option("items", items);
  }, []);

  const handleAdd = useCallback(() => {
    if (schedulerRef.current) {
      schedulerRef.current.instance.showAppointmentPopup(
        {
          startDate: date.current,
          endDate: new Date(date.current.getTime() + 3600000), // Default to 1 hour later
          text: "",
          description: "",
        },
        true,
      );
    }
  }, []);

  const viewRef = useRef<Array<"timelineDay" | "week">>([
    "timelineDay",
    "week",
  ]);

  useEffect(() => {
    if (isSuccess && currentEvent && schedulerRef.current) {
      schedulerRef.current.instance.scrollTo(date.current);
    }
  }, [isSuccess, currentEvent]);

  return isSuccess && currentEvent ? (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        minHeight: "100px",
        marginTop: 32,
      }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{
          maxWidth: "80vw",
          width: "100%",
        }}
      >
        <Group justify="space-between" mb="md">
          <Title order={2} c={"primary"} fw={700}>
            Event Schedule
          </Title>
          <Button onClick={handleAdd}>Add Time Slot</Button>
        </Group>
        <MainLoader isPending={isFetching} />
        <Scheduler
          ref={schedulerRef}
          timeZone="Asia/Jerusalem"
          dataSource={data}
          views={viewRef.current}
          defaultCurrentView="timelineDay"
          defaultCurrentDate={date.current}
          height={580}
          onAppointmentAdded={onAdded}
          onAppointmentUpdated={onUpdated}
          onAppointmentDeleted={onDeleted}
          onAppointmentFormOpening={onAppointmentFormOpening}
        ></Scheduler>
      </Card>
    </Box>
  ) : isLoading ? (
    <MainLoader isPending />
  ) : isError ? (
    <Text>Oops! Something went wrong. Please try again later.</Text>
  ) : null;
};
