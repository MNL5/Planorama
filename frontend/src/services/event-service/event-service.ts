import {
  abortableGetRequest,
  abortablePutRequest,
  abortablePostRequest,
} from "../abortable-request";
import { EventType } from "../../types/event";
import { AxiosResponse } from "axios";

const createEvent = async (event: Omit<EventType, "id">) => {
  const response = await abortablePostRequest<EventType>(
    "events",
    event
  ).request;
  return response.data;
};

const updateEvent = async (eventToEdit: Omit<EventType, "id">, id: string) => {
  const response = await abortablePutRequest<EventType>(
    `events/${id}`,
    eventToEdit
  ).request;
  return response.data;
};

const getEventList = async () => {
  const response: AxiosResponse<EventType[]> = await abortableGetRequest<
    EventType[]
  >("events/list").request;
  return response.data;
};

const getEventByGuestId = (guestId: string) => {
  return abortableGetRequest<
    EventType
  >(`events?guest=${guestId}`);
};

export { createEvent, updateEvent, getEventList, getEventByGuestId };
