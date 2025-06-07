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

function toIsoDateTimeString(date: Date, time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result.toISOString();
}

function getMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export { formatTime, getMinTime, getMaxTime, toIsoDateTimeString, getMinutes };
