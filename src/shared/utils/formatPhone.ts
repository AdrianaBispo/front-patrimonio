import { IMask } from "react-imask";

export const phoneMaskOptions = {
  mask: [
    { mask: "(00) 0000-0000" },
    { mask: "(00) 00000-0000" },
  ],
};

export function formatPhone(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return IMask.pipe(String(value), phoneMaskOptions);
}
