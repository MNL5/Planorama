import { AxiosResponse } from "axios";

import {
  abortableGetRequest,
  abortablePostRequest,
  abortableDeleteRequest,
  abortablePutRequest,
} from "../abortable-request";
import { Schedule, TimeSlot } from "../../types/schedule";

const createTimeSlot = async (
  eventId: string,
  timeSlot: Omit<TimeSlot, "id">,
) => {
  const response = await abortablePostRequest<Schedule>("schedules", {
    eventId,
    ...timeSlot,
  }).request;
  return response.data.schedule[0];
};

const updateTimeSlot = async (
  eventId: string,
  timeSlot: TimeSlot,
) => {
  const response = await abortablePutRequest<Schedule>(`schedules/${eventId}/${timeSlot.id}`, timeSlot).request;
  return response.data.schedule[0];
};

const getAllTimeSlots = async (eventId: string) => {
  const response: AxiosResponse<Schedule> = await abortableGetRequest<Schedule>(
    `schedules?event=${eventId}`,
  ).request;
  return response.data.schedule ?? ([] as TimeSlot[]);
};

const deleteTimeSlot = async (eventId: string, timeSlotId: string) => {
  const response: AxiosResponse<Schedule> =
    await abortableDeleteRequest<Schedule>(`schedules/${eventId}/${timeSlotId}`)
      .request;
  return response.data.schedule[0];
};

export { createTimeSlot, getAllTimeSlots, deleteTimeSlot, updateTimeSlot };
