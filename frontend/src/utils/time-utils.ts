import { TimeSlot } from "../types/time-slot";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getMinTime(timeSlots: TimeSlot[]) {
  if (timeSlots.length === 0) return 0;
  return Math.min(
    ...timeSlots.map(
      (t) => t.startTime.getHours() * 60 + t.startTime.getMinutes()
    )
  );
}

function getMaxTime(timeSlots: TimeSlot[]) {
  if (timeSlots.length === 0) return 60;
  return Math.max(
    ...timeSlots.map((t) => t.endTime.getHours() * 60 + t.endTime.getMinutes())
  );
}

function timeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export { formatTime, getMinTime, getMaxTime, timeStringToDate };
