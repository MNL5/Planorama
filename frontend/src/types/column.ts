import { OptionType } from "./option-type";

interface Column<T> {
  key: keyof T;
  label: string;
  isEdit: boolean;
  isMulti: boolean;
  isNullable: boolean;
  values?: OptionType[];
  validationFunction?: (value: unknown) => boolean;
  alt?: { [key: string]: string };
}

export type { Column };
