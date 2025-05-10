import { FilterOperator } from "../types/filter-operator";

const FilterOperatorFunctions = {
  [FilterOperator.EQUALS]: <T>(a: T[keyof T], b: string) =>
    String(a).toLowerCase() === b.toLowerCase(),
  [FilterOperator.NOT_EQUALS]: <T>(a: T[keyof T], b: string) =>
    String(a).toLowerCase() !== b.toLowerCase(),
  [FilterOperator.INCLUDES]: <T>(a: T[keyof T], b: string) =>
    Array.isArray(a) ? a.includes(b) : false,
  [FilterOperator.NOT_INCLUDES]: <T>(a: T[keyof T], b: string) =>
    Array.isArray(a) ? !a.includes(b) : false,
};

export { FilterOperatorFunctions };
