import {
  Text,
  Table,
  Group,
  Paper,
  Modal,
  Select,
  Button,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { isEmpty, uniq } from "lodash";
import { useDisclosure } from "@mantine/hooks";

import { Column } from "../../types/column";
import { AddRowModal } from "./add-row-modal";
import { FilterOperator } from "../../types/filter-operator";
import { FilterOperatorFunctions } from "../../utils/filter-operator-functions";
import { toast } from "react-toastify";

interface CustomTableProps<T> {
  data: T[];
  columns: Column<T>[];
  createRow?: (row: T) => Promise<T>;
  updateRow?: (row: T) => Promise<T>;
  deleteRow?: (id: string) => Promise<T>;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, ids: string[]) => void;
  rowStyle?: React.CSSProperties;
  selectable?: boolean;
  refetchData?: () => void;
}

function CustomTable<T extends { id: string }>({
  data: initialData,
  columns,
  createRow,
  updateRow,
  deleteRow,
  onDragStart,
  rowStyle = {},
  selectable = false,
  refetchData,
}: CustomTableProps<T>) {
  const [opened, { open, close }] = useDisclosure();
  const [data, setData] = useState<T[]>(initialData);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<T>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const lastId = useRef<string>(null);

  useEffect(() => {
    setData(initialData);
    if (selectedIds.size > 0) {
      const dataIds = new Set(initialData.map((row) => row.id));
      const newSelectedIds = new Set(
        Array.from(selectedIds).filter((id) => dataIds.has(id)),
      );
      setSelectedIds(newSelectedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure();
  const [selectedField, setSelectedField] = useState<keyof T | null>(null);
  const [selectedOperator, setSelectedOperator] =
    useState<FilterOperator | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const searchableColumns = columns.filter((col) => col.isSearchable);
  const filterableColumns = columns.filter((col) => col.isFilterable);

  const fieldOptions = useMemo(
    () =>
      filterableColumns.map((col) => ({
        value: col.key as string,
        label: col.label,
      })),
    [filterableColumns],
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

  const searchedData = useMemo(
    () =>
      isEmpty(searchableColumns)
        ? data
        : data.filter((row) =>
            searchableColumns.some((col) => {
              const cellValue = row[col.key];
              return (
                cellValue &&
                String(cellValue)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              );
            }),
          ),
    [data, searchQuery, searchableColumns],
  );

  const valuesOptions = useMemo(() => {
    const column = filterableColumns.find((col) => col.key === selectedField);

    if (selectedField && column) {
      return uniq(searchedData.flatMap((row) => row[selectedField])).map(
        (value) => ({
          value: String(value),
          label: String(
            value ? (column.alt ? column.alt[String(value)] : value) : "",
          ),
        }),
      );
    }
  }, [selectedField, searchedData, filterableColumns]);

  const handleApplyFilter = () => {
    if (selectedField && selectedOperator && selectedValue) {
      const filteredData = searchedData.filter((row) => {
        const cellValue = row[selectedField];

        return FilterOperatorFunctions[selectedOperator](
          cellValue,
          selectedValue,
        );
      });
      setData(filteredData);
    }
    closeFilterModal();
  };

  const handleClearFilter = () => {
    setData(initialData);
    setSelectedField(null);
    setSelectedOperator(null);
    setSelectedValue(null);
    closeFilterModal();
  };

  const handleAddRow = (newRow: T) => {
    setData((prev) => [...prev, newRow]);
    refetchData?.();
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

  const validateForm = (newRowData: Partial<T>) => {
    const newErrors: string[] = [];

    columns.forEach((col) => {
      const value = newRowData[col.key];
      if (
        !col.isNullable &&
        (value === undefined ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0))
      ) {
        newErrors.push(`${col.label} is required`);
      } else if (
        !isEmpty(value) &&
        col.validationFunction &&
        !col.validationFunction(value)
      ) {
        newErrors.push(`${col.label} is invalid`);
      }
    });

    if (newErrors.length > 0) {
      toast.error(`- ${newErrors.join("\n- ")}`);
    }

    return newErrors.length === 0;
  };

  const handleSaveClick = async () => {
    if (editRowId !== null && updateRow && validateForm(editFormData)) {
      const updatedRow = await updateRow({
        ...editFormData,
        id: editRowId,
      } as T);

      setData((prev: T[]) =>
        prev.map((row: T) => (row.id === updatedRow.id ? updatedRow : row)),
      );

      refetchData?.();

      setEditRowId(null);
      setEditFormData({});
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!deleteRow) return;
    await deleteRow(id);
    setData((prev: T[]) => prev.filter((row: T) => row.id !== id));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRowSelect = (e: React.MouseEvent, index: number, id: string) => {
    const newSelectedIds = new Set(selectedIds);

    if (e.shiftKey) {
      let lastIndex = searchedData.findIndex(
        (row) => row.id === lastId.current,
      );
      if (lastIndex === -1) lastIndex = 0;

      if (!e.ctrlKey && !e.metaKey) {
        newSelectedIds.clear();
      }

      const start = Math.min(lastIndex, index);
      const end = Math.max(lastIndex, index);
      for (let i = start; i <= end; i++) {
        newSelectedIds.add(searchedData[i].id);
      }
    } else if (e.ctrlKey || e.metaKey) {
      if (!newSelectedIds.delete(id)) {
        newSelectedIds.add(id);
      }
      lastId.current = id;
    } else {
      newSelectedIds.clear();
      newSelectedIds.add(id);
      lastId.current = id;
    }

    setSelectedIds(newSelectedIds);
  };

  const handleRowDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    id: string,
  ) => {
    if (onDragStart) {
      if (selectedIds.has(id)) {
        onDragStart(e, [...selectedIds]);
      } else {
        setSelectedIds(new Set([id]));
        onDragStart(e, [id]);
      }
    }
  };

  return (
    <Paper
      mah={"100%"}
      display={"flex"}
      shadow={"md"}
      radius={"md"}
      p={"md"}
      withBorder
      style={{ overflowY: "hidden", flexDirection: "column" }}
    >
      <Group
        justify={!isEmpty(searchableColumns) ? "space-between" : "flex-end"}
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
          {!isEmpty(filterableColumns) && (
            <ActionIcon
              size={40}
              onClick={openFilterModal}
              variant={"light"}
              color={"primary"}
            >
              <IconFilter size={24} />
            </ActionIcon>
          )}
          {createRow && (
            <ActionIcon
              size={40}
              onClick={open}
              variant={"light"}
              color={"primary"}
            >
              <IconPlus size={24} />
            </ActionIcon>
          )}
        </Group>
      </Group>
      {createRow && (
        <AddRowModal
          opened={opened}
          onClose={close}
          onAddRow={handleAddRow}
          columns={columns}
          createRow={createRow}
        />
      )}
      {!isEmpty(filterableColumns) && (
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
                  setSelectedOperator(null);
                  setSelectedValue(null);
                }
              }}
            />
            <Select
              data={operatorOptions}
              value={selectedOperator}
              onChange={(value) => setSelectedOperator(value as FilterOperator)}
              disabled={!selectedField}
            />
            <Select
              data={valuesOptions}
              value={selectedValue}
              onChange={(value) => setSelectedValue(value)}
              disabled={!selectedOperator}
            />
          </Flex>
          <Group align={"center"} justify={"flex-end"} mt={"lg"}>
            <Button
              variant={"outline"}
              radius={"md"}
              onClick={handleClearFilter}
            >
              Clear Filter
            </Button>
            <Button radius={"md"} onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </Group>
        </Modal>
      )}
      <Flex style={{ flex: "1 1 auto", overflowY: "auto" }}>
        <Table
          withTableBorder
          highlightOnHover
          striped={false}
          withColumnBorders
        >
          <Table.Thead
            pos={"sticky"}
            top={0}
            style={{ backgroundColor: "white" }}
          >
            <Table.Tr>
              {columns.map((col) => (
                <Table.Th key={String(col.key)}>{col.label}</Table.Th>
              ))}
              {updateRow && <Table.Th />}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {isEmpty(searchableColumns) || !isEmpty(searchedData)
              ? searchedData.map((row, index) => (
                  <Table.Tr
                    key={row.id}
                    bg={selectedIds.has(row.id) ? "#e6c8fa" : "gray.0"}
                    draggable={!!onDragStart}
                    onDragStart={(e) => handleRowDragStart(e, row.id)}
                    style={rowStyle}
                    onClick={(e) => {
                      if (selectable) {
                        handleRowSelect(e, index, row.id);
                      }
                    }}
                  >
                    {columns.map((col) => (
                      <Table.Td
                        key={String(col.key)}
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {editRowId === row.id && col.isEdit ? (
                          !col.values ? (
                            <TextInput
                              w={120}
                              size={"xs"}
                              value={(editFormData[col.key] as string) ?? ""}
                              onChange={(e) =>
                                handleInputChange(
                                  col.key,
                                  e.currentTarget.value,
                                )
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
                              clearable
                              value={(editFormData[col.key] as string) ?? ""}
                              data={col.values}
                              onChange={(value) => {
                                if (value) {
                                  handleInputChange(col.key, value);
                                }
                              }}
                              onClear={() => {
                                handleInputChange(col.key, "");
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
                          ((row[col.key] as string[])
                            ?.map((val) => (col.alt ? col.alt[val] : val))
                            .join(", ") ?? "")
                        ) : (
                          String(
                            row[col.key]
                              ? col.alt
                                ? col.alt[String(row[col.key] as string)]
                                : row[col.key]
                              : "",
                          )
                        )}
                      </Table.Td>
                    ))}

                    {(updateRow || deleteRow) && (
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
                              {updateRow && (
                                <ActionIcon
                                  color={"blue"}
                                  variant={"transparent"}
                                  onClick={() => handleEditClick(row)}
                                >
                                  <IconPencil size={18} />
                                </ActionIcon>
                              )}
                              {deleteRow && (
                                <ActionIcon
                                  color={"red"}
                                  variant={"transparent"}
                                  onClick={() => handleDeleteClick(row.id)}
                                >
                                  <IconTrash size={18} />
                                </ActionIcon>
                              )}
                            </>
                          )}
                        </Group>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))
              : !isEmpty(searchQuery) && (
                  <Table.Tr>
                    <Table.Td colSpan={columns.length + 1} align={"center"}>
                      <Text size={"md"} c={"dark.6"}>
                        No results found matching your search.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
          </Table.Tbody>

          {data.length === 0 && (
            <Table.Tfoot>
              <Table.Tr>
                <Table.Td
                  colSpan={columns.length + 1}
                  style={{ textAlign: "center" }}
                >
                  There is no data to display
                </Table.Td>
              </Table.Tr>
            </Table.Tfoot>
          )}

          {columns.some((col) => col.footer) && (
            <Table.Tfoot
              pos={"sticky"}
              bottom={0}
              style={{ backgroundColor: "white" }}
            >
              <Table.Tr>
                {columns.map((col) => (
                  <Table.Td key={String(col.key)} fw={"bold"}>
                    {col.footer ? col.footer(data) : ""}
                  </Table.Td>
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
