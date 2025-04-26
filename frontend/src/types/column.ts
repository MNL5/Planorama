interface Column<T> {
  key: keyof T;
  label: string;
  isEdit: boolean;
  isMulti: boolean;
  values?: string[];
}

export type { Column };
