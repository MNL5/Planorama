import {
  Text,
  Table,
  Group,
  Paper,
  Modal,
  Select,
  Button,
  Container,
  TextInput,
  ActionIcon,
  MultiSelect,
  Flex,
} from "@mantine/core";
import {
  IconX,
  IconPlus,
  IconTrash,
  IconCheck,
  IconPencil,
  IconSearch,
  IconFilter,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { isEmpty } from "lodash";
import { useDisclosure } from "@mantine/hooks";

import { Column } from "../../types/column";
import { AddRowModal } from "./add-row-modal";
import { FilterOperator } from "../../types/filter-operator";
import { FilterOperatorFunctions } from "../../utils/filter-operator-functions";

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  createRow?: (row: T) => Promise<T>;
  updateRow: (row: T) => Promise<T>;
  deleteRow: (id: string) => Promise<T>;
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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure();
  const [selectedField, setSelectedField] = useState<keyof T | null>(null);
  const [selectedOperator, setSelectedOperator] =
    useState<FilterOperator | null>(null);
  const [selectedValue] = useState<string | null>(null);

  const searchableColumns = columns.filter((col) => col.isSearchable);
  const filterableColumns = columns.filter((col) => col.isFilterable);

  const fieldOptions = useMemo(
    () =>
      filterableColumns.map((col) => ({
        value: col.key as string,
        label: col.label,
      })),
    [filterableColumns]
  );

  const operatorOptions = useMemo(() => {
    if (selectedField) {
      return filterableColumns
        .find((col) => col.key === selectedField)
        ?.filterOperators?.map((operator) => ({
          value: operator,
          label: operator,
        }));
    }
  }, [filterableColumns, selectedField]);

  const searchedData = data.filter(
    (row) =>
      isEmpty(searchableColumns) ||
      searchableColumns.some((col) => {
        const cellValue = row[col.key];
        return (
          cellValue &&
          String(cellValue).toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
  );

  const handleApplyFilter = () => {
    if (selectedField && selectedOperator && selectedValue) {
      const filteredData = data.filter((row) => {
        const cellValue = row[selectedField];
        if (!cellValue) return false;

        return FilterOperatorFunctions[selectedOperator](
          cellValue,
          selectedValue
        );
      });
      setData(filteredData);
    }
    closeFilterModal();
  };

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
    if (editRowId !== null) {
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
    await deleteRow(id);
    setData((prev: T[]) => prev.filter((row: T) => row.id !== id));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Container size={"md"} mt={"xl"}>
      <Paper shadow={"md"} radius={"md"} p={"md"} withBorder>
        {createRow && (
          <>
            <Group
              justify={
                !isEmpty(searchableColumns) ? "space-between" : "flex-end"
              }
              mb={"md"}
            >
              {!isEmpty(searchableColumns) && (
                <TextInput
                  w={"50%"}
                  placeholder={"Search..."}
                  rightSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              )}
              <Group>
                <ActionIcon
                  size={40}
                  onClick={openFilterModal}
                  variant={"light"}
                  color={"primary"}
                >
                  <IconFilter size={24} />
                </ActionIcon>
                <ActionIcon
                  size={40}
                  onClick={open}
                  variant={"light"}
                  color={"primary"}
                >
                  <IconPlus size={24} />
                </ActionIcon>
              </Group>
            </Group>
            <AddRowModal
              opened={opened}
              onClose={close}
              onAddRow={handleAddRow}
              columns={columns}
              createRow={createRow}
            />
            <Modal
              opened={filterModalOpened}
              onClose={closeFilterModal}
              title={"Apply Filter"}
            >
              <Flex gap={"md"}>
                <Select
                  placeholder={"Filter by..."}
                  data={fieldOptions}
                  value={selectedField as string | null}
                  onChange={(value) => {
                    if (value) {
                      setSelectedField(value as keyof T);
                    }
                  }}
                />
                <Select
                  data={operatorOptions}
                  value={selectedOperator}
                  onChange={(value) =>
                    setSelectedOperator(value as FilterOperator)
                  }
                  disabled={!selectedField}
                />
              </Flex>
              <Button fullWidth mt="lg" onClick={handleApplyFilter}>
                Apply Filter
              </Button>
            </Modal>
          </>
        )}
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
            {!isEmpty(searchedData) ? (
              searchedData.map((row) => (
                <Table.Tr key={row.id} bg={"gray.0"}>
                  {columns.map((col) => (
                    <Table.Td key={String(col.key)}>
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
                              ? col.alt[String(row[col.key])]
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
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columns.length + 1} align={"center"}>
                  <Text size={"md"} c={"dark.6"}>
                    No results found matching your search.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}

export { CustomTable };
