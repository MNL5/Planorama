interface Column<T> {
  key: keyof T;
  label: string;
  isEdit: boolean;
  isMulti: boolean;
  isNullable: boolean;
  values?: {label: string, value: string}[];
  validationFunction?: (value: unknown) => boolean;
  alt? : {[key: string]: string};
}

export type { Column };
