// Dates are formatted in one fixed time zone so the server and the browser print the same day.
const TIME_ZONE = "Europe/Athens";

export function formatDate(date: string, style: "long" | "short" = "long") {
  return new Date(date).toLocaleDateString(
    "el-GR",
    style === "long"
      ? { day: "numeric", month: "long", year: "numeric", timeZone: TIME_ZONE }
      : { timeZone: TIME_ZONE }
  );
}
