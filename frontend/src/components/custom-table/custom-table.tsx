import { useState } from "react";
import {
  Table,
  TextInput,
  ActionIcon,
  Group,
  Paper,
  Container,
} from "@mantine/core";
import { IconPencil, IconTrash, IconCheck, IconX } from "@tabler/icons-react";

interface Column<T> {
  key: keyof T;
  label: string;
}

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

function CustomTable<T extends { id: string }>({
  data: initialData,
  columns,
}: CustomTableProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<T>>({});

  const handleEditClick = (row: T) => {
    setEditRowId(row.id);
    setEditFormData({ ...row });
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  const handleInputChange = (field: keyof T, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveClick = () => {
    if (editRowId !== null) {
      setData((prev: T[]) =>
        prev.map((row: T) =>
          row.id === editRowId ? { ...row, ...editFormData } : row
        )
      );
      setEditRowId(null);
      setEditFormData({});
    }
  };

  const handleDeleteClick = (id: string) => {
    setData((prev: T[]) => prev.filter((row: T) => row.id !== id));
  };

  return (
    <Container size={"md"} mt={"xl"}>
      <Paper shadow={"md"} radius={"md"} p={"md"} withBorder>
        <Table
          withTableBorder
          highlightOnHover
          striped={false}
          withColumnBorders
        >
          <Table.Thead>
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={String(col.key)}>{col.label}</Table.Th>
              ))}
              <Table.Th />
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data.map((row) => (
              <Table.Tr key={row.id} bg={"gray.0"}>
                {columns.map((col) => (
                  <Table.Td key={String(col.key)}>
                    {editRowId === row.id ? (
                      <TextInput
                        value={(editFormData[col.key] as string) || ""}
                        onChange={(e) =>
                          handleInputChange(col.key, e.currentTarget.value)
                        }
                        size="xs"
                      />
                    ) : (
                      String(row[col.key])
                    )}
                  </Table.Td>
                ))}

                <Table.Td>
                  <Group gap="xs" align="center" justify="center">
                    {editRowId === row.id ? (
                      <>
                        <ActionIcon
                          color="green"
                          onClick={handleSaveClick}
                          variant="light"
                        >
                          <IconCheck size={18} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={handleCancelClick}
                          variant="light"
                        >
                          <IconX size={18} />
                        </ActionIcon>
                      </>
                    ) : (
                      <>
                        <ActionIcon
                          color={"blue"}
                          variant={"transparent"}
                          onClick={() => handleEditClick(row)}
                        >
                          <IconPencil size={18} />
                        </ActionIcon>
                        <ActionIcon
                          color={"red"}
                          variant={"transparent"}
                          onClick={() => handleDeleteClick(row.id)}
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}

export { CustomTable };
