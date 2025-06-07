import { AxiosResponse } from "axios";

import {
  abortableGetRequest,
  abortablePostRequest,
  abortableDeleteRequest,
} from "../abortable-request";
import { TimeSlot } from "../../types/time-slot";

const createTimeSlot = async (
  eventId: string,
  timeSlot: Omit<TimeSlot, "id">
) => {
  const response = await abortablePostRequest<TimeSlot>("schedules", {
    eventId,
    ...timeSlot,
  }).request;
  return response.data;
};

const getAllTimeSlots = async (eventId: string) => {
  const response: AxiosResponse<TimeSlot[]> = await abortableGetRequest<
    TimeSlot[]
  >(`schedules?event=${eventId}`).request;
  return response.data;
};

const deleteTimeSlot = async (id: string) => {
  const response: AxiosResponse<TimeSlot> =
    await abortableDeleteRequest<TimeSlot>(`schedules/${id}`).request;
  return response.data;
};

export { createTimeSlot, getAllTimeSlots, deleteTimeSlot };
