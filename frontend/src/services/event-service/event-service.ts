import { AxiosResponse } from "axios";

import {
    abortableGetRequest,
    abortablePutRequest,
    abortablePostRequest,
} from '../abortable-request';
import { CreateEvent, Event } from '../../types/event';

const createEvent = async (event: CreateEvent) => {
    const response = await abortablePostRequest<Event>('events', event).request;
    return response.data;
};

const updateEvent = async (
    eventToEdit: Partial<Omit<Event, 'id'>>,
    id: string
) => {
    const response = await abortablePutRequest<Event>(
        `events/${id}`,
        eventToEdit
    ).request;
    return response.data;
};

const getEventList = async () => {
    const response: AxiosResponse<Event[]> = await abortableGetRequest<Event[]>(
        'events/list'
    ).request;
    return response.data;
};

const getEventByGuestId = (guestId: string) => {
    return abortableGetRequest<Event>(`events?guest=${guestId}`);
};

export { createEvent, updateEvent, getEventList, getEventByGuestId };
