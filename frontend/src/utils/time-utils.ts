import { FormattedTimeSlot } from "../types/time-slot";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getMinTime(timeSlots: FormattedTimeSlot[]) {
  if (timeSlots.length === 0) return 0;
  return Math.min(
    ...timeSlots.map(
      (t) => t.startTime.getHours() * 60 + t.startTime.getMinutes()
    )
  );
}

function getMaxTime(timeSlots: FormattedTimeSlot[]) {
  if (timeSlots.length === 0) return 60;
  return Math.max(
    ...timeSlots.map((t) => t.endTime.getHours() * 60 + t.endTime.getMinutes())
  );
}

function timeToIsoTimeString(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:00`;
}

export { formatTime, getMinTime, getMaxTime, timeToIsoTimeString };
