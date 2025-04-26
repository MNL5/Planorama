import {
  Table,
  Group,
  Paper,
  Select,
  Container,
  TextInput,
  ActionIcon,
  MultiSelect,
} from "@mantine/core";
import { useState } from "react";
import { isEmpty } from "lodash";
import { useDisclosure } from "@mantine/hooks";
import {
  IconX,
  IconPlus,
  IconTrash,
  IconCheck,
  IconPencil,
} from "@tabler/icons-react";

import { Column } from "../../types/column";
import { AddRowModal } from "./add-row-modal";

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

function CustomTable<T extends { id: string }>({
  data: initialData,
  columns,
}: CustomTableProps<T>) {
  const [opened, { open, close }] = useDisclosure();
  const [data, setData] = useState<T[]>(initialData);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<T>>({});
  const [lastId, setLastId] = useState<number>(initialData.length);

  const handleAddRow = (newRow: T) => {
    setData((prev) => [...prev, newRow]);
    setLastId(lastId + 1);
    close();
  };

  const handleEditClick = (row: T) => {
    setEditRowId(row.id);
    setEditFormData({ ...row });
  };

  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  const handleInputChange = (field: keyof T, value: string | string[]) => {
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
        <Group justify={"flex-end"} mb={"md"}>
          <ActionIcon
            size={40}
            onClick={open}
            variant={"light"}
            color={"primary"}
          >
            <IconPlus size={24} />
          </ActionIcon>
        </Group>
        <AddRowModal
          opened={opened}
          onClose={close}
          onAddRow={handleAddRow}
          columns={columns}
          lastId={lastId}
        />
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
                    {editRowId === row.id && col.isEdit ? (
                      isEmpty(col.values) ? (
                        <TextInput
                          size={"xs"}
                          value={(editFormData[col.key] as string) || ""}
                          onChange={(e) =>
                            handleInputChange(col.key, e.currentTarget.value)
                          }
                        />
                      ) : col.isMulti ? (
                        <MultiSelect
                          w={200}
                          value={(editFormData[col.key] as string[]) || ""}
                          data={col.values?.map((value) => ({
                            value,
                            label: value,
                          }))}
                          onChange={(value) => {
                            if (value) {
                              handleInputChange(col.key, value);
                            }
                          }}
                          styles={{
                            dropdown: {
                              overflowX: "hidden",
                            },
                            option: {
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        />
                      ) : (
                        <Select
                          w={200}
                          value={(editFormData[col.key] as string) || ""}
                          data={col.values?.map((value) => ({
                            value,
                            label: value,
                          }))}
                          onChange={(value) => {
                            if (value) {
                              handleInputChange(col.key, value);
                            }
                          }}
                          styles={{
                            dropdown: {
                              overflowX: "hidden",
                            },
                            option: {
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            },
                          }}
                        />
                      )
                    ) : col.isMulti ? (
                      (row[col.key] as string[]).join(", ")
                    ) : (
                      String(row[col.key] ?? "")
                    )}
                  </Table.Td>
                ))}

                <Table.Td>
                  <Group gap={"xs"} align={"center"} justify={"center"}>
                    {editRowId === row.id ? (
                      <>
                        <ActionIcon
                          color={"green"}
                          onClick={handleSaveClick}
                          variant={"transparent"}
                        >
                          <IconCheck size={18} />
                        </ActionIcon>
                        <ActionIcon
                          color={"red"}
                          onClick={handleCancelClick}
                          variant={"transparent"}
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
