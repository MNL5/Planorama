interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface FormattedTimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  description: string;
}

export type { TimeSlot, FormattedTimeSlot };
