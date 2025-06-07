import { TimeSlot } from "../types/time-slot";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getMinTime(events: TimeSlot[]) {
  if (events.length === 0) return 0;
  return Math.min(
    ...events.map((e) => e.startTime.getHours() * 60 + e.startTime.getMinutes())
  );
}

function getMaxTime(events: TimeSlot[]) {
  if (events.length === 0) return 60;
  return Math.max(
    ...events.map((e) => e.endTime.getHours() * 60 + e.endTime.getMinutes())
  );
}

function timeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export { formatTime, getMinTime, getMaxTime, timeStringToDate };
