import { AxiosResponse } from "axios";

import {
  abortableGetRequest,
  abortablePutRequest,
  abortablePostRequest,
  abortableDeleteRequest,
} from "../abortable-request";
import { Guest } from "../../types/guest";

const createGuest = async (eventId: string, guest: Omit<Guest, "id">) => {
  const response = await abortablePostRequest<Guest>("guests", {
    eventId,
    ...guest,
  }).request;
  return response.data;
};

const updateGuest = async (
  eventId: string,
  guestToEdit: Omit<Guest, "id">,
  id: string
) => {
  const response = await abortablePutRequest<Guest>(`guests/${id}`, {
    eventId,
    ...guestToEdit,
  }).request;
  return response.data;
};

const getAllGuests = async (eventId: string) => {
  const response: AxiosResponse<Guest[]> = await abortableGetRequest<Guest[]>(
    `guests?event=${eventId}  `
  ).request;
  return response.data;
};

const deleteGuest = (id: string) => {
  return abortableDeleteRequest<Guest>(`guests/${id}`);
};

export { createGuest, updateGuest, getAllGuests, deleteGuest };
