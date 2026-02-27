export function formatDateBR(date: string | Date) {
  const dateString = typeof date === "string" ? date : date.toISOString();
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

