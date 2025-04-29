import httpClient from '../http-client';
import Element from '../../types/element';
import { abortablePostRequest } from '../abortable-request';

const load = () => httpClient.get<{elements: Element[]}>('/seating/load');
const save = (elements: Element[]) =>
    abortablePostRequest<void>('/seating/save', elements);

export default { load, save };
