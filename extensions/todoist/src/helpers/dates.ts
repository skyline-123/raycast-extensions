import { Task } from "@doist/todoist-api-typescript";
import { addDays, format, formatISO, isThisYear, isBefore, isSameDay } from "date-fns";

export function isRecurring(task: Task): boolean {
  return task.due?.isRecurring || false;
}

export function isExactTimeTask(task: Task): boolean {
  return !!task.due?.datetime;
}

/**
 * Returns today's date in user's timezone using the following format: YYYY-MM-DD
 *
 * Note that `format` from date-fns returns the date formatted to local time.
 * If it's 20th February at 6 AM UTC:
 * - This function will return 19th February at midnight UTC for Los Angeles timezone (GMT-8)
 * - This function will return 20th February at midnight UTC for Paris timezone (GMT+1)
 */
export function getToday() {
  return new Date(format(Date.now(), "yyyy-MM-dd"));
}

export function isOverdue(date: Date) {
  return isBefore(date, getToday());
}

export function displayDueDate(dateString: string): string {
  const date = new Date(dateString);

  if (isOverdue(date)) {
    return isThisYear(date) ? format(date, "dd MMMM") : format(date, "dd MMMM yyy");
  }

  const today = getToday();

  if (isSameDay(date, today)) {
    return "Today";
  }

  if (isSameDay(date, addDays(today, 1))) {
    return "Tomorrow";
  }

  const nextWeek = addDays(today, 7);

  if (isBefore(date, nextWeek)) {
    return format(date, "eeee");
  }

  if (isThisYear(date)) {
    return format(date, "dd MMMM");
  }

  return format(date, "dd MMMM yyy");
}

export function getAPIDate(date: Date): string {
  return formatISO(date, { representation: "date" });
}
