import {
  abortableGetRequest,
  abortablePutRequest,
  abortablePostRequest,
} from "../abortable-request";
import { EventType } from "../../types/event";
import { AxiosResponse } from "axios";

const createEvent = (event: EventType) =>
  abortablePostRequest<EventType>("events", event);

const updateEvent = (event: Partial<EventType>) =>
  abortablePutRequest<EventType>(`events/${event.id}`, event);

const getEventList = async () => {
  const response: AxiosResponse<EventType[]> = await abortableGetRequest<
    EventType[]
  >("events/list").request;
  return response.data;
};

export { createEvent, updateEvent, getEventList };
