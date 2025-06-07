import { AxiosResponse } from "axios";

import {
  abortableGetRequest,
  abortablePostRequest,
  abortableDeleteRequest,
} from "../abortable-request";
import { Schedule } from "../../types/schedule";
import { TimeSlot } from "../../types/time-slot";

const createTimeSlot = async (
  eventId: string,
  timeSlot: Omit<TimeSlot, "id">
) => {
  const response = await abortablePostRequest<Schedule>("schedules", {
    eventId,
    ...timeSlot,
  }).request;
  return response.data.schedule[0];
};

const getAllTimeSlots = async (eventId: string) => {
  const response: AxiosResponse<Schedule> = await abortableGetRequest<Schedule>(
    `schedules?event=${eventId}`
  ).request;
  return response.data.schedule;
};

const deleteTimeSlot = async (eventId: string, timeSlotId: string) => {
  const response: AxiosResponse<Schedule> =
    await abortableDeleteRequest<Schedule>(`schedules/${eventId}/${timeSlotId}`)
      .request;
  return response.data.schedule[0];
};

export { createTimeSlot, getAllTimeSlots, deleteTimeSlot };
