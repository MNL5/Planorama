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
  Tooltip,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { TimeInput } from "@mantine/dates";

import { TimeSlot } from "../../types/time-slot";
import { barColors, horizontalPadding } from "./consts";
import {
  formatTime,
  getMaxTime,
  getMinTime,
  timeStringToDate,
} from "../../utils/time-utils";

export const Schedule: React.FC = () => {
  const [events, setEvents] = useState<TimeSlot[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);

  const minTime = Number.isFinite(getMinTime(events)) ? getMinTime(events) : 0;
  const maxTime = Number.isFinite(getMaxTime(events)) ? getMaxTime(events) : 30;
  const totalMinutes = Math.max(maxTime - minTime, 30);

  const handleAdd = () => {
    setStartTime("");
    setEndTime("");
    setDescription("");
    setTouched(false);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!startTime || !endTime || !description) return;
    setEvents([
      ...events,
      {
        startTime: timeStringToDate(startTime),
        endTime: timeStringToDate(endTime),
        description,
      },
    ]);
    setModalOpen(false);
  };

  const isSaveDisabled: boolean =
    !startTime ||
    !endTime ||
    !description.trim() ||
    (startTime !== "" && endTime !== "" && endTime <= startTime);

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
            {events.length === 0 && (
              <Text c="dimmed" ta="center" py="md">
                No time slots yet. Click "Add Time Slot" to create one.
              </Text>
            )}
            {events.map((event, idx) => {
              const start =
                event.startTime.getHours() * 60 +
                event.startTime.getMinutes() -
                minTime;
              const duration =
                event.endTime.getHours() * 60 +
                event.endTime.getMinutes() -
                (event.startTime.getHours() * 60 + event.endTime.getMinutes());
              const left = (start / totalMinutes) * 100;
              const width = (duration / totalMinutes) * 100;
              return (
                <Box key={idx} style={{ position: "relative", height: 40 }}>
                  <Tooltip
                    label={`${formatTime(event.startTime)} - ${formatTime(
                      event.endTime
                    )}`}
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
                      }}
                    >
                      {event.description}
                    </Box>
                  </Tooltip>
                </Box>
              );
            })}
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
              error={
                touched && startTime && endTime && endTime <= startTime
                  ? "End time must be after start time"
                  : undefined
              }
            />
            <TextInput
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              required
              placeholder="Enter description"
              w="100%"
            />
            <Button
              mt="md"
              onClick={handleSave}
              disabled={isSaveDisabled}
              fullWidth
            >
              Save
            </Button>
          </Stack>
        </Modal>
      </Card>
    </Box>
  );
};
