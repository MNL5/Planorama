import { AxiosResponse } from "axios";

import {
  abortableGetRequest,
  abortablePostRequest,
} from "../abortable-request";
import { Gift } from "../../types/gift";

const createGift = async (eventId: string, gift: Omit<Gift, "id">) => {
  const response = await abortablePostRequest<Gift>("gifts", {
    eventId,
    ...gift,
  }).request;
  return response.data;
};

const getAllGifts = async (eventId: string) => {
  const response: AxiosResponse<Gift[]> = await abortableGetRequest<Gift[]>(
    `gifts?event=${eventId}  `,
  ).request;
  return response.data;
};

export { createGift, getAllGifts };
