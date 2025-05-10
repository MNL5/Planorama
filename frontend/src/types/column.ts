import { OptionType } from "./option-type";

interface Column<T> {
  key: keyof T;
  label: string;
  isEdit: boolean;
  isMulti: boolean;
  isNullable: boolean;
  footer?: (value: T[]) => string;
  values?: OptionType[];
  validationFunction?: (value: unknown) => boolean;
  alt?: { [key: string]: string };
}

export type { Column };
