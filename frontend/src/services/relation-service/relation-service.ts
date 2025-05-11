import { AxiosResponse } from "axios";

import {
  abortableGetRequest,
  abortablePutRequest,
  abortablePostRequest,
  abortableDeleteRequest,
} from "../abortable-request";
import { GuestRelation } from "../../types/guest-relation";

const createRelation = async (
  eventId: string,
  guestRelation: Omit<GuestRelation, "id">
) => {
  const response = await abortablePostRequest<GuestRelation>("relations", {
    eventId,
    ...guestRelation,
  }).request;
  return response.data;
};

const updateRelation = async (
  eventId: string,
  relationToEdit: Omit<GuestRelation, "id">,
  id: string
) => {
  const response = await abortablePutRequest<GuestRelation>(`relations/${id}`, {
    eventId,
    ...relationToEdit,
  }).request;
  return response.data;
};

const getAllRelations = async (eventId: string) => {
  const response: AxiosResponse<GuestRelation[]> = await abortableGetRequest<
    GuestRelation[]
  >(`relations?event=${eventId}`).request;
  return response.data;
};

const deleteRelation = async (id: string) => {
  const response: AxiosResponse<GuestRelation> =
    await abortableDeleteRequest<GuestRelation>(`relations/${id}`).request;
  return response.data;
};

export { createRelation, updateRelation, getAllRelations, deleteRelation };
