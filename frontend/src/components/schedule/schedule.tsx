import {
  Box,
  Card,
  Text,
  Paper,
  Modal,
  Stack,
  Group,
  Title,
  Button,
  Loader,
  Center,
  Tooltip,
  TextInput,
} from "@mantine/core";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import { TimeInput } from "@mantine/dates";
import { IconTrash } from "@tabler/icons-react";
import { useQuery, useMutation } from "@tanstack/react-query";

import {
  formatTime,
  getMaxTime,
  getMinTime,
  getMinutes,
  toIsoDateTimeString,
} from "../../utils/time-utils";
import { barColors, horizontalPadding, minSlotMinutes } from "./consts";
import {
  deleteTimeSlot,
  createTimeSlot,
  getAllTimeSlots,
} from "../../services/time-slot-service/time-slot-service";
import { useEventContext } from "../../contexts/event-context";
import { FormattedTimeSlot, TimeSlot } from "../../types/time-slot";

export const Schedule: React.FC = () => {
  const { currentEvent } = useEventContext();
  const {
    data: timeSlots = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TimeSlot[], Error>({
    queryKey: ["timeSlots"],
    queryFn: () => getAllTimeSlots(currentEvent?.id as string),
    enabled: !!currentEvent?.id,
  });

  const formattedTimeSlots: FormattedTimeSlot[] = useMemo(() => {
    return timeSlots.map((slot) => ({
      ...slot,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
    }));
  }, [timeSlots]);

  const createMutation = useMutation<TimeSlot, Error, Omit<TimeSlot, "id">>({
    mutationFn: (newTimeSlot) =>
      createTimeSlot(currentEvent?.id as string, newTimeSlot),
    onSuccess: () => {
      toast.success("Time slot created successfully");
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

  const [modalOpen, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [contextMenuIdx, setContextMenuIdx] = useState<number | null>(null);
  const [menuOpened, setMenuOpened] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const minTime = useMemo(() => {
    const min = getMinTime(formattedTimeSlots);
    return formattedTimeSlots ? (Number.isFinite(min) ? min : 0) : 0;
  }, [formattedTimeSlots]);

  const maxTime = useMemo(() => {
    const max = getMaxTime(formattedTimeSlots);
    return formattedTimeSlots ? (Number.isFinite(max) ? max : 30) : 30;
  }, [formattedTimeSlots]);

  const totalMinutes = useMemo(
    () => Math.max(maxTime - minTime, 30),
    [maxTime, minTime]
  );

  const handleAdd = () => {
    setStartTime("");
    setEndTime("");
    setDescription("");
    setModalOpen(true);
  };

  const isSaveDisabled: boolean =
    !startTime ||
    !endTime ||
    !description.trim() ||
    (startTime !== "" &&
      endTime !== "" &&
      (endTime <= startTime ||
        getMinutes(endTime) - getMinutes(startTime) < minSlotMinutes));

  const errorMessage = useMemo(() => {
    if (!startTime || !endTime || !description.trim()) {
      return "Missing required fields.";
    } else if (startTime && endTime && startTime >= endTime) {
      return "End time must be after start time.";
    } else if (getMinutes(endTime) - getMinutes(startTime) < minSlotMinutes) {
      return `Time slot must be at least ${minSlotMinutes} minutes long.`;
    } else if (!currentEvent?.time) {
      return "Event date is not set.";
    } else {
      return "";
    }
  }, [startTime, endTime, description, currentEvent]);

  const handleSave = async () => {
    if (isSaveDisabled || !currentEvent?.time) return;
    await createMutation.mutateAsync({
      startTime: toIsoDateTimeString(currentEvent.time, startTime),
      endTime: toIsoDateTimeString(currentEvent.time, endTime),
      description,
    });
    setModalOpen(false);
  };

  const handleRightClick = (event: React.MouseEvent, idx: number) => {
    event.preventDefault();
    setContextMenuIdx(idx);
    setMenuPosition({ x: event.clientX, y: event.clientY });
    setMenuOpened(true);
  };

  const handleDelete = async () => {
    if (contextMenuIdx === null) return;
    const slot = timeSlots[contextMenuIdx];
    if (slot && slot.id) {
      await deleteMutation.mutateAsync(slot.id);
    }
    setContextMenuIdx(null);
    setMenuOpened(false);
    setMenuPosition(null);
  };

  const handleMenuClose = () => {
    setContextMenuIdx(null);
    setMenuOpened(false);
    setMenuPosition(null);
  };

  return (
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
          maxWidth: "60vw",
          width: "100%",
        }}
      >
        <Group justify="space-between" mb="md">
          <Title order={2} c={"primary"} fw={700}>
            Event Schedule
          </Title>
          <Button onClick={handleAdd}>Add Time Slot</Button>
        </Group>
        <Paper
          shadow="xs"
          radius="md"
          p="md"
          withBorder
          style={{
            position: "relative",
            width: "100%",
            minHeight: 240,
            paddingBottom: 72,
            background: "#f8fafc",
            overflow: "hidden",
            paddingLeft: horizontalPadding,
            paddingRight: horizontalPadding,
          }}
        >
          <Stack gap="xs">
            {isLoading ? (
              <Center py="md">
                <Loader />
              </Center>
            ) : isError ? (
              <Text c="red" ta="center" py="md">
                {error instanceof Error
                  ? error.message
                  : "Failed to load time slots."}
              </Text>
            ) : (
              formattedTimeSlots &&
              (formattedTimeSlots.length === 0 ? (
                <Text c="dimmed" ta="center" py="md">
                  No time slots yet. Click "Add Time Slot" to create one.
                </Text>
              ) : (
                formattedTimeSlots.map((timeSlot, idx) => {
                  const start =
                    timeSlot.startTime.getHours() * 60 +
                    timeSlot.startTime.getMinutes() -
                    minTime;
                  const duration =
                    timeSlot.endTime.getHours() * 60 +
                    timeSlot.endTime.getMinutes() -
                    (timeSlot.startTime.getHours() * 60 +
                      timeSlot.startTime.getMinutes());
                  const left = (start / totalMinutes) * 100;
                  const width = (duration / totalMinutes) * 100;
                  return (
                    <Box
                      key={timeSlot.id ?? idx}
                      style={{ position: "relative", height: 40 }}
                      onContextMenu={(e) => handleRightClick(e, idx)}
                    >
                      <Tooltip
                        label={
                          <>
                            <span style={{ fontWeight: 400 }}>
                              {timeSlot.description}
                            </span>
                            <br />
                            {`${formatTime(timeSlot.startTime)} - ${formatTime(
                              timeSlot.endTime
                            )}`}
                          </>
                        }
                        withArrow
                        transitionProps={{ transition: "pop", duration: 150 }}
                      >
                        <Box
                          style={{
                            position: "absolute",
                            top: 4,
                            height: 32,
                            background: barColors[idx % barColors.length],
                            borderRadius: 6,
                            width: `calc(${width}% - 8px)`,
                            marginLeft: `calc(${left}% )`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#222",
                            fontWeight: 500,
                            fontSize: 14,
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            transition: "all 0.3s",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            left: 0,
                            right: 0,
                            userSelect: "none",
                          }}
                        >
                          {timeSlot.description}
                        </Box>
                      </Tooltip>
                      {/* Custom Context Menu */}
                      {menuOpened && contextMenuIdx === idx && menuPosition && (
                        <div
                          style={{
                            position: "fixed",
                            left: menuPosition.x,
                            top: menuPosition.y,
                            zIndex: 9999,
                            minWidth: 140,
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: 6,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            padding: 0,
                          }}
                          onMouseLeave={handleMenuClose}
                        >
                          <Button
                            variant="subtle"
                            color="red"
                            fullWidth
                            leftSection={<IconTrash size={18} />}
                            onClick={async () => {
                              await handleDelete();
                              handleMenuClose();
                            }}
                            style={{ borderRadius: 0, background: "#fff" }}
                          >
                            Delete Time Slot
                          </Button>
                        </div>
                      )}
                    </Box>
                  );
                })
              ))
            )}
          </Stack>
          {/* Time axis */}
          <Box
            style={{
              position: "absolute",
              left: horizontalPadding,
              right: horizontalPadding,
              bottom: 4,
              height: 32,
              pointerEvents: "none",
            }}
          >
            <Box
              style={{
                borderTop: "1px solid #ccc",
                position: "relative",
                height: 1,
                top: 12,
              }}
            >
              {[
                ...Array(
                  Math.max(1, 1 + Math.floor(Math.max(0, totalMinutes) / 30))
                ),
              ].map((_, i) => {
                const minutes = minTime + i * 30;
                const h = String(Math.floor(minutes / 60)).padStart(2, "0");
                const m = String(minutes % 60).padStart(2, "0");
                return (
                  <Text
                    key={i}
                    size="xs"
                    c="dimmed"
                    style={{
                      position: "absolute",
                      left: `${
                        totalMinutes === 0 ? 0 : ((i * 30) / totalMinutes) * 100
                      }%`,
                      top: 4,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {h}:{m}
                  </Text>
                );
              })}
            </Box>
          </Box>
        </Paper>
        <Modal
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add Time Slot"
          centered
        >
          <Stack w="100%">
            <TimeInput
              label="Start Time"
              value={startTime}
              onChange={(event) => setStartTime(event.currentTarget.value)}
              required
              withSeconds={false}
              placeholder="Pick start time"
              w="100%"
            />
            <TimeInput
              label="End Time"
              value={endTime}
              onChange={(event) => setEndTime(event.currentTarget.value)}
              required
              withSeconds={false}
              placeholder="Pick end time"
              w="100%"
            />
            <TextInput
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              required
              placeholder="Enter description"
              w="100%"
            />
            <Tooltip label={errorMessage} disabled={!errorMessage}>
              <Button
                mt="md"
                onClick={handleSave}
                disabled={
                  isSaveDisabled ||
                  createMutation.isPending ||
                  !currentEvent?.time
                }
                fullWidth
                loading={createMutation.isPending}
              >
                Save
              </Button>
            </Tooltip>
          </Stack>
        </Modal>
      </Card>
    </Box>
  );
};
