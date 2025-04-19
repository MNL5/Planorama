import {
  abortablePutRequest,
  abortableGetRequest,
  abortablePostRequest,
} from "../abortable-request";
import { EventType } from "../../types/event";

const createEvent = (event: EventType) =>
  abortablePostRequest<EventType>("events", event);

const updateEvent = (event: Partial<EventType>) =>
  abortablePutRequest<EventType>(`events/${event.id}`, event);

const getEventList = () => abortableGetRequest("events/list");

export { createEvent, updateEvent, getEventList };
