import {
  Modal,
  Group,
  Button,
  Select,
  TextInput,
  MultiSelect,
} from "@mantine/core";
import { isEmpty } from "lodash";
import { useState } from "react";

import { Column } from "../../types/column";

interface AddRowModalProps<T> {
  opened: boolean;
  onClose: () => void;
  onAddRow: (newRow: T) => void;
  columns: Column<T>[];
  lastId: number;
}

function AddRowModal<T>({
  opened,
  onClose,
  onAddRow,
  columns,
  lastId,
}: AddRowModalProps<T>) {
  const [newRowData, setNewRowData] = useState<Partial<T>>({});

  const handleInputChange = (key: keyof T, value: string | string[]) => {
    setNewRowData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    const newId = (lastId + 1).toString();
    onAddRow({ ...newRowData, id: newId } as T);
    setNewRowData({});
  };

  return (
    <Modal opened={opened} onClose={onClose}>
      <form onSubmit={(e) => e.preventDefault()}>
        {columns.map((col) => (
          <div key={String(col.key)} style={{ marginBottom: "10px" }}>
            <label>{col.label}</label>
            {isEmpty(col.values) ? (
              <TextInput
                value={(newRowData[col.key] as string) || ""}
                onChange={(e) =>
                  handleInputChange(col.key, e.currentTarget.value)
                }
                size="xs"
                placeholder={`Enter ${col.label}`}
                style={{ marginTop: "5px" }}
              />
            ) : col.isMulti ? (
              <MultiSelect
                data={col.values?.map((value) => ({
                  value,
                  label: value,
                }))}
                value={(newRowData[col.key] as string[]) || []}
                onChange={(value) => handleInputChange(col.key, value)}
                size="xs"
                placeholder={`Select ${col.label}`}
                style={{ marginTop: "5px" }}
              />
            ) : (
              <Select
                data={col.values?.map((value) => ({
                  value,
                  label: value,
                }))}
                value={(newRowData[col.key] as string) || ""}
                onChange={(value) => {
                  if (value) {
                    handleInputChange(col.key, value);
                  }
                }}
                size={"xs"}
                placeholder={`Select ${col.label}`}
                style={{ marginTop: "5px" }}
              />
            )}
          </div>
        ))}
        <Group justify={"flex-end"} mt={"md"}>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Row</Button>
        </Group>
      </form>
    </Modal>
  );
}

export { AddRowModal };
