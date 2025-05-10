import { FilterOperator } from "../types/filter-operator";

const FilterOperatorFunctions = {
  [FilterOperator.EQUALS]: <T>(a: NonNullable<T[keyof T]>, b: string) =>
    String(a).toLowerCase() === b.toLowerCase(),
  [FilterOperator.NOT_EQUALS]: <T>(a: NonNullable<T[keyof T]>, b: string) =>
    String(a).toLowerCase() !== b.toLowerCase(),
  [FilterOperator.CONTAINS]: <T>(a: NonNullable<T[keyof T]>, b: string) =>
    String(a).toLowerCase().includes(b.toLowerCase()),
  [FilterOperator.NOT_CONTAINS]: <T>(a: NonNullable<T[keyof T]>, b: string) =>
    !String(a).toLowerCase().includes(b.toLowerCase()),
  [FilterOperator.INCLUDES]: <T>(a: NonNullable<T[keyof T]>, b: string) =>
    Array.isArray(a) || typeof a === "string" ? a.includes(b) : false,
  [FilterOperator.NOT_INCLUDES]: <T>(a: NonNullable<T[keyof T]>, b: string) =>
    Array.isArray(a) || typeof a === "string" ? !a.includes(b) : false,
};

export { FilterOperatorFunctions };
