export type ElementProps<T extends HTMLElement> = Partial<
  Record<keyof T, string | boolean | object>
>;

export type SelectorElement<T> = T | string;

export type ElementChild = HTMLElement | HTMLElement[];

export type ElementValue<T> = Partial<Record<keyof T, string | boolean | object>> | ElementChild;
