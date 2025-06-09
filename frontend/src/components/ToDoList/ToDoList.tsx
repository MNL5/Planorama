import { useEffect, useState } from "react";
import {
  Container,
  TextInput,
  Button,
  Checkbox,
  Group,
  Paper,
  Text,
  Stack,
  Title,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import Task from "../../types/task";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/TaskService/TaskService";
import { toast } from "react-toastify";
import { useEventContext } from "../../contexts/event-context";

const TodoList = () => {
  const { currentEvent } = useEventContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const eventId = currentEvent?.id;

  const loadTasks = async () => {
    if (!eventId) return;
    try {
      setLoading(true);
      const data = await getAllTasks(eventId);
      setTasks(data);
    } catch (err) {
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newDescription.trim() || !eventId) return;
    try {
      const newTask = await createTask({
        eventId,
        description: newDescription.trim(),
        fulfilled: false,
      });
      setTasks((prev) => [...prev, newTask]);
      setNewDescription("");
    } catch {
      toast.error("Failed to add task.");
    }
  };

  const handleToggleDone = async (task: Task) => {
    try {
      const updated = await updateTask({
        ...task,
        fulfilled: !task.fulfilled,
      });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch {
      toast.error("Failed to update task.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error("Failed to delete task.");
    }
  };

  return (
    <Container py="xl" style={{ width: "35rem" }}>
      <Title order={2} mb="md">
        To Do List
      </Title>

      {!eventId ? (
        <Text c="dimmed">No event selected.</Text>
      ) : (
        <>
          <Group align="flex-end" mb="xl">
            <TextInput
              label="New Task"
              placeholder="What do you need to do?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button
              onClick={handleAddTask}
              leftSection={<IconPlus size={18} />}
            >
              Add
            </Button>
          </Group>

          {loading ? (
            <Loader />
          ) : (
            <Stack>
              {tasks.length === 0 && <Text c="dimmed">No tasks yet</Text>}
              {tasks.map((task) => (
                <Paper
                  key={task.id}
                  withBorder
                  p="sm"
                  radius="md"
                  bg={task.fulfilled ? "gray.1" : "white"}
                >
                  <Group justify="space-between">
                    <Checkbox
                      label={task.description}
                      checked={task.fulfilled}
                      onChange={() => handleToggleDone(task)}
                      styles={{
                        label: {
                          textDecoration: task.fulfilled
                            ? "line-through"
                            : "none",
                          color: task.fulfilled ? "#888" : "inherit",
                        },
                      }}
                    />
                    <ActionIcon
                      color="red"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
        </>
      )}
    </Container>
  );
};

export default TodoList;
