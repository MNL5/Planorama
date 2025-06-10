import { AxiosResponse } from "axios";
import Task from "../../types/task";
import {
  abortableDeleteRequest,
  abortableGetRequest,
  abortablePostRequest,
  abortablePutRequest,
} from "../abortable-request";

const getAllTasks = async (eventId: string) => {
  const response: AxiosResponse<Task[]> = await abortableGetRequest<Task[]>(
    `tasks?event=${eventId}`,
  ).request;
  return response.data;
};

const createTask = async (task: Omit<Task, "id">) => {
  const response = await abortablePostRequest<Task>("tasks", {
    ...task,
  }).request;
  return response.data;
};

const updateTask = async (task: Task) => {
  const response = await abortablePutRequest<Task>(`tasks/${task.id}`, {
    description: task.description,
    fulfilled: task.fulfilled,
  }).request;
  return response.data;
};

const deleteTask = async (taskId: string) => {
  const response = await abortableDeleteRequest<Task>(`tasks/${taskId}`)
    .request;
  return response.data;
};
export { getAllTasks, createTask, updateTask, deleteTask };
