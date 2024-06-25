/**
 * Checks if the given date is older than one day from now.
 * @param updatedAt - The date to check.
 * @returns True if the date is older than one day, false otherwise.
 */
export function isDatabaseOutdated(updatedAt: Date): boolean {
  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  return now.getTime() - updatedAt.getTime() > oneDayInMs;
}
