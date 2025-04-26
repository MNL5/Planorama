interface Column<T> {
  key: keyof T;
  label: string;
  isEdit: boolean;
  values?: string[];
}

export type { Column };
