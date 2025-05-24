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
  createRow: (row: T) => Promise<T>;
}

function AddRowModal<T>({
  opened,
  onClose,
  onAddRow,
  columns,
  createRow,
}: AddRowModalProps<T>) {
  const [newRowData, setNewRowData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (key: keyof T, value: string | string[]) => {
    setNewRowData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [key as string]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    columns.forEach((col) => {
      const value = newRowData[col.key];
      if (
        !col.isNullable &&
        (value === undefined ||
          (typeof value === "string" && value.trim() === "") ||
          (Array.isArray(value) && value.length === 0))
      ) {
        newErrors[col.key as string] = `${col.label} is required`;
      } else if (
        !isEmpty(value) &&
        col.validationFunction &&
        !col.validationFunction(value)
      ) {
        newErrors[col.key as string] = `${col.label} is invalid`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    onAddRow(await createRow({ ...newRowData } as T));
    setNewRowData({});
    setErrors({});
  };

  return (
    <Modal opened={opened} onClose={onClose}>
      <form onSubmit={(e) => e.preventDefault()}>
        {columns.map((col) => (
          <div key={String(col.key)} style={{ marginBottom: "10px" }}>
            <label>{col.label}</label>
            {!col.values ? (
              <TextInput
                size={"sm"}
                value={(newRowData[col.key] as string) || ""}
                onChange={(e) =>
                  handleInputChange(col.key, e.currentTarget.value)
                }
                placeholder={`Enter ${col.label}`}
                style={{ marginTop: "5px" }}
                error={!col.isNullable ? errors[col.key as string] : undefined}
              />
            ) : col.isMulti ? (
              <MultiSelect
                size={"sm"}
                data={col.values}
                value={(newRowData[col.key] as string[]) || []}
                onChange={(value) => handleInputChange(col.key, value)}
                placeholder={`Select ${col.label}`}
                style={{ marginTop: "5px" }}
                error={!col.isNullable ? errors[col.key as string] : undefined}
              />
            ) : (
              <Select
                size={"sm"}
                data={col.values}
                value={(newRowData[col.key] as string) || ""}
                onChange={(value) => {
                  if (value) {
                    handleInputChange(col.key, value);
                  }
                }}
                placeholder={`Select ${col.label}`}
                style={{ marginTop: "5px" }}
                error={!col.isNullable ? errors[col.key as string] : undefined}
              />
            )}
          </div>
        ))}
        <Group justify={"flex-end"} mt={"md"}>
          <Button onClick={onClose} variant={"outline"} radius={"md"}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} radius={"md"}>Add</Button>
        </Group>
      </form>
    </Modal>
  );
}

export { AddRowModal };
