import {
  Table,
  Group,
  Paper,
  Select,
  TextInput,
  ActionIcon,
  MultiSelect,
  Flex,
} from "@mantine/core";
import { useState } from "react";
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
  createRow?: (row: T) => Promise<T>;
  updateRow?: (row: T) => Promise<T>;
  deleteRow?: (id: string) => Promise<T>;
}

function CustomTable<T extends { id: string }>({
  data: initialData,
  columns,
  createRow,
  updateRow,
  deleteRow,
}: CustomTableProps<T>) {
  const [opened, { open, close }] = useDisclosure();
  const [data, setData] = useState<T[]>(initialData);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<T>>({});

  const handleAddRow = (newRow: T) => {
    setData((prev) => [...prev, newRow]);
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

  const handleSaveClick = async () => {
    if (editRowId !== null && updateRow) {
      const updatedRow = await updateRow({
        ...editFormData,
        id: editRowId,
      } as T);

      setData((prev: T[]) =>
        prev.map((row: T) => (row.id === updatedRow.id ? updatedRow : row))
      );
      setEditRowId(null);
      setEditFormData({});
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!deleteRow) return;
    await deleteRow(id);
    setData((prev: T[]) => prev.filter((row: T) => row.id !== id));
  };

  return (
    <Paper mah={"100%"} display={"flex"} shadow={"md"} radius={"md"} p={"md"} withBorder style={{ overflowY: "hidden", flexDirection: "column" }}>
      {
        createRow && 
        <>
          <Group justify={"flex-end"} mb={"xs"}>
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
            createRow={createRow}
          />
        </>
      }
      <Flex style={{ flex: "1 1 auto", overflowY: "auto" }}>
        <Table
          withTableBorder
          highlightOnHover
          striped={false}
          withColumnBorders
        >
          <Table.Thead pos={"sticky"} top={0} style={{backgroundColor: "white"}}>
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
                  <Table.Td key={String(col.key)} style={{whiteSpace: "pre-wrap"}}>
                    {editRowId === row.id && col.isEdit ? (
                      !col.values ? (
                        <TextInput
                          w={120}
                          size={"xs"}
                          value={(editFormData[col.key] as string) ?? ""}
                          onChange={(e) =>
                            handleInputChange(col.key, e.currentTarget.value)
                          }
                        />
                      ) : col.isMulti ? (
                        <MultiSelect
                          w={120}
                          value={
                            Array.isArray(editFormData[col.key])
                              ? (editFormData[col.key] as string[])
                              : []
                          }
                          data={col.values}
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
                          w={120}
                          value={(editFormData[col.key] as string) ?? ""}
                          data={col.values}
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
                      (row[col.key] as string[])
                        ?.map((val) => (col.alt ? col.alt[val] : val))
                        .join(", ") ?? ""
                    ) : (
                      String(
                        row[col.key]
                          ? col.alt
                            ? col.alt[String(row[col.key] as string)]
                            : row[col.key]
                          : ""
                      )
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
                        { updateRow && 
                          <ActionIcon
                            color={"blue"}
                            variant={"transparent"}
                            onClick={() => handleEditClick(row)}
                          >
                            <IconPencil size={18} />
                          </ActionIcon>
                        }
                        {
                          deleteRow &&
                            <ActionIcon
                              color={"red"}
                              variant={"transparent"}
                              onClick={() => handleDeleteClick(row.id)}
                            >
                              <IconTrash size={18} />
                            </ActionIcon>
                        }
                      </>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>

          {
            data.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={columns.length + 1} style={{ textAlign: "center" }}>
                  There is no data to display
                </Table.Td>
              </Table.Tr>
            )
          }

          {columns.some((col) => col.footer) && (
            <Table.Tfoot pos={"sticky"} bottom={0} style={{backgroundColor: "white"}}>
              <Table.Tr>
                {columns.map((col) => (
                  <Table.Td key={String(col.key)} fw={"bold"}>{col.footer ? col.footer(data) : ""}</Table.Td>
                ))}
                <Table.Td />
              </Table.Tr>
            </Table.Tfoot>
          )}
        </Table>
      </Flex>
    </Paper>
  );
}

export { CustomTable };
