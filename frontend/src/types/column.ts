interface Column<T> {
  key: keyof T;
  label: string;
  isEdit: boolean;
  isMulti: boolean;
  isNullable: boolean;
  values?: string[];
  validationFunction?: (value: unknown) => boolean;
}

export type { Column };
