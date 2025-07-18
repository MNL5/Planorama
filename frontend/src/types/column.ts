import { OptionType } from "./option-type";
import { FilterOperator } from "./filter-operator";

interface Column<T> {
  key: keyof T;
  label: string;
  isEdit: boolean;
  isMulti: boolean;
  isNullable?: boolean;
  footer?: (value: T[]) => string;
  values?: OptionType[];
  validationFunction?: (value: unknown) => boolean;
  alt?: { [key: string]: string };
  isSearchable?: boolean;
  isFilterable?: boolean;
  filterOperators?: FilterOperator[];
  isOpenList?: boolean;
}

export type { Column };
