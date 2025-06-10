interface Schedule {
  id: string;
  schedule: TimeSlot[];
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
  text: string;
}

export type { Schedule, TimeSlot };
